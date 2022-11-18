const passport = require('passport')
const bcrypt = require('bcryptjs')
const express = require('express')
const rout = express.Router()

const User = require('../models/user')
const Advertisement = require('../models/advertisement')
const fileMulter = require('../middleware/file')

// Зарегистрироваться
rout.post('/singup', async (req, res, next) => {
	const email = await User.findByEmail(req.body.email)
	if(email){
		return res.status(401).json({
			error: "email занят",
			status: "error"
		})
	}
	const passwordHash = await bcrypt.hash(req.body.password, 10)
	const newUser = {
		email: req.body.email,
		passwordHash: passwordHash,
		name: req.body.name,
		contactPhone: req.body.contactPhone ?? ''
	}
	try {
		const updatedUser = await User.create(newUser)
		req.login(updatedUser, function(err) {
			if (err) { return next() }
			return res.json({
				data: {
				id: updatedUser.id,
				email: updatedUser.email,
				name: updatedUser.name,
				contactPhone: updatedUser.contactPhone
			},
			status: "ok"
		})
		})
	} catch (e) {
		console.log(e)
		next()
	}
})

// Залогиниться
rout.post('/singin',
	passport.authenticate('local', { failureRedirect: '/err401' }),
	(req, res) => {
		res.json({
			data: {
			id: req.user.id,
			email: req.user.email,
			name: req.user.name,
			contactPhone: req.user.contactPhone
		},
		status: "ok"})
})

// Разлогиниться
rout.get('/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { return next(err) }
		res.redirect('/')
	})
})

// Получить данные объявления
rout.get('/advertisements/:id', async (req, res, next) => {
	const { id } = req.params
	try {
		const adv = await Advertisement.findById(id)
		res.json(adv)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Получить список объявлений
rout.get('/advertisements', async (req, res, next) => {
	try {
		const adv = await Advertisement.findAdvert()
		res.json(adv)
	} catch (e) {
		console.log(e)
		next()
	}
})

// Создать объявление
rout.post('/advertisements',
	fileMulter.array('images', 5),
	async (req, res, next) => {
		if (!req.isAuthenticated()) {
			return res.status(401).json('Авторизируйтесь')
		}
		const images = req.files ?? []
		const imagesPath = images.map((obj) => obj.path)
		try {
			const adv = await Advertisement.createAdvert({ ...req.body, userId: req.user.id, images: imagesPath})
			res.json(adv.save())
		} catch (e) {
			console.log(e)
			next()
		}
})

// Удалить объявление
rout.delete('/advertisements/:id', async (req, res, next) => {
	const { id } = req.params
	if (!req.isAuthenticated()) {
		return res.status(401).json('Авторизируйтесь')
	}
	const adv1 = await Advertisement.findById(id)
	if (req.user.id !== adv1.userId) {
		console.log(req.user, adv1)
		return res.status(403).json('В доступе отказано')
	}
	try {
		const adv = await Advertisement.removeAdvert(id)
		res.json(adv)
	} catch (e) {
		console.log(e)
		next()
	}
})

module.exports = rout
