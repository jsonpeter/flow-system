/**
 * Created by Xie on 2017/5/18.
 */
// const sdate = require('silly-datetime');
const moment = require('moment');
module.exports = {
    user: {
        admin_login: function (username, password, type) {
            let sql = '';
            if (type) {
                sql = ' and status=1 '
            }
            return 'SELECT  *  FROM admin_user where username="' + username + '" and password=MD5("' + password + '") and type=' + type + sql;
        },
        admin_login_log:function (id) {
            return 'UPDATE admin_user set `lastTime`=now() where id='+id;
        }
    },
    admin: {
        add: function (obj) {
            const {username, company, name, tel, address, status, desc, auth_list} = obj;
            return 'INSERT into admin_user (`username`,`password`,`company`, `name`,`tel`,`address`,`status`,`desc`,`auth_list`) ' +
                'VALUES ("' + username + '",MD5("123456") ,"' + company + '","' + name + '","' + tel + '","' + address + '",' + status + ',"' + desc + '","' + auth_list + '")';
        },
        list: function () {
            return 'SELECT  *  FROM admin_user where `type`=1 order by id desc';
        },
        select_info(id){
            return 'SELECT `id`,`username`,`company`, `name`,`tel`,`address`,`lastTime` FROM admin_user where id='+id;
        },
        select_store(id){
            return 'SELECT * FROM store_list where userId='+id+' order by id desc';
        },
        update_pwd:function(obj){
            const {id,password} = obj;
            let str='UPDATE admin_user set `password`=MD5("'+password+'") where id='+id;
            // console.log(str)
            return str
        },
        update:function(obj){
            const {id,username,company, name, tel, address, status, desc} = obj;
            return 'UPDATE admin_user set `username`="'+username+'",`company`="'+company+'", `name`="'+name+'",`tel`="'+tel+'",`address`="'+address+'",`status`="'+status+'",`desc`="'+desc+'" where id='+id;
        },
        update_info:function(obj){
            const {id, name, tel, address} = obj;
            return 'UPDATE admin_user set `name`="'+name+'",`tel`="'+tel+'",`address`="'+address+'"  where id='+id+' and `type`=1 and status=1';
        },
        check_name: function (username) {
            return 'SELECT  count(id) as num  FROM admin_user where username="' + username + '" and type=1 order by id desc';
        }
    },
    face: {
        select_person(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date("' + _options.startTime + '") and date("' + _options.endTime + '") and';
            }
            let s_sql = 'a.age,a.gender';
            let limit = '';
            if (_options.select === 'count') {
                s_sql = 'count(*) as totals';
            }
            if (_options.limit) {
                s_sql = 'a.id,a.age,a.beauty,b.deviceId,a.type,a.gender,a.glasses,a.shape,a.dateTime as firstTime,a.faceId,b.storeId,b.dateTime as lastTime'
                limit = 'limit ' + ((_options.page - 1) * _options.size) + ',' + _options.size;
            }
            //全部人员或今日进入 详情
            let str = 'SELECT ' + s_sql + ' FROM ' +
                '(SELECT *  FROM  users_log  where ' + w_sql + '  userId='+_options.userId+' and storeId=' + Number(_options.storeId) + ' and id in (select max(id) from users_log group by faceId)) as b,' +
                '(SELECT * FROM users_info) as a ' +
                'where a.faceId=b.faceId order by b.id desc ' + limit;
            // console.log('select_person--->',str)
            return str;
        },
        select_all_person(storeId,userId){
            let str= 'SELECT count(*) as `all` from (SELECT id FROM myDataBase.users_log where storeId=' + Number(storeId) + ' and userId='+userId+' group by faceId) AS b';
           // console.log('select_all_person:',str)
            return str;
        },
        select_time_gender(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date("' + _options.startTime + '") and date("' + _options.endTime + '") and';
            }
            //全部人员或今日进入 详情
            let str = 'SELECT count(t.gender="male" or null) as male,count(t.gender="female" or null) as female FROM  (SELECT a.* FROM ' +
                ' (SELECT *  FROM  users_log  where ' + w_sql + ' storeId=' + Number(_options.storeId) + ' and userId='+_options.userId+') as b, ' +
                ' (SELECT * FROM users_info) as a where a.faceId=b.faceId) as t';
            // console.log(str)
            return str;
        },
        select_time_age(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date("' + _options.startTime + '") and date("' + _options.endTime + '") and';
            }
            //全部人员或今日进入 详情
            let str = 'select age_temp as name,count(*) as value from (select age,case' +
                ' when age between 1 and 10 then "1-10"' +
                ' when age between 11 and 25 then "11-25"' +
                ' when age between 16 and 29 then "16-29"' +
                ' when age between 30 and 40 then "30-40"' +
                ' when age between 41 and 50 then "41-50"' +
                ' when age >50 then "50"' +
                ' end as age_temp from (select age from  users_info where faceid in ' +
                '(SELECT faceId FROM users_log where ' + w_sql + ' storeId=' + Number(_options.storeId) + ' group by faceId)) as a ' +
                ') t_user group by age_temp';
            // console.log('select_time_age',str)
            return str;
        },
        select_new_all(storeId) {
            //今日新增人员,所有人员
            let str='SELECT * from (SELECT count(*) as new_person FROM ' +
                ' (SELECT *  FROM  users_log  where  storeId=' + Number(storeId) + ' and id in ' +
                ' (select max(id) from users_log group by faceId)) as b, ' +
                ' (SELECT faceId,`dateTime`,`type` FROM users_info) as a ' +
                ' where a.faceId=b.faceId and a.type!="white" and  date(a.dateTime)=date(b.dateTime) and date(a.dateTime)=date(now())) as NewPerson,' +
                ' (SELECT count(*) as all_person FROM (SELECT * FROM users_log where date(dateTime)=date(now()) and storeId=' + storeId + ' group by faceId) as b,' +
                ' (SELECT faceId,`type` FROM users_info ) as a where b.faceId=a.faceId and a.type!="white" ) as AllPerson';
            // console.log('今日新增人员',str)
            return str
        },
        select_new_all_info(storeId){

        },
        select_store_histroy(storeId) {
            let str='select * from store_histroy  where storeId=' + Number(storeId)
            // console.log(str)
            return str;
        },
        addUser_info: function (obj) {
            const {userId,faceId, beauty, age, gender, glasses, face_shape,storeId} = obj;
            let str= 'INSERT into users_info (userId,faceId,beauty,age,gender,glasses,shape,storeId)' +
                ' VALUES ('+userId+',"' + faceId + '",' + beauty + ',' + age + ',"' + gender + '","' + glasses + '","' + face_shape + '",'+storeId+')';
            // console.log(str)
            return str;

        },
        update_user_type:function(obj){
           let {id,storeId,userId,type}=obj;
           let str='update users_info set `type`="'+type+'" where id = ' +id +' and storeId='+storeId+' and userId='+userId;
           return str;
        },
        select_minuteLog: function (faceId) {
            let str='SELECT * FROM users_log where faceId="' + faceId + '" and date(dateTime)=date(now()) and hour(dateTime)=hour(now()) and minute(dateTime)=minute(now()) order by id desc LIMIT 1';
            // console.log(str)
            return str;
        },
        addUser_log: function (faceId,userId,storeId,deviceId) {
            // const _now = moment().format('YYYY-MM-DD HH:mm:ss') /*现在的时间*/
            let str= 'INSERT into users_log (faceId,userId,storeId,deviceId) VALUES ("' + faceId + '",'+userId+',' + storeId + ','+deviceId+')';
            // console.log(str)
            return str;
        },
        select_type(faceId,userId,storeId){
            return 'SELECT `type` FROM users_info where userId='+userId+' and storeId='+storeId+' and faceId="'+faceId+'"';
        },
    },
    store:{
        store_list:function (id) {
            return 'SELECT  *  FROM store_list where userId=' + id + ' order by id desc';
        },
        store_del:function (id) {
            return 'DELETE FROM  store_list where id=' + id+';DELETE FROM  device_list where storeId=' + id;
        },
        store_add:function (obj) {
            const {userId, name, address,start_time,end_time} = obj;
            return 'INSERT INTO store_list (userId,name,address,start_time,end_time) VALUES ('+userId+',"'+name+'","'+address+'","'+start_time+'","'+end_time+'")' ;
        },
        device_del:function (id) {
            return 'DELETE FROM  device_list where id=' + id;
        },
        device_list:function (storeId,userId) {
            let sql='',sql_user='',sql_store='';
            if(userId){
                sql_user='userId='+userId;
            }
            if(storeId){
                sql_store='storeId='+storeId;
            }
            if(sql_store&&sql_user){
                sql=sql_store+' and '+sql_user;
            }else{
                sql=sql_store+sql_user;
            }
            let str= 'SELECT  *  FROM device_list where ' + sql +' order by id desc';
            //console.log(str);
            return str;
        },
        device_add:function (obj) {
            const {userId, name, storeId,type,hls} = obj;
            return 'INSERT INTO device_list (userId,name,`type`,storeId,hls) VALUES ('+userId+',"'+name+'","'+type+'",'+storeId+',"'+hls+'")' ;
        },
        device_edit:function (obj) {
            const {name,type,hls,id} = obj;
            return 'update device_list set `name`="'+name+'",`type`="'+type+'",hls="'+hls+'" where id='+id;
        },
        add_history:function () {
            return 'INSERT INTO  `myDataBase`.`store_histroy` (`number`,`userId`,`storeId`)  SELECT count(*) as number,c.storeId,c.userId FROM (SELECT * FROM  myDataBase.users_log where   DATE_FORMAT(dateTime,"%m-%d-%Y")=DATE_FORMAT(now(),"%m-%d-%Y")  order by id desc) as c group by c.userId'
        }
    }
};
