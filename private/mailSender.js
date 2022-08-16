const nodemailer = require("nodemailer");

module.exports.sendMail = ({ auth, host, port, mail }) => {
  let { to, from, subject, text, html } = mail;

  console.log(auth);

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
        console.log(`Mail Sent to ${to}`);
        if (err) {
          resolve(err);
        }
        resolve(info);
      }
    );
  });
};
