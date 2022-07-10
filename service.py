# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #                                                                   #
#                                                                            #
# main() app                                                                 #
# -------------------------------------------------------------------------- #

# Defining main function
from roboLib import roboPathClass


def main():
    m = 10
    n = 10
    robotSize = 1
    bestPathObj = roboPathClass.RoboPath(m, n, robotSize)

    # Insert some obstacles
    obstacleList = [[4, 2, 1], [6, 4, 1], [10, 4, 1]]
    bestPathObj.insertObstacles(obstacleList)

    # Get best path for robot to take
    startCoord = [0, 0]
    endCoord = [8, 8]
    bestPathObj.bestSafePath(startCoord, endCoord)

    bestPathObj.printMatrixMap()


# Using the special variable
# __name__
if __name__ == "__main__":
    main()
