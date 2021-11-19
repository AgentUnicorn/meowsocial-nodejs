var db = require('mongoose');

db.connect(process.env.DB);

var commentSchema = db.Schema({
    cmtAuthor: {
        type: db.Schema.Types.ObjectId, 
        ref : 'user'
    },
    cmtText: String,
    createAt: {
        type: Date,
        default: new Date()
    }
}, {
    versionKey: false
})

var Comment = db.model('comment', commentSchema);

module.exports = Comment;