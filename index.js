const express = require('express');
const app = express();
const path = require('path');
const hbs = require( 'express-handlebars');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const upload = require("./handlers/multer");
const cloudinary = require('cloudinary').v2;
const router = express.Router();

cloudinary.config({
    cloud_name: 'lama10',
    api_key: '452482112762477',
    api_secret: 'GsR_-dhebRKtTsVBwDZ3s8HQ2Y0'
});

require("dotenv").config();
const port = 4000;

mongoose.connect('mongodb://localhost/userdb');
let db = mongoose.connection;

db.on('err',function (){
    console.log(err);
});

db.once('open',function (){
    console.log("Connected to mongodb")
});

let Image = require('./models/Image');

app.set('views', path.join(__dirname, 'views'));
/*
hbs.registerPartials(__dirname + '/views/partials');
*/


app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));



app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'static')));


/*
app.set('view engine', 'handlebars');
*/

app.get('/',(req,res)=>{
    res.render('imageupload')
});
app.get('/images',async (req,res) =>{
    const images = await Image.find();
    res.render("images", {layout: 'main', template: 'home-template', images});
});

app.get('/images/:id',async (req,res) =>{
    const images = await Image.findOne({
        _id: req.params.id
    });
    res.render("images", {layout: 'main', template: 'home-template', images});

});

app.post('/upload',upload.single("image"),async (req,res)=>{
    const result = await cloudinary.uploader.upload(req.file.path);
    const image = new Image();
    image.title =  req.body.title;
    image.categories = req.body.categories;
    image.album_name = req.body.album_name;
    image.imageURL = result.secure_url;
    await image.save();
    res.send({
        message: "Image uploaded successfully " +
            ""})
});

app.delete('/images/:id',function (req,res) {
    Image.findOneAndRemove({
        _id : req.params.id
    }, function (err,dbs){
        if(err){
            res.send('error deleting');
        }
        else{
            console.log(dbs);
            return res.send({
                ok: true
            })

        }
    });

});
app.listen(port,()=>{
    console.log("listening on port", port)
});