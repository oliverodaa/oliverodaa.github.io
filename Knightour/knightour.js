var size = 8;
var col = 0;
var row = 0;
var speed = 1000;
var currentTour = 0;
var globalPosition = [];

function startKnightour() {
	currentTour ++
	// receving input
	changeSize();
	changeCol();
	changeRow();
	changeSpeed();
	// applying game
	resetHtmlBoard()
	setTimeout(resetHtmlBoard,speed-1);
	console.log("col is "+col)
	console.log("row is " + row)
    var coordinateList = knightour(createPosition(),col,row,[]);
    console.log("in start, it's " + coordinateList)
	animateBoard(coordinateList,0,currentTour)
}

function changeSize() {
	var sizeInput = document.getElementById("board_size").value;
	if (!isNaN(sizeInput) && sizeInput > 0 && sizeInput < 101) {
		size = sizeInput;
		if (size <= col) {
			col = size - 1;
		}
		if (size <= row) {
			row = size - 1;
		}
		updateSummary();
	}
	else if (sizeInput != "") {
		changeMessageBar("Sorry, board size must be a positive number no greater than 100.");
	}
}

function changeCol() {
	var colInput = document.getElementById("start_col").value;
	if (!isNaN(colInput) && colInput > 0 && colInput < parseInt(size)) {
		col = parseInt(colInput);
		updateSummary();
	}
	else if (colInput != "") {
		changeMessageBar("Sorry, column input must be a number small enough to fit on the board.");
	}
}

function changeRow() {
	var rowInput = document.getElementById("start_row").value;
	if (!isNaN(rowInput) && rowInput > 0 && rowInput < parseInt(size)) {
		row = parseInt(rowInput);
		updateSummary();
	}
	else if (rowInput != "") {
		changeMessageBar("Sorry, row input must be a number small enough to fit on the board.");
	}
}

function changeSpeed() {
	var speedInput = document.getElementById("speed").value;
	if (!isNaN(speedInput) && speedInput > 0) {
		speed = speedInput*1000;
		updateSummary();
		if (speedInput > 30) {
			changeMessageBar("You want to wait 30 seconds for each animation? Your choice I guess.")
		}
	}
	else if (speedInput != "") {
		changeMessageBar("Time doesn't work like that. You're just being silly.")
	}
}

function updateSummary() {
	document.getElementById("summary").innerHTML = "The board will be "+size+" by "+size+" and the starting coordinates will be "+row+","+col+". The speed will be "+speed/1000+"s per move."
}

function changeMessageBar(text) {
	document.getElementById("message").innerHTML = "<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button><p>" + text + "</p></div>"
}

function animateBoard(coordinateList,i,tourNum) {
	console.log("coordinateList is " + coordinateList)
	function callWithTimeout(i) {
		setTimeout(function () {animateBoard(coordinateList,i,tourNum)},speed)
	}
	var localCol = coordinateList[i][0];
	var localRow = coordinateList[i][1];
	changeCellClass(localCol,localRow,"currentKnight");
	if (i>0) {
		prevCol = coordinateList[i-1][0];
		prevRow = coordinateList[i-1][1];
		if (blackOrWhite(prevCol,prevRow) == "'whiteSquare'") {
			changeCellClass(prevCol,prevRow,"usedSquareWhite");
		}
		else {
			changeCellClass(prevCol,prevRow,"usedSquareBlack");
		}
	}
	if (tourNum==currentTour && i<coordinateList.length) {
		callWithTimeout(i+1);
	}
}

function changeCellClass(thisCol,thisRow,className) {
	document.getElementById(thisCol.toString()+","+thisRow.toString()).className = className;
}

function resetHtmlBoard() {
	// Creates an HTML table with id="row,col" 
	// and class="whiteSquare"/"blackSquare"
	var HTML_Board = ["<table id='knightourBoard'>"];
	for (var tableRow=size-1; tableRow>=0;tableRow--) {
		HTML_Board.push("<tr>");
		for (var tableCol=0;tableCol<size;tableCol++) {
			HTML_Board.push("<td class="+blackOrWhite(tableRow,tableCol)+"id="+tableRow.toString()+","+tableCol.toString()+"></td>")
		}
		HTML_Board.push("</tr>");
	}
	HTML_Board.push("</table>");
	HTML_Board = HTML_Board.join("");
	document.getElementById("theBoard").innerHTML = HTML_Board;
}

function blackOrWhite(row,col) {
	if ((row+col)%2 == 0) {
		return "'blackSquare'";
	}
	else {
		return "'whiteSquare'";
	}
}

function createPosition() {
	var position = []
	for (var i=0;i<size;i++) {
		position.push([]);
		for (var c=0;c<size;c++) {
			position[i].push("free");
		}
	}
	return position
}

function findNextMove(position,col,row) {
	var validSpots = validMoves(position,col,row);
	var lowestValue = 9;
	var bestRowCol = validSpots[0];
	for (var i=0;i<validSpots.length;i++) {
		var movesFromMove = validMoves(position,validSpots[i][0],validSpots[i][1]).length
		if (movesFromMove > 0 && movesFromMove < lowestValue) {
			lowestValue = movesFromMove;
			bestRowCol = validSpots[i];
		}
	}
	return bestRowCol
}

function validMoves(position,col,row) {
	var possibleMoves = [[row+1,col+2],[row+2,col+1],[row-1,col+2],[row-2,col+1],[row+2,col-1],[row+1,col-2],[row-1,col-2],[row-2,col-1]];
	var validMoves = []
	for (var i=0;i<possibleMoves.length;i++) {
		if (position[possibleMoves[i][1]] && position[possibleMoves[i][1]][possibleMoves[i][0]] == "free") {
			validMoves.push([possibleMoves[i][1],possibleMoves[i][0]]);
		}
	}
	return validMoves
}

function knightour(position,col,row,coordinateList) {
	coordinateList.push([col,row]);
	position[col][row] = "not";
	var nextMove = findNextMove(position,col,row);
	if (nextMove) {
		return knightour(position,nextMove[0],nextMove[1],coordinateList)
	}
	else {
		return coordinateList
	}
}

















