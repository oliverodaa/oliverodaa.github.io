from copy import deepcopy
from time import time
from functools import reduce
from random import choice

#-------------------CONNECT FOUR------------------#

#-------GAMEPLAY---------#

print("")
print("WELCOME TO CONNECT FOUR")
print("-----------------------")
print("- To play at p1, call play(human,minimax_ai).")
print("- To play as p2, call play(minimax_ai,human).")
print("- You can also call play(human,human) and play(minimax_ai,minimax_ai).")

def play(p1,p2):
	print("Welcome to Connect Four. Let's play!")
	position = create_board()
	current_token = player_one_coin
	alt_token = player_two_coin
	small_visualize(position)
	while not ending_conditions(position):
		move = p1(position,4)                      # queries for move
		position[-1] = move                        # ties move to board
		position[move].append(current_token)       # applies move
		p1, p2 = p2, p1
		current_token, alt_token = alt_token, current_token
		small_visualize(position)
	print("Cool game bro. GG.")

#-------Basic Structure and Visualizer-------#

player_one_coin = 'x'
player_two_coin = 'o'
board_rows = 6
board_cols = 7
emptyspot = '_'

def create_board():
	# The last item of the board will be the 
	# previous column. This will make it more 
	# efficient to check for winning positions.
	board = []
	for i in range(board_cols):
		column = []
		board.append(column)
	board.append(False)
	return board

def visualize_board(board):
	n = board_rows - 1
	board = deepcopy(board)
	board.pop()
	while n >= 0:
		print("\n","         ", end="")
		for col in board:
			if len(col) > n:
				print(str(col[n]) + "       ", end="")
			else:
				print(str(emptyspot) + "       ", end="")
		print("")
		n -= 1

def small_visualize(board):
	n = board_rows - 1
	board = deepcopy(board)
	board.pop()
	while n >= 0:
		print("\n","         ", end="")
		for col in board:
			if len(col) > n:
				print(str(col[n]) + " ", end="")
			else:
				print(str(emptyspot) + " ", end="")
		n -= 1
	print("")

#------------Interactive Game--------------#

#------Helpers for four_in_a_row----->

# Note that here, last move refers to
# coordinates, not a column number.

def vert(position,start_coordinates,current_token):
	up = count_from(position,start_coordinates,current_token,-1,0)
	down = count_from(position,start_coordinates,current_token,1,0)
	return (up[0]+down[0],up[1] + down[1])

def horiz(position,start_coordinates,current_token):
	right = count_from(position,start_coordinates,current_token,0,1)
	left = count_from(position,start_coordinates,current_token,0,-1)
	return (left[0]+right[0],left[1] + right[1])

def diag_up(position,start_coordinates,current_token):
	up = count_from(position,start_coordinates,current_token,1,1)
	down = count_from(position,start_coordinates,current_token,-1,-1)
	return (up[0]+down[0],up[1] + down[1])

def diag_down(position,start_coordinates,current_token):
	down = count_from(position,start_coordinates,current_token,-1,1)
	up = count_from(position,start_coordinates,current_token,1,-1)
	return (up[0]+down[0],up[1] + down[1])

def count_from(position,start_coordinates,current_token,up,right):
	count = 0
	start_col = start_coordinates[0]
	start_row = start_coordinates[1]
	blank_space = 0
	n = 1
	while count < 3:
		try:
			if (start_col + right*n < 0) or (start_row + up*n < 0):
				return (count,blank_space)
			elif position[start_col+right*n][start_row+up*n] == current_token:
				count += 1
				n += 1
			else:
				return (count,blank_space)
		except:
			if start_col+right*n < board_cols and start_row+up*n < board_rows:
				blank_space += 1
			return (count,blank_space)
	return (count,blank_space)

def four_in_a_row(position,start_coordinates,current_token):
	return vert(position,start_coordinates,current_token)[0] >= 3 \
	       or horiz(position,start_coordinates,current_token)[0] >= 3 \
	       or diag_up(position,start_coordinates,current_token)[0] >= 3 \
	       or diag_down(position,start_coordinates,current_token)[0] >= 3

