const jwt = require('jsonwebtoken')
require('dotenv').config()
const { JWT_SECRET } = process.env

const authRequired = (req, res, next) => {
  const token = req.signedCookies.token
  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookie token length:', token?.length)
  }
  try {
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    res.status(401).send({
      loggedIn: false,
      message: 'You are def not authorized.',
    })
    return
  }
  next()
}

module.exports = { authRequired }
