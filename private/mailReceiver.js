require("dotenv").config();
var Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
let { decodeBuffer, flattenAttribute, getHTMLContent, getErrorResponse, flattenBoxes } = require("./utils.js");

/**
 * Return a list of mails in the range.
 * @param {{ auth, host, port, range }} params
 * @returns
 */
module.exports.getEmailsInfos = ({ auth, host, port, box, range }) => {
  return new Promise((resolve) => {
    var imap = new Imap({
      user: auth?.user,
      password: auth?.pass,
      host,
      port,
      tls: true,
    });
    imap.once("error", (err) => {
      resolve(getErrorResponse(err));
    });
    imap.once("end", () => {
      imap.removeAllListeners();
      console.log("Connection ended");
    });
    imap.once("ready", () => {
      imap.openBox(box, true, (err, box) => {
        console.log(
          `getEmailsInfos => ${Math.max(box.messages.total - (range?.to || 10), 1)}:${
            box.messages.total - (range?.from || 0)
          }`
        );

        if (err) {
          resolve(getErrorResponse(err));
          return;
        }
        if (box.messages.total == 0) {
          resolve({
            status: 200,
            data: {
              box: {
                name: box.name,
                flags: box.flags,
                messages: box.messages.total,
              },
              mails: [],
            },
          });
          imap.end();
          return;
        }

        var f = imap.seq.fetch(
          `${Math.max(box.messages.total - (range?.to || 10), 1)}:${box.messages.total - (range?.from || 0)}`,
          {
            bodies: ["HEADER.FIELDS (FROM SUBJECT TO)"],
          }
        );
        var messages = [];
        f.on("message", (msg) => {
          messages.push(
            new Promise((resolveMessage, rejectMessage) => {
              const buffer = [];
              var header, attributes;

              msg.on("body", (stream) => {
                stream.on("data", (chunk) => buffer.push(chunk));
                stream.on("end", () => (header = simpleParser(Buffer.concat(buffer), {})));
              });

              msg.on("attributes", (attr) => (attributes = attr));

              msg.on("end", async () => {
                let parsed = await header;
                msg.removeAllListeners();
                resolveMessage({
                  header: {
                    subject: parsed.subject,
                    from: parsed.from.value[0],
                    to: parsed.to.value,
                  },
                  uid: attributes.uid,
                  date: attributes.date,
                  flags: attributes.flags,
                });
              });

              msg.on("error", () => rejectMessage({}));
            })
          );
        });
        f.once("end", async () => {
          let mails = await Promise.all(messages.reverse());
          f.removeAllListeners();
          imap.end();
          resolve({
            status: 200,
            data: {
              box: {
                name: box.name,
                flags: box.flags,
                messages: box.messages.total,
              },
              mails,
            },
          });
        });
      });
    });

    imap.connect();
  });
};

module.exports.getEmail = ({ auth, host, port, box, uid }) => {
  return new Promise((resolve) => {
    var imap = new Imap({
      user: auth?.user,
      password: auth?.pass,
      host,
      port,
      tls: true,
    });
    imap.once("error", (err) => {
      resolve(getErrorResponse(err));
    });
    imap.once("end", () => {
      imap.removeAllListeners();
      console.log("Connection ended");
    });
    imap.once("ready", () => {
      imap.openBox(box, true, (err) => {
        if (err) {
          resolve(getErrorResponse(err));
          return;
        }
        console.log(`getEmail => ${uid}`);
        var f = imap.fetch(uid, {
          bodies: ["HEADER.FIELDS (FROM SUBJECT TO)"],
          struct: true,
        });
        f.once("message", (msg) => {
          const buffer = [];
          var header, body, attributes;

          msg.on("body", (stream) => {
            stream.on("data", (chunk) => buffer.push(chunk));
            stream.on("end", () => (header = simpleParser(Buffer.concat(buffer), {})));
          });

          msg.on("attributes", (attr) => {
            body = readMsgBody(imap, attr);
            attributes = attr;
          });

          msg.on("end", async () => {
            let parsed = await header;
            let { html, attachments } = await body;

            msg.removeAllListeners();
            resolve({
              status: 200,
              data: {
                header: {
                  subject: parsed.subject,
                  from: parsed.from.value[0],
                  to: parsed.to.value,
                },
                html,
                attachments,
                uid: attributes.uid,
                date: attributes.date,
                flags: attributes.flags,
              },
            });
          });

          msg.on("error", (err) => {
            resolve(getErrorResponse(err));
          });
        });

        f.once("end", async () => {
          f.removeAllListeners();
          imap.end();
        });
      });
    });
    imap.connect();
  });
};

