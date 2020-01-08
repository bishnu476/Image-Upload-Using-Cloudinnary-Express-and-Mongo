let mongoose = require('mongoose');
let imageSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    imageURL: {
        type: String
    },
    categories:{
        type: String,
        require: true,
    },
    album_name: {
        type: String
    }
});

let Image = module.exports = mongoose.model('Image',imageSchema);
