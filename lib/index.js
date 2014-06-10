var http = require('http');
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;


exports.fileBrowser = function (port, path){
  http.createServer(Server).listen(port);
  front_path = path;
};

function Server (req, res){
  var the_path = front_path + decodeURI(url.parse(req.url,true).pathname);
  console.log();
  console.log(req.connection.remoteAddress + " " + the_path);
  fs.exists(the_path, function (exists) { //Is the path exists?
    if (!exists){
      // 404
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end("404 Not Found");
      return;
    }
    if (fs.statSync(the_path).isDirectory()) { //Is the path refer to a file or direction?
      //for direction
      res.writeHead(200, {
        "Content-Type": "text/html; charset=UTF-8"
      });
      res.write('<h2><a href=../ >⬆︎</a></h2><h3>' + the_path + '</h3>');
      exec('ls ' + the_path, function (err, stout, sterr){
        var file_list = stout.split('\n');
        for (var i in file_list){
          if (file_list[i] !== "") {
            res.write('<a href=' + encodeURI((the_path + '/').replace("//","/").replace(/^\./,"") + file_list[i]) + '>' + file_list[i] + '</a>' + '\n');
            res.write('<br>');
          }
        }
        res.end();
      });
    } else {
      //for file
      res.writeHead(200, {"Content-Type": "application/octet-stream"});
      fs.createReadStream(the_path).pipe(res);
    }

  });
}

