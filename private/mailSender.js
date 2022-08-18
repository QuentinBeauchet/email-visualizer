const nodemailer = require("nodemailer");
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
    nodemailer.createTestAccount((err, test) => {
      if (err) {
        resolve({ status: 500 });
        return;
      }
      module.exports
        .sendMail({
          auth,
          host,
          port,
          mail: {
            to: test.user,
            from: "TEST",
            subject: "Connexion Test",
            text: "",
            html: "",
          },
        })
        .then((res) => resolve({ status: res.status }));
    });
  });
};
