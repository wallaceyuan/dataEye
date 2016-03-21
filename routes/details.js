/**
 * Created by yuan on 2016/3/21.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
/* GET users listing. */
router.use('/',function(req,res,next){
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var url= "http://api.kankanews.com/wechat/wxmp/kkpsc/all.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&stime="+stime+"&etime="+etime+"&cmd=getPastData";
    request(url, function (error, response, body) {
        var prevData = JSON.parse(body);
        var timeBox = [];var clickBox = [];var dtBox = [];var dclickBox = [];
        for(var key in prevData.clicknum){
            timeBox.push(key);
            clickBox.push(prevData.clicknum[key]);
        }
        for(var key in prevData.delta){
            dtBox.push(key);
            dclickBox.push(prevData.delta[key]);
        }
        res.timeBox = timeBox,res.clickBox = clickBox,res.dtBox = dtBox,res.dclickBox = dclickBox
        next();
    });
});

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
        yesterday_pv:res.yesterday_pv,
        clicknum:res.clicknum,
        delta:res.delta,
        timeBox:res.timeBox,
        clickBox:res.clickBox,
        dtBox:res.dtBox,
        dclickBox:res.dclickBox
    });
});


router.get('/list/:name', function(req, res, next) {
    var name = req.params.name;
    var kkapi = "http://api.kankanews.com/wechat/wxmp/kkpsc/"+name+".json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getSource&source="+name;
    request(kkapi, function (error, response, body) {
        var data = JSON.parse(body);
/*        var source_pv = data['pv'].source_pv;
        var nameBox = [];var dataBox = [];var count = 0;
        for(var key in source_pv){
            if(count<20){
                count++;
                nameBox.push(key);
                dataBox.push({value:source_pv[key], name:key});
            }
        }*/
        var pageurl = data['pageurl'];
        //var dataBox = dataBox;

        res.render('details/detail',{
            title: name,
/*            dataBox:dataBox,*/
            total_amount:pageurl['amount'],
            total_delta:pageurl['delta'],
            timestamp:data.timestamp,
            delta_pv:data['pv'].delta_pv,
            today_pv:data['pv'].today_pv,
            yesterday_pv:data['pv'].yesterday_pv
/*            clicknum:res.clicknum,
            delta:res.delta,
            timeBox:res.timeBox,
            clickBox:res.clickBox,
            dtBox:res.dtBox,
            dclickBox:res.dclickBox*/
        });
    });
});

module.exports = router;