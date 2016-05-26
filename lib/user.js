//查看数据库数据  1、启动 redis-cli.exe 2、get user:ids3、hgetall user:17

var redis=require('redis');
var bcypt=require('bcrypt-nodejs');
var db=redis.createClient();
function User(obj){


    for(var key in obj){
        this[key]=obj[key];
       // console.log(this[key]);
    }
};
User.prototype.save=function(fn){
    console.log("save begin")
    if(this.id){
        this.update(fn);
    }
    else {
        var user = this;
        db.incr('user:ids', function (err, id) {
            console.log("save begin1")

            //if (err) {
            //    return fn(err);
            //}
            user.id = id;
            user.hashPassword(function (err) {
                if (err) {
                    return fn(err);
                }
                user.update(fn);
            });
           // user.update(fn);
        });
    }
};

User.prototype.update= function (fn) {
    var user=this;
    var id=user.id;
    db.set('user:id:'+user.name,id, function (err) {
        if(err) {
            return fn(err);
        }
        db.hmset('user:'+id,user, function (err) {
            fn(err);
        });
    });
};

User.prototype.hashPassword= function (fn) {
    var user=this;
    bcypt.genSalt(12, function (err,salt) {
        if(err){
            return fn(err);
        }
        user.salt=salt;
        bcypt.hash(user.pass,salt,null,function(err,hash){ //和bcypt参数个数不一致
            if(err){
                return fn(err);
            }
            user.pass=hash;
            fn();
        });
    });
};
User.getByName= function (name,fn) {

    User.getId= function (id,fn) {
        db.get('user:id:'+name,fn);
    };
    User.get= function (id,fn) {
        db.hgetall('user:'+id, function (err,user) {
            if(err){
                return fn(err);
            }
            fn(null,new User(user));
        })
    }
    User.getId(name, function (err,id) {
        if(err){
            return fn(err);
        }
        User.get(id,fn);
    });
}
User.authenticate= function (name,pass,fn) {
    User.getByName(name, function (err,user) {
        if(err){
            return fn(err);
        }
        if(!user.id){
            return fn();
        }
        bcypt.hash(pass,user.salt, null,function (err,hash) {
            if(err){
                return fn(err);
            }
            if(hash==user.pass){ //如果输入的密码加密之后和数据库中的密码一致
                return fn(null,user);
            }
            fn();
        });
    });
};
User.prototype.toJSON= function () {
    return{
        Id:this.id,
        name:this.name
    }
}
//var tobi=new User({
//    name:'yukaifei',
//    pass:'y12345',
//    age:'26'
//});
//tobi.save(function (err) {
//    if(err){
//        console.log(11111111111);
//    }
//    console.log('user id %d',tobi.id);
//    console.log('save');
//});
//console.log(2222)
module.exports=User;
