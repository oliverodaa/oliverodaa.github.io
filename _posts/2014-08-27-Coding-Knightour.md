---
title: Coding the Knight's Tour
layout: blog
---

## Introduction

The Knight's Tour Problem is a lot of fun, and there are some fantastic big-picture ideas that come into play. This article mostly goes into the "meat" of the problems rather than other elements like the visualisation.

If you'd like to see the my full implementations in either Python (visualised in the terminal) or JavaScript/HTML/CSS, I've linked the completed projects below.

* [Python implementation](/static/knightour.py): This should be fairly simple to understand because the visualisation is simply rows of print statements. The solution in this file uses Warnsdorff's Rule with the brute-force approach as backup.

* [Web (JavaScript) implementation](/knightour/): The solution in this version is simple because it depends completely on Warnsdorff's rule. If you want to understand the visualisation I recommend using the debugging console on your browser (on Chrome you can access it by clicking "inspect element") because you're dealing with dependencies between HTML, CSS, website-wide style rules, and website-wide JavaScript rules.

## What is the Knight's Tour?

Imagine that you have a chess board and exactly one knight on that chess board. As in normal chess, the knight can move in an "L" shape in any direction. 

<img src="/static/knights-tour-animation.gif" height="220">
<em>By Hsilgneymerej (Own work) [Public domain], via Wikimedia Commons</em>

Your challenge is to move the knight around the board in such a way that it lands on each square exactly once. It's a tough challenge because there are so many combinations of moves, but given enough time most people can figure out a 5x5 board by trial and error.

## Two Solutions

Computers, of course, are perfect for a job like this: if you give them the right instructions. 

### Brute Force

Any programmer who is familiar with recursion will tell you right away that you can use a [pathfinding algorithm](http://en.wikipedia.org/wiki/Pathfinding). Conceptually this one is simple: the code evaluates every possible combination of moves, and returns a solution when it hits a correct one.

Here is a simplified version of how I did it in Python.

The board is represented by a list of lists and the output of this function is a board where each cell is numbered in order of visits by the knight.

<pre>
def find_tour(board,coordinates,n):
	row,col = coordinates[0],coordinates[1]
	board[row][col] = move_count
	if finished_check(board):
		return board
	else:
		for move in valid_moves(coordinates,board):
			try: return find_tour(board,move,move_count+1)
			except: pass
		raise Error("No valid tours.")
</pre>

Within that for-loop, you can see that <code>find_tour</code> gets called up to eight times (the number of valid moves for a knight on a chess board). Each of those calls represents a possible move, and from each of those new positions, there could be up to another eight moves.

As you can probably tell, the brute-force approach works, but it's inefficient. It takes O(2^n) time, growing exponentially as the board increases in size. So how can we find a solution that's faster?

### Warnsdorff's Rule

[Warnsdorff's Rule](http://en.wikipedia.org/wiki/Knight's_tour#Warnsdorff.27s_rule) is a [heuristic](http://en.wikipedia.org/wiki/Heuristic), or a rule of thumb for finding a solution. In short, Warnsdorff's Rule is as follows:

<blockquote>If there are multiple possible moves for the knight, move to the position from which you will have the fewest moves.</blockquote>

This heuristic actually works so reliably that when I [rewrote the code in JavaScript for the web](/knightour/), I didn't even include the brute force method as backup!

What about efficiency? Because Warnsdorff's Rule tells you best path at each step, you're essentially following a linear path that never diverges. That's O(n) time! Linear time is so quick that you can usually find a knight's tour on a 100x100 board without your browser freezing.

Here is my JavaScript implementation.

<pre>
function knightour(position,col,row,coordinateList) {
	coordinateList.push([col,row]);
	position[col][row] = "visited";
	var nextMove = findNextMove(position,col,row);
	if (nextMove) {
		return knightour(position,nextMove[0],nextMove[1],coordinateList);
	}
	else {
		return coordinateList;
	}
}
</pre>

In this one, findNextMove abstracts away the tedious process of counting the number of moves from each move. Note that, while this snippet of code is also recursive, it doesn't branch off at any point. I could just as easily have used a for loop. 

The function outputs a list of coordinates on the chess board. The reason why I had it output coordinates was to make the html/css visualisation easier to achieve, since I have each cell of the html board identified by its coordinates. 

# Conclusion

I hope my explanation of the Knight's Tour helps you to complete this very fun challenge. I've left out the explanation of the HTML/CSS/JavaScript integration because a large portion of that was fiddly and boring stuff like the error message if you enter 30 seconds in the "animation speed" box.

Feel free to contact me if I've made any errors, or if you'd like me to explain anything in more detail!