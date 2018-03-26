// if login is success, disable login page view and appear home screen.

if('#debug').click(function(event) {
$('#login-screen').css('display', 'none');
$('#home-screen').css('display', 'block');
});
