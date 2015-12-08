//Импортируем зависимости
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var handlebars = require( 'express-handlebars' ).create( );
var http = require( 'http' );
var mysql = require( 'mysql' );
var session = require('express-session');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var helmet = require('helmet');
var logger = require( 'logger' );

var gm = require('gm').subClass({ imageMagick: true });
var temp = require('temp').track();
var fs   = require('fs');
var path = require('path');

var tempdir = temp.mkdirSync('tempimagesdir');

var logFile = fs.createWriteStream('myLogFile.log', {flags: 'a'});

//Функция для подсчета хэшей
var MD5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
           if (lX4 & lY4) {
                   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
           }
           if (lX4 | lY4) {
                   if (lResult & 0x40000000) {
                           return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                   } else {
                           return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                   }
           } else {
                   return (lResult ^ lX8 ^ lY8);
           }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
   		}

   	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

   	return temp.toLowerCase();
}

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
    
    app.use(cookieParser());
    app.use(session({
        secret: 'My super session secret',
        cookie: {
            httpOnly: true,
            secure: true
        }
    }));
    
    app.use( csrfProtection );
    app.use(express.logger({stream: logFile}));

    app.use(helmet.csp({
      // Specify directives as normal
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
      objectSrc: []
    }));
    app.use(helmet.xssFilter());
    app.use(helmet.hidePoweredBy({ setTo: 'this is secret' }));
    
    //app.use( logger( ) );
};

var csrfProtection = csrf({ cookie: true });
var app = express.createServer( );
configure( app );

