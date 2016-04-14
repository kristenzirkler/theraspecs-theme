// FEATURE SETTINGS DEFAULTS
if(typeof topBarEvenSpacing === "undefined") var topBarEvenSpacing = false;
if(typeof topBarLastItem === "undefined") topBarLastItem = $('.top-bar .category-list > li:last-child');
if(typeof topBarAllLinks === "undefined") topBarAllLinks = $('.top-bar .category-list > li > a');
if(typeof quickViewActive === "undefined") quickViewActive = true;

var qv_content;

var windowWidth = function() {
	var winWidth = window.innerWidth;
	if(isNaN(winWidth)) winWidth = document.body.clientWidth;
	
	if( ! jQuery('html').hasClass('responsive') ) winWidth = 1000; // for responsive toggle
	
	return winWidth;
};

// REMOVE ROW DIVIDERS
$('.subcat-grid .RowDivider').remove();

// HIDE EMPTY ITEMS
$('.hide-empty-last-child > *:last-child').each(function(){ 
	if($.trim($(this).text()) == '') $(this).hide();
});

$(document).ready(function(){
	// TOOLTIPS - clear empty
	$('.empty-tip').each(function(){if($(this).attr('title') == "") $(this).replaceWith($(this).html());});

	// MAIN CAROUSEL
	$('.orbit-inside > div').addClass('orbit');
	$('.orbit-inside img').unwrap();
	var orbit_freq = $('.orbit').attr('data-swap-frequency') * 1000;
	if(isNaN(orbit_freq)) orbit_freq = 5000;
	$('.orbit').orbit({
		fluid: true,
		advanceSpeed: orbit_freq,
		directionalNav: true,
		bullets: true
	});
	
	// REMOVE ROW DIVIDERS
	$('.subcat-grid .RowDivider').remove();
	
	// HIDE SLIDE CONTENT IF EMPTY
	$(".orbit-slide .slide-content").each(function(){
		slideContent = $(this);
		if (slideContent.children(".slide-heading").is(":empty") && slideContent.children(".slide-text").is(":empty") && slideContent.children(".button").is(":empty")){
			slideContent.hide();
		}
	});

	// OPEN CLEARING
	$('.clearing-open').click(function(event){
		event.preventDefault();
	
		var mainImgThumb = $('.product-thumbs a[href^="'+$(this).attr('href')+'"]').parent();
		var firstImgThumb = $('.product-thumbs li:first');
		if(mainImgThumb.length < 1) mainImgThumb = firstImgThumb;
		mainImgThumb.trigger(jQuery.Event("click.fndtn.clearing", { target: mainImgThumb.find('img').get(0) }));
	});
	
	// ALERT BOXES - clear empty ones
	$('.alert-box').each(function(){
		if($(this).find('div').length > 0 && !$(this).hasClass('none')) $(this).show();
		if($(this).find('div').is(':empty')) $(this).hide();		
	});
	
	// FOLDED-INFO
	$('body').on('click','.folded-info-link',function(event){
		event.preventDefault();
		
		var foldedinfopanel = $(this).next('.folded-info');
		if(foldedinfopanel.length == 0) foldedinfopanel = $(this).parent().next('.folded-info');
		
		if(foldedinfopanel.is(':hidden'))
		{
			foldedinfopanel.show(200);
			$(this).addClass('open');
		}
		else
		{
			foldedinfopanel.hide(200);
			$(this).removeClass('open');
		}
	});
	
	// TOP NAVIGATION -- add required foundation classes for dropdowns
	$('.categories-top ul ul,.categories-drop ul,.categories-mega > ul > li > ul').each(function(){ $(this).addClass('dropdown').parent().addClass('has-dropdown'); });

	// MEGA-MENU
	$('.categories-mega .has-dropdown').each(function(){
		var menu_link = $(this);
		var menu = menu_link.find('.dropdown');
		var columns = menu.children('li').not('.back');
		
		// if there are third level categories in the menu
		if( menu.find('ul').length > 0 )
		{
			// equalize column heights in each dropdown
			var col_tallest = 0;
			columns.each(function(){ var col_height = $(this).outerHeight(true); if( col_height > col_tallest ) col_tallest = col_height; });
			columns.css('min-height',col_tallest+'px');
			
			// move right of center menus to left side
			var menu_link_pos = menu_link.position();
			if(menu_link_pos.left > $('.top-bar').width() / 2)
			{
				var right_offset = (menu.width() - columns.length * columns.width()) * -1;
				menu.css('left','auto').css('right',right_offset+'px');
			}
		}
		else
			menu.addClass('no-third-level');
	});
	
	// PRODUCT TAB - VIDEO
	$('.videoRow').click(function(){
		$('.VideoSingleTitle').text( $(this).find('img').attr('title') );
	});

	// QUICK SEARCH
    if(typeof QuickSearch !== "undefined")
    {
	    QuickSearch.search_done = function(response){
	    	//console.log(response);
		    // Cache results
			var cache_name = $('#search_query').val().length+$('#search_query').val();
			QuickSearch.cache[cache_name] = response;
	
			$('.QuickSearch').remove();
			
			var QS_table = $('<table class="QuickSearch" cellspacing="0" cellpadding="0" border="0"></table>')

			// found results?
			if($('result', response).length > 0) {
			
				var counter = 0;
				$('result', response).each(function(){
					var tr_html = $(this).text();
					
					// pull rating number from image / replace image so it isnt requested
					var RatingNum = tr_html.match(/<img src=".+IcoRating(\d+).gif" class="RatingIMG" \/>/i);
					if(RatingNum !== null && typeof RatingNum[1] !== 'undefined') {
						RatingNum = RatingNum[1];
						tr_html = tr_html.replace(/<img src=".+IcoRating(\d+).gif" class="RatingIMG" \/>/i, '<span class="ProductRating ProductRating'+RatingNum+'"><i class="icon-rating-'+RatingNum+'"></i></span>');
					}
					
					var tr = $( tr_html );
					var url = $('.QuickSearchResultName a', tr).attr('href');
					
					var tmpCounter = counter;
					
					$('.QuickSearchResultMeta .Price',tr).attr('class','ProductPrice');
					
					tr.attr('id','QuickSearchResult'+counter);
					tr.attr('class','QuickSearchResult');
					
					tr.bind('mouseover', function() { QuickSearch.item_selected = true; QuickSearch.highlight_item(tmpCounter, false); });
					tr.bind('mouseup', function() { window.location = url; });
					tr.bind('mouseout', function() { QuickSearch.item_selected = false; QuickSearch.unhighlight_item(tmpCounter) });
					
					QS_table.append( tr );
					counter++;
				});
				
				// More results than we're showing?
				if($('viewmoreurl', response).length > 0)
				{
					// get link
					var all_results_link = $('viewmoreurl', response).text();
					
					// build link row
					var all_results_row = $('<tr class="QuickSearchAllResults"><td colspan="2">'+all_results_link+'</td></tr>');
					all_results_row.bind('mouseover',function() { QuickSearch.over_all = true; });
					all_results_row.bind('mouseout',function() { QuickSearch.over_all = false; });
					
					// append link row
					QS_table.append( all_results_row );
				}
				
				// add QuickSearch to DOM
				$('.search-form').append(QS_table);
			}
	
			
	    };
        QuickSearch.hide_popup = function(){
			$('.QuickSearch').remove();
			QuickSearch.selected = null;
		};
    }

	
	// FAST CART
	if(config.FastCart)
	{
		// attach fast cart event to all 'add to cart' link
		$(".ProductActionAdd > a").click(function(event) {
			return fastCart($(this));
		});
	}

	// QUICK VIEW
	if(quickViewActive)
	{
		$(".product-grid").on('click','.quickview',function(event){
			event.preventDefault();
			
			var pid = $(this).closest('li').attr('data-product');
			var endpoint = config.ShopPath + '/remote.php?w=getproductquickview';
			endpoint = endpoint.replace(/^http[s]{0,1}:\/\/[^\/]*\/?/, '/');
			
			$.get(endpoint, { pid: pid }, function(resp) {

				if (resp.success && resp.content) {
					
					// share button fix
					window.addthis = null;
					
					$("#QuickView").reveal();
					$('#QuickView > div').html(resp.content);
					
					$('#productDetailsAddToCartForm').validate({
						onsubmit: false,
						ignoreTitle: true,
						showErrors: function (errorMap, errorList) {
							// nothing
						},
						invalidHandler: function (form, validator) {
							if (!validator.size()) {
								return;
							}
			
							alert(validator.errorList[0].message);
						}
					});
				}
			});
		});
	}
	
	// TOP NAVIGATION - EVEN SPACING - INITIAL CALL / EVENT ATTACHING
	if(topBarEvenSpacing)
	{
	    topBarEven(topBarLastItem, topBarAllLinks);
	    
	    $(window).resize(function () {
			waitForFinalEvent(function(){
				topBarEven(topBarLastItem, topBarAllLinks);
			}, 500, "topBarEvenResize");
		});
	}
});

