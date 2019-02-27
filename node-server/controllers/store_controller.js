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
    }
}
