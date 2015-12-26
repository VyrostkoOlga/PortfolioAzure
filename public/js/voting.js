/*window.onload = function( ) {
    vote = function( ) {
        var place = document.getElementById( 'place' ).value;
        var present = document.getElementById( 'present' ).value;
        var date = document.getElementById( 'date' ).value;
        var token = document.getElementById( 'token' ).value;
        
        var xhttp = new XMLHttpRequest( );
        xhttp.open( 'POST', '/vote', true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('X-CSRF-Token', token);
        xhttp.send("place=" + place + "&date=" + date + "present=" + present );
    };
};*/

var needUpdate = [];

vote = function( ) {
    var place = document.getElementById( 'place' ).value;
    var present = document.getElementById( 'present' ).value;
    var date = document.getElementById( 'date' ).value;
    var token = document.getElementById( 'token' ).value;
        
    var xhttp = new XMLHttpRequest( );
    xhttp.open( 'POST', '/vote', true );
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('X-CSRF-Token', token);
    xhttp.send("place=" + place + "&date=" + date + "&present=" + present );
    
    needUpdate.push( true );
};

getResults = function( ) {
    var xhttp = new XMLHttpRequest( );
    xhttp.onreadystatechange = function( ) {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log( xhttp.responseText );
            var result = JSON.parse( xhttp.responseText );
            var date = result.date.date;
            document.getElementById("date-result").innerHTML = date.substring( 0, date.indexOf( 'T' ) );
            
            document.getElementById("date-counter").src = result.date.n;
            needUpdate.pop( );
        }
    }
    
    xhttp.open( 'GET', '/vote', true );
    xhttp.send();
};

window.onload = function( ) {
    getResults( );
    setInterval(function() { 
        if ( needUpdate.length != 0 ) {
            getResults( );
        }
    }, 1000);
};