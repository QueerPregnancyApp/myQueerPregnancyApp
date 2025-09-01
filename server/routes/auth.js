import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const cookieOpts = { httpOnly: true, sameSite: 'lax', secure: false, path: '/' };

router.post('/register', async (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'missing fields'});
  const hash = await bcrypt.hash(password, 10);
  const { rows:[user] } = await pool.query(
    'INSERT INTO users(username, password_hash) VALUES($1,$2) RETURNING id, username',
    [username, hash]
  );
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, cookieOpts);
  res.json(user);
});

router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  const { rows:[user] } = await pool.query('SELECT id, username, password_hash FROM users WHERE username=$1',[username]);
  if(!user) return res.status(401).json({error:'invalid'});
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(401).json({error:'invalid'});
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, cookieOpts);
  res.json({ id: user.id, username: user.username });
});

router.post('/logout', (req,res)=>{
  res.clearCookie('token', { ...cookieOpts, maxAge: 0 });
  res.json({ ok:true });
});

router.get('/me', async (req,res)=>{
  const token = req.cookies?.token;
  if(!token) return res.json(null);
  try{
    const { id } = jwt.verify(token, JWT_SECRET);
    const { rows:[user] } = await pool.query('SELECT id, username FROM users WHERE id=$1',[id]);
    res.json(user || null);
  }catch(err){
    res.json(null);
  }
});

export default router;
