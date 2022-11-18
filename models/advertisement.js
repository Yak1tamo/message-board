const {Schema, model} = require('mongoose')

const Advertisement = new Schema({
	shortText: {
		type: String,
		required: true,
		unique: false
	},
	description: {
		type: String,
		required: false,
		unique: false
	},
	images: {
		type: [String],
		required: false,
		unique: false
	},
	userId: {
		type: String,
		required: true,
		unique: false,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		required: true,
		unique: false,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		required: true,
		unique: false,
		default: Date.now()
	},
	tags: {
		type: [String],
		required: false,
		unique: false
	},
	isDeleted: {
		type: Boolean,
		required: true,
		unique: false
	}
})

Advertisement.statics.findAdvert = async function(params) {
	return this.find({ ...params, isDeleted: false })
}

Advertisement.statics.createAdvert = async function(data) {
	return await new this({ ...data, isDeleted: false })
}

Advertisement.statics.removeAdvert = async function(id) {
	return await this.findByIdAndUpdate(id, { isDeleted: true })
}

module.exports = model('Advertisement', Advertisement)
