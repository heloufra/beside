var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/assets/files/homework_attachement');
     },
    filename: function (req, file, cb) {
    	console.log("file multer ",file);
        cb(null ,Date.now() + '-'+ file.originalname);
    }
});

var upload = multer({ storage: storage });

module.exports = upload;