// TOP NAVIGATION - EVEN SPACING
function topBarEven(topBarLastItem, topBarAllLinks)
{
	var padding = 15;
	var max_padding = 100;
	var incr = 0;
	
	// add padding to all elements until the last item wraps
	while(topBarLastItem.yPosition() == 0 && padding <= max_padding)
	{
		padding++;
		topBarAllLinks.css('padding','0 ' + padding + 'px');
	}
	// back it up by 1
	padding--;
	topBarAllLinks.css('padding','0 '+padding+'px');
	
	
	// add padding to the last element until it wraps
	while(topBarLastItem.yPosition() == 0 && padding <= max_padding)
	{
		padding++;
		topBarLastItem.children('a').css('padding-right',padding + 'px');
	}
	// back it up by 1
	padding--;
	topBarLastItem.children('a').css('padding-right',padding + 'px');
}

jQuery.fn.yPosition = function() {
    var position = this.position();
	return position.top; 
};

// REQUIRED FOR ABILITY TO ATTACH CODE TO 'FINISHED RESIZING' EVENT
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();


//////////////////////////////////
// CALL / BIND HELPER FUNCTIONS //
//////////////////////////////////

// HELPERS NOT REQUIRING READY PAGE
applyProductThumbWidth();

// HELPER / PLUGIN CALLS ON READY
$(document).ready(function(){

	prepareMenu();
	prepareCarousel();
	
	$(".slide-heading").fitText(1.5);
	$(".slide-text").fitText(2);
});

