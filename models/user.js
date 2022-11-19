const {Schema, model} = require('mongoose')

const UserModule = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	passwordHash: {
		type: String,
		required: true,
		unique: false
	},
	name: {
		type: String,
		required: true,
		unique: false
	},
	contactPhone: {
		type: String,
		required: false,
		unique: false
	}
})

UserModule.statics.findByEmail = async function(email, cb) {
	return await this.findOne({ email: email }).exec(cb)
}

UserModule.statics.getResponse = function(user) {
	return {
		data: {
		id: user.id,
		email: user.email,
		name: user.name,
		contactPhone: user.contactPhone
		},
		status: "ok"
	}
}

module.exports = model('User', UserModule)
