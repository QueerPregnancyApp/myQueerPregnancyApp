const bcrypt = require("bcrypt");
const {
  createUser,
  getUserByUsername,
  getUserByToken,
} = require("../db/helpers/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { token } = require("morgan");

const router = require("express").Router();

const SALT_ROUNDS = 10;
const COOKIE_OPTIONS = {
  sameSite: "strict",
  httpOnly: true,
  signed: true,
  secure: true,
};

router.get("/", async (req, res, next) => {
  try {
    res.send("WOW! A thing!");
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const response = await jwt.verify(req.headers.authorization, JWT_SECRET);
    const user = await getUserByToken(response.id);
    if (!user) {
      throw "not a user";
    }
    delete user.password;
    res.send({ user, ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
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
    res.cookie("token", token, COOKIE_OPTIONS);

    delete user.password;
    // console.log(res)

    res.send({ user, ok: true, token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) {
      return res
        .status(401)
        .send({ ok: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    // delete user.password;
    if (validPassword) {
      //creating our token
      const token = jwt.sign(user, JWT_SECRET);
      //attaching a cookie to our response using the token that we created
      res.cookie("token", token, COOKIE_OPTIONS);

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

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.send({
      loggedIn: false,
      message: "Logged Out",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
