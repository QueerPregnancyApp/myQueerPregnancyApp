const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const { JWT_SECRET, COOKIE_SECRET } = process.env

module.exports = { JWT_SECRET, COOKIE_SECRET }
