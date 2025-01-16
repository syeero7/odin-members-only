import { Router } from "express";
import passport from "passport";

import * as controller from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", (req, res) => res.render("index", { posts: [] }));
userRouter.get("/user/sign-up", controller.signupUserGet);
userRouter.get("/user/sign-in", controller.signinUserGet);
userRouter.get("/user/logout", controller.logoutUserGet);

userRouter.post("/user/sign-up", controller.signupUserPost);
userRouter.post(
  "/user/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/sign-in",
    failureMessage: true,
  })
);

userRouter.post("/user/:userId/membership", controller.setMembership);
userRouter.post("/user/:userId/admin", controller.setAdmin);

export default userRouter;
