var mongoose = require('mongoose');


// var url = "mongodb://director:1a2b3c@localhost:55555/treasure";
var url = "mongodb://localhost:27017/treasure";
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Successful connection to "+url)
});
var Schema = mongoose.Schema

var user = {
    name:String,
    password:String,
    role:String,
    usrId:String ,
    firstLogin:{
        type: Boolean,
        default: true
    },
    watch:[String],
    nickName:String,
    age:String,
    height:String,
    image: String,
    favoriteLike: String,
    weight:String,
    profile: String,
    sigother: [{
        age:String,
        location:String,
        maritalStatus: String,
        weight:String,
        height:String,
        annualIncome:String,
        education:String,
        isDinks:Boolean,
        isSmoke: Boolean,
        isDrinkWine: Boolean,
    }],
    maritalStatus: String,
    isDinks: {
        type: Boolean,
        default: false
    },
    isSmoke: Boolean,
    isDrinkWine: Boolean,
    hobby: String,
    annualIncome:String,
    education:String,
    createBy: {
     type: String,
     default: ""
    },
    vip:{
        type: Number,
        default: 0
    },
    gender:{
        type: String,
        default: 'male'
    },
    location:String
}
var post = 
   {
    name:String,
    createAt:String,
    usrId: String,
    content: String,
    photos:  [String]
}
var User  = mongoose.model('User', Schema(user));
var Post  =mongoose.model('Post', Schema(post));
module.exports = {mongoose, Post, User};
