const client = require("../client");
const util = require("../util");

const getAllWeeks = async () => {
  try {
    const {
      //is this label for rows correct?
      rows: [weeks],
    } = await client.query(`
          SELECT *
          FROM weeks;
      `);
    return weeks;
  } catch (error) {
    throw error;
  }
};

const getWeeksId = async (week_id) => {
  const {
    rows: [week],
  } = await client.query(
    //need help with rewriting this :
    `
    SELECT * FROM weeks WHERE id = $1
    `,
    [week_id]
  );
  return week;
};

const createWeeks = async ({ weight, size, info }) => {
  const {
    rows: [weeks],
  } = await client.query(
    `
        INSERT INTO weeks(weight, size, info)
        VALUES ($1, $2, $3)
        RETURNING *
    `,
    [weight, size, info]
  );
  return weeks;
};

async function updateWeeks(week_id, fields) {
  try {
    const toUpdate = {};
    for (let column in fields) {
      if (fields[column] !== undefined) toUpdate[column] = fields[column];
    }
    let weeks;

    if (util.dbFields(toUpdate).insert.length > 0) {
      const values = [...Object.values(toUpdate), week_id];
      const { rows } = await client.query(
        `
          UPDATE weeks
          SET ${util.dbFields(toUpdate).insert}
          WHERE "id"=$${values.length}
          RETURNING *;
        `,
        values
      );
      weeks = rows[0];
    }

    return weeks;
  } catch (error) {
    throw error;
  }
}

async function deleteWeeks(id) {
  try {
    const { rows } = await client.query(
      'DELETE FROM weeks WHERE "id"=$1 RETURNING *',
      [id]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllWeeks,
  getWeeksId,
  createWeeks,
  updateWeeks,
  deleteWeeks,
};
