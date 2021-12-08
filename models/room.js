var db = require('mongoose');

db.connect(process.env.DB);

var roomSchema = db.Schema({
    roomId: String,
    messages: [{
        type: db.Schema.Types.ObjectId,
        ref: "message"
    }],
    participants: [{
        type: db.Schema.Types.ObjectId,
        ref: "user"
    }]
})

var Room = db.model('room', roomSchema);

module.exports = Room;