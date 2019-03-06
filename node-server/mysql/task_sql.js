/**
 * Created by Xie on 2017/5/18.
 */
// const sdate = require('silly-datetime');
const moment = require('moment');
module.exports = {
    select_dayNewNum(){
        //各个门店的新人汇总
        let str='select  a.storeId,count(*) as new_number  from (SELECT *  FROM  users_log  where  date(dateTime)=date(now()) group by faceId) as a,' +
            ' (SELECT faceId,dateTime,`type` FROM users_info) as b where a.faceId=b.faceId  and b.type!="white"  and  date(a.dateTime)=date(b.dateTime)  group by a.storeId';
        console.log(str)
        return str;
    },
    select_dayAllNum(){
        //各个门店的总人数汇总
        let str='select storeId ,count(*) as "number" from (SELECT *  FROM  users_log  where  date(dateTime)=date(now()) group by faceId ,storeId) as s, (SELECT `type`,faceId  FROM  users_info) as b where  s.faceId=b.faceId and b.type!="white"  group by s.storeId  HAVING COUNT(*) > 0';
        console.log(str)
        return str;
    },
    install_logs(number,storeId,new_number){
        //写入日志表
        let str=' INSERT INTO store_histroy (number,storeId,new_number) values ('+number+','+storeId+','+new_number+') ';
        console.log(str)
        return str;
    }
};
