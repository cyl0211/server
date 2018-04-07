var muilter = require('../multerUtil');
//multer有single()中的名称必须是表单上传字段的name名称。
var upload = muilter.single('file');
exports.dataInput = function(req, res) {
    upload(req, res, function(err) {});
    res.send('上传成功');
    
}