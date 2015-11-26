var express = require('express');
var http = require('http');
var index = require('index.html');
var port = process.env.PORT || 1337;

  var app = express();
  // Куча всяких настроек express`а        
   
  app.get('/', index );

  http.createServer(app).listen(port, function(){
    console.log('Express server listening on port ' + port);
  });
