const path = require('path');
const fs = require('fs');
const colors = require('colors');
const helpers = require('../tools/helpers')
const baiduAPI = require('../tools/baiduAPI')
const faceCtr= require('../controllers/face_controller');
const filePath = path.resolve('public/face/');
let save_path = path.resolve('public/person/');
let isStart=false;
function getImgFiles(){
      setInterval(()=>{
        //逐个读取图片
        helpers.ImgFileSend(filePath, async (imgPath, base64Img) => {
            isStart=false;
            console.time("耗时".green);
            const res = await baiduAPI.faceCheck(base64Img);
            // console.log('识别完成',res.error_msg !== 'SUCCESS')
            if (res.error_msg !== 'SUCCESS') {
                console.timeEnd("耗时");
                return
            }
            let dir_name=imgPath.replace(filePath+'/','');
            let storeId=dir_name.substr(0,dir_name.indexOf('/'));
            let  save_path_id=save_path+'/'+storeId;

            // 调用创建用户组
            await baiduAPI.groupAdd(storeId);
            //人脸置信度&&人脸完整度
            const face_res = res.result.face_list[0];
            let faceId = face_res.face_token;
            // console.log('人脸置信度',face_res.face_probability  +'*'+ face_res.quality.blur )
            if (face_res.face_probability < 0.8  || face_res.quality.blur > 0.7) {
                console.timeEnd("耗时".green);
                return;
            }
            const seach_res = await baiduAPI.faceSeach(base64Img, storeId);
            //存在
            if (seach_res.error_msg === 'SUCCESS'&&seach_res.result.user_list[0].score>95) {
                // console.log('搜索完成相似得分', seach_res.result.user_list[0].score)
                //更新时间
                faceId = seach_res.result.user_list[0].user_id;
                addUserLog(save_path_id,faceId, storeId, base64Img)
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
                await baiduAPI.faceAdd(base64Img, storeId, faceId)
                // console.log('添加完成baidu', add_res);
                //入库
                faceCtr.user_AddInfo(data_obj, () => {
                    // console.log('本地入库成功');
                    addUserLog(save_path_id,faceId, storeId, base64Img);

                });
            }
            // 删除图片
            fs.unlink(imgPath, function () {
                // console.log('\x1b[91m 删除图片：' + imgPath + '\x1b[91m')
            });
        })
    },5000)
}
function addUserLog(save_path_id,faceId, storeId,base64Img) {

    faceCtr.user_checkLog(faceId, storeId, (res) => {
        if (res && res.data.length === 0) {
            faceCtr.user_AddLog(faceId, storeId, () => {
                // console.log('日志记录成功')
                //保存文件夹
                const newImgName = faceId + '.jpg';
                helpers.fileDelSave(save_path_id, newImgName, base64Img);
                console.timeEnd("耗时".green);
            });

        }
    })

}
module.exports=getImgFiles
