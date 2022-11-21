const express = require('express')
const rout = express.Router()

rout.get('/', (req, res) => {
	const title = 'Главная страница'
	const id  = req.user?.id ?? ''
	const name  = req.user?.name ?? ''
	res.render('index', {
		title: title,
		user: id,
		userName: name
	})
})

module.exports = rout
