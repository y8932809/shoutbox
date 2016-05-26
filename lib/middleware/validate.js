//function parseFiled(field){
//    return field.split(/\[|\]/).filter(function (s) {
//        return s;
//    })
//}
function getFiled(req,field){
    var val=req.body;
    //field.forEach(function (prop) {
    //    val=val[prop];
    //});
    return val[field];
}
exports.required= function (field) {
    //field=parseFiled(field);
    return function (req,res,next) {
        if(getFiled(req,field)){
            next();
        }
        else{
            res.err(field + 'is required'); //因为不是数组，所以不能用join
            res.redirect('back');
        }
    }
};
exports.lengthAbove= function (field,len) {
    //field=parseFiled(field);
    return function (req,res,next) {
        if(getFiled(req,field).length>len){
            next();
        }
        else{
            res.err(field+'must have more than'+len +'charactes');
            res.redirect('back');
        }
    }
};