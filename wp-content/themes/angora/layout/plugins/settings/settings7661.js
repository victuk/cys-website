(function ($) {
    "use strict";

	var parameters = [];

	var settings_block = '<div class="block-settings-wrapper">'+
							'<div id="block_settings" class="block_settings">'+
								'<section>'+
									'<h3>HEADER STYLE</h3>'+
									'<ul>'+
										'<li class="header-index"><a href="'+js_load_parameters.theme_site_url+'">Image Slideshow</a></li>'+
										'<li class="header-index-image"><a href="'+js_load_parameters.theme_site_url+'/index-image">Single Image</a></li>'+
										'<li class="header-index-video"><a href="'+js_load_parameters.theme_site_url+'/index-video">Video Background</a></li>'+
									'</ul>'+
									'<hr>'+
									'<h3>COLORS</h3>'+
									'<span class="red" 			title="Red" 		data-color="#f25454" />'+
									'<span class="blue" 		title="Blue" 		data-color="#4e9cb5" />'+
									'<span class="green" 		title="Green" 		data-color="#24bca4" />'+
									'<span class="turquoise" 	title="Turquoise" 	data-color="#46cad7" />'+
									'<span class="purple" 		title="Purple" 		data-color="#c86f98" />'+
									'<span class="orange" 		title="Orange" 		data-color="#ee8f67" />'+
									'<span class="yellow" 		title="Yellow" 		data-color="#e4d20c" />'+
									'<span class="grey" 		title="Grey" 		data-color="#6b798f" />'+
								'</section>'+
								'<a href="#" id="settings_close">Close</a>'+
							'</div>'+
						'</div>';

	//Init color buttons
	function initColor() {
		$(".block-settings-wrapper section span").on("click", function() {
			var cls = $(this).attr("class");
			var color = $(this).data("color");
		
			//CSS
			$("#angora-color-schema-css").attr('href', js_load_parameters.theme_default_path+'/layout/colors/'+cls+'.css');

			//Logo
			$('.navbar .navbar-brand > img').attr('data-alt', js_load_parameters.theme_default_path+'/images/logo/logo-'+cls+'.png');
			$('.navbar.floating .navbar-brand > img').attr('src', js_load_parameters.theme_default_path+'/images/logo/logo-'+cls+'.png');

			//Google Maps
			$("#google-map").data("color", color);
			$("#google-map").data("marker", js_load_parameters.theme_default_path+"/layout/images/map-marker-"+cls+".png");
			
			$.Angora_Theme.mapCreate();
		});
	}

	//Init open/close button	
	function initClose() {
		parameters.push("opened");

		$("#settings_close").on("click", function(e) {
			$("body").toggleClass("opened-settings");

			if (!$.cookies.get("opened")) {
				$.cookies.set("opened", "opened-settings");
			} else {
				$.cookies.del("opened");
			}

			e.preventDefault();	
		});
	}

	//Init cookies
	function initCookies() {
		for (var key in parameters) {
			if (parameters.hasOwnProperty(key)) {
				var name = parameters[key];
				var parameter = $.cookies.get(name);

				if (parameter) {
					$("body").addClass(parameter);
				}
			}
		}
	}

	//Init
	$("body").prepend(settings_block);
	initColor();
	initClose();
	initCookies();

	//Activate header style
	var url = window.location.href;
	url = url.replace(/\/$/, "");
	var ind = url.lastIndexOf("/");
	url = url.substr(ind+1);

	if (url.indexOf("index")===-1) {url = "index";}

	var $page = $("li.header-"+url);

	$page.addClass("active");
	$page.append('<i class="fas fa-check"></i>');
	
})(jQuery);