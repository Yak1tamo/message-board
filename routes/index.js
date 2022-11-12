const express = require('express')
const rout = express.Router()

rout.get('/', (req, res) => {
	const title = 'Главная страница'
	res.render('index', {
		title: title,
		user: req.user
	})
})

module.exports = rout
