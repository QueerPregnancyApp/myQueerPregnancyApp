import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use('/api/auth', auth);

app.get('/api/health', (_req,res)=> res.json({ ok:true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log(`server on :${PORT}`));
