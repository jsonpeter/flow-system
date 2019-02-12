/**
 * Created by Xie on 2017/6/5.
 */
const Promise = require('bluebird')
const Tasksql = require('../mysql/task_sql');
const DBhelper = require('../mysql/db_helper');

module.exports= {
    select_new:function (callback) {
        DBhelper.execute_sql(Tasksql.select_dayAllNum(),(data)=>{
            if(callback){
                callback(data)
            }
        })
    },
    select_all:function (callback) {
        DBhelper.execute_sql(Tasksql.select_dayNewNum(),(data)=>{
            if(callback){
                callback(data)
            }
        })
    },
    install_log:function (number,storeId,new_number,callback) {
        DBhelper.execute_sql(Tasksql.install_logs(number,storeId,new_number),(data)=>{
            if(callback){
                callback(data)
            }
        })
    }
}