// HELPER / PLUGIN CALLS ON LOAD (after images)
$(window).load(function() {
	updateOnSaleBadge();
	
	productGridEvenImages();
	productGridEvenBoxes();
	
	productPageEvenImages();
});

if($('body').hasClass('facets')) {
	var $noProdsAlert = $('<div class="alert-box no-prods-alert"><div>No products match those criteria.</div><a href="" class="close">&times;</a></div>');
	$(document).ajaxComplete(function() {
		if($('section.main .ProductList li').length == 0) {
			$('section.main .ProductList').before($noProdsAlert);
			$noProdsAlert.show();
			$('.ProductCompareSelectedButton,.SortBox').hide();
		} else {
			$noProdsAlert.remove();
			$('.ProductCompareSelectedButton,.SortBox').show();
			productGridEvenImages();
			productGridEvenBoxes();
		}
	});
}

// BIND HELPER FUNCTION CALLS TO WINDOW RESIZE
$(window).resize(function () {
	waitForFinalEvent(function(){
	
		applyProductThumbWidth();
		updateOnSaleBadge();
		productGridEvenImages();
		productGridEvenBoxes();
		productPageEvenImages();
		
	}, 100, "templateHelpers");
});

////////////////////
// TOP NAVIGATION //
////////////////////

// Adjust menu on resize / screen rotation
var mainmenu = $('.main-menu');
$(window).bind('resize orientationchange', function() {
	if(windowWidth() <= 768) mainmenu.hide();
	waitForFinalEvent(function(){
		adjustMenu();
		$('.main-menu').show();
	}, 100, "adjustNavMenu");
});

