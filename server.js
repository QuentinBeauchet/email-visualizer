let { getEmailsInfos, getEmail, sendMail } = require("./private/customImap.js");

const express = require("express");
var cors = require("cors");

const path = `${__dirname}/dist/`;
const app = express();
const port = 3000;

const queues = {
  infos: [
    new Promise((resolve) => {
      resolve();
    }),
  ],
  mail: [
    new Promise((resolve) => {
      resolve();
    }),
  ],
};

function addToRequestQueue(req, res, queue, promise) {
  let prev = queues[queue].shift();
  if (prev) {
    prev.then(() => {
      promise.then((r) => res.send(r));
      queues[queue].push(promise);
    });
  } else res.redirect(req.originalUrl);
}

app.use(cors());
app.use(express.json());

app.use("/", express.static(path));

app.use("/test", express.static(`${__dirname}/public/`));

app.use("/infos", (req, res) => {
  addToRequestQueue(req, res, "infos", getEmailsInfos(req.body));
});

app.use("/mail", (req, res) => {
  addToRequestQueue(req, res, "mail", getEmail(req.body));
});

app.use("/send", (req, res) => {
  addToRequestQueue(req, res, "mail", sendMail(req.body));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
