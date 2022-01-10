import * as functions from "firebase-functions";
import * as https from "https";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const nomicsApiKey = "a9691284dd7ea08650c6c6b308f54c7760730a0b";
const nomicsURL = "https://api.nomics.com/v1/currencies/ticker?";
const nomicsConfig = "&ids=BTC&interval=1d,30d&convert=USD&per-page=100&page=1";

export const getBitcoinPrice = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    console.log("CORS OPTIONS REQUEST");
  } else {
    https.get(`${nomicsURL}key=${nomicsApiKey}${nomicsConfig}`, (r) => {
      console.log("RESPONSE FROM APINOMICS", r);
      let obj = "";
      r.on("data", (data) => {
        obj += data;
      });
      r.on("end", () => {
        res.status(200).send(obj);
      });
    }).on("error", (error) => {
      res.status(400).send(error);
    });
  }
});
