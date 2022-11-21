const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const webhookHelper = require("./webhookController");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

const processWebhook = (request) => {
  const webhook = webhookHelper.sendBackInfo(request);

  return webhook
  // switch (webhook.event) {
  //   case "VERIFICATION_COMPLETED":

  //     break;
  //   case "VERIFICATION_REVIEWED":

  //     break;
  //   default:
  //     console.log("Review event was not possible");
  // }
};

app.get("/send-back/:clientId/:address/:privateKey", (req, res) => {
  // const {clientId, address, privateKey} = req.params
  const info = processWebhook(req);
  res.status(200).send(info);
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
