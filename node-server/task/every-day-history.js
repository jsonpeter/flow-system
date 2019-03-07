const schedule = require('node-schedule');
const storeCtr= require('../controllers/store_controller');

schedule.scheduleJob('0 59 23 ＊ ＊ ＊', function(){
    storeCtr.addHistory().then(() => {
        console.log('每日任务执行完毕' + new Date());
    })
});
