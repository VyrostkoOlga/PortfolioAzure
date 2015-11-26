window.onload = function( ) {
    var cookie = document.cookie.split(';');
    
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
        document.getElementById( 'hero' ).style.backgroundImage = "url(" + imagePath + " )";
    }
}