/**
 * From the message attribute fetch the body of it's different parts and then
 * decode and transform them into an HTML string to be displayed by a client.
 * @param {*} imap
 * @param {Object} attr The attribute of the message.
 * @returns A promise containing and HTML page.
 */
function readMsgBody(imap, attr) {
  return new Promise((resolve) => {
    let parts = flattenAttribute(attr.struct).reduce((acc, part) => {
      acc[part.partID] = part;
      return acc;
    }, {});

    var f = imap.fetch(attr.uid, {
      bodies: Object.keys(parts),
      struct: true,
    });

    f.once("message", (msg) => {
      msg.on("body", (stream, info) => {
        const buffer = [];
        stream.on("data", (chunk) => buffer.push(chunk));
        stream.once("end", () => {
          const part = parts[info.which];
          parts[info.which].content = decodeBuffer(Buffer.concat(buffer), part.encoding, part.type);
        });
      });
      msg.on("end", () => {
        msg.removeAllListeners();
        resolve(getHTMLContent(parts));
      });
      msg.on("error", () => resolve(""));
    });
    f.once("end", () => {
      f.removeAllListeners();
    });
  });
}

module.exports.isIMAPAuthValid = ({ auth, host, port }) => {
  return new Promise((resolve) => {
    var imap = new Imap({
      user: auth?.user,
      password: auth?.pass,
      host,
      port,
      tls: true,
    });
    imap.once("error", (err) => {
      resolve(getErrorResponse(err));
      imap.end();
    });
    imap.once("end", () => {
      imap.removeAllListeners();
      console.log("Connection ended");
    });
    imap.once("ready", () => {
      resolve({
        status: 200,
      });
      imap.end();
    });

    imap.connect();
  });
};

module.exports.getBoxes = ({ auth, host, port }) => {
  return new Promise((resolve) => {
    var imap = new Imap({
      user: auth?.user,
      password: auth?.pass,
      host,
      port,
      tls: true,
    });
    imap.once("error", (err) => {
      resolve(getErrorResponse(err));
      imap.end();
    });
    imap.once("end", () => {
      imap.removeAllListeners();
      console.log("Connection ended");
    });
    imap.once("ready", () => {
      imap.getBoxes((err, mailboxes) => {
        if (err) resolve(getErrorResponse(err));
        resolve({ status: 200, data: flattenBoxes(mailboxes) });

        imap.end();
      });
    });

    imap.connect();
  });
};

module.exports.getAttachment = ({ auth, host, port, box, uid, attachment }) => {
  return new Promise((resolve) => {
    var imap = new Imap({
      user: auth?.user,
      password: auth?.pass,
      host,
      port,
      tls: true,
    });
    imap.once("error", (err) => {
      resolve(getErrorResponse(err));
    });
    imap.once("end", () => {
      imap.removeAllListeners();
      console.log("Connection ended");
    });
    imap.once("ready", () => {
      imap.openBox(box, true, (err) => {
        if (err) {
          resolve(getErrorResponse(err));
          return;
        }
        console.log(`getAttachment => ${uid}/${attachment.partID}`);
        let { partID, type, subtype, encoding } = attachment;
        var f = imap.fetch(uid, {
          bodies: [partID],
          struct: true,
        });

        f.once("message", (msg) => {
          const buffer = [];
          msg.on("body", (stream) => {
            stream.on("data", (chunk) => buffer.push(chunk));
          });
          msg.on("end", () => {
            msg.removeAllListeners();
            resolve({
              status: 200,
              data: {
                content: decodeBuffer(Buffer.concat(buffer), encoding, type),
                type,
                subtype,
              },
            });
          });
          msg.on("error", (err) => resolve(getErrorResponse(err)));
        });

        f.once("end", () => {
          f.removeAllListeners();
          imap.end();
        });
      });
    });
    imap.connect();
  });
};
