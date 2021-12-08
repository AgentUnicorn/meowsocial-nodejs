var Post = require('../models/post.js');

exports.createPost = async (req, res) => {
    //lấy id của user gửi từ headers
    const author = req.headers.userid;
    if(!req.files || Object.keys(req.files).length === 0) {
        console.log(req.headers)
        var post = new Post({
            postAuthor: author, 
            postContent: req.body.postContent
        });

        return post.save(err => {
            res.status(201).json({
                status: "Success",
                data: post
            })
        })
    }

    let image = req.files.postImage;
    
    // tạo đường dẫn đến thư mục lưu hình ảnh
    let image_URL = 'public/images/' + image.name;

    // lưu hình ảnh vào thư mục trong db 
    image.mv(image_URL, function(err) {
        if(err)
            return res.status(500).json({
                status: "Fail",
                error: err
            });
        
        var post = new Post({
            postAuthor: author,
            postContent: req.body.postContent,
            postImages: image.name
        });
        post.save(err => {
            res.status(201).json({
                status: "Success",
                data: post
            })
        })
    })
}