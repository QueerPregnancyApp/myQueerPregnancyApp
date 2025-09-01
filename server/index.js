// ES Modules server entry
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Routes
import auth from './routes/auth.js';
// If you have a rights router, keep this import. If not, remove the next line.
import rightsRouter from './routes/rights.js';

const app = express();

// If behind a proxy/load balancer (Render/Heroku/etc.)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Dev logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parsers
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || undefined));

// CORS (allow client dev server + cookies)
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount routes
app.use('/api/auth', authLimiter, auth);
app.use('/api/rights', rightsRouter); // remove if you don't have this file

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Central error handler (optional but nice)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server on :${PORT}`));
