import * as fs from "fs";
import * as path from "path";
import * as http from "http";

export default class PageRouter {
  constructor() {
    this.sendHTMLContent = this.sendHTMLContent.bind(this);
    this.sendHomePage = this.sendHomePage.bind(this);
  }

  public sendHomePage(req: http.IncomingMessage, res: http.ServerResponse) {
    let filePath = "." + req.url;
    if (filePath == "./") {
      filePath = "../pages/index.html";
    } else {
      filePath = "../pages" + req.url;
    }
    this.sendHTMLContent(filePath, res);
  }

  public sendHTMLContent(filePath: string, res: http.ServerResponse) {
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";
    fs.readFile(path.join(__dirname, filePath), (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          fs.readFile("./404.html", (error404, content404) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content404, "utf-8");
          });
        } else {
          res.writeHead(500);
          res.end(`Sorry, check with the site admin for error: ${error.code}`);
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  }
}
