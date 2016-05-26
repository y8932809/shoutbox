var express = require('express');
var router = express.Router();
var Entry=require('../lib/entry');
var page=require("../lib/middleware/page");
var validate=require('../lib/middleware/validate');
router.get('/:page?',page(Entry.count,5), function(req, res, next) {
    var page=req.page;
    Entry.getRange(page.from,page.to, function (err,entries) {
        if(err){
            return next(err);
        }
        res.render('entries',{title:'Entries',entries:entries});
    })
});

router.get('/post', function (req,res) {
    res.render('post',{title:"Post"});
});

router.post('/posting',validate.required('title'),validate.lengthAbove('title',4),function (req,res,next) {
    var title=req.body.title;
    var body=req.body.body;
    var entry=new Entry({
        "username":res.locals.user.name,
        "title":title,
        "body":body
    });
    entry.save(function (err) {
        if(err){
            return next(err);
        }
        res.redirect('/entries')
    });
})
module.exports = router;
