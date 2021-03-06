# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #                                                                   #
#                                                                            #
# test() app                                                                 #
# -------------------------------------------------------------------------- #
from roboLib import roboPathClass


def test_roboLib():
    # initiate a RoboPath object
    m = 20
    n = 20
    robotSize = 1
    bestPathObj = roboPathClass.RoboPath(m, n, robotSize)

    # Insert some obstacles
    obstacleList = []
    validObstacles = bestPathObj.insertObstacles(obstacleList)
    assert validObstacles == True

    # Get best path for robot to take
    startCoord = [0, 0]
    endCoord = [18, 18]
    endReached = bestPathObj.bestSafePath(startCoord, endCoord)
    assert endReached == True
