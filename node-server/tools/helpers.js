const path = require('path');
const fs = require("fs");

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
module.exports = {
    ImgFileSend:function(filePath, callback){
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath,  (err, files)=> {
            if (err) {
                console.warn(err,filePath)
            } else {
                //遍历读取到的文件列表
                files.forEach( (filename)=> {
                    //获取当前文件的绝对路径
                    let filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir,  (eror, stats) =>{
                        if (eror) {
                            console.warn('获取文件stats失败');
                        } else {
                            let isFile = stats.isFile();//是文件
                            let isDir = stats.isDirectory();//是文件夹
                            if (isFile) {
                                let ext_name=path.extname(filedir)
                                if(ext_name==='.jpg'||ext_name==='.png'||ext_name==='.jpeg'){
                                    let imageBuf = fs.readFileSync(filedir);
                                    callback(filedir, imageBuf.toString('base64'))
                                }
                            }
                            if (isDir) {
                                this.ImgFileSend(filedir,callback);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        });
    },
    fileDelSave:function(fileRsePath,newImgName,base64Img) {
        // console.log(fileRsePath, newImgName)
        mkdirs(fileRsePath,()=>{
            saveImg(fileRsePath+'/'+newImgName, base64Img)
        })
    }
}
 function saveImg(name, base64) {
    let _base64 = base64.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(_base64, 'base64'); //把base64码转成buffer对象，
    fs.writeFile(name, dataBuffer, function (err) {
        if (err) {
            console.error("图片保存失败" + err);
        }
    });
}
// 递归创建目录 异步方法
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            // console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
                // console.log('在目录创建好' + dirname  +'目录');
            });
        }
    });
}
