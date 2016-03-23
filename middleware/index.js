/**
 * Created by yuan on 2016/3/21.
 */
exports.getDate = function() {
    var d = new Date();
    var etime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0).getTime()/1000;
    var stime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()/1000;
    var date = {
        stime:stime,
        etime:etime
    }
    return date;
}


