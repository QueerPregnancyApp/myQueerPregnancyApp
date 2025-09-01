const bcrypt = require("bcrypt");
const {
  createUser,
  getUserByUsername,
  getUserByToken,
} = require("../db/helpers/users");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-prod";

const router = require("express").Router();

// Cookies: httpOnly + secure in production, strict-ish CSRF posture
const cookieOpts = { httpOnly: true, sameSite: "lax", secure: false, path: "/" };
if (process.env.NODE_ENV === "production") cookieOpts.secure = true;

// Basic rate-limiters (helps pass CodeQL "missing rate limiting")
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

const SALT_ROUNDS = 10;

router.get("/", async (req, res, next) => {
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
    const response = await jwt.verify(token, JWT_SECRET);
    const user = await getUserByToken(response.id);
    if (!user) {
      return res.send({ user: null, ok: false });
    }
    delete user.password;
    res.send({ user, ok: true });
  } catch (error) {
    res.send({ user: null, ok: false });
  }
});

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    console.log(req.body, JWT_SECRET);
    const { username, password } = req.body;
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    //sending username and hashed pw to database
    const user = await createUser({ username, password: hashedPassword });
    //removing password from user object for security reasons
    delete user.password;

    //creating our token
    const token = jwt.sign(user, JWT_SECRET);

    //attaching a cookie to our response using the token that we created
    res.cookie("token", token, cookieOpts);

    delete user.password;
    // console.log(res)

    res.send({ user, ok: true, token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    console.log("user", user);

    if (!user) {
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("validPassword", validPassword);

    // delete user.password;
    if (validPassword) {
      //creating our token
      const token = jwt.sign(user, JWT_SECRET);
      //attaching a cookie to our response using the token that we created
      res.cookie("token", token, cookieOpts);
      console.log("token", token);

      delete user.password;
      res.send({ user, ok: true, token });
    } else {
      res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });
      // res.send({ message: "Failed to login!" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
    res.send({
      loggedIn: false,
      message: "Logged Out",
    });
  } catch (error) {
    res.send({ loggedIn: false, message: "Logged Out" });
  }
});

module.exports = router;
