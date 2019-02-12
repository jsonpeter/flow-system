const AipFaceClient = require("baidu-aip-sdk").face;
const pjson = require('../package.json').baiduApi;
// 设置APPID/AK/SK
const APP_ID = pjson.appid;
const API_KEY =pjson.key;
const SECRET_KEY = pjson.secret;
// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

const HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    // console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});

const IMAGE_TYPE = "BASE64";
module.exports = {
    groupAdd:function(groupId){
        // 调用创建用户组
        client.groupAdd(groupId).then(function(result) {
            console.log(JSON.stringify(result));
        }).catch(function(err) {
            // 如果发生网络错误
            console.log(err);
        });
    },
    faceCheck: function (image) {

        let options = {};
        options["face_field"] = "quality,age,beauty,gender,face_shape,expression,glasses";
        options["max_face_num"] = "1";
        options["face_type"] = "LIVE";
        // 带参数调用人脸检测
       return client.detect(image, IMAGE_TYPE, options)
    },
    faceAdd:function(image,groupId,userId){
       return client.addUser(image, IMAGE_TYPE, groupId, userId)
    },
    faceSeach: function (image,storeId) {
        let options = {};
        options["max_user_num"] = "1";
       return client.search(image, IMAGE_TYPE, storeId,options)
    }
}
