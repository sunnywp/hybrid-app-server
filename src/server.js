var express = require('express');
var bodyParser = require('body-parser');
var {mongoose, User, Post} = require("./mongoose");
var UUID = require('uuid');
var md5 = require('md5')
var https = require('https');
var app= express();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '1249695824@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'ceboztvplrypgcbj'
    }
});
const jwt= require('jsonwebtoken');
const expressJwt = require('express-jwt');

//定义签名
const secret = 'salt';

//使用中间件验证token合法性

app.use(expressJwt ({
  secret:  secret 
}).unless({
  path: ['/api/v1.0/iam/login']  //除了这些地址，其他的URL都需要验证
}));

//拦截器
app.use(function (err, req, res, next) {
  //当token验证失败时会抛出如下错误
  if (err.name === 'UnauthorizedError') {   
      res.status(401).send('invalid token...');
  }
});

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,userPhone');
    res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('X-Powered-By',' 3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next();
    }
  });

app.post('/api/v1.0/iam/code', function(req,res) {
  if(!req.body) return res.sendStatus(400);
  const email =  req.body.email;
  const code =  req.body.code;
 var mailOptions = {
    from: '1249695824@qq.com', // 发件地址
    to: email, // 收件列表
    subject: '验证码', // 标题
    //text和html两者只支持一种
    text: code, // 标题
    html: '' // html 内容
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
  res.status(200).send({});
})
  

app.post('/api/v1.0/iam/posts',function (req, res){
    if(!req.body) return res.sendStatus(400);
    req.body.createAt = Date.parse(new Date());
    var addPost = new Post(req.body);
    addPost.save().then((p) => {
        res.status(201).json(p)
    });
});


app.get('/api/v1.0/iam/hot-posts',function (req, res) {
     Post.find({}).sort({'_id':-1}).limit(5).exec((err, p)=> {
  if(err) {
    res.status(400).json({"error":"错误"});
} else {
   let rep = [];
   let list = p.map(_ => _.usrId);
   User.find({usrId:{$in:list}}).then((u, err)=>{
   p.forEach((item)=> {
     let uItem = JSON.parse(JSON.stringify(item));
     uItem.user = u.find((x)=>{
      return x.usrId === item.usrId;
});
   rep.push(uItem);
});
res.status(200).json(rep); 
});
}
});
});



app.get('/api/v1.0/iam/posts',function (req, res) {
    Post.find(req.query).sort({'_id':-1}).limit(5).exec((err, p)=> {
        res.status(200).json(p);
    });
});

app.put('/api/v1.0/iam/posts/:id',function (req, res){
    if(!req.body) return res.sendStatus(400);
    Post.updateOne({'_id': req.params['id']}, {$set: req.body}, function(err,result) {
      if (err) {
           res.status(400).json({"error":"更新用户动态失败"}) 
      } else {
           res.status(200).json({})   
      }
    })
});

app.delete('/api/v1.0/iam/posts/:id',function (req, res) {
    Post.findOneAndRemove({ '_id': req.params['id'] },  function (err, p) {
        if (err) return  res.sendStatus(400);
        res.status(204).json({});
    });
});

app.put('/api/v1.0/iam/users/:id/pwd',function (req, res) {
    const id = req.params['id']
    if(!req.body) return res.sendStatus(400);
    console.log("reset password  body="+ JSON.stringify (req.body))
    User.findOne({ 'usrId': req.params['id'] }).then((person)=> {
        console.log("orign user info=" + JSON.stringify(person));
        if (person.password !=req.body.orign_pwd) return  res.status(400).json({"error":"重置密码失败，旧密码不正确"});
        else  {
            User.updateOne({"usrId": person.usrId}, {"password": req.body.new_pwd}).then(() => {
                res.status(200).json({})
            },() => {
                res.status(400).json({"error":"重置密码失败，数据库异常"});
            })
        }
    }, () =>{
       res.status(400).json({"error":"用户不存在"});
    }).catch(()=> {
        res.status(500).json({"error":"内部错误"});
    })
});

 
app.post('/api/v1.0/iam/users',function (req, res){
    if(!req.body) return res.sendStatus(400);
    req.body.usrId = UUID.v1()
    User.findOne({ 'name':  req.body.name},  function (err, person) {
        if (!!person) {
            res.status(400).json({"error":"用户名已存在"})
        } else {
            var addUser = new User(req.body);
            addUser.save().then((person) => {
                res.status(201).json(person)
            });
        }
    });
});

app.get('/api/v1.0/iam/users',function (req, res) {
User.find(req.query,  function (err, person) {
        res.status(200).json(person)
    });
});


app.put('/api/v1.0/iam/users/:usrId',function (req, res){
  if(!req.body) return res.sendStatus(400);
  User.updateOne({'usrId': req.params['usrId']}, {$set: req.body}, function(err,rst) {
    if (err) {
         console.log("update user error:" + JSON.stringify(err))
         res.status(400).json({"error":"更新用户失败"}) 
    } else {
         res.status(200).json({});   
    }
  })
});

app.get('/api/v1.0/iam/users/:id',function (req, res) {
    id = req.params['id']
    User.findOne({ 'usrId': id },  function (err, person) {
        if (err) return  res.sendStatus(400);
        res.status(200).json(person)
    });
});



app.delete('/api/v1.0/iam/users/:id',function (req, res) {
    const id = req.params['id']
    User.findOneAndRemove({ 'usrId': id },  function (err, person) {
        if (err) return  res.sendStatus(400);
        res.send(204)
    });
});


app.post('/api/v1.0/iam/login',function (req, res){
    if(!req.body) return res.sendStatus(400);
    const usrname =  req.body.username;
    const pwd = req.body.password;
    User.findOne({ 'name': usrname }).then((person)=> {

        if (person.password !=pwd) return  res.status(400).json({"error":"用户名或密码不正确"});
        else  {
            if (!!person.firstLogin) {
                User.updateOne({"usrId": person.usrId}, {"firstLogin": false}).then(() => {});
            }
             const token = 'Bearer ' + jwt.sign({ usrId: person.usrId}, secret,{ expiresIn: 3600});        
            res.status(200).json({"access_token":token, "vip": person.vip, "firstLogin": !!person.firstLogin,"usrId": person.usrId})}
    }, () =>{
       res.status(400).json({"error":"用户名或密码不正确"});
    }).catch(()=> {
        res.status(400).json({"error":"用户名或密码不正确."});
    })
});

app.post('/api/v1.0/iam/sso/login',function (req, res){
    console.log("sso login")
    var request = {
        account: '10196470',
        token: 'a37b98432eb18bc0e5910c0d268c158e',
        clientIP: '10.68.6.22',
        systemCode:'wireless_virtual2_treasure_0001',
        verifyCode: ''
    }
    console.log("req.body:" + JSON.stringify (req.body))
    request.token = req.body.token;
    request.account = req.body.account;
    request.verifyCode = md5(request.account + request.token + request.clientIP + request.systemCode)
    var postData = JSON.stringify(request);
    console.log("sso login, body:" + postData)
    var request_option = {
        protocol:'https:',
        method:'POST',
        host: 'uac.zte.com.cn',
        port: 443,
        headers:{
            "Content-Type": 'application/json',
            "Content-Length": postData.length
        },
        path: '/uactoken/auth/token/verify.serv'
    }
   var req =  https.request(request_option, function(_res) {
        var content = '';
        _res.setEncoding('utf-8');
        _res.on('data', function(chunk) {
            content += chunk;
          
        });
        _res.on('end',function(){
            res.status(200).send(content.toString())
        });
    });

    req.write(postData);
    req.end();
})

app.listen(3000);

