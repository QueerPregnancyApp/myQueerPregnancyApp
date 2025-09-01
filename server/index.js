const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT;
const path = require("path");

// init morgan
const morgan = require("morgan");
app.use(morgan("dev"));
app.set("trust proxy", 1);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(cookieParser(process.env.COOKIE_SECRET));

// init body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// init cors
const cors = require("cors");
app.use(cors());

const client = require("./db/client");
client.connect();

app.use(express.static(path.join(__dirname, "..", "client/dist/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

// Router: /api
app.use("/api", require("./api"));

app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .send(error.message || "internal server error");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
