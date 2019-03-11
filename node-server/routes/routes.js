/**
 * Created by Xie on 2017/6/5.
 */
const express = require('express');
const router = express.Router();


const moment = require('moment');
const randomstring = require('randomstring');
const crypto = require('crypto-js');
const helpers= require('../tools/helpers');

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
            res.json({code:0,data:{num:data_num.data[0],gender:data.data[0]}})
        })
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
    faceCtr.select_Device(null,userId).then((data) => {
        let ary=data.data;
        for (let i=0;i<ary.length;i++){
            console.log(data)
        }
        res.json(data)
    })
    // console.log(hostName,IPv4)
    // const hlsPath='http://szpaasalihlsgw.lechange.cn:9001/LCO/4F07C7BPAGBAA7E/0/1/20190309161102/dev_20190309161102_47ffk2lp7pi6b44l.m3u8';
    // const outPath='rtmp://'+IPv4+'/live/'+req.userInfo.data.username;
    //  new ffmpeg({ source: hlsPath, timeout: 0 })
    //     .addOption('-vcodec', 'libx264')
    //     .addOption('-acodec', 'aac')
    //     .addOption('-crf', 26)
    //     .addOption('-aspect', '640:360')
    //     .addOption('-f', 'flv')
    //     .withSize('640x360')
    //     .on('start', function(commandLine) {
    //         console.log('Query : ' + commandLine);
    //     })
    //     .on('error', function(err) {
    //         console.log('Error: ' + err.message);
    //     })
    //     .output(outPath, function(stdout, stderr) {
    //         console.log('Convert complete' +stdout)
    //     })
    //     .run()

});

module.exports = router;
