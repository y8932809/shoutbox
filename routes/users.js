var express = require('express');
var router = express.Router();

var User=require('../lib/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function (req,res,next) {
  res.render('register',{title:'Register'})

});
router.post('/registering', function (req,res,next) { //不能使用同名路由？
  var name=req.body.name;
  var pass=req.body.pass;
  User.getByName(name, function (err,user) {
    if(err){
      return next(err);
    }
    if(user.id){
      res.err("username is already taken!"); //如何引用message模块？
      res.redirect('back');
    }
    else{
      user=new User({
          name:name,
          pass:pass
      });
      user.save(function (err) {
        if(err){
          req.session.uid=user.id;

          res.redirect('/')    //重新跳转成功页
        }
      });
    }
  });
});
module.exports = router;
