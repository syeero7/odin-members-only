import { Router } from "express";
import * as controllers from "../controllers/posts.js";

const router = Router();

router.get("/", controllers.getAllPosts);

router.use((req, res, next) => {
  if (req.isUnauthenticated()) return res.sendStatus(401);
  next();
});

router.get("/new", controllers.createPostGET);
router.post("/new", controllers.createPostPOST);

router.use((req, res, next) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  next();
});

router.post("/:postId/delete", controllers.deletePost);

export default router;
