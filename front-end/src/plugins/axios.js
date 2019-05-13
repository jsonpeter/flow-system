// Lib imports
import axios from 'axios'
let instance = axios.create({
    baseURL: 'http://localhost:3100/frontend',
    staticURL: 'http://localhost:3100',
    // baseURL: Vue.$serverPath+'/frontend',
    // staticURL: Vue.$serverPath,
    timeout: 10000
    // adapter: Cache({
    //     time: 60 //分钟
    // })
});
instance.interceptors.request.use(function (config) {
    const TOKEN=sessionStorage.getItem('access_token');
    if(TOKEN){
        config.headers={'AccessToken': TOKEN}
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
//响应
instance.interceptors.response.use(response => {
    const res = response.data;
    console.log(res)
    if (res.code&&res.code === -1) {

       location.href='/login';
        return Promise.reject();
    }else{
        return response.data
    }
}, function (error) {
    return Promise.reject(error);
})
export default instance
