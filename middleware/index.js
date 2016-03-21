/**
 * Created by yuan on 2016/3/21.
 */
app.use('*',function(req,res,next){
    /*  res.locals.user = req.session.user;
     res.locals.success = req.flash('success').toString();
     res.locals.error = req.flash('error').toString();
     next();*/
    console.log(123);
    var url = 'http://api.kankanews.com/wechat/wxmp/kkpsc/kkpsc.json?openid=o81pDuLcFI2sNfOuLFYk9RlfSLWc&cmd=getIndex';
    request(url, function (error, response, body) {
        var data = JSON.parse(body);
        var source_pv = data['pv'].source_pv;
        var nameBox = [];var dataBox = [];var count = 0;
        for(var key in source_pv){
            if(count<20){
                count++;
                nameBox.push(key);
                dataBox.push({value:source_pv[key], name:key});
            }
            console.log(nameBox);
            /*
             res.render('index',{
             timestamp:data.timestamp,
             delta_pv:data['pv'].delta_pv,
             today_pv:data['pv'].today_pv,
             yesterday_pv:data['pv'].yesterday_pv,
             source_pv:source_pv,
             nameBox:nameBox,
             dataBox:dataBox
             });
             */
            res.end('ok');
        }
    });
});