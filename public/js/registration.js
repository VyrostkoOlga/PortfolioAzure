checkError = function( ) {
    var q = window.location.search;
    console.log(q);
    if ( q == '?error=true' ) {
        var login = document.getElementsByName( 'login' );
        console.log( login );
        //login[0].style.borderColor = 'red';
        login[0].placeholder = 'Пользователь с этим логином уже существует';
        login[0].style.backgroundColor = 'red';
    }
    else {
        var login = document.getElementsByName( 'login' );
        login[0].style.backgroundColor = '#FFFFFF';
    }
};