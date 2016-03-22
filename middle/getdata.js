/**
 * Created by yuan on 2016/3/22.
 */
var request = require('request');
var async = require('async');
var router = express.Router();


exports.getBar = function(req, res, next) {
    router.use('/',function(req,res,next){
        /*  if(req.session.nameBox){
         console.log('缓存');
         res.locals.nameBox = res.nameBox = req.session.nameBox;
         next();
         }else{
         console.log('取数据');*/

        /*
         }
         */
        next();
    });

    async.waterfall([
        function(callback){
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
                res.timestamp = data.timestamp;
                res.delta_pv = data['pv'].delta_pv;
                res.today_pv = data['pv'].today_pv;
                res.yesterday_pv = data['pv'].yesterday_pv;
                res.nameBox = res.locals.nameBox = req.session.nameBox = nameBox;
                callback(req, res);
            });
        },
        function(callback){
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
                callback(req, res);
            });
        }
    ],
    function(req, res){
        //next();
    });
}




