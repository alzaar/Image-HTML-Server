import * as http from "http";

import Router from "./router/index";

const PORT = 4000;

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    new Router().handleRequest(req, res);
  }
);

server.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

/*
  Todo:
  1. Configure router using classes
  2. Make JSON responses rest api specific
  3. Add error handling

  Check: the page router for the response end error
*/
