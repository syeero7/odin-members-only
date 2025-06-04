import path from "path";
import bcrypt from "bcryptjs";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectPg from "connect-pg-simple";

import pool from "./db/pool.js";
import { getUserByEmail, getUserById } from "./db/queries.js";
import auth from "./routes/auth.js";
import posts from "./routes/posts.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = getUserByEmail(email);
        if (!user) return done(null, false, { message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (userId, done) => {
  try {
    const user = getUserById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const SessionStore = connectPg(session);
const { PORT, SECRET } = process.env;

app.use(
  session({
    store: new SessionStore({ pool }),
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.session());

app.use(async (req, res, next) => {
  if (req.isAuthenticated()) req.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => res.redirect("/posts"));
app.use("/auth", auth);
app.use("/posts", posts);

app.use((error, req, res, next) => {
  res.status(500).send(error.message || "Server Error");
});

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}/`));
