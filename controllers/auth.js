import { validationResult, body, param } from "express-validator";
import asyncHandler from "express-async-handler";
import passport from "passport";
import bcrypt from "bcryptjs";
import * as db from "../db/queries.js";

export const signUpGET = (req, res) => res.render("sign-up");

export const signUpPOST = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First name must only contain letters")
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be within 50 characters"),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name must only contain letters")
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be within 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be formatted properly")
    .custom(async (value) => {
      const user = await db.getUserByEmail(value);
      if (user) throw new Error("E-mail already in use");
      return true;
    }),
  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const formatted = result.formatWith(({ msg }) => msg);
      return res.status(400).render("sign-up", { errors: formatted.mapped() });
    }

    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insertUser(firstName, lastName, email, hashedPassword);

    res.redirect("/auth/sign-in");
  }),
];

export const signInGET = (req, res) => {
  const error = req.session.messages.length
    ? "Incorrect email or password"
    : "";

  res.render("sign-in", { error });
};

export const signInPOST = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/sign-in",
    failureMessage: true,
  })(req, res, next);
};

export const signOut = (req, res) => {
  req.logout(() => res.redirect("/posts"));
};

export const updateUserRole = [
  param("role").custom((value) => {
    return value === "member" || value === "admin";
  }),
  body("passcode").custom((value, { req }) => {
    const { MEMBER_PASSCODE, ADMIN_PASSCODE } = process.env;

    switch (req.params.role) {
      case "admin":
        return value === ADMIN_PASSCODE;

      case "member":
        return value === MEMBER_PASSCODE;

      default:
        return false;
    }
  }),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.redirect(400, "/posts");

    const userId = req.user.id;
    const { role } = req.body;

    await db.updateUserRole(userId, role);
    res.redirect("/posts");
  }),
];
