const client = require("./client");
const { createUser } = require("./helpers/users");
const { createPregnancy } = require("./helpers/pregnancy");
const { createPregnancyWeeks } = require("./helpers/pregnancyWeeks");
const { createWeeks } = require("./helpers/weeks");
const { users, pregnancies, weeks, pregnancyWeeks } = require("./seedData");

// helper for journal entries (if seed data is added later)
// const { createJournalEntry } = require("./helpers/journalEntries");

const dropTables = async () => {
  try {
    await client.query(`
        DROP TABLE IF EXISTS journalEntries;
        DROP TABLE IF EXISTS pregnancyWeeks;
        DROP TABLE IF EXISTS weeks;
        DROP TABLE IF EXISTS pregnancies;
        DROP TABLE IF EXISTS users;
    `);
    console.log("Dropped Tables");
  } catch (error) {
    console.log("Error dropping tables");
    throw error;
  }
};

const createTables = async () => {
  await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            journal text
        );
        CREATE TABLE journalEntries(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE pregnancies(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            age INTEGER NOT NULL,
            is_tracking BOOLEAN NOT NULL
        );
        CREATE TABLE weeks(
            id SERIAL PRIMARY KEY,
            weight FLOAT NOT NULL,
            size FLOAT NOT NULL,
            info VARCHAR(255)UNIQUE NOT NULL
        );
        CREATE TABLE pregnancyweeks(
          id SERIAL PRIMARY KEY,
          week_id INTEGER REFERENCES weeks(id),
          preg_id INTEGER REFERENCES pregnancies(id)
        );
    `);
  console.log("Created Tables");
};

const createInitialUsers = async () => {
  console.log("Creating Users...");
  for (const user of users) {
    await createUser(user);
  }
};

const createInitialPregnancies = async () => {
  console.log("Creating Pregnancies...");
  for (const pregnancy of pregnancies) {
    await createPregnancy(pregnancy);
  }
};

const createInitialWeeks = async () => {
  console.log("Creating Weeks...");
  for (const week of weeks) {
    await createWeeks(week);
  }
};

const createInitialPregnancyWeeks = async () => {
  console.log("Creating Pregnancyweeks...");
  for (const pregnancyWeek of pregnancyWeeks) {
    await createPregnancyWeeks(pregnancyWeek);
  }
};

const initDb = async () => {
  console.log("init");
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPregnancies();
    await createInitialWeeks();
    await createInitialPregnancyWeeks();
    console.log("DB is seeded and ready to go!!");
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
};

initDb();
