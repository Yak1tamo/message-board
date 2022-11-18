const {Schema, model} = require('mongoose')

const Chat = new Schema({
	users: {
		type: [Schema.Types.ObjectId],
		required: true,
		unique: false,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		required: true,
		unique: false
	},
	messages: [
		{
			author: {
				type: Schema.Types.ObjectId,
				required: true,
				unique: false,
				ref: 'User'
			},
			sentAt: {
				type: Date,
				required: true,
				unique: false
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

Chat.statics.findChat = async function(users) {
	return this.find(users)
}

Chat.statics.sendMessage = async function(data) {
	let ch = Chat.findOne({users: [data.author, data.receiver]})
	ch = ch ? ch : await new Chat({
		users: [data.author, data.receiver]
	})
	ch.messages.push({
		_id: new ObjectID(),
		author: data.author,
		text: data.text
	})
	return ch.save()
}

Chat.statics.subscribe = async function(cb) {
	const chat = this.findById(id)
}

Chat.statics.getHistory = async function(id) {
	const chat = await this.findById(id)
	return chat.messages
}

module.exports = model('Chat', Chat)
