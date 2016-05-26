var express=require('express');
var router=express.Router();
var User=require('../lib/user');

router.get('/', function (req,res) {
    res.render('login',{title:'login'});
})
router.post('/logining', function (req,res,next) {
    var name=req.body.name;
    var pass=req.body.pass;
    User.authenticate(name,pass, function (err,user) {
        if(err){
            return next(err);
        }
        if(user){
            req.session.uid=user.id;
            res.redirect('/');
        }
        else{
            res.err('sorry,no have username');
            res.redirect('back');
        }
    })
});
router.get('/logout', function (req,res) {
    req.session.destroy(function (err) {
        if (err){
            throw err;
        }
        res.redirect('/');
    })
})
module.exports = router;