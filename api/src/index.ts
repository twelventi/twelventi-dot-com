import Koa from "koa";
import Router from "koa-router";

import serve from "koa-static";
import mount from "koa-mount";
import * as fs from "fs";
import http from "http";

import { WebSocket, WebSocketServer } from "ws";
import { setupWsServer } from "./wsServer";

const PORT = parseInt(process.env["PORT"] ?? "3001");

const app = new Koa();
const api = new Koa();

//create the ui
const ui = new Koa();

//serve all the files in the generated react output
const uiPath = __dirname + "/../../ui/dist";
ui.use(serve(uiPath));

const defaultRouter = new Router();

//have all get requests return the index.html for react
defaultRouter.get("(.*)", async (ctx, next) => {
  const file = fs.readFileSync(`${uiPath}/index.html`).toString();
  console.log(file);
  ctx.body = file;
  ctx.status = 200;
});
ui.use(defaultRouter.routes());

//mount the ui on /
app.use(mount("/", ui));

const server = http.createServer(app.callback());
const wsServer = new WebSocketServer({ server });
setupWsServer(wsServer);

console.log(`Serving on PORT ${PORT}`);
server.listen(PORT);
