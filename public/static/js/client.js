$(document).ready(function() {
	var
		site_url = "bckchn.nl:8080",
		login_form = $("#login"),
		register_form = $("#register");
		
	login_form.submit(function() {
		$.post("/login", login_form.serialize(), function(data){
			if(!data.message) { 
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