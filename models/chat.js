const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const Chat = new Schema({
	users: {
		type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
		required: true,
		unique: false,
		ref: 'User',
		// set: () => {}
	},
	createdAt: {
		type: Date,
		required: true,
		unique: false,
		default: Date.now
	},
	messages: [
		{
			_id: {
				type: Schema.Types.ObjectId,
				required: true,
				unique: true,
				default: new mongoose.Types.ObjectId()
			},
			author: {
				type: Schema.Types.ObjectId,
				required: true,
				unique: false,
				ref: 'User'
			},
			sentAt: {
				type: Date,
				required: true,
				unique: false,
				default: Date.now
			},
			text: {
				type: String,
				required: true,
				unique: false
			},
			readAt: {
				type: Date,
				required: false,
				unique: false
			}
		}
	]
})

Chat.statics.sendMessage = async function(data, name) {
	try {

		let chat = await this.findOne({users: [data.author, data.receiver]})
	if(!chat) {
		chat = await new this({
			users: [data.author, data.receiver]
		})
	}
	chat.messages.push({
		_id: new mongoose.Types.ObjectId(),
		author: data.author,
		text: data.text
	})
	await chat.save()
	return chat.messages.map((el) => {
		return {
			text: el.text,
			sentAt: new Intl.DateTimeFormat().format(el.sentAt),
			author: name
		}
	})
	} catch (e) {
		console.log(e)
	}
}

module.exports = model('Chat', Chat)
