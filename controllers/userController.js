import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import * as db from "../db/queries.js";
import { validateUser } from "../utils/validation.js";

export const signupUserGet = (req, res) => res.render("sign-up");

export const signupUserPost = [
  validateUser,
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

export const signinUserGet = (req, res) => {
  const errors = req.session.messages?.map((msg) => ({ msg })) || [];
  res.render("sign-in", { errors });
};

export const logoutUserPost = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

export const setMembership = async (req, res) => {
  const { userId } = req.params;
  const { passcode } = req.body;

  if (passcode !== process.env.MEMBER_PASSCODE) return res.redirect(401, "/");

  await db.insertMember(userId);
  return res.redirect("/");
};

export const setAdmin = async (req, res) => {
  const { userId } = req.params;
  const { passcode } = req.body;

  if (passcode !== process.env.ADMIN_PASSCODE) return res.redirect(401, "/");

  const member = await db.getMemberByUserId(userId);
  if (member) {
    await db.updateMemberToAdmin(userId);
    return res.redirect("/");
  }

  await db.insertMember(userId);
  await db.updateMemberToAdmin(userId);
  res.redirect("/");
};
