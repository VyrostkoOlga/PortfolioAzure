window.onload = function( ) {
    var cookie = document.cookie.split(';');
    
    var error = document.location.search;
    var hash = document.location.hash;
    
    if ( hash == '#log-in-modal?error=true' ) {
        console.log( 'test' );
        var login = document.getElementsByName( 'login' );
        var password = document.getElementsByName( 'password' );
        
        makeLoginVisible( );
        
        login[0].style.borderColor = 'red';
        password[0].style.borderColor = 'red';
    }
    else {
        var login = document.getElementsByName( 'login' );
        var password = document.getElementsByName( 'password' );
        
        login[0].style.backgroundColor = "#FFFFFF";
        password[0].style.backgroundColor = "#FFFFFF";
    }
    
    var imagePath;
    for ( var i=0; i<cookie.length; i++ ) {
        var idx = cookie[i].indexOf( 'startImage=' );
        if ( idx != -1 ) {
            imagePath = cookie[i].substring( idx + 11, cookie[i].length );
            break;
        }
    }
    
    console.log( imagePath );
    if ( imagePath != undefined ) {
        document.getElementById( 'hero' ).style.backgroundImage = "url(" + decodeURIComponent(imagePath) + " )";
    }
}