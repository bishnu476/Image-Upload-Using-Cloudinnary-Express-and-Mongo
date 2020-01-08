const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req,file,cb)=>{
        if(!file.mimetype.match('text.*|image.*|application.*')
        ){
            cb(new Error("File format is not supported",false))
            return
        }
        cb(null, true);

/*        if(!file.mimeType.match(/jpe|jpeg|png|gif$i/)){
            cb(new Error("File format is not supported",false))
            return
        }
        cb(null, true);*/
    }
});