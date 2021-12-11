var db = require('mongoose');

db.connect(process.env.DB);

var messageSchema = db.Schema({
    from: {
        type: db.Schema.Types.ObjectId,
        ref: "user"
    },
    roomId: {
        type: db.Schema.Types.ObjectId
    },
    message: String,
    createAt: {
        type: Date,
        default: new Date()
    }
})

var Message = db.model('message', messageSchema);

module.exports = Message;