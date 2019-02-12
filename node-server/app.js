const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes');
const routesAdmin = require('./routes/routes-admin');
const schedule = require("node-schedule")

//设置允许跨域访问该服务.
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,AccessToken");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/images',express.static('public/person'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/frontend', routes);
app.use('/admin', routesAdmin);

module.exports = app;
