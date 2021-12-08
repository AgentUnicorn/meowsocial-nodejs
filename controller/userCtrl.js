const User = require('../models/user');
const Post = require('../models/post');

//Create User func
exports.createUser = async (req, res) => {
    try {
        const {username, useremail, userpassword} = req.body;
        if(!username || !useremail || !userpassword) {
            return res.status(400).json({
                status: "Fail",
                error: "Username, Email, Password are required!"
            })
        }

        const newUser = await new User({
            username,
            useremail,
            userpassword,
        })

        newUser.save(err => {
            res.status(201).json({
                status: "User created!",
                data: newUser
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
}

//Get User profile by Id
exports.getUserProfile = async (req, res) => {
    const userId = req.params.id;
    //Find user has this id
    User.findOne({_id: userId}, (error, userFounded) => {
        //Find this user's posts
        Post.find({postAuthor: userId})
            .populate('postAuthor')
            .populate({
                path: 'comments',
                populate: {
                    path: 'cmtAuthor'
                }
            })
            .exec((err, userPosts) => {
                if(err) return res.status(500).json({
                    status: "Fail",
                    error: err
                })
                res.status(201).json({
                    status: "Success",
                    data: {
                        userProfile: userFounded,
                        userPosts: userPosts
                    }
                })
            })
    })
}

//Update User profile
exports.updateUserProfile= async (req, res) => {
    const userId = req.params.id;
    const {usernameUpdate} = req.body;
    User.findOne({_id: userId}, (err, userProfile) => {
        if(!req.files || Object.keys(req.files).length === 0) {
            userProfile.username = usernameUpdate;
            return userProfile.save(err => {
                res.status(201).json({
                    status: "Success",
                    data: userProfile
                })
            })
        }

        let image = req.files.useravatarUpdate;
        
        // tạo đường dẫn đến thư mục lưu hình ảnh
        let image_URL = 'public/images/' + image.name;

        // lưu hình ảnh vào thư mục trong db 
        image.mv(image_URL, function(err) {
            if(err)
                return res.status(500).send(err);
            
            userProfile.username = usernameUpdate;
            userProfile.avatar = image.name;

            return userProfile.save(err => {
                res.status(201).json({
                    status: "Success",
                    data: userProfile
                })
            })
        })

    })
}

