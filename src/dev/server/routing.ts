import express from "express";
import path from "path";

const app = express();


const rootDir = process.cwd();
const docDir = path.resolve(rootDir, "docs");
const devHtml = path.resolve(__dirname, "dev.html");

app.get("/", (req, res) => res.sendFile(devHtml));
app.get(/^\/(assets|build)\/.*/, (req, res) => res.sendFile(path.join(docDir, req.url)));

export default app;
