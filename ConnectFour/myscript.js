// TO FIX:
// - primitiveValue is returning wins before they happen [DONE]
// - disable column buttons when AI is calculating [KIND OF]
// - Provide difficulty slider and AI player choice
// - "message" shows "thinking..." then "AI has checked X possible postitions" [DONE]

var globalPosition = [[],[],[],[],[],[],[],false];
var testPosition = [['x', 'o', 'x', 'o', 'x', 'o'], ['x', 'x', 'o'], ['o'], ['x', 'o', 'x', 'o', 'x', 'o'], ['o', 'x', 'x'], ['o'], ['x', 'o', 'x', 'o', 'x', 'o'], 4];
// Player tokens: if 'x' is about to move, current_token = 'x'
var playerOneToken = "x";
var playerTwoToken = "o";
var global_current_token = playerOneToken;
var global_alt_token = playerTwoToken;
var globalGameWon = false
// AI Business
var ai_difficulty = 5;
var ai_token = global_alt_token;
// Primitive Values
var CONSTANT_WIN = 10000000000000000000000;
var CONSTANT_LOSE = -10000000000000000000000;
var CONSTANT_DRAW = 0;
var CONSTANT_UNDECIDED = "undecided";
// How many positions checked?
var positionsChecked = 0;

function startConnectFour() {
	// Called by "start new game" button
	// resetNumberedBoard
	// resetPosition
	changeDifficulty();
	globalGameWon = false;
	resetNumberedBoard(6,7);
	resetGlobalPosition();
	resetTokens();
	// resizeBoard is in homepage.js
	resizeBoard();
}

function changeDifficulty() {
	var diffInput = document.getElementById("AI_Difficulty").value;
	if (!isNaN(diffInput) && diffInput > 0 && diffInput < 10) {
		ai_difficulty = diffInput
	}
	document.getElementById("difficulty").innerHTML = "Difficulty is " + ai_difficulty;
}

function receiveMove(move) {
	if (globalGameWon) {
		changeMessageBar("Sorry, " + getPlayerName(global_alt_token) + " already won!")
	}
	else if (validColumn(globalPosition,move-1)) {
		setTimeout(function() {applyMove(move-1);},0);
	}
	else {
		changeMessageBar("Sorry, that move is not valid.");
	}
}

function applyMove(column) {
	// Called by receiveMove or AI
	showCalculations();
	updateGlobalPosition(column);
	updateBoard(globalPosition);
	swapToken();
	// Check for wins
	// --> Trigger game end
	// --> OR: trigger next player (maybe AI)
	var primValue = primitiveValue(globalPosition,false);
	if (primValue == CONSTANT_LOSE) {
		boardWin();
	}
	else if (draw(globalPosition)) {
		boardDraw();
	}
	else {
		if (global_current_token == ai_token) {
			changeMessageBar("Awaiting AI Move");
			setTimeout(function() {applyMove(AI_Move(clone(globalPosition),ai_difficulty));},50);
		}
	}
}

//--------Small Input-Side Helpers-------------------//

function validColumn(position,column) {
	// Columns 1 to 7
	function isNumber(column) {
		return !isNaN(column);
	}
	function insideBoard(column) {
		return column >= 0 && column <= 6;
	}
	function notFullColumn(position,column) {
		return position[column].length < 6;
	}
	return isNumber(column) && insideBoard(column) && notFullColumn(position,column);
}

function swapToken() {
	global_current_token = [global_alt_token,global_alt_token=global_current_token][0];
}

function getPlayerName(token) {
	if (token == ai_token) {
		return "The Computer"
	}
	else if (token == playerOneToken) {
		return "White"
	}
	else {
		return "Black"
	}
}

function createButtonRow(length) {
	var buttonRow = ["<tr class='buttonRow'>"];
	for (var col=1;col<=length;col++) {
		buttonRow.push("<td><button class='btn btn-default' onclick='setTimeout(function() {receiveMove("+col+")},0);'>" + 
						col.toString() + "</button></td>");
	}
	buttonRow.push("</tr>");
	return buttonRow.join("");
}

function boardDraw() {
	globalGameWon = true;
	changeMessageBar("It's a tie")
}

function boardWin() {
	globalGameWon = true;
	changeMessageBar(getPlayerName(global_alt_token) + " won!");
}

function changeMessageBar(text) {
	document.getElementById("message").innerHTML = text
}