var prepareMenu = function() {
	$(".nav > ul").removeClass('sf-menu sf-vertical sf-js-enabled');

	// add page menu into ul
	$('.nav > ul > li:last').addClass('last-category-menu-link');
	
	if($('.nav > ul').length == 0) $('.nav').append('<ul></ul>'); // add UL if there is no category menu
	
	// move page menu links into main <ul>
	if($(".toggleMenu").next().is('.page-menu-link'))
		$('.nav > ul:first').prepend( $('.nav .page-menu-link') );
	else
		$('.nav > ul:first').append( $('.nav .page-menu-link') );

	// adjustments for menus with dropdowns
	$(".nav li a").each(function() {
		var dropdown = $(this).next('ul:not(:empty)');
		
		// remove empty menus
		var dropdown_menuitems = dropdown.children();
		if(dropdown_menuitems.length == 0) dropdown.remove();
		
		if (dropdown.length > 0 && dropdown_menuitems.length > 0) {
			$(this).addClass("parent");
			$(this).after('<a href="'+$(this).attr('href')+'" class="parent-expand-link"></a>');
		};
	})
	
	$(".toggleMenu").click(function(e) {
		e.preventDefault();
		$(this).toggleClass("active");
		$(".nav > ul").toggle();
	});
	
	adjustMenu();
};

var adjustMenu = function() {
	$('.product-thumbs').css('left','0');

	if (windowWidth() <= 768) { // mobile
		$(".toggleMenu").css("display", "inline-block");
		if (!$(".toggleMenu").hasClass("active")) {
			$(".nav > ul").hide();
		} else {
			$(".nav > ul").show();
		}
		$(".nav li").unbind('mouseenter mouseleave');
		$(".nav li a.parent + .parent-expand-link").unbind('click').bind('click', function(e) {
			// must be attached to anchor element to prevent bubbling
			e.preventDefault();
			
			$(this).parent("li").toggleClass("hover");
		});
		
		// move top menu
		$('.nav > ul').append( $('.account-links li') );
		$('.top-menu').hide();
		
		// adjust menu positioning
		var menu_reverse_offset = $('.logo').height() / 2;
		var menubutton_height = 42;
		$('.main-menu').css('margin-top','-'+(menu_reverse_offset+menubutton_height/2)+'px');
		$('.main-menu .category-list').css('margin-top',(menubutton_height+menu_reverse_offset)+'px');
		
	} 
	else if (windowWidth() > 768) { // desktop
		$(".toggleMenu").css("display", "none");
		$(".nav > ul").show();
		$(".nav li").removeClass("hover");
		$(".nav li a").unbind('click');
		$(".nav li").unbind('mouseenter mouseleave').bind('mouseenter mouseleave', function() {
		 	// must be attached to li so that mouseleave is not triggered when hover over submenu
		 	$(this).toggleClass('hover');
		});
		
		// move top menu
		$('.account-links ul').append( $('.nav .top-menu-link') );
		$('.top-menu').show();
		
		// adjust menu positioning
		$('.main-menu').css('margin-top','0');
		$('.main-menu .category-list').css('margin-top','0');
	}
}

//////////////
// FANCYBOX //
//////////////

// MAIN IMAGE OPENS FANCYBOX
$('.main-image-link').on('click',function(event){
	event.preventDefault();

	var currentThumb = $('.product-thumbs .active').index();

	$.fancybox.open($(".product-thumbs a"),{
		index : currentThumb,
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 80,
				height	: 80
			}
		}
	});
});

/////////////////////////////////////
// PRODUCT PAGE CAROUSELS / ZOOMIE //
/////////////////////////////////////

// Adjust menu on resize / screen rotation
$(window).bind('resize orientationchange', function() {
	waitForFinalEvent(function(){
		prodCarousel();
	}, 100, "adjustCarousel");
});

