db.dropUser(username, writeConcern) //从当前数据库删除用户

db.dropAllUsers(writeConcern) //从当前数据库删除所有用户


https://www.cnblogs.com/operationhome/p/9844268.html


 1. 添加管理用户：

use admin
 
db.createUser( {user: "admin",pwd: "123456",roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]})

2.开启auth参数，认证通过后才能访问数据库
db.auth("admin","123456")

3.数据库创建用户
use mart
db.createUser({"user":"hcs","pwd":"123456","roles":[{"role":"readWrite","db":"mart"}]}）