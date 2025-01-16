import { Router } from "express";
import passport from "passport";

import * as controller from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/");
userRouter.get("/user/sign-up", controller.signupUserGet);
userRouter.get("/user/sign-in", controller.signinUserGet);

userRouter.post("/user/sign-up", controller.signupUserPost);
userRouter.post(
  "/user/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/sign-in",
  })
);

export default userRouter;
