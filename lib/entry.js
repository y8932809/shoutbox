var redis=require('redis');
var db=redis.createClient();
module.exports=Entrty;
function Entrty(obj){
    for(var key in obj){
        this[key]=obj[key];
    }
}
Entrty.prototype.save= function (fn) {
    var entrtyJson=JSON.stringify(this);
    db.lpush(
        'entries',
        entrtyJson,
        function (err) {
            if(err){
                return err;
            }
            fn();
        }
    );
};
Entrty.getRange= function (from,to,fn) {
    db.lrange('entries',from,to,function(err,items){
        if(err){
            fn(err);
        }
        var entries=[];
        items.forEach(function (item) {
            entries.push(JSON.parse(item));
        });
        fn(null,entries);
    });
};
Entrty.count= function (fn) {
    db.llen('entries',fn);
}