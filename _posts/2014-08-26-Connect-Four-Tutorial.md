---
title: How I Made Connect Four
layout: blog
---

# Introduction

When I decided to make an AI for Connect Four in my first Computer Science course, I knew it would be a challenge, but a rewarding one. 

Connect Four is a fantastic game for learning Computer Science techniques because the various elements that need to be recreated lend themselves logically to a programming language:

* The 7x6 structure of the board can be represented effectively by a list of lists (or array of arrays, in JavaScript's case)

* Its winning conditions - to get four tokens of the same colour in a row either diagonally, horizontally, or vertically - are challenging to check for efficiently, but it is entirely possible to do so.

* The fact that the game is turn-based and does not invoke any chance means that it's compatible with the [Minimax Algorithm](http://en.wikipedia.org/wiki/Minimax) for calculating computer moves. Writing an AI with minimax is a great way to practice the "leap of faith" that recursion requires.

<img src="/static/connectfour.png" width="300px">

### Complete Files for Reference

Before we begin, I want to share the completed files from my three attempts at a Connect Four algorithm.

#### Snap!

My original attempt was in the visual programming language, Snap! As it was my final project for CS10, Berkeley's introductory Computer Science course, I made [this video](https://www.youtube.com/watch?v=m4II3Jqfgjw) explaining it. I should warn you that I talk pretty quickly in the video; I had to speed the video up to fit class requirements!

#### Python

During the summer of 2014 I revisited the code because I wanted to implement a proper Minimax AI. While my Snap! implementation manually looked forward two and three moves to check for winning and losing choices, for the first time I was able to build a Minimax AI that would look forward as many moves as you told it to!

[Here's the Python file](/static/connect.py)

#### JavaScript

Following the Python implementation, I wanted to share my game more easily, but most people aren't comfortable playing a text-based terminal game. There were a couple of challenges that didn't occur in the Python version, and a lot of things that were made much easier in the JavaScript version. Namely:

* If you refer to an item of a list/array that does not exist in JavaScript you will get <code>undefined</code>, instead of the errors you get in Python. That saves a lot of <code>try:/except:</code> clauses when you're identifying patterns in a list of lists!

* JavaScript objects aren't <em>really</em> equivalent to Python dictionaries. A frustrating difference is that there is no easy way to calculate length without iterating through every single item. That means that when the code memoizes the values (win/lose/draw/"connection score") of various positions inside a JavaScript object, then counts the number of values in order to impress you with a large number, it's pretty inefficient.

* In both JavaScript arrays and Python lists, elements are mutable, meaning that it's a necessity to create brand new copies of a board position object every time you make a change. Otherwise something like simulating seven different move options will result in each of those simulations messing each other up.

* It's a challenge to tie together HTML, CSS, and JavaScript in order to have a pretty appearance. Even more challenging is understanding synchronous vs. asynchronous DOM changes. But I'll leave explaining that to a dedicated post.

Here is the [completed page](/connectfour/), and here is a link to [the JavaScript on its own](/connectfour/myscript.js)

# Explaining the Code

The code got extremely complex after a while, to the point where I needed to make myself a flow-chart to clarify how all the functions fit together. Unless you have an enormous monitor, you'll probably need to click on the image below in order to read it.

This flow chart will shape the order of the rest of the article, so feel free to open it in another window to follow along.

<a href="/static/ChartImg.png"><img src="/static/ChartImg.png" width="100%"></a>

## Basic Ideas and Definitions

It's important to start off with clear ideas about how you're going to represent the game. Here are some terms that I'm going to be throwing around that have specific definitions:

* The "board" is literally the board on which the game is played. When I use the word "board" in the context of the web implementation, I'm referring to the visual representation of the game.

* The word "position" refers to a particular setup of the board. If there are three white squares on the third column of the board then that's a distinct position from a board with only two white squares in that column.

* The "current player" is the player who is moving <em>next</em>, not the player who has just moved.

* The terms "win", "lose", and "draw", as well as the concept of a "connection score" refer to opposite things depending on who is currently playing. It's the nature of Connect Four that if player 1 wins, player 2 loses. Similarly, a high ratio of connections between player one and player two should be inverted depending on which player is currently playing.

* "Primitive Value" refers to the value of the position as it currently is. In contrast, "Position Value" refers to the real value of the position. For example, if I am guaranteed a win in five turns, then my current position is the equivalent of a "win". 

### Global and Local Positions
 
Two things are happening in the code:

1. The game is being played. <code>globalPosition</code> is used to take track of the game.
2. For each turn, the AI needs to look ahead a certain number of moves and return its move choice. The variable <code>position</code> is used for each of the thousands of positions that need to be simulated.

Both of these actions require us to keep track of the position. 

I chose to represent each board position as an array of arrays where the first seven arrays represent columns, and the eighth value represents the most recent column:

<pre>
var globalPosition = [[],[],[],[],[],[],[],false];
var testPosition = 
[['x', 'o', 'x', 'o', 'x', 'o'], 
['x', 'x', 'o'], 
['o'], 
['x', 'o', 'x', 'o', 'x', 'o'], 
['o', 'x', 'x'], 
['o'], 
['x', 'o', 'x', 'o', 'x', 'o'], 
4];
</pre>

You're probably wondering why it's necessary to include an eighth value representing the most recent move. The game would work perfectly fine without it, but think about how it would help to have the most recent move when checking for wins, losses, and draws.

Basically, if you know what the most recent move was and you can assume that nobody won the game before that, you can check for wins by counting vertically, horizontally, diagonally-up, and diagonally-down from a single point, rather than looking at the whole board.

### Basic Minimax Structure and Changing Difficulty

The challenging thing about Minimax is conceptualising <em>how</em> to look forward multiple moves. 

The goal of this function is to calculate the value of a single position from the perspective of the person who will move next. For example, in the image below, the value of the position from the perspective of white is "undecided". 

<img src="/static/connectfour2.png" width="300px">

Consider three scenarios:

* From your current position, all seven moves would lead to a victory for your opponent.

* From your current position, one of your moves would cause a loss for your opponent.

* From your current position, six moves would lead to a victory for your opponent, but one would lead to a draw.

What would be the position value of each of these positions from your perspective?

As you've probably deduced, the Minimax AI assumes that both players will take a win if they have one, and will take a loss only if they have no other choice.

#### The Position Value Function

While teaching CS10, [Dan Garcia](http://www.eecs.berkeley.edu/~ddgarcia/) shared a fantastic representation of the "position value" function.

<a href="/static/positionValue.png"><img src="/static/positionValue.png" width="450px"></a>

As you can see, the function is recursive! 

The base case of the function is that the position already has a "primitive value". In other words, a player has won, lost, or drawn.

If that is not the case, the function calculates the "position value" of each of the possible columns. Each of these position values is found by calling <code>positionValue</code> recursively on each possible position.

Doing so creates an array of values, for example:

<pre>
// Child values
['win','lose','lose','lose','lose','lose','draw']
</pre>

Recursion requires a leap of faith, so let's just assume those values are there and work for now.

From there, it does the same checks as our example above. However - and this is where Minimax can be confusing - it looks for "losses" and avoids "wins". That's because the "child values" are the values of the position from the perspective of our opponent, the next player to move.

In other words, our function maximizes the current player's success by minimizing the opponent's success.

In this particular case, our function would return "win", because at least one of the child values was a loss for our opponent.