var prodCarousel = function() {
	if (windowWidth() <= 480) {
		mobileCarousel();
	}
	else if (windowWidth() > 480) {
		desktopCarousel();
	}
}

var prodThumbs;
var prepareCarousel = function() {
	// make some markup changes for the carousel
	prodThumbs = $('.product-thumbs');
	prodThumbs.wrap('<div class="thumb-nav-wrap"></div>');
	prodThumbs.wrap('<div class="thumb-wrap"></div>');
	prodThumbs.find('li:first').addClass('active');
	
	prodCarousel();
	
	// INITIAL ZOOMIE SET UP
	if($('.main-image').length > 0 && ShowImageZoomer) {
		var fullSrc = $('.main-image-link').attr('href');
		$('.main-image').data('full-src', fullSrc).zoomie();
	}
	
	// THUMB IMAGES SWITCH WITH MAIN IMAGE
	prodThumbs.find('a').on('click',function(event){
		event.preventDefault();
	
		// update main image
		var newImg = $(this).attr('href');
		$('.main-image').attr('src',newImg);
		$('.main-image-link').attr('href',newImg);
		
		// update zoomie plugin
		if($('.main-image').length > 0 && ShowImageZoomer) {
			var fullSrc = $('.main-image-link').attr('href');
			//$('.zoomie-window').css('background-image','url('+fullSrc+')');
			$('.main-image-link > .zoomie').replaceWith( $('.main-image') ); // remove zoomie
			$('.main-image').removeData('plugin_zoomie');
			$('.main-image').data('full-src', fullSrc).zoomie(); // re-init zoomie
		}
		
		// update active state of thumbnail
		prodThumbs.find('.active').removeClass('active');
		$(this).parent().addClass('active');
	});
};

var mobileCarousel = function() {
	var imgWidth = $('.product-images').width() * .8;
	var prevImgWidth = $('.product-images').width() * .1;		
	var numImgs = prodThumbs.children().length;

	// adjust width of thumbs (no longer percentage based)
	// moving ul wide enough for all thumbs
	if(numImgs == 1) {
		prodThumbs.parents('.thumb-nav-wrap').addClass('singleImage');
	}
	else if(numImgs > 1) {
		prodThumbs.children().width(imgWidth);
		prodThumbs.width( imgWidth * numImgs );
	}
	
	// slide Navigation
	if( $('.thumb-nav-wrap > ul').length == 0 )
	{
		var slideNav = $('<ul></ul>');
		for(var i=1;i<=numImgs;i++) slideNav.append('<li><a href="#"'+(i==1 ? ' class="active"' : '')+'>'+i+'</a></li>');
		$('.thumb-nav-wrap').append(slideNav);
	}
	
	// EVENTS
	var skipToSlide = function(x){
		x--;
		$('.thumb-nav-wrap > ul .active').removeClass('active');
		$('.thumb-nav-wrap > ul > li:eq('+x+') a').addClass('active');
	
		var leftpos = imgWidth * x;
		if(x>0) leftpos -= prevImgWidth;
		
		leftpos *= -1;
		
		prodThumbs.animate({
			left: leftpos,
		}, 600, function() {
			// Animation complete.
		});
		
		var activeindex = $('.thumb-nav-wrap > ul .active').parent().index();
		var lastindex = $('.thumb-nav-wrap > ul li:last').index();
		if(activeindex > 0) $('.mobile-prev').fadeIn(250);
		if(activeindex == 0) $('.mobile-prev').fadeOut(250);
		
		if(activeindex < lastindex) $('.mobile-next').fadeIn(250);
		if(activeindex == lastindex) $('.mobile-next').fadeOut(250);
	};
	
	var nextSlide = function(){
		var nextSlide = parseInt( $('.thumb-nav-wrap > ul .active').text() ) + 1;
		if(nextSlide > numImgs) nextSlide = 1;
		skipToSlide(nextSlide);
	};
	
	var prevSlide = function(){
		var prevSlide = parseInt( $('.thumb-nav-wrap > ul .active').text() ) - 1;
		if(prevSlide < 1) prevSlide = numImgs;
		skipToSlide(prevSlide);
	};

	if( $('.mobile-next').length == 0 )
	{
		var iconheight = $('.thumb-wrap').height() / 2 - 5;
		$('.thumb-wrap').prepend('<a href="#" class="mobile-prev" style="padding-top:'+iconheight+'px"><i class="icon-chevron-left"></i></a>');
		$('.thumb-wrap').append('<a href="#" class="mobile-next" style="padding-top:'+iconheight+'px"><i class="icon-chevron-right"></i></a>');
		
		$('.mobile-prev').on('click',function(event){
			event.preventDefault();
			
			if(!prodThumbs.is(':animated'))
				prevSlide();
		});
		
		$('.mobile-next').on('click',function(event){
			event.preventDefault();
		
			if(!prodThumbs.is(':animated'))
				nextSlide();
		});
		
	}
	
	if(numImgs == 1)
		$('.mobile-next').hide();
	
	prodThumbs.touchwipe({
		wipeLeft: function() {
			if(!prodThumbs.is(':animated'))
				nextSlide();
		},
		wipeRight: function() {
			if(!prodThumbs.is(':animated'))
				prevSlide();
		},
		min_move_x: 20,
		min_move_y: 20,
		preventDefaultEvents: false
	});
	
	$('.thumb-nav-wrap > ul a').on('click',function(event){
		event.preventDefault();
	
		var slide = parseInt( $(this).text() );
		skipToSlide(slide);
	});
};

