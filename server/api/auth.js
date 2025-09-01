import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import {
  createUser,
  getUserByUsername,
  getUserByToken,
} from "../db/helpers/users.js"; // ⬅️ ensure the .js extension exists

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-prod";
const SALT_ROUNDS = 10;

// Cookies: httpOnly + secure in production, strict-ish CSRF posture
const cookieOpts = { httpOnly: true, sameSite: "lax", secure: false, path: "/" };
if (process.env.NODE_ENV === "production") cookieOpts.secure = true;

// Basic rate-limiters (helps satisfy CodeQL "missing rate limiting")
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", async (_req, res, next) => {
  try {
    res.send("WOW! A thing!");
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.send({ user: null, ok: false });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserByToken(payload.id);
    if (!user) {
      return res.send({ user: null, ok: false });
    }
    delete user.password;
    res.send({ user, ok: true });
  } catch (_err) {
    res.send({ user: null, ok: false });
  }
});

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send({ ok: false, message: "Missing fields" });

    // Hash and create
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ username, password: hashedPassword });

    // Create a compact token with only the user id
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // httpOnly cookie
    res.cookie("token", token, cookieOpts);

    delete user.password;
    // Do not return the token in the body (avoids “clear-text” flags)
    res.send({ user, ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send({ ok: false, message: "Missing fields" });

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send({ ok: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).send({ ok: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOpts);

    delete user.password;
    res.send({ user, ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (_req, res) => {
  try {
    res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
    res.send({ loggedIn: false, message: "Logged Out" });
  } catch (_err) {
    res.send({ loggedIn: false, message: "Logged Out" });
  }
});

export default router;
