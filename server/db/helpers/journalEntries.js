const client = require("../client");

const createJournalEntry = async ({ user_id, content }) => {
  const {
    rows: [entry],
  } = await client.query(
    `
        INSERT INTO journal_entries(user_id, content)
        VALUES ($1, $2)
        RETURNING *
    `,
    [user_id, content]
  );
  return entry;
};

module.exports = { createJournalEntry };
