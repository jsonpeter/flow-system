/**
 * Created by Xie on 2017/6/5.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird')
const uuidv1 = require('uuid/v1');
const helpers = require('../tools/helpers')
const baiduAPI = require('../tools/baiduAPI')
const authCtr= require('../controllers/auth_controller');
const faceCtr= require('../controllers/face_controller');
const $check_token = require('../middlewares/check_token');
const moment = require('moment');
const today = moment().format('YYYY-MM-DD'); /*现在的时间*/
const yesterday=moment(today).add(-1, 'days').format('YYYY-MM-DD');
console.log(today,yesterday)
const storeId = 1;
const filePath = path.resolve('public/face/'+storeId);
const save_path = path.resolve('public/person/' + storeId);
setInterval(()=>{

},3000)
router.get('/auth/*',$check_token);
router.post('/auth/*',$check_token);

router.post('/login',(req, res) => {
    authCtr.admin_login({...req.body,type:1},function (data) {
        res.json(data)
    })
})


router.get('/test2',(req, page_res) => {
    let i=0;
    //逐个读取图片
    helpers.ImgFileSend(filePath, async (imgPath, base64Img) => {

        const res = await baiduAPI.faceCheck(base64Img);
        console.log('识别完成',res.error_msg !== 'SUCCESS')
        if (res.error_msg !== 'SUCCESS') {
            return
        }
        //人脸置信度&&人脸完整度
        const face_res = res.result.face_list[0];
        let faceId = face_res.face_token;
        console.log('人脸置信度',face_res.face_probability  +'*'+ face_res.quality.blur )
        if (face_res.face_probability < 0.8  || face_res.quality.blur > 0.7) {
            return;
        }
        const seach_res = await baiduAPI.faceSeach(base64Img, storeId);
        //存在
        if (seach_res.error_msg === 'SUCCESS'&&seach_res.result.user_list[0].score>95) {
            console.log('搜索完成相似得分', seach_res.result.user_list[0].score)
            //更新时间
            faceId = seach_res.result.user_list[0].user_id;
            addUserLog(faceId, storeId, base64Img)
        } else {
            const data_obj = {
                faceId: faceId,
                beauty: face_res.beauty,
                age: face_res.age,
                storeId: storeId,
                gender: face_res.gender.type,
                glasses: face_res.glasses.type,
                face_shape: face_res.face_shape.type
            };
            const add_res = await baiduAPI.faceAdd(base64Img, storeId, faceId)
            console.log('添加完成baidu', add_res);
            //入库
            faceCtr.user_AddInfo(data_obj, () => {
                console.log('本地入库成功');
                addUserLog(faceId, storeId, base64Img)
            });
        }
        if(i===0){
            page_res.json({success: true, res: seach_res})
        }
        i++;
        // 删除图片
        fs.unlink(imgPath, function () {
            console.log('\x1b[91m 删除图片：' + imgPath + '\x1b[91m')
        });
    })

})
function addUserLog(faceId, storeId,base64Img){
    faceCtr.user_checkLog(faceId, storeId,(res)=>{
        console.log('user_checkLog',res);
        if(res&&res.data.length===0){
            faceCtr.user_AddLog(faceId, storeId, () => {
                console.log('日志记录成功')
                //保存文件夹
                const newImgName = faceId + '.jpg';
                helpers.fileDelSave(save_path, newImgName, base64Img)
            });
        }
    })

}
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
        faceCtr.user_SelectPerson(options).then((data) => {
            res.json({code:0,data:{totals:data_count.data[0].totals,list:data.data}})
        })
    })

})
router.get('/auth/select_num',(req, res) => {
    let options= {
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
    faceCtr.store_Histroy(req.query.storeId).then((data) => {
        res.json(data)
    })
})
router.get('/auth/userinfo',(req, res) => {
    let id=req.userInfo.data[0].id;
    faceCtr.select_Info(id).then((data) => {
        res.json(data)
    })

})
router.post('/auth/update_info',function (req, res) {
    faceCtr.update_Info(req.body).then(data => {
        res.json(data)
    })
});
router.post('/auth/update_pwd',function (req, res) {
    let id=req.userInfo.data[0].id;
    faceCtr.update_Pwd({id:id,...req.body}).then(data => {
        res.json(data)
    })
});

module.exports = router;
