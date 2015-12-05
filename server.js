//Импортируем зависимости
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var handlebars = require( 'express-handlebars' ).create( );
var http = require( 'http' );

configure = function( app ) {
    //Настраиваем bodyParser
    app.use( bodyParser.json( ) );
    app.use(bodyParser.urlencoded({
    extended: true
    }));
    
    //Устанавливаем handlebars в качестве шаблонизатора
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');
    
    //Настраиваем доступную для просмотра папку на сервере
    app.use(express.static(__dirname + '/public'));
};

var app = express.createServer( );
configure( app );

//Запуск и обработчики возможных запросов
app.get( '/', function( req, res ) {
    res.render( 'index' );
});


var port = process.env.port || 8080;
/*
express.createServer(function (req, res) {
}).listen(port, function( ) {
    var host = server.address().address,
        port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
});

var server = app.listen(port, function () {
  var host = server.address().address,
      port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});
*/
var server = app.listen( port, function( req, res ) {
  var host = server.address().address,
      port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});


