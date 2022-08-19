var quotedPrintable = require("quoted-printable");
var utf8 = require("utf8");

/**
 * Decode the buffer with the informations given by it's message attribute part.
 * @param {Buffer} buffer The buffer of the part.
 * @param {String} encoding The encoding of the buffer.
 * @param {String} type The type of the data inside the buffer.
 * @returns The decoded String representation of the buffer.
 */
module.exports.decodeBuffer = (buffer, encoding, type) => {
  try {
    if (encoding == "QUOTED-PRINTABLE") return utf8.decode(quotedPrintable.decode(buffer.toString()));
    if (encoding == "BASE64" && type == "text") return Buffer.from(buffer.toString(), "base64").toString();
    return buffer.toString();
  } catch {
    return buffer.toString();
  }
};

/**
 * Get all the part of the message attribute inside a list.
 * @param {Object} part Can be an object of a list of objects.
 * @returns The list with all the parts of the message.
 */
module.exports.flattenAttribute = (part) => {
  if (part.encoding && part.size) return [part];
  else if (part.length)
    return part
      .map((subpart) => module.exports.flattenAttribute(subpart))
      .filter((el) => el != undefined)
      .flat(1);
};

/**
 * Return the content of the mail that will be displayed by the client,
 * if there is an HTML with images sources it will also include the base64
 * image inside the HTML, otherwise it will return the text content of the mail.
 * @param {Array} parts The unordered list of parts of the message.
 * @returns The content of the mail to be displayed by the client.
 */
module.exports.getHTMLContent = (parts) => {
  let noHTML = "";
  let HTML;
  let sources = [];
  for (let key in parts) {
    let { type, subtype, id, content } = parts[key];
    if (type == "text") {
      if (subtype == "html") {
        HTML = content;
      } else {
        noHTML = content;
      }
    }
    if (type == "image") {
      sources[id.slice(1, -1)] = `data:image/png;base64,${content}`;
    }
  }
  for (let sourceID in sources) {
    HTML = HTML.replace(`cid:${sourceID}`, sources[sourceID]);
  }
  return HTML || `<html><head></head><body><pre style="white-space: break-spaces;">${noHTML}</pre></body></html>`;
};

/**
 * Get the status and the message for a corresponding error.
 */
module.exports.getErrorResponse = (err) => {
  if (["EAUTH", "EENVELOPE"].includes(err?.code) || (err?.type == "no" && err?.source == "authentication")) {
    return {
      status: 403,
      data: "Bad credentials",
    };
  }
  if (
    ["ESOCKET", "EDNS", "ERR_SSL_WRONG_VERSION_NUMBER", "ECONNREFUSED", "ENOTFOUND"].includes(err?.code) ||
    ["Unexpected socket close"].some((el) => err?.message.includes(el))
  ) {
    return {
      status: 400,
      data: "Invalid server informations",
    };
  }

  return {
    status: 403,
    data: err,
  };
};
