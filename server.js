let {
  getEmailsInfos,
  getEmail,
  sendMail,
  isIMAPAuthValid,
  isSMTPAuthValid,
  getBoxes,
} = require("./private/customImap.js");

const express = require("express");
var cors = require("cors");

const path = `${__dirname}/dist/`;
const app = express();
const port = 3000;

const queues = ["infos", "mail", "send", "authIMAP", "authSMTP", "getBoxes"].reduce(
  (obj, key) => ({
    ...obj,
    [key]: [
      new Promise((resolve) => {
        resolve();
      }),
    ],
  }),
  {}
);

function addToRequestQueue(req, res, queue, promise) {
  let prev = queues[queue].shift();
  if (prev) {
    prev.then(() => {
      promise.then(({ status, data }) => res.status(status).send(data));
      queues[queue].push(promise);
    });
  } else addToRequestQueue(req, res, queue, promise);
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
  addToRequestQueue(req, res, "send", sendMail(req.body));
});

app.use("/authIMAP", (req, res) => {
  addToRequestQueue(req, res, "authIMAP", isIMAPAuthValid(req.body));
});

app.use("/authSMTP", (req, res) => {
  addToRequestQueue(req, res, "authSMTP", isSMTPAuthValid(req.body));
});

app.use("/boxes", (req, res) => {
  addToRequestQueue(req, res, "getBoxes", getBoxes(req.body));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