var connection = mysql.createConnection({
    host     : 'br-cdbr-azure-south-a.cloudapp.net',
    user     : 'b6c0eb62a12a31',
    password : '18af9f20',
    database : 'olgavyrostko' 
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

//Запуск и обработчики возможных запросов
app.use(function (req, res, next) {
    var userId = req.cookies.userId;
    var userAddress = req.cookies.userAddress;
    
    console.log( userId, userAddress );
    
    if ( userId == undefined && userAddress == undefined ) {
        userAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        connection.query( 'INSERT INTO sitevisits ( `visitId`, `user`) VALUES (?, ?)', [0, 2], function( err ){} );
        res.cookie('userAddress', userAddress, { maxAge: 900000, httpOnly: true });
    }
    next();
});

app.get( '/', csrfProtection, function( req, res ) {
    console.log( req.cookies );
    
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'index', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'index', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.get( '/about', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'about', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'about', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.get( '/gallery', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'gallery', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'gallery', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.post( '/reviews', function( req, res ) {
    var userId = req.cookies.userId;
    var text = req.body.text;
    
    connection.query( 'INSERT INTO reviews ( reviewId, user, reviewText ) VALUES (?, ?, ?)', [0, userId, text], function( err, result ) {
        if ( err ) {
            console.log( err );
        }
    });
});

app.get( '/reviews', function( req, res ) {
    connection.query( 'SELECT reviewId, user, reviewText, name, sirname FROM reviews INNER JOIN users ON userId = user', function( err, result ) {
        
        if ( err ) result = [];
        res.send( JSON.stringify( result ) );
        res.end( );
    }); 
});

app.get( '/guestbook', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'guestbook', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'guestbook', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.get( '/news', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'news', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'news', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.get( '/registration', function( req, res ) {
    res.render( 'registration', {'token': req.csrfToken() } );
});

app.post( '/registration', csrfProtection, function( req, res ) {
    var name = req.body.name;
    var sirname = req.body.sirname;
    var login = req.body.login;
    var password = MD5( req.body.password );
    var email = req.body.email;
    
    connection.query( 'INSERT INTO Users (`userId`, `userName`, `hashUserPassword`, `name`, `sirname`, `login`) VALUES ( ?, ?, ?, ?, ?, ? )', [0, email, password, name, sirname, login], function( err, result ) {
        if ( err ) {
            res.redirect( '/registration?error=true' );
        }
        else {
            res.redirect( '/userCab?login=' + encodeURIComponent( login ) + '&password=' + encodeURIComponent( req.body.password ) );
        }
    });
});

app.get( '/resume', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'resume', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'resume', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.get( '/works', function( req, res ) {
    var userId = req.cookies.userId;
    if ( userId != undefined )
        res.render( 'works', {'token': req.csrfToken(), 'loginOnclick': '', 'loginHref': '/profile' } );
    else
        res.render( 'works', {'token': req.csrfToken(), 'loginOnclick': 'makeLoginVisible( )', 'loginHref': '#log-in-modal' } );
});

app.post( '/userCab', csrfProtection, function( req, res ) {
    var name = req.body.login;
    var password = MD5(req.body.password);
    
    res.redirect( '/userCab?login=' + name + '&password=' + password );
});

app.get( '/userCab', csrfProtection, function( req, res ) {
    console.log( req.query );
    var name = req.query.login;
    var hashPassword = req.query.password;
    
    connection.query( 'SELECT * FROM olgavyrostko.users WHERE login=? AND hashUserPassword=?', [name, hashPassword], function( err, result, fields ) {
        if ( err || result.length != 1 ) {
            res.redirect( '/#log-in-modal?error=true' );
            return;
        }
        
        var userId = result[0].userId;
        res.cookie('userId', userId, { maxAge: 900000, httpOnly: true });
        connection.query( 'INSERT INTO sitevisits ( `visitId`, `user`) VALUES (?, ?)', [0, userId], function( err ){} );
        
        res.redirect( '/profile' );
    });
});

app.get( '/profile', function( req, res ) {
    connection.query( 'SELECT * FROM olgavyrostko.users WHERE userId=?', [req.cookies.userId], function( err, result, fields ) {
    if ( err || result.length != 1 ) {
        res.clearCookie( 'userId' );
        res.redirect( '/#log-in-modal?error=true' );
        return;
    }
        
    var userId = result[0].userId;
    var imagePath = result[0].imagePath;
    var name = result[0].name;
    var surname = result[0].sirname;
    
    res.cookie('userId', userId, { maxAge: 900000, httpOnly: true });
    //res.cookie('startImage', result[0].imagePath, { maxAge: 900000 } );
        
    var userVisits, userVisitsForDay, usersVisits;
    var today = new Date(Date.now( ));

    connection.query( 'SELECT count(*) as n FROM olgavyrostko.sitevisits WHERE user=?', [userId], function( err, result ) {
        if ( err ) userVisits = 1;
        else userVisits = result[0].n;
        
        var imagename = path.join(tempdir,""+userVisits+".png");
        var imUV, imUVNm, imUVD;
        var data;
        var result = gm(200, 50, "#EEEEEE");
        result.font( 'ps:helvetica' );
        result.fontSize( '20' );
        result.drawText( 10, 30, userVisits ).write(imagename,function(err){
            if (err) {
                console.log(err);
            }
            else 
                {
                    data = fs.readFileSync(imagename); 
                    imUV = "data:image/png; base64, " + data.toString( 'base64' );
                }
         });
        
        connection.query( 'SELECT count(*) as n FROM olgavyrostko.sitevisits', function( err, result ) {
            if ( err ) usersVisits = 1;
            else usersVisits = result[0].n;
            
            //console.log( fs.resolve( '/resources' ) );
            
            imagename = path.join(tempdir,""+usersVisits+".png");
            result = gm(200, 50, "#EEEEEE");
            result.font( 'ps:helvetica' );
            result.fontSize( '20' );
            result.drawText( 10, 30, usersVisits ).write(imagename,function(err){
                if (err) {
                    console.log(err);
                }
                else 
                    {
                        data = fs.readFileSync(imagename); 
                        imUVN = "data:image/png; base64, " + data.toString( 'base64' );
                    }
             });

            connection.query( 'SELECT count(*) as n FROM olgavyrostko.sitevisits WHERE user=? AND recordDate <= ?', [userId, today ], function( err, result ) {
                if ( err ) userVisitsForDay = 1;
                else userVisitsForDay = result[0].n;
                
                imagename = path.join(tempdir,""+userVisitsForDay+".png");
                result = gm(200, 50, "#EEEEEE");
                result.font( 'ps:helvetica' );
                result.fontSize( '20' );
                result.drawText( 10, 30, userVisitsForDay ).write(imagename,function(err){
                    if (err) {
                        console.log(err);
                    }
                    else 
                        {
                            data = fs.readFileSync(imagename); 
                            imUVD = "data:image/png; base64, " + data.toString( 'base64' );
                            
                            res.render( 'privateCab', { 'imagePath': imagePath, 'name': name, 'sirname': surname, 'visitNumber': imUV, 'usersVisitNumber': imUVN, 'userVisitNumberForDay': imUVD, 'today': today.toLocaleString( ) } );
                        }
                 });
                });
            });
        });
    });

});

app.get( '/logOut', function( req, res ) {
    res.clearCookie( 'userId' );
    res.redirect( '/' );
});

var port = process.env.port || 8080;
var server = app.listen( port, function( req, res ) {
  var host = server.address().address,
      port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});


