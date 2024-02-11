import http from "http";
import fs from "fs";

// const http = require('http');
// const fs = require('fs');

const requestHandler = (req, res) => {
  console.log("ny request");
  if (req.method === "GET") {
    if (req.url === "/chomp.css") {
      fs.readFile("./chomp.css", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      });
    } else if (req.url === "/chomp.js") {
      fs.readFile("./chomp.js", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(data);
      });
    } else if (req.url === "/") {
      fs.readFile("./chomp.html", (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    }
  }
};

const server = http.createServer(requestHandler);
const port = 1234;

server.listen(port, (err) => {
  if (err) {
    console.log("Error starting server", err);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
