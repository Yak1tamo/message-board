const mongoose = require('mongoose')
const { Schema, model } = mongoose

const Chat = new Schema({
	users: {
		type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
		required: true,
		unique: false,
		ref: 'User',
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

Chat.statics.sendMessage = async function(data) {
	try {
		let chat = await this.findOne({users: [data.author, data.receiver]}) ?? await this.findOne({users: [data.receiver, data.author]})
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
	await chat.populate('messages.author', 'name')
	return {
		id: chat.id,
		messages: chat.messages.map((el) => {
			return {
				text: el.text,
				sentAt: new Intl.DateTimeFormat().format(el.sentAt),
				author: el.author.name
			}
		})
	}
	} catch (e) {
		console.log(e)
	}
}

module.exports = model('Chat', Chat)
