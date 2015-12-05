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

app.get( '/about', function( req, res ) {
    res.render( 'about' );
});

app.get( '/gallery', function( req, res ) {
    res.render( 'gallery' );
});

app.get( '/guestbook', function( req, res ) {
    res.render( 'guestbook' );
});

app.get( '/news', function( req, res ) {
    res.render( 'news' );
});

app.get( '/registration', function( req, res ) {
    res.render( 'registration' );
});

app.get( '/resume', function( req, res ) {
    res.render( 'resume' );
});

app.get( '/works', function( req, res ) {
    res.render( 'works' );
});

var port = process.env.port || 8080;
var server = app.listen( port, function( req, res ) {
  var host = server.address().address,
      port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});


