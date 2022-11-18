const express = require('express')
const bcrypt = require('bcryptjs')
const http = require('http')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const socketIO = require('socket.io')

const User = require('./models/user')
const Chat = require('./models/chat')
const error404 = require('./middleware/err404')
const error401 = require('./routes/err401')
const api = require('./routes/api')
const index = require('./routes/index')

const HTTP_PORT = process.env.HTTP_PORT ?? 3000
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://mongo:27017/'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const verify = (email, password, done) => {
	User.findByEmail(email, (err, user) => {
		if (err) { return done(err) }
		if (!user) { return done(null, false) }
		const flag = bcrypt.compareSync(password, user.passwordHash)
		if( !flag ) {
			return done(null, false)
		}
		return done(null, user)
	})
}
const options = {
	usernameField: "email",
	passwordField: "password",
}
passport.use('local', new LocalStrategy(options, verify))
passport.serializeUser((user, cb) => {
	cb(null, user.id)
})
passport.deserializeUser( (id, cb) => {
	User.findById(id, (err, user) => {
		if (err) { return cb(err) }
		cb(null, user)
	})
})

app.use('/public', express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.use(session({ secret: 'SECRET'}))
app.use(passport.initialize())
app.use(passport.session())

// let count = 1

// printData = (req, res, next) => {
//     console.log("\n==============================")
//     console.log(`------------>  ${count++}`)

//     console.log(`req.body.email -------> ${req.body.email}`)
//     console.log(`req.body.password -------> ${req.body.password}`)

//     console.log(`\n req.session.passport -------> `)
//     console.log(req.session.passport)

//     console.log(`\n req.user -------> `)
//     console.log(req.user)

//     console.log("\n Session and Cookie")
//     console.log(`req.session.id -------> ${req.session.id}`)
//     console.log(`req.session.cookie -------> `)
//     console.log(req.session.cookie)

//     console.log("===========================================\n")

//     next()
// }

// app.use(printData)

app.use('/', index)
app.use('/api', api)
app.use('/err401', error401)
app.use(error404)

async function start (HTTP_PORT, MONGO_URL) {
	try {
		await mongoose.connect(MONGO_URL, {
		user: process.env.DB_USERNAME ?? 'root',
		pass: process.env.DB_PASSWORD ?? 'example',
		dbName: process.env.DB_NAME ?? 'advert_database'
	})
	server.listen(HTTP_PORT, () => {
		console.log(`Server runing PORT = ${HTTP_PORT} MONGO_URL= ${MONGO_URL}`)
	})
	} catch (e) {
		console.log(e)
	}
}

start(HTTP_PORT, MONGO_URL)
