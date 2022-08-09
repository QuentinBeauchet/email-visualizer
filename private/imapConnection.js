require("dotenv").config();
var Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
let { decodeBuffer, flattenAttribute, getHTMLContent } = require("./utils.js");

const options = {
  user: process.env.USER_MAIL,
  password: process.env.USER_PASSWORD,
  host: "imap.free.fr",
  port: 993,
  tls: true,
};

module.exports.getEmailsInfos = (from = 0, to = 10) => {
  return new Promise((resolve, reject) => {
    var imap = new Imap(options);
    imap.once("error", reject);
    imap.once("end", () => console.log("Connection ended"));
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`getEmailsInfos => ${Math.max(box.messages.total - to, 1)}:${box.messages.total - from}`);
        var f = imap.seq.fetch(`${Math.max(box.messages.total - to, 1)}:${box.messages.total - from}`, {
          bodies: ["HEADER.FIELDS (FROM SUBJECT)"],
        });
        var messages = [];
        f.on("message", (msg) => {
          messages.push(
            new Promise((resolveMessage, rejectMessage) => {
              const buffer = [];
              var header, attributes;

              msg.on("body", (stream) => {
                stream.on("data", (chunk) => buffer.push(chunk));
                stream.on("end", () => (header = Buffer.concat(buffer)));
              });

              msg.on("attributes", (attr) => (attributes = attr));

              msg.on("end", async () => {
                let parsed = await simpleParser(header, {});
                msg.removeAllListeners();
                resolveMessage({
                  header: {
                    subject: parsed.headers.get("subject"),
                    from: parsed.headers.get("from").text,
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
          imap.removeAllListeners();
          imap.end();
          resolve({
            box: {
              name: box.name,
              flags: box.flags,
              messages: box.messages.total,
            },
            mails,
          });
        });
      });
    });

    imap.connect();
  });
};

module.exports.getEmail = (uid) => {
  return new Promise((resolve, reject) => {
    var imap = new Imap(options);
    imap.once("error", reject);
    imap.once("end", () => console.log("Connection ended"));
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`getEmail => ${uid}`);
        var f = imap.fetch(uid, {
          bodies: ["HEADER.FIELDS (FROM SUBJECT)", "TEXT"],
          struct: true,
        });
        f.once("message", (msg) => {
          const buffer = [];
          var header, body, attributes;

          msg.on("body", (stream, info) => {
            if (info.which == "TEXT") header = Buffer.concat(buffer);
            stream.on("data", (chunk) => buffer.push(chunk));
          });

          msg.on("attributes", (attr) => {
            body = readMsgBody(imap, attr);
            attributes = attr;
          });

          msg.on("end", async () => {
            let parsed = await simpleParser(header, {});
            let html = await body;
            msg.removeAllListeners();
            resolve({
              header: {
                subject: parsed.headers.get("subject"),
                from: parsed.headers.get("from").text,
              },
              html,
              uid: attributes.uid,
              date: attributes.date,
              flags: attributes.flags,
            });
          });

          msg.on("error", () => reject({}));
        });

        f.once("end", async () => {
          f.removeAllListeners();
          imap.removeAllListeners();
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
  return new Promise((resolve, reject) => {
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
      msg.on("end", () => resolve(getHTMLContent(parts)));
      msg.on("error", () => reject({}));
    });
    f.once("end", () => {
      f.removeAllListeners();
    });
  });
}
