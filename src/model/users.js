var user = {
    name:String,
    password:String,
    role:String,
    usrId:String ,
    firstLogin:{
        type: Boolean,
        default: true
    },
    nickName:String,
    age:Number,
    height:String,
    image: String,
    favoriteLike: String,
    weight:String,
    profile: String,
    sigother: [{
        age:Number,
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

module.exports = {user};
