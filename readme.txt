db.dropUser(username, writeConcern) //�ӵ�ǰ���ݿ�ɾ���û�

db.dropAllUsers(writeConcern) //�ӵ�ǰ���ݿ�ɾ�������û�


https://www.cnblogs.com/operationhome/p/9844268.html


 1. ��ӹ����û���

use admin
 
db.createUser( {user: "admin",pwd: "123456",roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]})

2.����auth��������֤ͨ������ܷ������ݿ�
db.auth("admin","123456")

3.���ݿⴴ���û�
use mart
db.createUser({"user":"hcs","pwd":"123456","roles":[{"role":"readWrite","db":"mart"}]}��