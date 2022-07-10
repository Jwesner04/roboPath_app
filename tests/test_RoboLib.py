# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #                                                                   #
#                                                                            #
# main() app                                                                 #
# -------------------------------------------------------------------------- #
from roboLib import roboPathClass


def test_roboLib():
    # initiate a RoboPath object
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
    endReached = bestPathObj.bestSafePath(startCoord, endCoord)
    assert endReached == True

    expectedRoboPath = [[0, 0], [1, 1], [1, 2], [1, 3],
                        [1, 4], [2, 5], [3, 6], [4, 7],
                        [5, 7], [6, 7], [7, 7], [8, 8]]

    assert bestPathObj.getRoboPath() == expectedRoboPath
