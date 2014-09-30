$(document).ready(function() {

	/** Height round **/
	$('.height-js').height($('.height-js').width());
	$('.height-js-content').height($('.height-js-content').width());
	var shadowHeight = $('.height-js-80').width() * 0.8;
	$('.height-js-80').height(shadowHeight);
	$('.height-js-bordered-80').height($('.height-js-bordered-80').width() * 0.8);
	$('.height-js-bordered').height($('.height-js-bordered').width());

	$('#main').css('marginTop', getMarginTop());


	/** Time **/
	setInterval( function() {
		var date = new Date();
		$('.hour').html(date.getHours());
		$('.minute').html(date.getMinutes());
	},1000);


	/** Navigation **/
	$('#plant').on('click', function(e) {
		e.preventDefault();
		switchToPlant();
	});

	$('header h1').on('click', function(e) {
		e.preventDefault();
		switchToHome(shadowHeight);
	});



	/** Demo alert **/
	$('#water h2').on('click', function(e) {
		e.preventDefault();
		warningElement('water');
	});

	$('#luminosity h2').on('click', function(e) {
		e.preventDefault();
		warningElement('luminosity');
	});
});

function getMarginTop() {
	return (($('#wrapper').height() - $('header').height() - $('footer').height()) / 2) - ($('#round').height() / 2) - 10;
}

function switchToPlant() {

	$('#wrapper').addClass('plant');
	$('#main').stop().animate({
		marginTop: 0
	});
	$('.temp').fadeTo(1000, 0);
	$('.hour-minute').fadeTo(800, 0);

	$('.shadow').stop().animate({
		height: '0'
	}, 1000, function() {
		$('header').removeClass('blue').addClass('green');
		$('footer').removeClass('blue').addClass('green');
		$('.shadow').hide();
	});
	$('#plant').stop().animate({
		borderWidth: '4px'
	}, 1000, function() {

	});
}

function switchToHome(h) {

	$('#wrapper').removeClass('plant');
	$('.shadow').show();
	$('#main').stop().animate({
		marginTop: getMarginTop()
	});
	$('.shadow').stop().animate({
		height: h
	}, 1000, function() {
		$('header').removeClass('green').addClass('blue');
		$('footer').removeClass('green').addClass('blue');
		$('.temp').fadeTo(500, 1);
		$('.hour-minute').fadeTo(200, 1);
	});
	$('#plant').stop().animate({
		borderWidth: '18px'
	}, 1000, function() {

	});
}

function warningElement(type) {
	switch(type) {
		case 'water':
			$('#warning').addClass('on').find('button').html('Arroser');
			$('#water').addClass('warning');
			break;
		case 'luminosity':
			$('#warning').addClass('on').find('button').html('Eclairer');
			$('#luminosity').addClass('warning');
			break;
	}
}