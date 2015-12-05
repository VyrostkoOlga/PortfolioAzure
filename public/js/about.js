window.onload = function() {
    
    var ie = false;
    var myNav = navigator.userAgent.toLowerCase();
    ie = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    
    console.log( ie );
    
    colorImages = function( ) {
        if ( ie != 8 ) {
            var els = document.getElementsByClassName( "grey" );

            for ( var i=0; i<els.length; i++ ) {
                var el = els[i];
                el.style.display = 'none';
            }

            els = document.getElementsByClassName( "colored" );

            for ( var i=0; i<els.length; i++ ) {
                var el = els[i];
                el.style.display = 'block';
            }
        }
    }
    
    discolorImages = function( ) {
        if ( ie != 8 ) {
            var els = document.getElementsByClassName( "colored" );

            for ( var i=0; i<els.length; i++ ) {
                var el = els[i];
                el.style.display = 'none';
            }

            els = document.getElementsByClassName( "grey" );

            for ( var i=0; i<els.length; i++ ) {
                var el = els[i];
                el.style.display = 'block';
            }
        }
    }
}