#------------------------------------#

def max_column(position):
	max_length = 0
	for column in position:
		if type(column) is list:
			length = len(column)
			if length > max_length:
				max_length = length
	return max_length

def coordinates_list_maker(position):
	coordinates_list = []
	for c in range(board_cols):
		for r in range(max_column(position)+1):
			if r > len(position[c]) - 1 and r < board_rows:
				coordinates_list.append([c,r])
	return coordinates_list

connections_dict = {((), (), (), (), (), (), ()): (0, 0)}

def connections_score(position):
	# returns pair -> [num_for_current,num_for_other]
	modded_position = tuple(tuple(x) for x in position[:-1]) 
	if modded_position in connections_dict:
		return connections_dict[modded_position]
	else:
		given_col = position[-1]
		current_token = position[given_col][-1]
		if current_token == player_one_coin:
			other_token = player_two_coin
		else:
			other_token = player_one_coin

		coordinates_list = coordinates_list_maker(position)
		score_for_current = connections_score_applier(position,current_token,coordinates_list)
		score_for_other = connections_score_applier(position,other_token,coordinates_list)
		connections_dict[modded_position] = (score_for_current,score_for_other)
		return connections_dict[modded_position]
	
def connections_score_applier(position,current_token,coordinates_list):
	return reduce(lambda x,y: x+y,map(lambda x: longest_connection(position,x,current_token),coordinates_list))

def longest_connection(position,start_coordinates,current_token):
	vertical = vert(position,start_coordinates,current_token)
	horizontal = horiz(position,start_coordinates,current_token)
	diagonal_up = diag_up(position,start_coordinates,current_token)
	diagonal_down = diag_down(position,start_coordinates,current_token)
	
	score = 0
	for item in vertical,horizontal,diagonal_up,diagonal_down:
		if item[0] >= 3:
			return 2
		elif item[0] >= 2 and item[1] >= 1:
			score = 1
	return score

#------Helper for Draw----->

def total_board(position):
	position = deepcopy(position)
	position.pop()
	total = 0
	for column in position:
		total += len(column)
	return total

#----------------------------#

def draw(position):
	return total_board(position) == board_rows*board_cols

def ending_conditions(position):
	given_col = position[board_cols]
	if given_col:
		current_token = position[given_col][-1]
	else:
		return False
	start_coordinates = [given_col,len(position[given_col])-1]
	return four_in_a_row(position,start_coordinates,current_token) or draw(position)

#--------These Functions Choose the Moves-------#

#------Helpers for Players----->

def ok_move(column,position):
	try:
		column = int(column)
	except:
		return False
	return column > 0 and column <=7 and len(position[column-1]) < board_rows

def not_full_column(position,column):
	return len(position[column]) < board_rows

def current_coin(position):
	if total_board(position) % 2 == 0:
		return player_one_coin
	else:
		return player_two_coin

def contains_tuple(child_values):
	for item in child_values:
		if type(item) is tuple:
			return True
	return False

def best_almost_four(child_values):
	fours_dict = {}
	for item in child_values:
		if type(item) is tuple:
			fours_dict[item] = item[1] - item[0]
	best = max(fours_dict,key=fours_dict.get)
	return best

CONSTANT_WIN = "win"
CONSTANT_LOSE = "lose"
CONSTANT_DRAW = "draw"
CONSTANT_UNDECIDED = "undecided"

def primitive_value(position):
	given_col = position[board_cols]
	# print("given_col is " + str(given_col))
	# small_visualize(position)
	if type(given_col) is int:
		current_token = position[given_col][-1]
	else:
			return "Aint no starting column"
	start_coordinates = [given_col,len(position[given_col])-1]

	if four_in_a_row(position,start_coordinates,current_token):
		return CONSTANT_LOSE
	elif draw(position):
		return CONSTANT_DRAW
	else:
		return connections_score(position)

