var db = require('mongoose');
var bcrypt = require('bcrypt');

db.connect(process.env.DB);

var userSchema = db.Schema({
    username: {
        type: String,
        require: true
    },
    useremail: {
        type: String,
        require: true,
        unique: true
    },
    userpassword: {
        type: String,
        require: true
    },
    posts: [{
        type: db.Schema.Types.ObjectId,
        ref: 'post'
    }],
    avatar: String,
    followers: [{
        type: db.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following: [{
        type: db.Schema.Types.ObjectId,
        ref: 'user'
    }],
}, {
    versionKey: false
})


userSchema.pre('save', function(next) {
    var User = this;
    console.log(User);
    if(!User.isModified('userpassword')) return next();

    bcrypt.hash(User.userpassword, 10, function (err, encryptpw) {
        if(err) return next(err);

        User.userpassword = encryptpw;
        next();
    })

})

var User = db.model('user', userSchema);

module.exports = User;