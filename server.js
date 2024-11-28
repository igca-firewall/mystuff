// server.js
import next from "next";
import fs from "fs";
import https from "https";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Read the SSL certificate and key
const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};
// const crypto = require("crypto");

// // Generate a 32-byte random secret (256-bit key)
// const authSecret = crypto.randomBytes(32).toString("hex");
// console.log("Generated Auth Secret:", authSecret);

app.prepare().then(() => {
  https
    .createServer(options, (req, res) => {
      handle(req, res);
    })
    .listen(4000, (err) => {
      if (err) throw err;
      console.log("> Ready on https://localhost:4000");
    });
});