var desktopCarousel = function() {
	prodThumbs.attr('style','');

	// Product Detail Carousel
	var numInRow = 4;
	var thumbWidth = $('.product-images').width() / numInRow;
	
	var numThumbs = prodThumbs.children().length;
	
	var rightSideMax = ((thumbWidth * numThumbs) - (thumbWidth * numInRow)) *-1;
	
	// adjust width of thumbs (no longer percentage based)
	prodThumbs.children().width(thumbWidth);
	
	if( numThumbs > numInRow )
	{
		// moving ul wide enough for all thumbs
		prodThumbs.width( thumbWidth * numThumbs );	
		
		// add nav links
		var prevLink = $('<a href="#" class="prev"><i class="icon-chevron-left"></i></a>');
		var nextLink = $('<a href="#" class="next"><i class="icon-chevron-right"></i></a>');
		if($('.thumb-nav-wrap .prev').length == 0)
		{
			$('.thumb-nav-wrap').prepend(prevLink).append(nextLink);
		
			// EVENTS
			nextLink.on('click',function(event){
				event.preventDefault();
			
				if(! prodThumbs.is(':animated')) {
					if( prodThumbs.position().left > rightSideMax )
					{	
						var thumbWidth = $('.product-images').width() / numInRow;
						prodThumbs.width( thumbWidth * numThumbs );
						prodThumbs.animate({
							left: '-='+thumbWidth,
						}, 400, function() {
							// Animation complete.
						});
					}
					else
					{
						prodThumbs.animate({
							left: 0,
						}, 400, function() {
							// Animation complete.
						});
					}
				}
			});
			
			prevLink.on('click',function(event){
				event.preventDefault();
			
				if(! prodThumbs.is(':animated')) {
					if( prodThumbs.position().left < 0 )
					{	
						var thumbWidth = $('.product-images').width() / numInRow;
						prodThumbs.width( thumbWidth * numThumbs );
						prodThumbs.animate({
							left: '+='+thumbWidth,
						}, 400, function() {
							// Animation complete.
						});
					}
					else
					{
						prodThumbs.animate({
							left: rightSideMax,
						}, 400, function() {
							// Animation complete.
						});
					}
				}
			});
		} // if($('.thumb-nav-wrap .prev').length == 0)
	} // if( numThumbs > numInRow )
};




