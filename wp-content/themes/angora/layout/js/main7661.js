(function($) {
	
	"use strict";
	
	/* Default Variables */
	var Angora_Options = {
		parallax:true,
		loader:true,
		animations:true,
		scrollSpeed:700,
		navigation:'sticky',	//sticky, default
		zoomControlDiv:null,
		security:''
	};
	
	if (typeof Angora!=='undefined') {
		jQuery.extend(Angora_Options, Angora);
	}
	
	$.Angora_Theme = {
		
		//Initialize
		init:function() {
			this.loader();
			this.animations();
			this.navigation();
			this.intro();			
			this.portfolio();				
			this.contact();
			this.footer();
			this.map();
			this.parallax();
			this.videos();
			this.imageSlider();
			this.contentSlider();
			this.blog();
			this.errorPage();
			this.shortCodes();
			this.replace();
		},
		
		//Page Loader
		loader:function() {
			if (Angora_Options.loader) {
				var loaderHide = function() {
					jQuery(window).trigger('angora.loaded');
					
					jQuery('.page-loader').delay(1000).fadeOut('slow', function() {
						jQuery(window).trigger('angora.complete');
					});
				};
	
				//Loadsafe
				jQuery(window).on('load', function() {
					window._loaded = true;
				});
				
				window.loadsafe = function(callback) {
					if (window._loaded) {
						callback.call();
					} else {
						jQuery(window).on('load', function() {
							callback.call();
						});
					}
				};
	
				//Hide loader
				if (jQuery('#intro').attr('data-type')==='video' && !Modernizr.touch) {
					jQuery(window).on('angora.intro-video', function() {
						window.loadsafe(function() {
							loaderHide();
						});
					});
				} else {
					jQuery(window).on('load', function() {
						loaderHide();
					});
				}
			} else {
				jQuery('.page-loader').remove();
				jQuery(window).trigger('angora.loaded');	
                
                setTimeout(function() {
                    jQuery(window).trigger('angora.complete');
                }, 1);
			}
		},
		
		//Animations
		animations:function() {
			new WOW().init();
		},
	
		//Navigation
		navigation:function() {
			//Line height
			$('.navbar .navbar-brand img').waitForImages(function() {
				var height = parseInt(jQuery('.navbar .navbar-header').height(), 10);
				jQuery('.navbar .navbar-nav > li > a, .navbar .navbar-social').css('line-height', height+'px');

				//Responsive menu
				var $toggle = jQuery('.navbar .navbar-toggle'),
					toggle_height = parseInt($toggle.height(), 10);

				$toggle.css('margin-top', parseInt((height-(toggle_height+2))/2, 10)+'px');
			});
			
			//Collapse menu
			var collapseMenu = function() {
				if (jQuery('.navbar-collapse.collapse.in').length>0) {
					jQuery('.navbar-collapse.collapse.in').each(function() {
						jQuery(this).parent().find('.navbar-toggle').click();
					});
				}
				
				if (screen.availWidth<1920) {
					jQuery('.navbar').addClass('side-left');
					var $submenu = jQuery('.navbar li .sub-menu ul');					
				}
			};
	
			//Resize window
			jQuery(window).on('resize', function() {
				collapseMenu();
			});
	
			jQuery(window).on('scroll', function() {
				collapseMenu();
			});
	
			//Create floating navigation bar
			if (Angora_Options.navigation==='sticky') {
				jQuery(window).on("scroll", function() {
					var pos = jQuery(window).scrollTop();
					
					if (pos>=100) {
						jQuery(".navbar").addClass("floating slide-down");
					} else {
						jQuery(".navbar").removeClass("floating slide-down");
					}
				});
			} else {
				//Fixed menu
				jQuery('.navbar').addClass('fixed-top');
			}
	
			//Scroll to anchor links
			jQuery('a[href^=\\#]').on("click", function(e) {
				if (jQuery(this).attr('href')!=='#' && !jQuery(e.target).parent().parent().is('.navbar-nav') && !jQuery(this).attr('data-toggle')) {
					jQuery(document).scrollTo(jQuery(this).attr('href'), Angora_Options.scrollSpeed, {offset:{top:-85, left:0}});
					e.preventDefault();
				}
			});
	
			//Navigation
			jQuery(document).ready(function() {
				jQuery('.navbar-nav').onePageNav({
					currentClass:'active',
					changeHash:false,
					scrollSpeed:Angora_Options.scrollSpeed,
					scrollOffset:85,
					scrollThreshold:0.5,
					filter:'li a[href^=\\#]',
					begin:function() {
						collapseMenu();
					}
				});
			});
	
			if (document.location.hash && Angora_Options.loader) {
				if (!/\?/.test(document.location.hash)) {
					jQuery(window).on('load', function() {
						jQuery(window).scrollTo(document.location.hash, 0, {offset:{top:-85, left:0}});
					});
				}
			}
	
			//To top
			jQuery('footer .to-top').on('click', function() {
				jQuery(window).scrollTo(jQuery('body'), 1500, {offset:{top:0, left:0}});
			});
		},
	
		//Intro
		intro:function() {
			if (jQuery('#intro').length===0) {
				return;
			}
	
			var $intro = jQuery('#intro'),
				useImages = false, 
				useVideo = false,
				$elements;
	
			//Vertical Align Content
			var verticalAlignContent = function() {
				var contentH = $intro.find('.content').outerHeight(), 
					windowH = jQuery(window).height(), 
					value = Math.floor((windowH-contentH)/2);
				
				if (jQuery("#wpadminbar").length>0) {
					var barH = jQuery("#wpadminbar").height();
					value -= barH;
				}
					
				$intro.find('.content').css({marginTop:value});
			};
	
			//Magic mouse
			var magicMouse = function() {
				var mouseOpacity = 1-jQuery(document).scrollTop()/400;
				if (mouseOpacity<0) {mouseOpacity = 0;}
				$intro.find('.mouse').css({opacity:mouseOpacity});
			};
	
			if (!Angora_Options.animations) {
				$intro.find('.wow').removeClass('wow');
			}
	
			jQuery(window).on('resize', function() {
				verticalAlignContent();
			});
	
			jQuery(window).on('load', function() {
				verticalAlignContent();
				magicMouse();
			});
			
			jQuery(window).on('scroll', function() {
				magicMouse();
			});
	
			//Static image
			if ($intro.data('type')==='single-image') {
				useImages = true;
				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					jQuery(window).on('angora.complete', function() {
						$elements.removeClass('animated');
						$elements.removeAttr('style');
						
						new WOW({boxClass:'animate'}).init();
					});
				} else {
					verticalAlignContent();
				}
	
				jQuery('<div />').addClass('slider fullscreen').prependTo('body');
				
				jQuery('<div />').addClass('image').css({
					opacity:0,
					backgroundImage:"url('"+$intro.attr('data-source')+"')",
					backgroundRepeat:'no-repeat',
					backgroundSize:'cover'
				}).appendTo('.slider');
	
				jQuery('.slider').waitForImages(function() {
					jQuery(this).find('.image').css({opacity:1});
				});
	
				if ($intro.attr('data-parallax')==='true' && !Modernizr.touch) {
					jQuery(document).ready(function() {
						jQuery('.slider').find('.image').css({backgroundRepeat:'repeat'}).parallax('50%', 0.25);
					});
				}			
			}		
			//Slideshow
			else if ($intro.data('type')==='slideshow') {
				useImages = true;
	
				var contentListShow = function($that, $contentList, index) {
					var $current;
					
					if (!$contentList) {
						$contentList = $intro;
						$current = $contentList;
					} else {
						$current = $contentList.find('> div[data-index='+index+']');
					}
					
					$current.show();
					verticalAlignContent();
					
					var $elements = $current.find('.animate');
	
					if ($elements.length>0) {
						$elements.removeClass('animated');
						$elements.removeAttr('style');
						
						new WOW({boxClass:'animate'}).init();
					}
				};
				
				var contentListHide = function($that, $contentList, onComplete) {
					if ($contentList) {
						var $current = $contentList.find('> div:visible');
						if (typeof $current!=='undefined') {
							$contentList.find('> div').hide();
						}
					}
					
					if (onComplete && typeof onComplete==='function') {
						onComplete();
					}
				};
	
				var $imagesList = $intro.find($intro.data('images')),
					$contentList = $intro.data('content') ? $intro.find($intro.data('content')) : false,
					changeContent = $contentList!==false ? true : false,
					$toLeft = $intro.data('to-left') ? $intro.find($intro.data('to-left')) : false,
					$toRight = $intro.data('to-right') ? $intro.find($intro.data('to-right')) : false,
					delay = parseInt($intro.data('delay'), 10)>0 ? parseInt($intro.data('delay'), 10)*1000 : 7000,
					images = [];
	
				$imagesList.hide();
				
				$imagesList.find('> img').each(function(index) {
					images.push({src:$(this).attr('src')});
					$(this).attr('data-index', index);
				});
	
				if (changeContent) {
					$contentList.find('> div').hide();
					$contentList.find('> div').each(function(index) {
						jQuery(this).attr('data-index', index);
					});
				}
	
				var slideshowTimeout = false, 
					slideshowCurrent = 0, 
					slideshowIsFirst = true;
				
				var slideshowChange = function($that, index) {
					if (index>=images.length) {
						index = 0;
					} else if (index<0) {
						index = images.length-1;
					}
					
					slideshowCurrent = index;
	
					var isFirst = $that.find('.image').length===0 ? true : false;
					
					if (isFirst) {
						jQuery('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat'
						}).addClass('image').appendTo('.slider');
					} else {
						jQuery('<div />').css({
							backgroundImage:"url('"+images[index].src+"')",
							backgroundRepeat:'no-repeat',
							opacity:0
						}).addClass('image').appendTo('.slider');
	
						setTimeout(function() {
							$that.find('.image:last-child').css({opacity:1});
							setTimeout(function() {
								$that.find('.image:first-child').remove();
							}, 1500);
						}, 100);
					}
	
					if ($contentList || slideshowIsFirst) {
						contentListHide($that, $contentList, function() {
							contentListShow($that, $contentList, index);
						});
					}
					
					slideshowIsFirst = false;
	
					clearTimeout(slideshowTimeout);
					
					slideshowTimeout = setTimeout(function() {
						slideshowNext($that);
					}, delay);
				};
				
				var slideshowCreate = function() {
					jQuery('<div />').addClass('slider fullscreen').prependTo('body');
					
					jQuery(window).on('load', function() {
						$imagesList.waitForImages(function() {
							slideshowChange(jQuery('.slider'), 0);
						});
					});
				};
				
				var slideshowNext = function($slider) {
					slideshowChange($slider, slideshowCurrent+1);
				};
				
				var slideshowPrev = function($slider) {
					slideshowChange($slider, slideshowCurrent-1);
				};
	
				slideshowCreate();
	
				if ($toLeft!==false && $toRight!==false) {
					$toLeft.on("click", function(e) {
						slideshowPrev($('.slider'));
						e.preventDefault();
					});
					
					$toRight.on("click", function(e) {
						slideshowNext($('.slider'));
						e.preventDefault();
					});
				}
			}
			//Fullscreen Video
			else if ($intro.data('type')==='video') {
				useVideo = true;										
	
				if (Modernizr.touch) {
					jQuery('#video-mode').removeClass('animate').hide();
					useImages = true;
					useVideo = false;
				}
	
				$elements = $intro.find('.animate');
				
				if ($elements.length>0) {
					verticalAlignContent();
	
					jQuery(window).on('angora.complete', function() {
						$elements.removeClass('animated');
						$elements.removeAttr('style');
						
						new WOW({boxClass:'animate'}).init();
					});
				} else {
					verticalAlignContent();
				}	
				
				jQuery(document).ready(function() {
					var reserveTimer,
						onlyForFirst = true,
						quality = $intro.attr('data-quality'),
						callBackImage = $intro.attr('data-on-error');

					if (quality!=='small' && quality!=='medium' && quality!=='large' && quality!=='hd720' && quality!=='hd1080' && quality!=='highres') {
						quality = 'default';
					}

					jQuery('[data-hide-on-another="true"]').remove();

					jQuery(window).on('YTAPIReady', function() {
						reserveTimer = setTimeout(function() {
							jQuery(window).trigger('angora.intro-video');
							onlyForFirst = false;
						}, 5000);
					});

					jQuery('<div />').addClass('slider fullscreen').prependTo('body').on('YTPStart', function() {
							if (onlyForFirst) {
								clearTimeout(reserveTimer);
								jQuery(window).trigger('angora.intro-video');
								onlyForFirst = false;
							}
						}).mb_YTPlayer({
							videoURL:$intro.attr('data-source'),
							mobileFallbackImage:callBackImage,
							mute:$intro.attr('data-mute')==='true' ? true : false,
							startAt:parseInt($intro.attr('data-start'), 10),
							stopAt:parseInt($intro.attr('data-stop'), 10),
							autoPlay:true,
							showControls:false,
							ratio:'16/9',
							showYTLogo:false,
							vol:100,
							quality:quality,
							onError:function() {
								clearTimeout(reserveTimer);
								jQuery(window).trigger('angora.intro-video');
							}
					});

					if ($intro.attr('data-overlay')) {
						jQuery('.YTPOverlay').css({
							backgroundColor:'rgba(0, 0, 0, '+$intro.attr('data-overlay')+')'
						});
					}
				});

				var videoMode = false, 
					videoModeSelector = '#intro .mouse, #intro .content, .slider.fullscreen .overlay';

				jQuery('#video-mode').on("click", function() {
					jQuery(videoModeSelector).animate({opacity:0}, {duration:500, queue:false, complete:function() {
						if (!videoMode) {
							jQuery('.slider').YTPUnmute();
							
							jQuery('.YTPOverlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
								jQuery(this).hide();
							}});

							jQuery('<div />').appendTo('#intro').css({
								position:'absolute',
								textAlign:'center',
								bottom:'30px',
								color:'#fff',
								left:0,
								right:0,
								opacity:0
							}).addClass('click-to-exit');

							jQuery('<h5 />').appendTo('.click-to-exit').text('Click to exit full screen');

							setTimeout(function() {
								jQuery('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
									setTimeout(function() {
										jQuery('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
											jQuery(this).remove();
										}});
									}, 1500);
								}});
							}, 500);
						}

						videoMode = true;

						jQuery(this).hide();
					}});
				});

				$intro.on("click", function(e) {
					if (videoMode && jQuery(e.target).is('#intro')) {
						jQuery('.slider').YTPMute();
						jQuery('.YTPOverlay').show().animate({opacity:1}, {duration:500, queue:false});
						jQuery(videoModeSelector).show().animate({opacity:1}, {duration:500, queue:false});
						$intro.find('.click-to-exit').remove();
						videoMode = false;
					}
				});
			}
		},
	
		//Portfolio
		portfolio:function() {
			if (jQuery('.portfolio-item').length===0) {
				return;
			}
			
			var that = this;
	
			var calculatePortfolioItems = function() {
				var sizes = {lg:4, md:4, sm:4, xs:2}, 
					$that = jQuery('.portfolio-items'),
					w = jQuery(window).width(), 
					onLine = 0, value = 0;
	
				if ($that.attr('data-on-line-lg')>0) {sizes.lg = parseInt($that.attr('data-on-line-lg'), 10);}
				if ($that.attr('data-on-line-md')>0) {sizes.md = parseInt($that.attr('data-on-line-md'), 10);}
				if ($that.attr('data-on-line-sm')>0) {sizes.sm = parseInt($that.attr('data-on-line-sm'), 10);}
				if ($that.attr('data-on-line-xs')>0) {sizes.xs = parseInt($that.attr('data-on-line-xs'), 10);}
	
				//New width
				if (w<=767) {
					onLine = sizes.xs;
				} else if (w>=768 && w<=991) {
					onLine = sizes.sm;
				} else if (w>=992 && w<=1199) {
					onLine = sizes.md;
				} else {
					onLine = sizes.lg;
				}
	
				value = Math.floor(w/onLine);
				
				//Portfolio image
				var $img = jQuery('.portfolio-item img');
				
				if ($img.prop('complete')) {
					var $item = $img.closest('.portfolio-item'),
						width = $img.width(),
						height = $img.height();
					
					height = height*value/width;
					
					$item.css({width:value+'px', height:height+'px'});
				}
			};
	
			jQuery(window).on('resize', function() {
				calculatePortfolioItems();
			});
			
			jQuery(window).on('load', function() {
				calculatePortfolioItems();
				
				//Isotope
				jQuery('.portfolio-items').isotope({
				  	itemSelector:'.portfolio-item',
					layoutMode:'fitRows'
				});

				var $items = jQuery('.portfolio-items').isotope();

				//Filter items on button click
				jQuery('.portfolio-filters').on('click', 'span', function() {
					var filter = jQuery(this).data('filter');
					$items.isotope({filter:filter});
				});

				jQuery('.portfolio-filters').on('click', 'span', function() {
					jQuery(this).addClass("active").siblings().removeClass('active');
				});
			});
			
			var closeProject = function() {
				jQuery('#portfolio-details').animate({opacity:0}, {duration:600, queue:false, complete:function() {
					jQuery(this).hide().html('').removeAttr('data-current');
				}});
			};
			
			//Portfolio details
			jQuery('.portfolio-item a').on("click", function(e) {
				e.preventDefault();
				var $that = jQuery(this);
				var $item = $that.closest(".portfolio-item");
				
				if ($item.find('.loading').length===0) {
					jQuery('<div />').addClass('loading').appendTo($item);
					$that.parent().addClass('active');
	
					var $loading = $item.find('.loading'),
						$container = jQuery('#portfolio-details'),
						timer = 1;
					
					if ($container.is(':visible')) {
						closeProject();
						timer = 800;
						$loading.animate({width:'70%'}, {duration:2000, queue:false});
					}
	
					setTimeout(function() {

						$loading.stop(true, false).animate({width:'70%'}, {duration:6000, queue:false});
						
						//Add AJAX query to the url
						var url = $that.attr("href")+"?ajax=1";
						
						jQuery.get(url).done(function(response) {
							$container.html(response);
							
							$container.waitForImages(function() {
								$loading.stop(true, false).animate({width:'100%'}, {duration:500, queue:true});
								
								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									jQuery(this).remove();
	
									$container.show().css({opacity:0});	
									
									that.imageSlider($container, function() {
										jQuery(document).scrollTo($container, 600, {offset:{top:-parseInt(jQuery(".navbar").height(), 10), left:0}});
										$container.animate({opacity:1}, {duration:600, queue:false});
										$container.attr('data-current', $that.data("rel"));
									});
								}});
							});
						}).fail(function() {
							$that.parent().removeClass('active');
							$loading.remove();
						});
					}, timer);
					
				}
				
				e.preventDefault();
			});
	
			jQuery(document.body).on('click', '#portfolio-details .icon.close i', function() {
				closeProject();
			});
	
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = jQuery('[rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', 0, {offset:{top:0, left:0}});
					jQuery(window).on('angora.complete', function() {
						$item.trigger('click');
					});
				}
			}
	
			jQuery('a[href^="#view-"]').on("click", function() {
				var $item = jQuery('[rel="'+jQuery(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					jQuery(document).scrollTo('#portfolio', Angora_Options.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger('click');
					}});
				}
			});
		},
	
		//Parallax Sections
		parallax:function() {
			if (jQuery('.parallax').length===0) {
				return;
			}
	
			jQuery(window).on('load', function() {
				jQuery('.parallax').each(function() {
					if (jQuery(this).attr('data-image')) {
						jQuery(this).parallax('50%', 0.5);
						jQuery(this).css({backgroundImage:'url('+jQuery(this).data('image')+')'});
					}
				});
			});
		},
	
		//Video Background for Sections
		videos:function() {
			if (Modernizr.touch) {
				jQuery('section.video').remove();
				return;
			}
	
			if (jQuery('section.video').length>0) {
				var tag = document.createElement('script');
				tag.src = "//www.youtube.com/player_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
				jQuery(window).on('resize', function() {
					jQuery('section.video').each(function() {
						jQuery(this).css({height:jQuery(this).find('.video-container .container').outerHeight(true)});
					});
				}).resize();
			}
		},
	
		//Google Maps
		map:function() {
			if (jQuery('#google-map').length===0) {
				return;
			}
			
			var that = this;
	
			jQuery(window).on('load', function() {
				that.mapCreate();
			});
		},
		
		//Create map
		mapCreate:function() {
			var $map = jQuery('#google-map');
			
			//Main color			
			var main_color = $map.data('color');

			//Saturation and brightness
			var saturation_value = -20;
			var brightness_value = 5;

			//Map style
			var style = [ 
				{//Set saturation for the labels on the map
					elementType:"labels",
					stylers:[
						{saturation:saturation_value},
					]
				}, 

				{//Poi stands for point of interest - don't show these labels on the map 
					featureType:"poi",
					elementType:"labels",
					stylers:[
						{visibility:"off"},
					]
				},

				{//Hide highways labels on the map
					featureType:'road.highway',
					elementType:'labels',
					stylers:[
						{visibility:"off"},
					]
				}, 

				{//Hide local road labels on the map
					featureType:"road.local", 
					elementType:"labels.icon", 
					stylers:[
						{visibility:"off"}, 
					] 
				},

				{//Hide arterial road labels on the map
					featureType:"road.arterial", 
					elementType:"labels.icon", 
					stylers:[
						{visibility:"off"},
					] 
				},

				{//Hide road labels on the map
					featureType:"road",
					elementType:"geometry.stroke",
					stylers:[
						{visibility:"off"},
					]
				},

				{//Style different elements on the map
					featureType:"transit", 
					elementType:"geometry.fill", 
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				}, 

				{
					featureType:"poi",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.government",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.attraction",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"poi.business",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"transit",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"transit.station",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"landscape",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]	
				},

				{
					featureType:"road",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"road.highway",
					elementType:"geometry.fill",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				},

				{
					featureType:"water",
					elementType:"geometry",
					stylers:[
						{hue:main_color},
						{visibility:"on"}, 
						{lightness:brightness_value}, 
						{saturation:saturation_value},
					]
				}
			];
			
			var coordY = $map.data('latitude'), coordX = $map.data('longitude');
			var latlng = new google.maps.LatLng(coordY, coordX);
			
			var settings = {
				zoom:$map.data('zoom'),
				center:new google.maps.LatLng(coordY, coordX),
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				panControl:false,
				zoomControl:false,
				mapTypeControl:false,
				streetViewControl:false,
				scrollwheel:false,
				draggable:true,
				mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},
				navigationControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL},
				styles:style
			};
			
			var map = new google.maps.Map($map.get(0), settings);
			
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});
			
			var contentString = $map.parent().find('#map-info').html() || '';
			var infoWindow = new google.maps.InfoWindow({content: contentString});
			var companyPos = new google.maps.LatLng(coordY, coordX);
			
			var marker = new google.maps.Marker({
				position:companyPos,
				map:map,
				icon:$map.data('marker'),
				zIndex:3
			});
	
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(map, marker);
			});
			
			//Add custom buttons for the zoom-in/zoom-out on the map
			if (Angora_Options.zoomControlDiv===null) {				
				var zoomControlDiv = document.createElement('div');		
				var zoomControl = new customZoomControl(zoomControlDiv, map);
				Angora_Options.zoomControlDiv = zoomControlDiv;
			}

			//Insert the zoom div on the top left of the map
			map.controls[google.maps.ControlPosition.LEFT_TOP].push(Angora_Options.zoomControlDiv);
		},
	
		//Content slider
		contentSlider:function($root, element) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			if (typeof element==='undefined') {element = 'div';}
	
			$root.find('.content-slider').each(function() {
				var $that = jQuery(this), timeout, delay = false, process = false, $arrows;
				
				$that.css({position:'relative'}).find('> '+element).each(function(index) {
					$that.height(jQuery(this).outerHeight(true));
					jQuery(this).attr('data-index', index);
					jQuery(this).css({position:'relative', left:0, top:0});
					
					if (index>0) {
						jQuery(this).hide();
					} else {
						$that.attr('data-index', 0);
					}
				});
	
				if ($that.attr('data-arrows')) {
					$arrows = jQuery($that.attr('data-arrows'));
				} else {
					$arrows = $that.parent();
				}
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
				
				if ($that.find('> '+element+'[data-index]').length<2) {
					$arrows.hide();
					clearInterval(timeout);
					delay = false;
				}
	
				$arrows.find('.arrow').on("click", function() {
					if (!process) {
						process = true;
						clearInterval(timeout);
	
						var index = parseInt($that.attr('data-index'), 10), last = parseInt($that.find('> '+element +':last-child').attr('data-index'), 10), set;
						var property;
						
						if (jQuery(this).hasClass('left')) {
							set = index===0 ? last : index-1;
							property = [ {left:100}, {left:-100}];
						} else {
							set = index===last ? 0 : index+1;
							property = [{left:-100}, {left:100}];
						}
						
						var $current = $that.find('> '+element+'[data-index='+index+']'),
							$next = $that.find('> '+element+'[data-index='+set+']');
	
						$that.attr('data-index', set);
						$current.css({left:'auto', right:'auto'});
						$current.animate({opacity:0}, {duration:300, queue:false});
	
						$current.animate(property[0], {duration:300, queue:false, complete:function() {
							jQuery(this).hide().css({opacity:1}).css({left:0});
	
							$that.animate({height:$next.outerHeight(true) }, {duration:(($that.outerHeight(true)===$next.outerHeight(true)) ? 0 : 200), queue:false, complete:function() {
								$next.css({opacity:0, left:'auto', right:'auto'}).css(property[1]).show();
								$next.animate({opacity:1}, {duration:300, queue:false});
	
								$next.animate({left:0}, {duration:300, queue:false, complete:function() {
									if (delay!==false) {
										timeout=setInterval(function() {
											$arrows.find('.arrow.right').click();
										}, delay);
									}
									process = false;
								}});
							}});
						}});
					}
				});
	
				jQuery(window).on('resize', function() {
					$that.each(function() {
						jQuery(this).height(jQuery(this).find('> '+element+':visible').outerHeight(true));
					});
				}).resize();
			});
		},
	
		//Contact form
		contact:function() {
			if (jQuery('#angora-contact-form').length===0) {
				return;
			}
	
			var $name = jQuery('.field-name'), $email = $('.field-email'), $phone = jQuery('.field-phone'),
				$text = jQuery('.field-message'), $button = jQuery('#contact-submit'),
				$action = jQuery('.field-action');
	
			$('.field-name, .field-email, .field-message').focus(function() {
				if ($(this).parent().find('.error').length>0) {
					$(this).parent().find('.error').fadeOut(150, function() {
						$(this).remove();
					});
				}
			});
	
			$button.removeAttr('disabled');
			
			$button.on("click", function() {
				var fieldNotice = function($that) {
					if ($that.parent().find('.error').length===0) {
						jQuery('<span class="error"><i class="fas fa-times"></i></span>').appendTo($that.parent()).fadeIn(150);
					}
				};
	
				if ($name.val().length<1) {fieldNotice($name);}
				if ($email.val().length<1) {fieldNotice($email);}
				if ($text.val().length<1) {fieldNotice($text);}
	
				if (jQuery('#contact').find('.field .error').length===0) {
					jQuery(document).ajaxStart(function() {
						$button.attr('disabled', true);
					});
					
					jQuery.post($action.data('url'), {
						action:'contact',
						security:Angora.security,
						name:$name.val(), 
						email:$email.val(),
						phone:$phone.val(), 
						message:$text.val()
					}, function(response) {
						var data = $.parseJSON(response);
						
						if (data.status==='email') {
							fieldNotice($email);
							$button.removeAttr('disabled');
						} else if (data.status==='error') {
							$button.text('Unknown Error :(');
						} else {
							jQuery('.contact-form').fadeOut(300);
							jQuery('.contact-form-result').fadeIn(300);
						}
					});
				}
			});
		},
		
		//Footer
		footer:function() {
			var $body = jQuery('body');
			
			if ($body.find('.footer-widgets').length>0) {				
				var $widgets = jQuery('.footer-widgets');
				var img = $widgets.data("bg-image");
				$widgets.css({"background-image":"url('"+img+"')"});
			}
		},
	
		//Images Slider
		imageSlider:function($root, onComplete) {
			if (typeof $root==='undefined') {$root = jQuery('body');}
			
			if ($root.find('.image-slider').length===0) {
				if (onComplete && typeof onComplete==='function') {onComplete();}
				return;
			}
			
			//Replace block gallery
			$root.find('.image-slider').each(function() {
				var $that = jQuery(this);
				var $list = $that.find('li');
				
				$list.each(function() {
					var $item = jQuery(this);
					var $img = $item.find('img');
					$img.removeClass().addClass('img-responsive img-rounded');
					$img.removeAttr('data-id').removeAttr('srcset').removeAttr('sizes').removeAttr('alt');
					$img.appendTo($item);

					var $figure = $item.find('figure');
					$figure.remove();
				});
				
				var $arrows = 	'<div class="arrows">'+
									'<a class="arrow left">'+
										'<i class="fas fa-chevron-left"></i>'+
									'</a>'+
									'<a class="arrow right">'+
										'<i class="fas fa-chevron-right"></i>'+
									'</a>'+
								'</div>';
				
				$that.append($arrows);
				$arrows = $that.find('.arrows');
				
				$that.wrap('<div class="image-slider" />').contents().unwrap();
				$list.wrap('<div />').contents().unwrap();
			});
			
			//Init slider	
			$root.find('.image-slider').each(function() {
				var $that = jQuery(this), $arrows = $that.find('.arrows');
				var $list = jQuery(this).find('> div').not('.arrows');
				var timeout, delay = false, process = false;
	
				var setHeight = function($that, onComplete) {
					$that.css({
						height:$that.find('> div:visible img').outerHeight(true)
					});
					
					if (onComplete && typeof onComplete==='function') {onComplete();}
				};
	
				if ($that.attr('data-delay')) {
					delay = parseInt($that.attr('data-delay'), 10);
					timeout = setInterval(function() {
						$arrows.find('.arrow.right').click();
					}, delay);
				}
	
				jQuery(this).waitForImages(function() {
					jQuery(this).css({position:'relative'});
	
					$list.hide().css({
						position:'absolute',
						top:0,
						left:0,
						zIndex:1,
						width:'100%',
						paddingLeft:15,
						paddingRight:15,
					});
	
					$list.eq(0).show();
	
					setHeight($that, onComplete);
					
					jQuery(window).on('resize', function() {
						setTimeout(function() {
							setHeight($that);
						}, 1);
					});
	
					if ($list.length===1) {
						$arrows.hide();
						clearInterval(timeout);
						delay = false;
					}
				});
	
				$arrows.find('.arrow').on('click', function(e) {
					if (process) {
						e.preventDefault();
						return;
					}
					
					clearInterval(timeout);
	
					var isRight = jQuery(this).hasClass('right');
					var $current = $that.find('> div:visible').not('.arrows'), $next;
	
					if (isRight) {
						$next = $current.next();
						if (!$next || $next.is('.arrows')) {
							$next = $list.eq(0);
						}
					} else {
						if ($current.is(':first-child')) {
							$next = $list.last();
						} else {
							$next = $current.prev();
						}
					}
	
					process = true;
					$current.css({zIndex:1});
					
					$next.css({opacity:0, zIndex:2}).show().animate({opacity:1}, {duration:300, queue:false, complete:function() {
						$current.hide().css({opacity:1});
						
						if (delay!==false) {
							timeout = setInterval(function() {
								$arrows.find('.arrow.right').click();
							}, delay);
						}
						process = false;
					}});
				});
			});
		},
	
		//Blog
		blog:function() {
			//Search form
			jQuery(window).on('resize', function() {
				var $btn = jQuery(".search-form .search-submit");
				$btn.addClass("btn btn-default");
				var width = parseInt($btn.outerWidth(), 10);
				jQuery(".search-form .search-field").css("padding-right", (width+16)+"px");
			}).resize();
			
			//Masonry blog
			if (jQuery('.blog-masonry').length) {
				//Get column width
				var getColumnWidth = function() {
					var $that = jQuery('.blog-masonry'),
						w = $that.outerWidth(true)-30,
						ww = jQuery(window).width(),
						columns;

					if ($that.hasClass('blog-masonry-four')) {
						columns = 4;
					} else if ($that.hasClass('blog-masonry-three')) {
						columns = 3;
					} else if ($that.hasClass('blog-masonry-two')) {
						columns = 2;
					} else {
						columns = 1;
					}

					if (ww<=767) {
						columns = 1;
					} else if (ww>=768 && ww<=991 && columns>2) {
						columns -= 1;
					}

					return Math.floor(w/columns);
				};

				jQuery('.blog-post.masonry').css({width:getColumnWidth()});

				jQuery('.blog-masonry').waitForImages(function() {
					jQuery(this).isotope({
						itemSelector:'.blog-post.masonry',
						resizable:false,
						transformsEnabled:false,
						masonry:{columnWidth:getColumnWidth()}
					});
				});

				jQuery(window).on('resize', function() {
					var size = getColumnWidth();
					jQuery('.blog-post.masonry').css({width:size});
					jQuery('.blog-masonry').isotope({
						masonry:{columnWidth:size}
					});
				});
			}
		},
		
		//Error page
		errorPage:function() {
			if (jQuery('#error-page').length>0) {
				jQuery(window).on('resize', function() {
					jQuery('#error-page').css({marginTop:-Math.ceil(jQuery('#error-page').outerHeight()/2)});
			   	}).resize();
			}
		},
		
		//Short codes
		shortCodes:function() {
			//Progress bars
			if (jQuery('.progress .progress-bar').length>0) {
				setTimeout(function() {
					jQuery(window).on('angora.complete', function() {
						jQuery(window).scroll(function() {
							var scrollTop = jQuery(window).scrollTop();
							jQuery('.progress .progress-bar').each(function() {
								var $that = jQuery(this), itemTop = $that.offset().top-jQuery(window).height()+$that.height()/2;
								
								if (scrollTop>itemTop && $that.outerWidth()===0) {
									var percent = parseInt(jQuery(this).attr('data-value'), 10)+'%';
									var $value = jQuery(this).parent().parent().find('.progress-value');
									
									if ($value.length>0) {
										$value.css({width:percent, opacity:0}).text(percent);
									}
	
									$that.animate({width:percent}, {duration:1500, queue:false, complete:function() {
										if ($value.length>0) {
											$value.animate({opacity:1}, {duration:300, queue:false});
										}
									}});
								}
							});
						}).scroll();
					});
				}, 1);
			}
			
			//Counters
			if (jQuery('.number-count').length>0) {
				jQuery('.number-count').counterUp({
					delay:4,
					time:1000
				});
			}
			
			//Clients
			if (jQuery('.clients-slider').length>0) {
				jQuery('.clients-slider').owlCarousel({
					autoplay:3000,
					autoplaySpeed:300,
					dots:false,
					responsive:{
						0:		{items:2},
						480:	{items:3},
						768:	{items:5}
					}
				});
			}
			
			//Testimonials
			if (jQuery('.testimonial-slider').length>0) {
				jQuery(".testimonial-slider").slick({
					slidesToShow:1,
					slidesToScroll:1,
					arrows:false,
					fade:true,
					asNavFor:".testimonial-nav"
				});

				jQuery(".testimonial-nav").slick({
					slidesToShow:5,
					slidesToScroll:1,
					asNavFor:".testimonial-slider",
					dots:false,
					centerMode:true,
					focusOnSelect:true,
					variableWidth:false,
					arrows:false,
					responsive:[
						{
							breakpoint:991,
							settings:{
								slidesToShow:5
							}
						},
						{
							breakpoint:480,
							settings:{
								slidesToShow:3
							}
						}
					]
				});
			}
		},
		
		//Replace
		replace:function() {
			var btn, txt;
			
			//Submit
			btn = jQuery(".comment-form .submit");
			txt = btn.val();
			btn.replaceWith('<button id="submit" name="submit" class="submit btn btn-default" type="submit">'+txt+'</button>');		
		
			//Instagram
			jQuery(".instagram-feed li").each(function() {
				var width = jQuery(this)[0].getBoundingClientRect().width;
				jQuery(this).css('height', width+'px');
			});
			
			//Social widget
			jQuery(".widget_social").prev(".widget_text").css("margin-bottom", "0");
		},
		
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = 'width='+w+', height='+h+', resizable=1';
	
			//Title
			if (typeof title==='undefined') {
				title = jQuery('title').text();
			} else if (typeof title==='string') {
				if (jQuery(title).length>0) {
					title = jQuery(title).text();
				}
			}
			
			//Image
			if (typeof image==='undefined') {
				image = '';
			} else if (typeof image==='string') {
				if (!/http/i.test(image)) {
					if (jQuery(image).length>0) {
						if (jQuery(image).is('img')) {
							image = jQuery(image).attr('src');
						} else {
							image = jQuery(image).find('img').eq(0).attr('src');
						}
					} else {
						image = '';
					}
				}
			}
			
			//Url
			if (typeof url==='undefined') {
				url = document.location.href;
			} else if (url.indexOf(document.location.protocol+'//')==-1) {				
				url = document.location.protocol+'//'+document.location.host+document.location.pathname+url;
			}
			
			//Share
			if (network==='twitter') {
				return window.open('//twitter.com/intent/tweet?text='+encodeURIComponent(title+' '+url), 'share', params);
			} else if (network==='facebook') {
				return window.open('//www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodeURIComponent(url)+'&p[title]='+encodeURIComponent(title)+'&p[images][0]='+encodeURIComponent(image), 'share', params);
			} else if (network==='pinterest') {
				return window.open('//pinterest.com/pin/create/bookmarklet/?media='+image+'&description='+title+' '+encodeURIComponent(url), 'share', params);
			} else if (network==='linkedin') {
				return window.open('//www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(url)+'&title='+title, 'share', params);
			}
			
			return;
		}
	};
	
	//Initialize
	$.Angora_Theme.init();

})(jQuery);

