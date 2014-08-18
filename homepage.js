$(function() {
	$('#nav-wrapper').height($('#nav').height());
})

$(window).resize(
	function checkWidth() {
		var fullTitle = ($('#title_container').css("padding-top") == "70px")
		if (fullTitle && $('#cover_space').width() < 466) {
			$('#title_container').css({"padding-top":"10px"});
		}
		else if (!fullTitle && $('#cover_space').width() > 466) {
			$('#title_container').css({"padding-top":"70px"});
		}
	}
)