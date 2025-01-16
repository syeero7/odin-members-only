import { Router } from "express";
import passport from "passport";

import * as controller from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/sign-up", controller.signupUserGet);
userRouter.get("/sign-in", controller.signinUserGet);
userRouter.get("/logout", controller.logoutUserGet);

userRouter.post("/sign-up", controller.signupUserPost);
userRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/sign-in",
    failureMessage: true,
  })
);

userRouter.post("/:userId/membership", controller.setMembership);
userRouter.post("/:userId/admin", controller.setAdmin);

export default userRouter;
