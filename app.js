import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectPg from "connect-pg-simple";

import { pool } from "./config/database.js";
import { initializePassport } from "./config/passport.js";
import currentUser from "./middleware/currentUser.js";
import userRouter from "./routes/userRouter.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const pgStore = connectPg(session);
initializePassport(passport);

app.use(
  session({
    store: new pgStore({ pool }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.session());

app.use(currentUser);

app.use("/", userRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
