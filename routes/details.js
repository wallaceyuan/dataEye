var express = require('express');
var request = require('request');
var router = express.Router();
var mime = require('mime');
var middleware = require('../middleware/index');
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
/* GET users listing. */
//侧边栏
router.use('/',function(req,res,next){
    if(mime.lookup(req.url) != 'application/octet-stream'){
        return;
    }
    /*  if(req.session.nameBox){
     console.log('缓存');
     res.locals.nameBox = res.nameBox = req.session.nameBox;
     next();
     }else{
     console.log('取数据');*/
    var url = 'http://api.kankanews.com/wechat/wxmp/kkpsc/kkpsc.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getIndex';
    request(url, function (error, response, body) {
        console.log('req.url','侧边栏',req.url);
        var data = JSON.parse(body);
        var source_pv = data['pv'].source_pv;
        var nameBox = [];var dataBox = [];var count = 0;
        for(var key in source_pv){
            if(count<6){
                count++;
                nameBox.push(key);
                dataBox.push({value:source_pv[key], name:key});
            }
        }
        var pageurl = data['pageurl'];
        res.total_amount = pageurl['total_amount'];
        res.total_delta = pageurl['total_delta'];
        res.dataBox = dataBox;
        res.timestamp = res.locals.timestamp =data.timestamp;
        res.delta_pv = res.locals.delta_pv = data['pv'].delta_pv;
        res.today_pv = res.locals.today_pv = data['pv'].today_pv;
        res.yesterday_pv = res.locals.yesterday_pv = data['pv'].yesterday_pv;
        res.nameBox = res.locals.nameBox = req.session.nameBox = nameBox;
        next();
    });
});


//主页
router.get('/main', function(req, res, next) {
    console.log('/main',req.url);
    var total_amount = res.total_amount;
    var total_delta = res.total_delta;
    var dataBox = res.dataBox;
    res.locals.click = 'all';
    res.render('details/index', {
        title: 'Express',dataBox:dataBox,
        total_amount:total_amount, total_delta:total_delta,
        timestamp:res.timestamp, delta_pv:res.delta_pv, today_pv:res.today_pv, yesterday_pv:res.yesterday_pv,
        clicknum:res.clicknum, delta:res.delta, timeBox:res.timeBox, clickBox:res.clickBox,
        dtBox:res.dtBox, dclickBox:res.dclickBox
    });
});

/*router.use('/list/:name',function(req,res,next){
    if(mime.lookup(req.url) != 'application/octet-stream'){
        return;
    }
    console.log('name',req.params.name);
    /!*    if(req.url == '/'){
     var query = 'all';
     }else{
     var query = 'all';
     }*!/
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var url = "http://api.kankanews.com/wechat/wxmp/kkpsc/all.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&stime="+stime+"&etime="+etime+"&cmd=getPastData";
    request(url, function (error, response, body) {
        console.log('req.url','昨天今天',req.url);
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
});*/

router.get('/list/:name', function(req, res, next) {
    var name = req.params.name;
    res.locals.click = name;
    var kkapi = "http://api.kankanews.com/wechat/wxmp/kkpsc/"+name+".json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getSource&source="+name;
    request(kkapi, function (error, response, body) {
        var data = JSON.parse(body);
        console.log('/list/:name',req.url);
        var pageurl = data['pageurl'];
        res.render('details/detail',{
            title: name,
            total_amount:pageurl['amount'],
            total_delta:pageurl['delta'],
            timestamp:data.timestamp,
            delta_pv:data['pv'].delta_pv,
            today_pv:data['pv'].today_pv,
            yesterday_pv:data['pv'].yesterday_pv
        });
    });
});


router.get('/now/:name',function(req, res, next) {
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var date = {
        stime:stime,
        etime:etime
    }
    var name = req.params.name;
    res.locals.click = name;
    var kkapi = 'http://api.kankanews.com/wechat/wxmp/kkpsc/'+name+'.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&stime='+date.stime+'&etime='+date.etime+'&cmd=getSourceByDate'
    console.log(kkapi);
    request(kkapi, function (error, response, body) {
        console.log('req.url','/pre/:name',req.url);
        var prevData = JSON.parse(body);
        var timeBox = [];var clickBox = [];
        for(var key in prevData.data){
            timeBox.push(key);
            clickBox.push(prevData.data[key]);
        }
        res.render('details/now', {
            title: prevData.source,
            timeBox:timeBox, clickBox:clickBox,
            timeslot:prevData.timeslot,
            total:prevData.total,
            flag:name
        });
    });
});

router.get('/pre/:name',function(req, res, next) {
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var date = {
        stime:stime,
        etime:etime
    }
    var name = req.params.name;
    res.locals.click = name;
    var kkapi = 'http://api.kankanews.com/wechat/wxmp/kkpsc/'+name+'.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&stime='+date.stime+'&etime='+date.etime+'&cmd=getPastData';
    console.log(kkapi);

    request(kkapi, function (error, response, body) {
        console.log('req.url','/pre/:name',req.url);
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
        res.render('details/pre', {
            title: prevData.source,
            timeBox:timeBox, clickBox:clickBox,
            dtBox:dtBox,dclickBox:dclickBox,
            flag:name
        });
    });
});


module.exports = router;