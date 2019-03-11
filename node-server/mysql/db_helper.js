/**
 * Created by Xie on 2017/5/18.
 */
const mysql= require('mysql');
const pjson = require('../package.json').mysql;
const mysql_cfg= {
       host:pjson.host,
        user: pjson.user,
        password: pjson.password,
        database:pjson.database,
        port: pjson.port
};
const pool = mysql.createPool(mysql_cfg);

module.exports = {
    execute_sql: function (sql, callback) {
        //链接数据库
        pool.getConnection((err, conn) => {
            let _data={code:0,data:null};
            if (err) {
                console.error(err)
                _data.code=-1;
                callback(_data);
            } else {
                //执行sql语句
                conn.query(sql, function (err, rows) {
                    if(err){
                        console.error(err)
                    }
                    let o=JSON.stringify(rows);
                    _data.data=JSON.parse(o);
                    //事件驱动回调
                    callback(_data);
                    //释放连接
                    conn.release();
                });
            }
        });
    }
}
