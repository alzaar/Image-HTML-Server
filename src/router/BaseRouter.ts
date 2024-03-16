import * as fs from "fs";
import * as url from "url";
import * as path from "path";
import * as http from "http";

import { RequestHandler, CustomReq } from "./types";

export default class BaseRouter {
  private routes: { [key: string]: { [method: string]: RequestHandler } };
  constructor() {
    this.routes = {};
  }

  public addRoute(method: string, path: string, handler: RequestHandler): void {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }
    this.routes[path][method] = handler;
  }

  public handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    const parsedUrl = url.parse(req.url || "", true);
    const path = parsedUrl.pathname || "";
    const method = req.method || "";

    const matchingRoutes = Object.keys(this.routes).filter((route) => {
      const routeParts = route.split("/");
      const pathParts = path.split("/");
      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every(
        (part, index) => part.startsWith(":") || part === pathParts[index]
      );
    });

    const handler =
      matchingRoutes.length > 0 ? this.routes[matchingRoutes[0]][method] : null;

    if (handler) {
      const params: Record<string, string> = {};
      const routeParts = matchingRoutes[0].split("/");
      const pathParts = path.split("/");
      routeParts.forEach((part, index) => {
        if (part.startsWith(":")) {
          const paramName = part.substring(1);
          params[paramName] = pathParts[index];
        }
      });

      const augmentedReq = req as CustomReq;
      augmentedReq.params = params;
      handler(augmentedReq, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
}
