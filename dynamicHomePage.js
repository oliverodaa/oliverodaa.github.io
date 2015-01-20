// 1. Change image
// 2. Change highlighted menu item
// 3. Hide other two divs
// 4. Show new div
// 5. Change Title

$(document).ready(function() {
	$('.about').hide();
	$('.projects').hide();
	$('#content_space').height = $('.resume').height(); 
})
var currentPage = 2;

function showAbout() {
	$('#content_space').height = $('.resume').height(); 

	if (currentPage > 1) {
		var hideDir = 'right';
		var showDir = 'left';
	} else {
		var hideDir = 'left';
		var showDir = 'right';
	}
	currentPage = 1;

	$('.resume').hide("slide",{direction: hideDir},800);
	$('.projects').hide("slide",{direction: hideDir},800);
	$('.about').show("slide",{direction: showDir},800);

	$('#Resume').removeClass("active");
	$('#Projects').removeClass("active");
	$('#About').addClass("active");
};

function showResume() {
	if (currentPage > 2) {
		var hideDir = 'right';
		var showDir = 'left';
	} else {
		var hideDir = 'left';
		var showDir = 'right';
	}
	currentPage = 2;

	$('.about').hide("slide",{direction: hideDir},400);
	$('.projects').hide("slide",{direction: hideDir},400);
	$('.resume').show("slide",{direction: showDir},400);

	$('#About').removeClass("active");
	$('#Projects').removeClass("active");
	$('#Resume').addClass("active");
};

function showProjects() {
	$('#content_space').height = $('.projects').height(); 

	if (currentPage > 3) {
		var hideDir = 'right';
		var showDir = 'left';
	} else {
		var hideDir = 'left';
		var showDir = 'right';
	}
	currentPage = 3;

	$('.about').hide("slide",{direction: hideDir},400);
	$('.resume').hide("slide",{direction: hideDir},400);
	$('.projects').show("slide",{direction: showDir},400);

	$('#About').removeClass("active");
	$('#Resume').removeClass("active");
	$('#Projects').addClass("active");
};