/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */

const jwt = require('jsonwebtoken');//用来创建和确认用户信息摘要
// 检查用户会话
module.exports = function(req, res, next) {
    //检查post的信息或者url查询参数或者头信息
    const token = req.get("accessToken");
    // 解析 token
    if (token) {
        // 确认token
        jwt.verify(token, 'secret', function(err, decoded) {
            if (err) {
                return res.json({ code: -1, message: 'token信息错误.' });
            } else {
                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                req.userInfo = decoded;
                next();
            }
        });
    } else {
        // 如果没有token，则返回错误
        return res.json({ code: -1, message: 'token信息错误.' });
    }
};
