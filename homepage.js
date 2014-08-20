// The point of this function is to make sure that
// when it changes to fixed position, the page 
// doesn't have a gap in it
$(function() {
	$('#nav-wrapper').height($('#nav').height());
})

function checkWidth() {
	var fullWidth = ($('#title_container').css("padding-top") == "70px")
	if (fullWidth && $('#cover_space').width() < 466) {
		$('#title_container').css({"padding-top":"10px"});
	}
	else if (!fullWidth && $('#cover_space').width() > 466) {
		$('#title_container').css({"padding-top":"70px"});
	}
}

$(document).ready(function () {
	var longTitle = ($('#title').text().length > 8);
	if (longTitle) {
		checkWidth();
		$(window).resize(checkWidth);
	}
})

function resizeBoard() {
	var spaceWidth = $('#boardDiv').width();
	var windowHeight = $(window).height();
	var maxWidth = windowHeight - 100;
	if (spaceWidth < maxWidth) {
		// console.log("good size")
		$('#boardBox').css({"margin":"0px"})
	}
	else {
		// console.log("spaceWidth is "+spaceWidth)
		// console.log("maxWidth is "+maxWidth)
		var paddingWidth = (spaceWidth - maxWidth)/2;
		// console.log("Changing padding to: " + paddingWidth.toString());
		$('#boardBox').css({"padding-left":paddingWidth.toString()+"px"});
		$('#boardBox').css({"padding-right":paddingWidth.toString()+"px"});
	}
	$('#theBoard').height($('#theBoard').width());
	$('#connectBoard td').height($('#theBoard').width()/7);
	$('#knightourBoard td').height($('#theBoard').width()/boardSize);
}

$(document).ready(function () {
	resizeBoard();
	$(window).resize(resizeBoard);
})