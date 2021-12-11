const Room = require('../models/room');
const Message = require('../models/message');

exports.getMessages = (req,res) => {
    const roomname = req.query.roomname;
    const temp = roomname.split('!@!@2@!@!').reverse().join('!@!@2@!@!');
    Room.findOne({roomName: [temp, roomname]}, (err, roomFound) => {
        if(roomFound) {
            Message.find({roomId: roomFound._id})
            .populate('from')
            .exec((err, allMessage) => {
                res.status(200).send(allMessage)
            })
        }
    })
}