import * as fs from "fs";
import * as http from "http";
import * as path from "path";

import { CustomReq } from "./types";

export default class ImageRouter {
  public sendImage(req: CustomReq, res: http.ServerResponse): void {
    const imageId = req.params.imageId;
    const imagePath = path.join("..", "images", `${imageId}.png`);
    if (fs.existsSync(imagePath)) {
      res.writeHead(200, { "Content-Type": "image/png" });
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Image not found");
    }
  }

  public sendAllImageIds(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    const folderPath = path.join(__dirname, "..", "..", "..", "images");
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        // Handle error
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        // Send the list of files as the response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(files.map((file) => file.split(".")[0])));
      }
    });
  }
}
