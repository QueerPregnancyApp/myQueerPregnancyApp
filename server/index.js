const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT;
const path = require("path");

// init morgan
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
// Set common security headers
app.use(helmet());

// If behind a proxy/load balancer (Render, Heroku, Fly, etc.), trust the first proxy
// so secure cookies and rate limiting IPs work
app.set("trust proxy", 1);

// init body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// init cors
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

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
