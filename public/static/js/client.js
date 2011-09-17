$(document).ready(function() {
	var
		site_url = "bckchn.nl:8080",
		login_form = $("#login"),
		register_form = $("#register"),
		composer_form = $("#composer"),
		composer_input = $("#composer_message"),
		bckchn_session_cookie_name = 'bckchn_session',
		bckchn_session_key = $.cookie(bckchn_session_cookie_name);
	
  now.receiveMessage = function(message_obj){
		console.log(message_obj);
		/*
		$("#foo").html(
			'mytemplate.ejs',
			{user: user_obj, message: message_obj});
		*/
	}
	
	composer_form.submit(function(){
		console.log('sending' + composer_input.val());
		now.distributeMessage(composer_input.val());
		composer_input.val("");
		return false;
	});
	
	login_form.submit(function() {
		$.post("/login", login_form.serialize(), function(data){
			if(!data.message) { 
				$.cookie(
					bckchn_session_cookie_name, 
					data.username, 
					{path: '/'});
				location.reload();
			} else {
				alert(data.message);
			}
		});
		return false;
	});
	
	register_form.submit(function() {
		$.post("/register", register_form.serialize(), function(data){
			if(!data.message) { 
				location.reload();
			} else {
				alert(data.message);
			}
		});
		return false;
	});
	
});