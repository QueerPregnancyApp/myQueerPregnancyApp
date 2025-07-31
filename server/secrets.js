require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET

module.exports = { JWT_SECRET, COOKIE_SECRET }
