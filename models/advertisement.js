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
	const adv = await new this({ ...data, isDeleted: false })
	return await adv.save()
}

Advertisement.statics.removeAdvert = async function(id) {
	return await this.findByIdAndUpdate(id, { isDeleted: true })
}

Advertisement.statics.getResponse = function(adv, name) {
	return {
		id: adv.id,
		shortText: adv.shortText,
		description: adv.description,
		images: adv.images,
		user: {
			id: adv.userId,
			name: name
		},
		createdAt: adv.createdAt
	}
}

module.exports = model('Advertisement', Advertisement)
