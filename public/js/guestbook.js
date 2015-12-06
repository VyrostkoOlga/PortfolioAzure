var expts = new RegExp( '(.*?)<(B|I)>(.*?)</(B|I)>(.*?)', 'i' );
var img = new RegExp( '(.*?)<IMG([^/]*?)src=([^/]*?)/>', 'i' );
var animg = new RegExp( '(.*?)@IMG([^/]*?)src=([^/]*?)/@', 'i' );
var anexpts = new RegExp( '(.*?)@(B|I)@(.*?)#(B|I)@(.*?)', 'i' );
var regTag = new RegExp( '(.*?)<([^>]*)>(.*?)</[^>]*>(.*?)', 'i' );
var regTag2 = new RegExp( '(.*?)<([^>]*)>([^/]*?)/>(.*?)');

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
    
    text = text.replace( img, '$1@IMG$2src=$3/@' );
    text = text.replace( expts, '$1@$2@$3#$4@$5' );
    text = text.replace( regTag, '$1 $3 $4' );
    text = text.replace( regTag2, '$1 $4');
    text = text.replace( anexpts, '$1<$2>$3</$4>$5' );
    text = text.replace( animg, '$1<IMG$2src=$3/>' );
    
    var xhttp = new XMLHttpRequest( );
    xhttp.open( 'POST', '/reviews', true );
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('X-CSRF-Token', csrf);
    xhttp.send( 'text=' + text );
    
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
    text.textContent = data.reviewText;
    
    var user = findNodeByClassName( newReview, "userId", true );
    user.textContent = data.name + ' ' + data.sirname;
    user.setAttribute('userId', data.userId);
    
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
            console.log( reviews );
            for ( var i=0; i<data.length; i++ ) {
                console.log( reviews );
                var current = reviews[i];
                console.log( current );
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