addPage = function( ) {
    var form = document.getElementById( "add-page-form" );
    form.style.display = "block";
    
    document.getElementById( "add-page-action" ).style.display = "none";
    return false;
}

cancelAddPage = function( ) {
    var form = document.getElementById( "add-page-form" );
    form.style.display = "none";
    
    document.getElementById( "add-page-action" ).style.display = "inline-block";
    return false;
}

sendReview = function( ) {
    var proto = document.getElementById( "guestbook-page-proto" );
    var form = document.getElementById( "add-page-form" );
    
    var pageText = findNode( form, "text", true );
    
    var newReview = proto.cloneNode( true );
    newReview.style.display = "block";
    
    var text = findNode( newReview, "text", true );
    text.value = pageText.value;
    
    document.getElementById( "content-wrapper" ).insertBefore( newReview, proto );
    
    pageText.value = "";
    form.style.display = "none";
    document.getElementById( "add-page-action" ).style.display = "inline-block";
}