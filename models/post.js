var db = require('mongoose');

db.connect(process.env.DB);

var postSchema = db.Schema({
    //author là 1 objectId tham chiếu qua 
    //collection user (ref buộc phải viết thường)
    postAuthor: {
        type: db.Schema.Types.ObjectId, 
        ref : 'user'
    },
    postContent: String,
    postImages: String,
    likes: [{
        type: db.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: db.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    createAt: {
        type: Date,
        default: new Date()
    }
}, {
    versionKey: false
})

var Post = db.model('post', postSchema);

module.exports = Post;