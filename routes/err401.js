const express = require('express')
const rout = express.Router()

rout.get('/', (req, res) => {
	res.status(401)
	res.json('401 | неверный логин или пароль.')
})

module.exports = rout
