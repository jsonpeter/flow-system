/**
 * Created by Xie on 2017/6/5.
 */
const express = require('express');
const router = express.Router();
const authCtr= require('../controllers/auth_controller');
const storeCtr= require('../controllers/store_controller');
const $check_token = require('../middlewares/check_token');

router.post('/login',(req, res) => {
    authCtr.admin_login({...req.body,type:0},function (data) {
        res.json(data)
    })
})
router.get('/auth/*',$check_token);
router.post('/auth/*',$check_token);

router.post('/auth/add',function (req, res) {
    authCtr.add(req.body,function (data) {
        res.json(data)
    })
});
router.get('/auth/check_name',function (req, res) {
    authCtr.check_name(req.query.username,function (data) {
        res.json(data)
    })
});
router.get('/auth/list',function (req, res) {
    authCtr.list(function (data) {
        res.json(data)
    })
});
router.post('/auth/update',function (req, res) {
    authCtr.update(req.body,function (data) {
        res.json(data)
    })
});

router.post('/auth/update_pwd',function (req, res) {
    authCtr.update_pwd({id:req.body.id,password:'123456'},function (data) {
        res.json(data)
    })
});
router.get('/auth/store_list',(req, res) => {
    storeCtr.store_SelectList(req.query.id).then((data) => {
        res.json(data)
    })
})
router.get('/auth/device_list',(req, res) => {
    console.log('storeId',req.query.storeId)
    storeCtr.Device_List(req.query.storeId).then((data) => {
        res.json(data)
    })
})
router.post('/auth/store_add',function (req, res) {
    storeCtr.store_Add(req.body).then((data)=>{
        res.json(data)
    })
});
router.post('/auth/device_add',function (req, res) {
    storeCtr.Device_Add(req.body).then((data)=>{
        res.json(data)
    })
});
router.delete('/auth/device_del',function (req, res) {
    storeCtr.device_Del(req.query.id).then((data)=>{
        res.json(data)
    })
});
router.delete('/auth/store_del',function (req, res) {
    storeCtr.store_Del(req.query.id).then((data)=>{
        res.json(data)
    })
});


module.exports = router;
