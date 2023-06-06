import { WebSocketServer, WebSocket } from "ws";

var clients: Record<string, { ws: WebSocket; fl: string }> = {};
export function setupWsServer(wsServer: WebSocketServer) {
  wsServer.on("connection", async (connection: WebSocket, req) => {
    // Generate a unique code for every user
    const userId = crypto.randomUUID();
    const remoteAddr =
      req.headers["x-forwarded-for"] ??
      (Object.keys(clients).length % 2 == 0 ? "8.8.8.8" : "83.39.107.191");

    console.log(Object.keys(clients));
    console.log(`Recieved a new connection from ${remoteAddr}`);

    //fetch country code
    const cc = await (
      await fetch(`https://ipapi.co/${remoteAddr}/country`)
    ).text();

    const ccEmoji = cc;

    // String.fromCodePoint(
    //   ...cc
    //     .toUpperCase()
    //     .split("")
    //     .map((char) => 127397 + char.charCodeAt(0))
    // );

    // Store the new connection and handle messages
    clients[userId] = { ws: connection, fl: ccEmoji };
    console.log(`${userId} connected from ${ccEmoji}`);
    connection.on("message", (data: Buffer) => {
      Object.keys(clients).forEach((value) => {
        const client = clients[value].ws;
        if (client.readyState === WebSocket.OPEN) {
          let payload: Object;
          try {
            payload = JSON.parse(data.toString());

            client.send(
              JSON.stringify({
                event: "update",
                userid: userId,
                ...payload,
                fl: cc,
              })
            );
          } catch (e) {}
        }
      });
    });

    connection.on("close", () => {
      Object.keys(clients).forEach((value) => {
        const client = clients[value].ws;
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(JSON.stringify({ event: "close", userid: userId }));
          } catch (e) {}
        }
      });
      delete clients[userId];
      console.log(`${userId} closed`);
    });
  });
}
