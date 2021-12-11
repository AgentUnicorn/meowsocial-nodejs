var db = require('mongoose');

db.connect(process.env.DB);

var roomSchema = db.Schema({
    roomName: {
        type: String,
        unique: true
    }

})

var Room = db.model('room', roomSchema);

module.exports = Room;