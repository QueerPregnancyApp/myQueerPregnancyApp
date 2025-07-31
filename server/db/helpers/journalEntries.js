const client = require("../client");

const createJournalEntry = async ({ user_id, content }) => {
  const {
    rows: [entry],
  } = await client.query(
    `
        INSERT INTO journalentries(user_id, content)
        VALUES ($1, $2)
        RETURNING *
    `,
    [user_id, content]
  );
  return entry;
};

const getEntriesByUserId = async (userId) => {
  const { rows } = await client.query(
    `
      SELECT * FROM journalentries
      WHERE user_id = $1;
    `,
    [userId]
  );
  return rows;
};

module.exports = {
  createJournalEntry,
  getEntriesByUserId,
};
