# -------------------------------------------------------------------------- #
# Defines all constants for this service                                     #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #
# -------------------------------------------------------------------------- #
# Coordinate enums, where X=row, Y=column
X = 0
Y = 1
RADIUS = 2

# Possible Coordinate Values
OCCUPIED = 0
UNOCCUPIED = 1
ROBOT_ROUTE = 2


# ----------------------------------------------------------------------- #
# Dependency array used to go over possible directions the robot can go.
# This considers the radius of the robot, and will ensure that 1 position
# move includes the size of the robot in an [x,y] coordinate system.
# Direction map shown below:
#
# [ \ | / ]
# [ - X - ]
# [ / | \ ]
#
# ----
ROBOT_DIRECTIONS = ((1, 0), (-1, 0), (0, 1), (0, -1),
                    (-1, -1), (1, 1), (1, -1), (-1, 1))
