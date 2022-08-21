const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
let { getErrorResponse } = require("./utils.js");

module.exports.sendMail = ({ auth, host, port, mail }) => {
  console.log(`New mail from ${auth.user}`);

  let { to, from, subject, text, html } = mail;
  let transporter = nodemailer.createTransport({
    auth,
    host,
    port,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return new Promise((resolve) => {
    transporter.sendMail(
      {
        from: `"${from}" <${auth.user}>`,
        to,
        subject,
        text,
        html,
      },
      (err, info) => {
        if (err) {
          resolve(getErrorResponse(err));
          return;
        }
        console.log(`Mail Sent to ${to}`);
        resolve({
          status: 200,
          data: {
            accepted: info.accepted,
            rejected: info.rejected,
          },
        });
      }
    );
  });
};

module.exports.isSMTPAuthValid = ({ auth, host, port }) => {
  return new Promise((resolve) => {
    let connection = new SMTPConnection({
      port,
      host,
      secure: false,
      authMethod: "LOGIN",
    });

    connection.on("connect", () => {
      connection.login(
        {
          credentials: auth,
        },
        (err) => {
          if (err) {
            resolve(getErrorResponse(err));
            connection.quit();
            return;
          }
          resolve({ status: 200 });
          connection.quit();
        }
      );
    });

    connection.on("error", (err) => {
      resolve(getErrorResponse(err));
      connection.quit();
    });

    connection.connect();
  });
};
