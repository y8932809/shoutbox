var express = require('express');
var router = express.Router();
var User=require('../lib/user');
//router.auth= express.basicAuth(User.authenticate);

router.get('/user/:id', function (req,res,next) {
    User.get(req.params.id, function (err,user) {
        if(err){
            return next(err);
        }
        if(!user.id){
            return res.send(404);
        }
        res.json(user);
    });
});
module.exports = router;
