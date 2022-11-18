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

module.exports = model('User', UserModule)
