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
router.post('/registering', function (req,res,next) { //����ʹ��ͬ��·�ɣ�
  var name=req.body.name;
  var pass=req.body.pass;
  User.getByName(name, function (err,user) {
    if(err){
      return next(err);
    }
    if(user.id){
      res.err("username is already taken!"); //�������messageģ�飿
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

          res.redirect('/')    //������ת�ɹ�ҳ
        }
      });
    }
  });
});
module.exports = router;
