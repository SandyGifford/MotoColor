import express from "express";
import addWebpack from "./addWebpack";
import http from "http";
import routing from "./routing";

const port = 3000;

const app = express();
const server = http.createServer(app);
addWebpack(server);

app.use(routing);
server.listen(port, () => console.log(`Example app listening on port ${port}!`));

