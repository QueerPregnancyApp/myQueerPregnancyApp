const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const {
  createJournalEntry,
  getEntriesByUserId,
} = require("../db/helpers/journalEntries");

router.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { id } = await jwt.verify(token, JWT_SECRET);
    const { content } = req.body;
    const entry = await createJournalEntry({ user_id: id, content });
    res.send(entry);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const { id } = await jwt.verify(token, JWT_SECRET);
    const entries = await getEntriesByUserId(id);
    res.send(entries);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