//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function updateOnSaleBadge() {

	$('.product-grid .RetailPriceValue').each(function(){
		var li = $(this).closest('li');
		var imagelink = li.find('.ProductImage a')
		
		var badge_diameter = imagelink.width() * .24; //changed from .25 to avoid cutoff at top
		var badge_radius = badge_diameter/2;
		var font_size = badge_radius/2.5;
		
		// get badge
		var onsalebadge = li.find('.on-sale-badge');
		var created_badge = false;
		if(onsalebadge.length == 0) {
			created_badge = true;
			onsalebadge = $('<span class="on-sale-badge">Sale</span>');
		}
		
		// adjust onsale badge dimensions
		onsalebadge.width(badge_diameter).height(badge_diameter).css({
			//‘ margin' : '-'+badge_radius+'px 0 0 -'+badge_radius+'px',
			'margin' : '-'+2*badge_radius+'px 0 0 '+badge_radius+'px',
			'line-height' : badge_diameter+'px',
			'font-size' : font_size + 'px'
		});
		
		// add badge to page
		if(created_badge)
		{
			imagelink.append(onsalebadge);
			onsalebadge.fadeIn();
		}
		
	});
	
}

// Apply ProductThumbWidth
function applyProductThumbWidth()
{
	if($('.details-row').width() == 1000) {
		$('.product-images').css('width',ProductThumbWidth+'px');
		var details_width = $('.details-row').width() - ProductThumbWidth;
		$('.product-details').css('width',details_width+'px');
	}
	else {
		$('.product-images,.product-details').attr('style','');
	}
}

// EQUAL PRODUCT BOX IMAGES
function productGridEvenImages() {
	var maxHeight = 0;
	var product_images_divs = $('.ProductImage');
	var product_images = $('.ProductImage img');
	product_images.each(function(){
		var imgHeight = $(this).height();
		if(maxHeight < imgHeight) maxHeight = imgHeight;
	});
	product_images_divs.each(function(){ $(this).height(maxHeight); });
	
	/*
maxHeight = 0;
	var product_name = $('.ProductName');
	product_name.each(function(){
		var nameHeight = $(this).height();
		if(maxHeight < nameHeight) maxHeight = nameHeight;
	});
	if(maxHeight > 0)
		product_name.each(function(){ $(this).height(maxHeight); });
*/
}

// MAKE MAIN IMAGE AREA AS TALL AS LARGEST IMAGE
function productPageEvenImages()
{
	var tallestImgHeight = 0;
	var tallestImgWidth;
	
	$('.product-thumbs .thumb-image img').each(function(){
		var $img = $(this);	
		var imgHeight = $img[0].naturalHeight;
	
		if(imgHeight > tallestImgHeight) {
			tallestImgHeight = imgHeight;
			tallestImgWidth = $img[0].naturalWidth;
		}
	});
	
	var ratio = tallestImgWidth / $('.main-image-link').width();
	if(ratio < 1) ratio = 1;
	
	var scaledHeight = tallestImgHeight / ratio;
	
	$('.main-image-link').css('min-height',scaledHeight+'px');	
}

// EQUAL PRODUCT BOX HEIGHTS
function productGridEvenBoxes() {
	$('.product-grid').each(function(){
		var grid = $(this);
		var boxes = grid.find('li');
		
		boxes.each(function(){ $(this).attr('style',''); }); // clear previous inline styles
		
		// find max height
		var maxHeight = 0;
		boxes.each(function(){
			var thisHeight = $(this).outerHeight(true);
			if(maxHeight < thisHeight) maxHeight = thisHeight;
		});
		
		// apply max height
		if(maxHeight > 0)
			boxes.each(function(){ $(this).css('min-height', maxHeight + 'px'); });
	});
}

$('#change-currency').on('click',function(e) {
	e.stopPropagation();
	$('#currency-chooser .currencies').toggle();
	$(window).on('click', function() { $('#currency-chooser .currencies').hide(); });
});


/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {
    
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
 
    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold : 0});
        }
    });
 
    
})(jQuery);
