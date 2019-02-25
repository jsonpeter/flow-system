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
                sql = ' and date(now())>=date(start_time) and date(now())<=date(end_time) and status=1 '
            }
            return 'SELECT  *  FROM admin_user where username="' + username + '" and password=MD5("' + password + '") and type=' + type + sql;

        },
        admin_login_log:function (id) {
            return 'UPDATE admin_user set `lastTime`=now() where id='+id;
        }
    },
    admin: {
        add: function (obj) {
            const {username, company, name, tel, address, status, start_time, end_time, desc, auth_list} = obj;
            return 'INSERT into admin_user (`username`,`password`,`company`, `name`,`tel`,`address`,`status`, `start_time`,`end_time`,`desc`,`auth_list`) ' +
                'VALUES ("' + username + '",MD5("123456") ,"' + company + '","' + name + '","' + tel + '","' + address + '",' + status + ',"' + start_time + '","' + end_time + '","' + desc + '","' + auth_list + '")';
        },
        list: function () {
            return 'SELECT  *  FROM admin_user where type=1 order by id desc';
        },
        select_info(id){
            return 'SELECT `id`,`username`,`company`, `name`,`tel`,`address`,`start_time`,`end_time`,`lastTime` FROM admin_user where id='+id;
        },
        update_pwd:function(obj){
            const {id,password} = obj;
            let str='UPDATE admin_user set `password`=MD5("'+password+'") where id='+id;
            // console.log(str)
            return str
        },
        update:function(obj){
            const {id,username,company, name, tel, address, status, start_time, end_time, desc} = obj;
            return 'UPDATE admin_user set `username`="'+username+'",`company`="'+company+'", `name`="'+name+'",`tel`="'+tel+'",`address`="'+address+'",`status`="'+status+'", `start_time`="'+start_time+'",`end_time`="'+end_time+'",`desc`="'+desc+'" where id='+id;
        },
        update_info:function(obj){
            const {id, name, tel, address} = obj;
            return 'UPDATE admin_user set `name`="'+name+'",`tel`="'+tel+'",`address`="'+address+'"  where id='+id;
        },
        check_name: function (username) {
            return 'SELECT  count(id) as num  FROM admin_user where username="' + username + '" and type=1 order by id desc';
        }
    },
    face: {
        select_person(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date(' + _options.startTime + ') and date(' + _options.endTime + ') and';
            }
            let s_sql = 'a.age,a.gender';
            let limit = '';
            if (_options.select === 'count') {
                s_sql = 'count(*) as totals';
            }
            if (_options.limit) {
                s_sql = 'a.id,a.age,a.beauty,a.type,a.gender,a.glasses,a.shape,a.dateTime as firstTime,a.faceId,b.storeId,b.dateTime as lastTime'
                limit = 'limit ' + ((_options.page - 1) * _options.size) + ',' + _options.size;
            }
            //全部人员或今日进入 详情
            let str = 'SELECT ' + s_sql + ' FROM ' +
                '(SELECT *  FROM  users_log  where ' + w_sql + ' storeId=' + Number(_options.storeId) + ' and id in(select max(id) from users_log group by faceId)) as b,' +
                '(SELECT * FROM users_info) as a ' +
                'where a.faceId=b.faceId order by b.id desc ' + limit;
             // console.log('~~~',str)
            return str;
        },
        select_time_gender(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date(' + _options.startTime + ') and date(' + _options.endTime + ') and';
            }
            //全部人员或今日进入 详情
            let str = 'SELECT count(t.gender="male" or null) as male,count(t.gender="female" or null) as female FROM  (SELECT a.* FROM ' +
                ' (SELECT *  FROM  users_log  where ' + w_sql + ' storeId=' + Number(_options.storeId) + ') as b, ' +
                ' (SELECT * FROM users_info) as a where a.faceId=b.faceId) as t';
            // console.log(str)
            return str;
        },
        select_time_age(_options) {
            let w_sql = '';
            if (_options.type === 'time') {
                w_sql = 'date(dateTime) between date(' + _options.startTime + ') and date(' + _options.endTime + ') and';
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
            // console.log(str)
            return str;
        },
        select_new_all(storeId) {
            //今日新增人员,所有人员
            let str='SELECT * from (SELECT count(*) as new_person FROM ' +
                ' (SELECT *  FROM  users_log  where  storeId=' + Number(storeId) + ' and id in ' +
                ' (select max(id) from users_log group by faceId)) as b, ' +
                ' (SELECT * FROM users_info) as a ' +
                ' where a.faceId=b.faceId and  date(a.dateTime)=date(b.dateTime) and date(a.dateTime)=date(now())) as NewPerson,' +
                ' (SELECT count(*) as all_person FROM (SELECT * FROM users_log where date(dateTime)=date(now()) and storeId=' + storeId + ' group by faceId) as b,' +
                ' (SELECT * FROM users_info ) as a where b.faceId=a.faceId) as AllPerson';
            // console.log(str)
            return str
        },
        select_store_histroy(storeId) {
            let str='select * from store_histroy  where storeId=' + Number(storeId) + ' order by dateTime desc'
            // console.log(str)
            return str;
        },
        addUser_info: function (obj) {

            const {faceId, beauty, age, gender, glasses, face_shape, storeId} = obj;
            let str= 'INSERT into users_info (faceId,beauty,age,gender,glasses,shape,storeId)' +
                ' VALUES ("' + faceId + '",' + beauty + ',' + age + ',"' + gender + '","' + glasses + '","' + face_shape + '",' + storeId + ')';
            // console.log(str)
            return str;

        },
        update_user_type:function(obj){
           let {id,storeId,type}=obj;
           let str='update users_info set `type`="'+type+'" where id = ' +
               '(Select id  from (Select id,faceId,type from users_info where id='+id+') as a, ' +
               '( SELECT faceId FROM users_log where storeId='+storeId+') as b where a.faceId=b.faceId limit 0,1)';
           return str;
        },
        select_minuteLog: function (faceId, storeId) {
            let str='SELECT * FROM users_log where faceId="' + faceId + '" and storeId=' + storeId + ' and date(dateTime)=date(now()) and hour(dateTime)=hour(now()) and minute(dateTime)=minute(now()) order by id desc LIMIT 1';
            // console.log(str)
            return str;
        },
        addUser_log: function (faceId, storeId) {
            // const _now = moment().format('YYYY-MM-DD HH:mm:ss') /*现在的时间*/
            let str= 'INSERT into users_log (faceId,storeId) VALUES ("' + faceId + '",' + storeId + ')';
            // console.log(str)
            return str;
        }
    }
};
