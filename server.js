var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 1337;
 
http.createServer(function (request, response) {
    fs.readFile('index.html', function (err, data){
       if (err) {
       	response.end("File wasn't found");
       }
        response.end(data);
    });
}).listen(port);

