/**
 * Created by Xie on 2017/6/5.
 */
const Promise = require('bluebird')
const DBsql = require('../mysql/db_sql');
const DBhelper = require('../mysql/db_helper');

module.exports= {
    user_SelectPerson:function (options) {
       return new Promise((r)=>{
           DBhelper.execute_sql(DBsql.face.select_person(options),(data)=>{
               r(data)
           })
       })
    },
    user_SelectNumber:function (storeId) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.face.select_new_all(storeId),(data)=>{
                r(data)
            })
        })
    },
    store_Histroy(storeId){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.face.select_store_histroy(storeId),(data)=>{
                r(data)
            })
        })
    },
    store_Histroy_age(options){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.face.select_time_age(options),(data)=>{
                r(data)
            })
        })
    },
    store_Histroy_gender(options){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.face.select_time_gender(options),(data)=>{
                r(data)
            })
        })
    },
    update_Info(options){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.admin.update_info(options),(data)=>{
                r(data)
            })
        })
    },
    update_Pwd(options){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.admin.update_pwd(options),(data)=>{
                r(data)
            })
        })
    },
    select_Info(id){
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.admin.select_info(id),(data)=>{
                r(data)
            })
        })
    },
    user_AddInfo:function (obj, callback) {
        DBhelper.execute_sql(DBsql.face.addUser_info(obj),(data)=>{
            if(callback){
                callback(data)
            }
        })
    },
    user_AddLog:function (faceId,storeId,callback) {
        DBhelper.execute_sql(DBsql.face.addUser_log(faceId,storeId),(data)=>{
            if(callback){
                callback(data)
            }
        })
    },
    user_checkLog:function (faceId,storeId,callback) {
        DBhelper.execute_sql(DBsql.face.select_minuteLog(faceId,storeId),(data)=>{
            if(callback){
                callback(data)
            }
        })
    }
}
