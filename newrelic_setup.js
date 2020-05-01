const fs = require('fs')
    , request = require('request')

var nragent = fs.readFileSync(`newrelicagent.txt`).toString();
fs.readdir('src/', function(err, files){
    if (err) throw err;
    files.filter((fileName)=>{
      return fileName.endsWith('.html');
    }).forEach(function (fileName) {
      var srcTxt = fs.readFileSync(`src/${fileName}`).toString();
      var destTxt = srcTxt.replace('<title>', nragent + '<title>');
      fs.writeFileSync(`public/${fileName}`, destTxt);
    });
});