function showCalculations() {
	changeMessageBar("The AI has checked " + positionsChecked + " positions")
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//-----------Create Board/Position-----------------------//

function resetNumberedBoard(rows,columns) {
	// Creates an HTML table with id="row,col" anc class="x"/"o"/"empty"
	var HTML_Board = ["<table id='connectBoard'>"];
	HTML_Board.push(createButtonRow(columns));
	for (var row=rows-1; row>=0 ;row--) {
		HTML_Board.push("<tr>");
		for (var col=0;col<columns;col++) {
			HTML_Board.push("<td class='empty' id=" + col.toString() + 
                      "," + row.toString() + "></td>");
		}
		HTML_Board.push("</tr>");
	}
	HTML_Board.push("</table>");
	HTML_Board = HTML_Board.join("");
	document.getElementById("theBoard").innerHTML = HTML_Board;
}

function resetGlobalPosition() {
	globalPosition = [[],[],[],[],[],[],[],false];
}

function resetTokens () {
	global_current_token = playerOneToken;
	global_alt_token = playerTwoToken;
	ai_token = playerTwoToken;
}

//--------Update Board/Position-----------------------//

function updateBoard(board) {
	// This refers to the board created in createNumberedBoard
	// It assumes 7 columns and 6 rows, where each row is a table cell
	// With id="col,row" and class="x"/"o"/"empty"
	// It also assumes that all other moves have already been visualised.
	var col = board[board.length-1];
	var row = board[col].length-1;
	// console.log(board);
	var token = board[col][row];
	document.getElementById(col.toString()+","+row.toString()).className = token;
}

function updateGlobalPosition(column) {
	globalPosition[column].push(global_current_token);
	globalPosition[globalPosition.length-1] = column;
}

//-----------Value of Position--------------------------------------//

function primitiveValue(position,realValue) {
	// realValue means that moves that lead to a win can return WIN
	positionsChecked += 1;
	if (fourInARow(position)) {
		// console.log("win?");
		return CONSTANT_LOSE;
	}
	else if (draw(position)) {
		// console.log("draw?");
		return CONSTANT_DRAW;
	}
	else {
		return heuristicValue(position);
	}
}

function findCurrentToken(position) {
	var lastMove = position[position.length-1];
	if (lastMove === false) {
		return playerOneToken;
	}
	else {
		if (position[lastMove][position[lastMove].length-1] == playerOneToken) {
			return playerTwoToken;
		}
		else {
     		return playerOneToken;
		}
	}
}

function findAltToken(position) {
	if (findCurrentToken(position) == playerOneToken) {
		return playerTwoToken;
	}
	else {
		return playerOneToken;
	}
}

function positionToString(position) {
	var stringOutput = [];
	for (var i=0;i<position.length-1;i++) {
		stringOutput.push(position[i].toString());
		stringOutput.push("/");
	}
	return stringOutput.join("");
}

//---------------DRAW--------------//

function draw(position) {
	return totalTokensOnPosition(position) == 42;
}

function totalTokensOnPosition(position) {
	var total = 0;
	for (var col=0;col<7;col++) {
		total += position[col].length;
	}
	return total;
}

//-------------COUNT FROM [COL,ROW]------------------------//

function countFrom(position,startCoordinates,player_token,up,right) {
	var count = 0;
	var blank_space = 0;
	var col = startCoordinates[0];
	var row = startCoordinates[1];
	while (count < 4) {
		col += right;
		row += up;
		if ((col < 0) || (col > 6) || (row < 0) || (row > 5)) {
			return [count,blank_space];
		}
		else if (position[col][row]===undefined) {
			return [count,blank_space+1];
		}
		else if (position[col][row]==player_token) {
			count ++;
		}
		else {
			return [count,blank_space];
		}
	}
	return [count,blank_space];
}

// The following functions have:
// a -> total adjacent tokens along axis
// b -> total empty space either end
// output -> [a,b]

function vert(position,startCoordinates,player_token) {
	var up = countFrom(position,startCoordinates,player_token,1,0);
	var down = countFrom(position,startCoordinates,player_token,-1,0);
	return [up[0]+down[0],up[1]+down[1]];
}

function horiz(position,startCoordinates,player_token) {
	var right = countFrom(position,startCoordinates,player_token,0,1);
	var left = countFrom(position,startCoordinates,player_token,0,-1);
	return [right[0]+left[0],right[1]+left[1]];
}

function diagUp(position,startCoordinates,player_token) {
	var upRight = countFrom(position,startCoordinates,player_token,1,1);
	var downLeft = countFrom(position,startCoordinates,player_token,-1,-1);
	return [upRight[0]+downLeft[0],upRight[1]+downLeft[1]];
}

function diagDown(position,startCoordinates,player_token) {
	var upLeft = countFrom(position,startCoordinates,player_token,1,-1);
	var downRight = countFrom(position,startCoordinates,player_token,-1,1);
	return [upLeft[0]+downRight[0],upLeft[1]+downRight[1]];
}

//-------------FOUR IN A ROW----------------//

function fourInARow(position) {
	var lastMove = position[position.length-1];
	if (lastMove === false) {
		return false;
	}
	else {
		var startCoordinates = [lastMove,position[lastMove].length-1];
		var last_token = findAltToken(position);
		return vert(position,startCoordinates,last_token)[0] >= 3 ||
	         horiz(position,startCoordinates,last_token)[0] >= 3 ||
	         diagUp(position,startCoordinates,last_token)[0] >= 3 ||
	         diagDown(position,startCoordinates,last_token)[0] >= 3;
	}
}

//--------------CONNECTION SCORE-------------//

function heuristicValue(position) {
	var current_token = findCurrentToken(position);
	var alt_token = findAltToken(position);
	var coordinateArray = coordinateArrayMaker(position);
	var scoreForCurrent = connectionScoreApplier(position,current_token,coordinateArray);
	var scoreForAlt = connectionScoreApplier(position,alt_token,coordinateArray);
	return scoreForCurrent - scoreForAlt;
}

function connectionScore(position) {
	var current_token = findCurrentToken(position);
	var alt_token = findAltToken(position);
	var coordinateArray = coordinateArrayMaker(position);
	var scoreForCurrent = connectionScoreApplier(position,current_token,coordinateArray);
	var scoreForAlt = connectionScoreApplier(position,alt_token,coordinateArray);
	return [scoreForCurrent,scoreForAlt];
}

function connectionScoreApplier(position,player_token,coordinateArray) {
	var allCoordinateScores = coordinateArray.map(function (x) {return bestConnection(position,x,player_token)});
	return allCoordinateScores.reduce(function(x,y) {return x+y;});
}

// From a particular empty cell, how many "potential 4s" are there?
// We don't want to double count because that cell could just be blocked
// vert, horiz, etc. return
// [a,b] where
// a = number of adjacent tokens (same token)
// b = number of empty spaces
function bestConnection(position,startCoordinates,player_token) {
	var axisArray = [
		vert(position,startCoordinates,player_token),
		horiz(position,startCoordinates,player_token),
		diagUp(position,startCoordinates,player_token),
		diagDown(position,startCoordinates,player_token)
	];

	var bestScore = 0;
	for (var i=0;i<4;i++) {
		var axis = axisArray[i];
		if (axis[0] >= 3) {
			return 2;
		}
		// e.g OX_X_
		else if (axis[0] == 2 && axis[1] >= 1) {
			bestScore = 1;
		}
		// e.g. _X__O
		else if (axis[0] == 1 && axis[1] == 2 && bestScore < 0) {
			bestScore = 0;
		}
	}
	return bestScore;
}

function coordinateArrayMaker(position) {
	var coordinateArray = [];
	var maxLength = maxColumn(position);
	for (var c=0;c<7;c++) {
		for (var r=0;r<=maxLength && r<6;r++) {
			if (r+1 > position[c].length) {
				coordinateArray.push([c,r]);
			}
		}
	}
	return coordinateArray;
}

function maxColumn(position) {
	var maxLength = 0;
	var length = 0;
	for (var i=0;i<7;i++) {
		length = position[i].length;
		if (length > maxLength) {
			maxLength = length;
		}
	}
	return maxLength;
}

//-----------------------AI MOVE------------------//

function AI_Move(position, depth) {
	// console.log(positionToString(position));
	var start = new Date();
	// -----
    var validMoves = validColumns(position);
    var minOppVal = CONSTANT_WIN;
    var minOppPos = validMoves[0]; // just in case all are bad moves
    var move;
    var moveValue;
    for (var i = 0; i < validMoves.length; i++) {
    	move = validMoves[i];
    	// console.log("move" + move);
    	// console.log(positionToString(position));
        moveValue = positionValue(position, depth, move, minOppVal);
        console.log("Move " + move + " is " + moveValue);
        if (moveValue == CONSTANT_LOSE) {
            return move;
        } else if (moveValue < minOppVal) {
            minOppVal = moveValue;
            minOppPos = move;
        }
    }
    // -------
    var end = new Date();
	console.log(end - start + " milliseconds");
	// -------
	console.log("Choose column " + minOppPos);
    return minOppPos;
}


function positionValue(position,depth,move,cutoff) {
	// Record previous move and set up current board
	// console.log(depth);
	// console.log(positionToString(position));
	// console.log("a");
	position[move].push(findCurrentToken(position));
	var prevMove = position.pop();
	position.push(move);

	// Check for wins
	var primValue = primitiveValue(position,true);
	if ((depth <= 0 && fullColumns(position) < 5) || primValue == CONSTANT_WIN || primValue == CONSTANT_LOSE || draw(position)) {
		undoMove(position, prevMove);
		// console.log("primvalue of " + move +": " + primValue);
		return primValue;
	}
	// return heuristic value
	// else if (fullColumns(position) < 5 && (depth <= 0 || isNaN(depth))) {
	// 	return -primValue;
	// }
	// go deeper
	else {
		// console.log("c");
		var stringPosition = positionToString(position); // for memoization

		validMoves = validColumns(position);
		childVals = [];
		var minOppVal = CONSTANT_WIN;

		for (var i = 0; i < validMoves.length; i++) {
			moveVal = positionValue(position, depth - 1, validMoves[i], minOppVal);
			if (moveVal == CONSTANT_LOSE) {
				undoMove(position, prevMove);
				return CONSTANT_WIN;
			}
			minOppVal = Math.min(moveVal, minOppVal);
			// console.log("minOppVal is " + minOppVal);
		    // Keep track of the worst situation I can make for my opponent.
            // IDEA 1: My parent is trying to minimize me and my "brothers"
            // IDEA 2: One of my "brothers" already got (positionValue of 3)
            // Therefore, if I can be sure of getting (positionValue >= 3) 
            //            ->  then our parent will ignore me
			if (-minOppVal >= cutoff) {
				undoMove(position, prevMove);
				return -minOppVal;
			}
		}
		undoMove(position, prevMove);
		// console.log("score is " + minOppVal);
		return -minOppVal;
	}
}

function childValues(childPos,depth) {
	return childPos.map(function (x) {return positionValue(x,depth-1);});
}

function validColumns(position) {
	return [0,1,2,3,4,5,6].filter((function (x) {return validColumn(position,x);}));
}

function childPositions(position,validCols) {
	var outputArray = [];
	for (var i in validCols) {
		outputArray.push(newPosition(position,validCols[i]));
	}
	return outputArray;
}

function fullColumns(position) {
	var count = 0;
	for (var i=0;i<7;i++) {
		if (position[i].length == 6) {
			count ++;
		}
	}
	return count;
}

function newPosition(position,column) {
	var copiedPosition = clone(position);
	copiedPosition.pop();
	copiedPosition[column].push(findCurrentToken(position));
	copiedPosition.push(column);
	return copiedPosition;
}

function undoMove(position, prevMove) {
	// console.log(">>>>>");
	// console.log(positionToString(position));
	// console.log("remove " + position[position.length-1] + ", " + position[position[position.length-1]].toString());

	position[position[position.length-1]].pop(); // Remove last thing from most recent column
	position[position.length-1] = prevMove; // Make position[7] the most recent move
	
	// console.log(positionToString(position));
	// console.log("<<<<<<");
}

function clone (existingArray) {
	// This was copied from http://stackoverflow.com/questions/9399369/how-to-copy-or-duplicate-an-array-of-arrays
	var newObj = (existingArray instanceof Array) ? [] : {};
	for (var i in existingArray) {
        if (existingArray[i] && typeof existingArray[i] == "object") {
        	newObj[i] = clone(existingArray[i]);
      	} else {
        	newObj[i] = existingArray[i];
    	}
   }
   return newObj;
}

function containsConnectionScore(childVals) {
	for (var i=0;i<childVals.length;i++) {
		if (typeof childVals[i] == "object") {
			return true
		}
	}
	return false
}

var testScores = [[1,2],[0,0],[1,0],[1,0],[1,0],[3,1],[2,0]]

function bestConnectionScore(childVals) {
	// This is from the perspective of the player about to move
	// Where childVal -> [myScore,oppScore]
	// Therefore optimise for max(myScore-oppScore)
	var bestScores = [];
	var bestBalance = -1000;
	var currentBalance = -1000;
	for (var i=0;i<7;i++) {
		if (typeof childVals[i] == "object") {
			if (childVals[i][1] === 0) {
				currentBalance = childVals[i][0] / 0.9;
			}
			else {
				currentBalance = childVals[i][0] / childVals[i][1];
			} 
			if (currentBalance > bestBalance) {
				bestBalance = currentBalance;
				bestScores = childVals[i];
			}
		}
	}
	return bestScores;
}

function reverseArraysInArray(parentArray) {
	var outputArray = []
	for (i=0;i<parentArray.length;i++) {
		outputArray.push(clone(parentArray[i]).reverse())
	}
	return outputArray
}