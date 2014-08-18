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
	$('#board_space').height($('#board_space').width()); 
}

$(document).ready(function () {
	resizeBoard();
	$(window).resize(resizeBoard);
})