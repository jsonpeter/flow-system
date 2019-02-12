/**
 * Created by Xie on 2017/6/5.
 */
const DBsql = require('../mysql/db_sql');
const DBhelper = require('../mysql/db_helper');
const jwt = require('jsonwebtoken');

module.exports= {
    //admin登陆&创建token
    admin_login: function (req_data, callback) {
        console.error(req_data)
        let {username, password,type} = req_data;
        DBhelper.execute_sql(DBsql.user.admin_login(username, password,type), function (res) {
            let token = '',out_json={success:false,error:'no user'};
            console.error(res.code,res.data)
            if (res.code===0&&res.data.length>0) {
                let data=res.data;
                delete data.password;

                // 创建token
                token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1小时过期
                    data: data
                }, 'secret');
                out_json={success:true,data:{...data,token}};
            }
            callback(out_json)
        })
    },
    add:function (obj, callback) {
        DBhelper.execute_sql(DBsql.admin.add(obj),callback)
    },
    list:function (callback) {
        DBhelper.execute_sql(DBsql.admin.list(),callback)
    },
    update:function (obj,callback) {
        DBhelper.execute_sql(DBsql.admin.update(obj),callback)
    },
    update_pwd:function (id,callback) {
        DBhelper.execute_sql(DBsql.admin.update_pwd(id),callback)
    },
    check_name:function (username, callback) {
        DBhelper.execute_sql(DBsql.admin.check_name(username),callback)
    }
}

