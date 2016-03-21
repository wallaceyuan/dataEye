/**
 * Created by yuan on 2016/3/21.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
/* GET users listing. */
router.get('/', function(req, res, next) {
    var total_amount = res.total_amount;
    var total_delta = res.total_delta;
    var dataBox = res.dataBox;
    req.session.user = 123;
    res.render('details/index', {
        title: 'Express',
        dataBox:dataBox,
        total_amount:total_amount,
        total_delta:total_delta,
        timestamp:res.timestamp,
        delta_pv:res.delta_pv,
        today_pv:res.today_pv,
        yesterday_pv:res.yesterday_pv
    });
});

module.exports = router;