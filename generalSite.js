// ---------------------FUNCTION DEFINITIONS--------------------------- //

function checkWidth() {
	// This makes sure the title text doesn't look weird on resize
	var titleLength = $('#title').text().length;
	var oneLine = ($('#title_container').css("padding-top") == "70px")
	if (oneLine && $('#cover_space').width() < titleLength*30) {
		$('#title_container').css({"padding-top":"10px"});
	}
	else if (!oneLine && $('#cover_space').width() >= titleLength*30) {
		$('#title_container').css({"padding-top":"70px"});
	}
}

function resizeBoard() {
	// This makes sure that square boards are both square and not too big
	var spaceWidth = $('#boardDiv').width();
	var windowHeight = $(window).height();
	var maxWidth = windowHeight - 100;
	if (spaceWidth < maxWidth) {
		$('#boardBox').css({"margin":"0px"})
	}
	else {
		var paddingWidth = (spaceWidth - maxWidth)/2;
		$('#boardBox').css({"padding-left":paddingWidth.toString()+"px"});
		$('#boardBox').css({"padding-right":paddingWidth.toString()+"px"});
	}
	var boardSize = $('#theBoard').width();
	$('#theBoard').height($('#theBoard').width());
	$('#connectBoard td').height($('#theBoard').width()/7);
	if (boardSize == undefined) {
		var boardSize = 1;
	}
	// boardSize is defined in knightour.js
	$('#knightourBoard td').height($('#theBoard').width()/boardSize);
}

// ---------------------FUNCTION CALLS--------------------------- //

$(document).ready(function() {
	// This fills the gap left when the navbar becomes "sticky"
	$('#nav-wrapper').height($('#nav').height()+21);
})

$(document).ready(function () {
	var longTitle = ($('#title').text().length > 8);
	if (longTitle) {
		checkWidth();
	}
})

$(window).resize(checkWidth);

$(document).ready(function () {
	resizeBoard();
})

$(window).resize(resizeBoard);










