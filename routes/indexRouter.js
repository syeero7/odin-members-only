import { Router } from "express";

import * as controller from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", controller.getAllPosts);
indexRouter.get("/post/:userId/create", controller.createPostGet);

indexRouter.post("/post/:userId/create", controller.createPost);
indexRouter.post("/post/delete/:postId", controller.deletePost);

export default indexRouter;
