const path = require('path');
const fs = require('fs');
const colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});
const chokidar = require('chokidar');
const helpers = require('../tools/helpers')
const baiduAPI = require('../tools/baiduAPI')
const faceCtr= require('../controllers/face_controller');
// const filePath = '/ftp/test/';
const filePath = path.resolve('public/face/');
let save_path = path.resolve('public/person/');

const watcher = chokidar.watch(filePath, {
    interval: 1000,
    binaryInterval: 500,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 1000
    },
    persistent: true
});
watcher.on('add', async (imgPath,event) => {
   let tmp = imgPath.substr(filePath.length+1);
   let findIDary=tmp.substr(0,tmp.indexOf('/')).split('&');
   if(findIDary.length!==3){
       return;
   }
   console.log('findIDary',findIDary)
   let userId = findIDary[0];
   let storeId = findIDary[1];
   let deviceId = findIDary[2];
   console.log('userId:'+userId+',storeId:'+storeId+',deviceId:'+deviceId)
    // console.log('size',parseInt(event.size/1024))
    const fileSize=event.size/1024;
    let ext_name = path.extname(imgPath);
    //文件大于15KB并小于100KB
    if (fileSize>=5&&fileSize<=180&&(ext_name === '.jpg' || ext_name === '.png' || ext_name === '.jpeg')) {
        //逐个读取图片
        let base64Img = fs.readFileSync(imgPath, { encoding: 'base64' });
        const res = await baiduAPI.faceCheck(base64Img);

        if (res.error_msg === 'SUCCESS') {
            // let dir_name = imgPath.replace(filePath, '');
            let save_path_id = save_path + '/' + storeId;
            // 调用创建用户组
            await baiduAPI.groupAdd(storeId)
            //人脸置信度&&人脸完整度
            const face_res = res.result.face_list[0];
            let faceId = face_res.face_token;
             console.log('人脸置信度',face_res.face_probability  +'*'+ face_res.quality.blur )
            if (face_res.face_probability > 0.9 && face_res.quality.blur < 0.5) {
                const seach_res = await baiduAPI.faceSeach(base64Img, storeId);
                console.log('搜索完成相似得分')
                //存在
                if (seach_res.error_msg === 'SUCCESS' && seach_res.result.user_list[0].score > 72) {
                    console.log(colors.prompt('更新时间完成'));
                    //更新时间
                    faceId = seach_res.result.user_list[0].user_id;
                    addUserLog(save_path_id, faceId,userId, storeId,deviceId, base64Img);
                    //检测状态
                    console.log('检测状态')
                    faceCtr.user_CheckType(faceId,userId,storeId, (res) => {
                        console.error('类别',res.data[0].type);
                    })
                } else {
                    const data_obj = {
                        faceId: faceId,
                        beauty: face_res.beauty,
                        age: face_res.age,
                        storeId: storeId,
                        userId: userId,
                        deviceId: deviceId,
                        gender: face_res.gender.type,
                        glasses: face_res.glasses.type,
                        face_shape: face_res.face_shape.type
                    };
                    await baiduAPI.faceAdd(base64Img, storeId, faceId)
                    console.log(colors.silly('添加完成'));
                    //入库
                    faceCtr.user_AddInfo(data_obj, () => {
                        // console.log('本地入库成功');
                        addUserLog(save_path_id, faceId, userId,storeId,deviceId, base64Img);
                    });
                }
            } else {
                console.log(colors.error("置信度低"));
            }
        } else {
            console.log(colors.error("无法识别"));
            console.log(res)
        }
    }else{
        console.log('未识别','文件大小：'+fileSize+',后缀：'+ext_name)
    }
    // 删除图片
    fs.unlink(imgPath, function () {
        console.log('\x1b[91m 删除图片：' + imgPath + '\x1b[91m')
    });
})

function addUserLog(save_path_id,faceId,userId, storeId,deviceId,base64Img) {
    // 防止并发添加
    faceCtr.user_checkLog(faceId, storeId, (res) => {
        if (res && res.data.length === 0) {
            faceCtr.user_AddLog(faceId,userId, storeId,deviceId, () => {
                //console.log('日志记录成功')
                //保存文件夹
                const newImgName = faceId + '.jpg';
                helpers.fileDelSave(save_path_id, newImgName, base64Img);
                console.log(colors.info('#####门店ID:'+storeId+',deviceId:'+deviceId));
            });

        }
    })

}
