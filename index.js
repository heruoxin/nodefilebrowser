#!/usr/bin/env node

var http = require('http');
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;

//useage: nodefb [port]

if (process.argv.length == 2){
  var port = 6489;
  console.log("Use default port: 6489");
} else {
  var port = process.argv[2];
}

function Server (req, res){
  the_path = "." + url.parse(req.url,true).pathname;
  console.log(the_path);
  fs.exists(the_path, function (exists) { //Is the path exists?
    if (exists){
      if (fs.lstatSync(the_path).isDirectory()) { //Is the path refer to a file or direction?
        //for direction
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write('<h3>' + the_path + '</h3>');
        exec('ls ' + the_path, function (err, stout, sterr){
          var file_list = stout.split('\n');
          for (var i in file_list){
            if (file_list[i] !== "") {
              res.write('<a href=' + the_path + file_list[i] + '>' + file_list[i] + '</a>' + '\n');
              res.write('<br>');
            }
          }
          res.end();
        });
        return;
      } else {
        //for file
        res.writeHead(200, {"Content-Type": "application/octet-stream"});//this should not be text!
        fs.createReadStream(the_path).pipe(res);
        return;
      }
    } else {
      // 404
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end("404 Not Found");
    }
  });
}

http.createServer(Server).listen(port);