def new_position(position,column):
	board = deepcopy(position)
	board.pop()
	board[column].append(current_coin(position))
	return board

def valid_positions(position):
	cols = [0,1,2,3,4,5,6]
	valid_columns = list(filter(lambda x: not_full_column(position,x),cols))
	valid_boards = list(map(lambda x: new_position(position,x),valid_columns))
	index = 0
	for board in valid_boards:
		board.append(valid_columns[index])
		index += 1
	return valid_boards

#---------------------------#

values_dict = {}

def position_value(position,depth):
	modded_position = tuple(tuple(x) for x in position[:-1])
	if modded_position in values_dict:
		return values_dict[modded_position]
	prim_value = primitive_value(position)
	if not type(prim_value) is tuple:
		return prim_value
	elif depth == 0:
		return prim_value[::-1]
	else:
		valid_pos = valid_positions(position)
		child_values = list(map(lambda x: position_value(x,depth-1),valid_pos))
		# print("depth is " + str(depth)," and col is " + str(position[-1]))
		# print("child values are " + str(child_values))
		if CONSTANT_LOSE in child_values:
			values_dict[modded_position] = CONSTANT_WIN
			return CONSTANT_WIN
		elif CONSTANT_DRAW in child_values:
			return CONSTANT_DRAW
		elif contains_tuple(child_values):
			best = best_almost_four(child_values)
			return best[::-1]
		else:
			values_dict[modded_position] = CONSTANT_LOSE
			return CONSTANT_LOSE

#---------------------------#

def human(position,depth):
	col = input("Which column do you want to go in? ")
	while not ok_move(col,position):
		col = input("Come on, a valid column! ")
	return int(col)-1

def minimax_ai(position,depth):
	start = time()
	valid_pos = valid_positions(position)
	child_values = list(map(lambda x: position_value(x,depth),valid_pos))
	remaining_cols = []
	remaining_values = []
	print(child_values)
	i = 0
	# This section uses the position_value function to find and select/avoid
	# guaranteed winning/losing paths
	for value in child_values:
		if value == CONSTANT_LOSE:
			print(time() - start,"seconds.")
			column = valid_pos[i][-1]
			print("Selecting column",column,"to win")
			return column
		elif value == CONSTANT_WIN:
			pass
		else:
			remaining_cols.append(valid_pos[i][-1])
			remaining_values.append(value)
		i += 1
	# remaining_cols is the subset of columns that lead to neither a guaranteed win
	# nor a guaranteed loss
	if remaining_cols:
		print(time() - start,"seconds.")
		best = best_almost_four(remaining_values)
		chosen_col = remaining_cols[remaining_values.index(best)]
		print("Selecting column " + str(chosen_col) + " with connection scores... " + str(best))
		return chosen_col
	else:
		column = choice(list(filter(lambda x: not_full_column(position,x),[0,1,2,3,4,5,6])))
		print("Selecting column",column)
		return column

#------------------------------
#TEST BOARDS

test1 = [['x', 'o', 'x', 'o', 'x', 'o'], [], [], [], [], [], [],0]
test2 = [[], [], ['o', 'o', 'o'], ['x', 'x', 'x'], ['o', 'o', 'x', 'x'], [], [], 2]
test3 = [['x', 'o', 'x', 'o', 'x', 'o'], ['x', 'x', 'o'], ['o'], ['x', 'o', 'x', 'o', 'x', 'o'], ['o', 'x', 'x'], ['o'], ['x', 'o', 'x', 'o', 'x', 'o'], 4]
test4 = [['o'], [], [], ['x'], [], [], [], 0]
test5 = [[], [], [], ['x','x'], ['o'], [], ['o'], 3]
test6 = [[], [], [], ['x','x'], ['o','x'], ['o'], ['o'], 3]
test7 = [[], [], [], ['x'], [], [], [], 3]
