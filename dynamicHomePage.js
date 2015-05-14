// 1. Change image
// 2. Change highlighted menu item
// 3. Hide other two divs
// 4. Show new div
// 5. Change Title
$('.about').hide();
$('.resume').hide();
$('.projects').hide();

$(document).ready(function() {
	if (window.location.hash == "#projects") {
		currentPage = 3;
		$('.about').hide();
		$('.resume').hide();
		$('.projects').show();
		$('#About').removeClass("active");
		$('#Resume').removeClass("active");
		$('#Projects').addClass("active");
	} else if (window.location.hash == "#resume") {
		currentPage = 2;
		$('.about').hide();
		$('.projects').hide();
		$('.resume').show();
		$('#About').removeClass("active");
		$('#Projects').removeClass("active");
		$('#Resume').addClass("active");
	} else {
		currentPage = 1;
		$('.resume').hide();
		$('.projects').hide();
		$('.about').show();
		$('#Resume').removeClass("active");
		$('#Projects').removeClass("active");
		$('#About').addClass("active");
	}
})

function showAbout() {
	if (currentPage > 1) {
		var hideDir = 'right';
		var showDir = 'left';
	} else {
		var hideDir = 'left';
		var showDir = 'right';
	}
	currentPage = 1;

	$('.resume').hide("slide",{direction: hideDir},400);
	$('.projects').hide("slide",{direction: hideDir},400);
	$('.about').show("slide",{direction: showDir},400);

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