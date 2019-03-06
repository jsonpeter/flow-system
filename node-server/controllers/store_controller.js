/**
 * Created by Xie on 2017/6/5.
 */
const Promise = require('bluebird')
const DBsql = require('../mysql/db_sql');
const DBhelper = require('../mysql/db_helper');

module.exports= {
    store_SelectList:function (id) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.store_list(id),(data)=>{
                r(data)
            })
        })
    },
    store_Add:function (obj) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.store_add(obj),(data)=>{
                console.log('~~',data)
                r(data)
            })
        })
    },
    store_Del:function (id) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.store_del(id),(data)=>{
                r(data)
            })
        })
    },
    device_Del:function (id) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.device_del(id),(data)=>{
                 r(data)
            })
        })
    },
    Device_Add:function (obj) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.device_add(obj),(data)=>{
                r(data)
            })
        })
    },
    Device_List:function (storeId) {
        return new Promise((r)=>{
            DBhelper.execute_sql(DBsql.store.device_list(storeId),(data)=>{
                r(data)
            })
        })
    }
}
