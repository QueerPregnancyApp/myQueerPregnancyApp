const client = require("../client");

const createJournalEntry = async ({ user_id, content }) => {
  const {
    rows: [entry],
  } = await client.query(
    `
        INSERT INTO journalEntries(user_id, content)
        VALUES ($1, $2)
        RETURNING *
    `,
    [user_id, content]
  );
  return entry;
};

const getEntriesByUserId = async (user_id) => {
  const { rows } = await client.query(
    `
    SELECT * FROM journalEntries
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );
  return rows;
};

module.exports = {
  createJournalEntry,
  getEntriesByUserId,
};
