/**
 * Created by Xie on 2017/6/5.
 */
const express = require('express');
const router = express.Router();


const moment = require('moment');
const randomstring = require('randomstring');

const ffmpeg = require('fluent-ffmpeg');

const authCtr= require('../controllers/auth_controller');
const faceCtr= require('../controllers/face_controller');
const $check_token = require('../middlewares/check_token');


router.get('/auth/*',$check_token);
router.post('/auth/*',$check_token);

router.post('/login',(req, res) => {
    authCtr.admin_login({...req.body,type:1},function (data) {
        res.json(data)
    })
})

router.get('/auth/select',(req, res) => {
    let options= {
        storeId:req.query.storeId,
        type:req.query.type,
        page:req.query.page,
        select:'count',
        limit:false,
        size:req.query.size
    }
    faceCtr.user_SelectPerson(options).then((data_count) => {
        options.select='all';
        options.limit=true;
        console.log('data_count',data_count)
        faceCtr.user_SelectPerson(options).then((data) => {
            res.json({code:0,data:{totals:data_count.data[0].totals,list:data.data}})
        })
    })

})
router.get('/auth/select_num',(req, res) => {
    let options= {
        userId:req.userInfo.data.id,
        storeId:req.query.storeId,
        startTime:req.query.startTime,
        endTime:req.query.endTime
    }
    faceCtr.user_SelectNumber(options.storeId).then((data_num) => {
        faceCtr.store_Histroy_gender(options).then((data) => {
            faceCtr.store_Histroy_persons(options.storeId,options.userId).then((data_all) => {
                res.json({code:0,data:{num:Object.assign(data_all.data[0],data_num.data[0]),gender:data.data[0]}})
            })
        })

    })
})
router.get('/auth/select_today',(req, res) => {
    let options= {
        storeId:req.query.storeId,
        userId:req.userInfo.data.id,
        type:'time',
        limit:true,
        size:20,
        page:1,
        startTime:req.query.endTime,
        endTime:req.query.endTime
    }
    faceCtr.user_SelectPerson(options).then((data) => {
        res.json(data)
    })
})
router.get('/auth/histroy_age',(req, res) => {
    let options= {
        storeId:req.query.storeId,
        startTime:req.query.startTime,
        endTime:req.query.endTime
    }
    faceCtr.store_Histroy_age(options).then((data) => {
        res.json(data)
    })
})

router.get('/auth/select_histroy',(req, res) => {
    let options= {
        storeId:req.query.storeId,
        type:'all',
        limit:false,
        startTime:req.query.startTime,
        endTime:req.query.endTime
    }
    faceCtr.user_SelectPerson(options).then((data) => {
        res.json(data)
    })
})

router.get('/auth/store_histroy',(req, res) => {
    let id=req.query.storeId;
    faceCtr.store_Histroy(id).then((data) => {
        res.json(data)
    })
})
router.get('/auth/store_list',(req, res) => {
    let id=req.userInfo.data.id;
    faceCtr.select_store(id).then((data) => {
        res.json(data)
    })

})
router.get('/auth/userinfo',(req, res) => {
    let id=req.userInfo.data.id;
    faceCtr.select_Info(id).then((data) => {
        res.json(data)
    })

})
router.get('/auth/device_list',(req, res) => {
    let storeId=req.query.storeId;
    let userId=req.userInfo.data.id;
    faceCtr.select_Device(storeId,userId).then((data) => {
        res.json(data)
    })
})
router.post('/auth/update_info',function (req, res) {
    let id=req.userInfo.data.id;
    faceCtr.update_Info({id:id,...req.body}).then(data => {
        res.json(data)
    })
});
router.post('/auth/update_user_type',function (req, res) {
    let id=req.userInfo.data.id;
    faceCtr.update_userType({userId:id,...req.body}).then(data => {
        res.json(data)
    })
});
router.post('/auth/update_pwd',function (req, res) {
    let id=req.userInfo.data.id;
    faceCtr.update_Pwd({id:id,...req.body}).then(data => {
        res.json(data)
    })
});
router.get('/auth/rtmp',function (req, res) {
    let userId=req.userInfo.data.id;
    let ratio=req.query.ratio||'640x360';
    faceCtr.select_Device(null,userId).then((data) => {
       // let ary=data.data;
        // for (let i=0;i<ary.length;i++){
        //     console.log(data);
        //     //遍历每个设备，并推流
        // }
        //模拟测试
        // const hlsPath='http://cctvcncw.v.wscdns.com/live/cctv3_1_914/playlist.m3u8';
        // const outPath='rtmp://localhost:1935/live/'+req.userInfo.data.username+'/'+randomstring.generate();
        // new ffmpeg({timeout: 2000 })
        //     .input(hlsPath)
        //     .input("./public/logo.png")
        //     .addOption('-vcodec', 'libx264')
        //     .addOption('-acodec', 'aac')
        //     .addOption('-crf', 26)
        //     .addOption('-f', 'flv')
        //     .withSize(ratio)
        //     .on('start', function(commandLine) {
        //         console.log('Query : ' + commandLine);
        //     })
        //     .on('error', function(err) {
        //         console.log('Error: ' + err.message);
        //     })
        //     .output(outPath, function(stdout, stderr) {
        //         console.error('Convert complete' +stdout,outPath);
        //     })
        //     .run();
        // let out=Object.assign(data,{rtmp:outPath,ratio:ratio})
        res.json(data)
    })
});

module.exports = router;
