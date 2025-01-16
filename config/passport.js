import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

import { getUserByEmail, getUserById } from "../db/queries.js";

const strategy = new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      req.session.messages = [];

      const user = await getUserByEmail(email);
      if (!user) return done(null, false, { message: "Incorrect email" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export const initializePassport = (passport) => {
  passport.use(strategy);
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
