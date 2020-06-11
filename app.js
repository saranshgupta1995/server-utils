const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

const sharper = require('./sharper');

const app = express();

app.use(express.static(path.join(__dirname, '/static')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(sharper);

app.get("/", (req, res) => {
  res.json({
    hello: "hello"
  });
});

app.get("/sharper", (req, res) => {
  res.sendFile(path.join(__dirname, '/static/sharper.html'));
});

const port = process.env.PORT || 3004;

const server = http.createServer(app);
server.listen(port, () => console.log("server is now listening"));