//Map zoom controls
function customZoomControl(controlDiv, map) {
	//Grap the zoom elements from the DOM and insert them in the map 
	var controlUIzoomIn = document.getElementById('zoom-in'),
	controlUIzoomOut = document.getElementById('zoom-out');

	controlDiv.appendChild(controlUIzoomIn);
	controlDiv.appendChild(controlUIzoomOut);

	//Setup the click event listeners and zoom-in or out according to the clicked element
	google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
		map.setZoom(map.getZoom()+1);
	});

	google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
		map.setZoom(map.getZoom()-1);
	});
}

//Share Functions
function shareTo(network, title, image, url) {
	return jQuery.Angora_Theme.share(network, title, image, url);
}

//Video Background for Sections
function onYouTubePlayerAPIReady() {
	jQuery('section.video').each(function(index) {				
		var $that = jQuery(this), 
			currentId = 'video-background-'+index;	
		
		jQuery('<div class="video-responsive"><div id="'+currentId+'"></div></div>').prependTo($that);

		var player = new YT.Player(currentId, {
			height:'100%',
			width:'100%',			
			playerVars:{
				'rel':0,
				'autoplay':1,
				'loop':1,
				'controls':0,
				'start':parseInt($that.attr('data-start'), 10),
				'autohide':1,
				'wmode':'opaque',
				'playlist':currentId
			},
			videoId:$that.attr('data-source'),
			events:{
				'onReady':function(evt) {
					evt.target.mute();
				},
				'onStateChange':function(evt) {
					if (evt.data===0) {evt.target.playVideo();}
				}
			}
		});

		var $control = $that.find('.video-control'),
			$selector = $that.find($control.attr('data-hide')),
			$container = $that.find('.video-container'),
			videoMode = $that.attr('data-video-mode')==='true' ? true : false;

		if ($control.length>0 && $selector.length>0) {
			$control.on("click", function() {
				if (!videoMode) {
					$that.attr('data-video-mode', 'true');
					videoMode = true;
					
					$that.find('.video-overlay').animate({opacity:0}, {duration:500, queue:false, complete:function() {
						jQuery(this).hide();
					}});
					
					$selector.animate({opacity:0}, {duration:500, queue:false, complete:function() {
						player.unMute();

						jQuery('<div />').appendTo($container).css({
							position:'absolute',
							textAlign:'center',
							bottom:'30px',
							color:'#fff',
							left:0,
							right:0,
							opacity:0
						}).addClass('click-to-exit');
						
						jQuery('<h5 />').appendTo($that.find('.click-to-exit')).text('Click to exit full screen');

						setTimeout( function() {
							$that.find('.click-to-exit').animate({opacity:1}, {duration:500, queue:false, complete:function() {
								setTimeout(function( ) {
									$that.find('.click-to-exit').animate({opacity:0}, {duration:500, queue:false, complete:function() {
										jQuery(this).remove();
									}});
								}, 1500);
							}});
						}, 500);

						$selector.hide();
					}});
				}
			});

			$that.on("click", function(evt) {
				if (videoMode && (jQuery(evt.target).is('.video-container') || jQuery(evt.target).parent().is('.click-to-exit'))) {
					$selector.show().animate({opacity:1}, {duration:500, queue:false});
					$that.find('.video-overlay').show().animate({opacity:1}, {duration:500, queue:false});

					$that.find('.click-to-exit').remove();
					$that.removeAttr('data-video-mode');
					videoMode = false;

					player.mute();
				}
			});
		}
	});
}


