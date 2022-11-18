const express = require('express')
const rout = express.Router()

rout.get('/', (req, res) => {
	res.status(401)
	res.json({
		error: "Неверный логин или пароль",
		status: "error"
	})
})

module.exports = rout
