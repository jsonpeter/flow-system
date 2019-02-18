const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes');
require('./task/index');
const routesAdmin = require('./routes/routes-admin');


//设置允许跨域访问该服务.
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,AccessToken");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'3.2.1')
    next();
});
app.use('/images',express.static(__dirname +'/public/person'));
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/frontend', routes);
app.use('/admin', routesAdmin);

module.exports = app;
