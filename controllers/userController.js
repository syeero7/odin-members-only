import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import * as db from "../db/queries.js";
import { validateSignupUser } from "../utils/validation.js";

export const signupUserGet = (req, res) => res.render("sign-up");

export const signupUserPost = [
  validateSignupUser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) res.render("sign-up", { errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    bcrypt.hash(password, 10, async (error, hashedPassword) => {
      if (error) return next(error);

      await db.insertUser(firstName, lastName, email, hashedPassword);
      res.redirect("/user/sign-in");
    });
  },
];

export const signinUserGet = (req, res) => res.render("sign-in");

export const logoutUserGet = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
