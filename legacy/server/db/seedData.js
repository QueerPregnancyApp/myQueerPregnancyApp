// dummy data in here
const users = [
  { username: "Gustavo", password: 12345678, journal: "funny" },
  { username: "Kieran", password: 87654321, journal: "smiley" },
  { username: "Patsy", password: 24681012, journal: "happy" },
];

const pregnancies = [
  { user_id: 1, age: 7, is_tracking: true },
  { user_id: 2, age: 12, is_tracking: true },
  { user_id: 3, age: 15, is_tracking: true },
];

const weeks = [
  { weight: 0.04, size: 0.31, info: "Baby is the size of a eyeliner brush" }, //add image url
  { weight: 0.49, size: 2.1, info: "Baby is the size of a golden stitch" },
  { weight: 2.47, size: 3.98, info: "Baby is the size of a mixed tape" },
];
const pregnancyWeeks = [
  { week_id: 1, preg_id: 1 },
  { week_id: 2, preg_id: 2 },
  { week_id: 3, preg_id: 3 },
];
module.exports = { users, pregnancies, weeks, pregnancyWeeks };
