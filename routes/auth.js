import { Router } from "express";
import * as controllers from "../controllers/auth.js";

const router = Router();

router.get("/sign-up", controllers.signUpGET);
router.get("/sign-in", controllers.signInGET);

router.post("/sign-up", controllers.signUpPOST);
router.post("/sign-in", controllers.signInPOST);

router.use((req, res, next) => {
  if (req.isUnauthenticated()) return res.sendStatus(401);
  next();
});

router.post("/sign-out", controllers.signOut);
router.post("/roles/:role", controllers.updateUserRole);

export default router;
