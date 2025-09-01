import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import auth from "./routes/auth.js";

const app = express();

// Behind proxy/load balancer (Render/Heroku/etc.)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Dev logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parsers
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || undefined));

// CORS (allow client dev server + cookies)
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Rate limiting (general wrapper for /api/auth)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use("/api/auth", authLimiter, auth);
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server on :${PORT}`));
