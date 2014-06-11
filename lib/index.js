var http = require('http');
var url = require('url');
var fs = require('fs');
var oppressor = require('oppressor');


function fileBrowser (port, given_path, cb){
  http.createServer(function (req, res){
    var browser_path = (decodeURI(url.parse(req.url,true).pathname));
    var file_path = (given_path + browser_path).replace("//","/");
    var req_info = req.connection.remoteAddress + " " + file_path;
    fs.exists(file_path, function (exists) { //Is the path exists?
      if (!exists){
        // 404
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("404 Not Found");
        return cb("404", req_info);
      }
      if (fs.statSync(file_path).isDirectory()) { //Is the path refer to a file or direction?
        //for direction
        cb(null, req_info);
        res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
        res.write('<h3><a href=./ >⬆︎</a>' + browser_path + '</h3>\n<hr />');
        fs.readdir(file_path,function(err, file_list){
          file_list.forEach(function(file){
            res.write('<a href=' + encodeURI((browser_path + '/').replace(/^\./,"").replace("//","/") + file) + '>' + file + '</a>' + '\n');
            res.write('<br>');
          });
          res.end();
        });
      } else {
        //for file
        cb(null, req_info);
        fs.createReadStream(file_path)
        .pipe(oppressor(req))
        .pipe(res)
        ;
      }

    });
  }).listen(port);
}

module.exports = fileBrowser;
