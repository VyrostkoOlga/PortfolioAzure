var bTag = new RegExp( '<b[^>]*?>([^<]*?)</b>', 'i' );
var iTag = new RegExp( '<i[^>]*?>([^<]*?)</i>', 'i' );
var bTag1 = new RegExp( '&lt;b&gt;(.*?)&lt;/b&gt;', 'i' );
var iTag1 = new RegExp( '&lt;i&gt;(.*?)&lt;/i&gt;', 'i' );

var imgTag = new RegExp( '<img.*? src=([\'"]data:image/[a-z]*?;base64,[^\'"]*?[\'"]).*?/>', 'i' );
var imgTag1 = new RegExp( '&lt;img src=([\'"]data:image/[a-z]*?;base64,[^\'"]*?[\'"])/&gt;', 'i' );

addPage = function( ) {
    var form = document.getElementById( "add-page-form" );
    form.style.display = "block";
    
    document.getElementById( "add-page-action" ).style.display = "none";
    return false;
};

cancelAddPage = function( ) {
    var form = document.getElementById( "add-page-form" );
    form.style.display = "none";
    
    document.getElementById( "add-page-action" ).style.display = "inline-block";
    return false;
};

sendReview = function( ) {
    var text = document.getElementById( 'text-add-page' ).value;
    var csrf = document.getElementsByName( '_csrf' )[0].value;
    
    text = text.replace( bTag, '$1'.bold() );
    text = text.replace( iTag, '$1'.italics( ) );
    text = text.replace( imgTag, '<img src=$1/>' );
    
    var xhttp = new XMLHttpRequest( );
    xhttp.open( 'POST', '/reviews', true );
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('X-CSRF-Token', csrf);
    xhttp.send( 'text=' + encodeURIComponent(text) );
    
    updateReviews( );
};

fillAndAdd = function( data ) {
    var proto = document.getElementById( "guestbook-page-proto" );
    var form = document.getElementById( "add-page-form" );
    
    var pageText = findNode( form, "text", true );
    
    var newReview = proto.cloneNode( true );
    newReview.id = "";
    newReview.setAttribute('name', 'reviewPage');
    newReview.style.display = "block";
    
    var text = findNodeByClassName( newReview, "text", true );
    text.textContent = decodeURIComponent(data.reviewText);
    text.innerHTML = text.innerHTML.replace( bTag1, '<b>$1</b>');
    text.innerHTML = text.innerHTML.replace( iTag1, '<i>$1</i>');
    
    text.innerHTML = text.innerHTML.replace( imgTag1, '<img height="100" width="100" src=$1/>' );
    
    var user = findNodeByClassName( newReview, "userId", true );
    user.textContent = data.name + ' ' + data.sirname;
    user.setAttribute('userId', data.user);
    
    document.getElementById( "content-wrapper" ).insertBefore( newReview, proto );
    
    pageText.value = "";
    form.style.display = "none";
    document.getElementById( "add-page-action" ).style.display = "inline-block";
};

updateReviews = function( ) {
    var xhttp = new XMLHttpRequest( );
    xhttp.onreadystatechange = function( ) {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var data = JSON.parse( xhttp.responseText );
            
            var reviews = document.getElementsByName( 'reviewPage' );
            for ( var i=0; i<data.length; i++ ) {
                var current = reviews[i];
                if ( undefined != current )
                    current.parentNode.removeChild( current );
            }
            
            for ( var i=0; i<data.length; i++ ) {
                fillAndAdd( data[i] );
            }
        }
    }
    
    xhttp.open( 'GET', '/reviews', true );
    xhttp.send( );
};