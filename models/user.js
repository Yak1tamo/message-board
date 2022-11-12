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

UserModule.statics.findByEmail = async function(email) {
	console.log(this)
	return await this.findOne(email)
}

UserModule.statics.createUser = async function(data) {
	const user = await new UserModule(data)
	return user.save()
}

module.exports = model('User', UserModule)
