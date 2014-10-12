from string import ascii_lowercase
from time import sleep
import copy

emptyspot = "_"
successful_tours = []

#----------BASIC STRUCTURE AND VISUALISER-------------#

def create_board(size):
	board = []
	for i in range(size):
		row = []
		for r in range(size):
			row.append(emptyspot)
		board.append(row)
	return board

def finished_check(board):
	for row in board:
		for item in row:
			if item == "_":
				return False
	return True

def visualise_board(board):
	row_num = len(board)
	digits_of_largest = len(str(len(board)**2))
	for row in reversit(board):
		column_num = 0
		gap = ""
		while len(str(row_num)) + len(gap) < 5:
			gap += " "
		print(gap + str(row_num) + ":  ", end="")
		for item in row:
			item = str(item)
			column_num += 1
			while len(item) < digits_of_largest or len(item) < 3:
				item += " "
			if column_num < len(board):
				print(str(item) + " ",end="")
			else:
				print(item,end="\n")
		row_num -= 1
	bottom_labels = "        "
	for i in range(len(board)):
	 	bottom_labels += ascii_lowercase[i] + "   "
	print(bottom_labels)

#------------HELPER FUNCTIONS-------------#

# I just needed a non-destructive way to invert the "board" 
# for the visualisation, and I couldn't find it, so I just made it.
def reversit(lst):
	output = []
	counter = len(lst) - 1
	for item in range(len(lst)):
		output.append(lst[counter])
		counter -= 1
	return output

# A rowcol is just my name for the coordinates in a pair [row,col].
# valid_rowcols returns a list of the valid moves from a position.
def valid_rowcols(rowcol,board):
		def valid_rowcol(rowcol):
			row = rowcol[0]
			col = rowcol[1]
			return row >= 0 and row < len(board) and col >= 0 and col < len(board) and board[row][col] == emptyspot
		def generate_rowcols(rowcol):
			row = rowcol[0]
			col = rowcol[1]
			return [[row+1,col+2],[row+2,col+1],[row-1,col+2],[row-2,col+1],\
		                   [row+2,col-1],[row+1,col-2],[row-1,col-2],[row-2,col-1]]
		return list(filter(valid_rowcol,generate_rowcols(rowcol)))

# find_next_move is an implementation of Waldorff's rule, which is
# a heuristic method of finding a valid knights tour. Wikipedia explains
# it well, but you just choose the move with the fewest valid moves from it.
def find_next_move(rowcol,board):
	valid_moves = valid_rowcols(rowcol,board)
	lowest_value = 9
	best_rowcol = "love"
	for move in valid_moves:
		moves_from_move = len(valid_rowcols(move,board))
		if moves_from_move < lowest_value:
			lowest_value = moves_from_move
			best_rowcol = move
	return best_rowcol

#----------------AND FINALLY, KNIGHTOUR!-------------#

def knightour(size,start_rowcol=[0,0]):
	board = create_board(size)
	return find_tour(board,start_rowcol,0)

def knight_anim(size,speed,start_rowcol=[0,0]):
	success_board = knightour(size,start_rowcol)
	anim_list = []
	for i in reversit(list(range(1,size**2+1))):
		new_board = copy.deepcopy(success_board)
		anim_list.append(new_board)
		for row in success_board:
			try: 
				row.insert(row.index(i),"_")
				row.remove(i)
			except:
				pass
	for i in range(size**2):
		print("---------------------------")
		sleep(speed)
		visualise_board(anim_list.pop())

def find_tour(board,rowcol,n):
	row,col = rowcol[0],rowcol[1]
	n += 1
	new_board = copy.deepcopy(board)
	new_board[row][col] = n
	next_move = find_next_move(rowcol,new_board)

	if finished_check(new_board):
		if new_board not in successful_tours:
			successful_tours.append(new_board)
		print('Tour found:')
		visualise_board(new_board)
		return new_board
	else:
		try:
			return find_tour(new_board,next_move,n)
		except: pass
		for move in valid_rowcols(rowcol,new_board):
			try: return find_tour(new_board,move,n)
			except: pass
		raise SyntaxError("No valid tours.")
