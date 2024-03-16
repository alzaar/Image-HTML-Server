import BaseRouter from "./BaseRouter";
import PageRouter from "./PageRouter";
import ImageRouter from "./ImageRouter";

export default class MainRouter extends BaseRouter {
  constructor() {
    super();
    const imageRouter = new ImageRouter();
    const pageRouter = new PageRouter();

    this.addRoute("GET", "/images", imageRouter.sendAllImageIds);
    this.addRoute("GET", "/images/:imageId", imageRouter.sendImage);
    this.addRoute("GET", "/", pageRouter.sendHomePage);
  }
}
