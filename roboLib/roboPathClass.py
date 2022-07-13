# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #
# References: https://www.youtube.com/watch?v=CABaqOkWbgQ                    #                                                                    #
#                                                                            #
# At the minimum the library should include the following abilities:         #
#   ● Take the initial parameters of map size (M x N) and robot radius.      #
#   ● Add obstacles to the current map using as a parameter a list of        #
#     circular obstacles, with each having a center location and radius.     #
#   ● Create the best safe path given a start and end location on the        #
#     current map, taking into consideration the robot radius.               #
#   ● Save the current map to a file.                                        #
#   ● Load a map from a file.                                                #
# -------------------------------------------------------------------------- #
from roboLib import ct
import copy

from collections import deque


class RoboPath:
    # -------------------------------------------------------------------------- #
    # Constructor
    # -------------------------------------------------------------------------- #
    def __init__(self, m, n, robotSize):
        """ Constructor of BestPath

            Summary: parametized constructor used to calculate a best path
                     and allow info to be retrieved on that calculation
            Inputs:
                - m: number of rows to generate.
                - n: number of columns to generate.
                - robotSize: radius of robot
        """

        self.mStart_ = 0
        self.mEnd_ = m

        self.nStart_ = 0
        self.nEnd_ = n

        self.matrixMap_ = []
        self.robotPath_ = [[]]

        self.robotSize_ = robotSize

        # generate initial matrix
        for r in range(self.mEnd_):
            row = []
            for c in range(self.nEnd_):
                row.append(ct.UNOCCUPIED)
            self.matrixMap_.append(row)

    # -------------------------------------------------------------------------- #
    # insertObstacles()
    # -------------------------------------------------------------------------- #
    def insertObstacles(self, obstacleList) -> str:
        """ insertObstacles() method of BestPath class

            Summary: insert obstacles into generated map MxN that updates a postion
                     from a value of 1 to 0, if occupied by an object.
                     NOTE: this function will discard obstacles outside the map
                           area
            Inputs:
                - obstacleList: contains a list of lists, where the sub-list
                                is always 3 size = [m, n, radius]. Example:
                                [ [1,2,1], [6,2,1], [4,4,2] ]

        """

        for obstacle in obstacleList:
            # check the obstacle has a valid set
            try:
                coordStartLocal = []
                # flip row to make a true (x,y) coordinate system. If (0,0),
                # translate to (0, m)
                rowLocal = (
                    self.mEnd_ - obstacle[ct.Y] - 1) - obstacle[ct.RADIUS]
                columnLocal = obstacle[ct.X] - obstacle[ct.RADIUS]
                coordStartLocal.append(rowLocal)
                coordStartLocal.append(columnLocal)

                coordEndLocal = []
                # flip row to make a true (x,y) coordinate system. If (0,0),
                # translate to (0, m)
                rowLocal = (
                    self.mEnd_ - obstacle[ct.Y] - 1) + obstacle[ct.RADIUS]
                columnLocal = obstacle[ct.X] + obstacle[ct.RADIUS]

                coordEndLocal.append(rowLocal)
                coordEndLocal.append(columnLocal)

                # Update the matrixMap_ with the obstacle
                self.updateMatrixMap(
                    coordStartLocal, coordEndLocal, ct.OCCUPIED)
            except:
                pass
            finally:
                return "A bad obstacle input"

        return "Obstacles set"

    # -------------------------------------------------------------------------- #
    # updateMatrixMap()
    # -------------------------------------------------------------------------- #
    def updateMatrixMap(self, coordStart, coordEnd, updateVal):
        """ updateMatrixMap() method of BestPath class

            Summary: insert obstacles into generated map MxN that updates a postion
                     from a value of 1 to 0, if occupied by an object.
            Inputs:
                startRow: the m (row) start in the matrix map to update
                endRow: the m (row) end in the matrix map
                startColumn: the n (column) start in the matrix map to update
                endColumn: the n (column) end in the matrix map to update
                updateVal: the value to update the map

        """

        # create this obstacles matrix
        rowLocal = coordStart[ct.M]
        columnLocal = coordStart[ct.N]
        while (rowLocal <= coordEnd[ct.M]):
            while (columnLocal <= coordEnd[ct.N]):
                if (columnLocal >= self.mStart_ and columnLocal < self.mEnd_ and
                        rowLocal >= self.nStart_ and rowLocal < self.nEnd_):
                    self.matrixMap_[rowLocal][columnLocal] = updateVal
                columnLocal += 1
            columnLocal = coordStart[ct.N]
            rowLocal += 1

    # -------------------------------------------------------------------------- #
    # bestSafePath()
    # -------------------------------------------------------------------------- #
    def bestSafePath(self, startLoc, endLoc) -> str:
        """ bestSafePath() method of BestPath class

            Summary: This method determines the best route for the robot to get
                     from start to finish without hitting an obstacle
            Inputs:
                - startLoc: location the robot starts and a list of size 2 = [m, n].
                - endLoc: location the robot ends and a list of size 2 = [m, n].
            Outputs:
                - bool: returns True if the robot found a valid path to reach the end.
                        returns False if the robot could not find a valid path
        """

        # Need to copy matrix locally so we don't overwrite the current state of
        # matrix
        matrixMapLocal = copy.deepcopy(self.matrixMap_)

        # queue used to track current location of robot
        # use queue as this allows a FIFO of queued points
        # to be processed. First one to reach the end is
        # assumed to be the best path
        queue = deque()

        # flip row to make a true (x,y) coordinate system. If (0,0),
        # translate to (0, m)
        try:
            rowStartLocal = self.mEnd_ - startLoc[ct.Y] - 1
            # Bad end coordinate to start location
            if (rowStartLocal >= self.mEnd_):
                return "Bad end coordinate to m start location"

            columnStartLocal = startLoc[ct.X]
            firstPoint = [[rowStartLocal, columnStartLocal]]
            queue.append(firstPoint)

            # flip row to make a true (x,y) coordinate system. If (0,0),
            # translate to (0, m)
            rowEndLocal = self.mEnd_ - (endLoc[ct.Y] + 1)
            # Bad start coordinate to start location
            if (rowEndLocal < self.mStart_):
                return "Bad start coordinate to m start location"

            columnEndLocal = endLoc[ct.X]

            while (len(queue)):
                size = len(queue)
                while (size > 0):
                    size -= 1
                    # Tracking history is important for
                    # identifying the path of the robot
                    pointHistory = queue.popleft()

                    # use last point from history
                    sizeOfHistory = len(pointHistory)
                    point = pointHistory[sizeOfHistory-1]

                    # check if end location has been reached. If it is reached
                    # append the history and return true to indicate a successful path
                    if (point[ct.M] is rowEndLocal and point[ct.N] is columnEndLocal):
                        self.robotPath_ = pointHistory
                        self.markRobotPathOnMap()
                        return "Robot made it to destination"

                    for d in ct.ROBOT_DIRECTIONS:
                        # Add the direction the robot is attempting to go to the current position
                        # of the robot
                        rowLocal = point[ct.M] + d[ct.M]
                        columnLocal = point[ct.N] + d[ct.N]

                        # Verify the move the robot is attempting is valid
                        if (self.moveIsValid(rowLocal, columnLocal) and matrixMapLocal[rowLocal][columnLocal] == 1):
                            pointHistoryLocal = pointHistory.copy()
                            # append this direction to the history
                            pointHistoryLocal.append([rowLocal, columnLocal])

                            # append this history to the queue
                            queue.append(pointHistoryLocal)
                            # mark this position as visited
                            matrixMapLocal[rowLocal][columnLocal] = ct.OCCUPIED
            return "Robot unable to reach destination"
        except:
            # pass the exception for the UI to handle and assume a bad input
            # was placed by the user
            pass
        finally:
            return "bad start or end location"

    # -------------------------------------------------------------------------- #
    # markRobotPathOnMap()
    # -------------------------------------------------------------------------- #
    def markRobotPathOnMap(self):
        """ markRobotPathOnMap() method of BestPath class

            Summary: marks the internal matrixMap_ member of class with the
                     path of the robot. If a path exists, each point will be set
                     to the value 2, which denotes the robot has visited that point.
                     Uses the internal member, robotPath_, to set the map.
                     NOTE: robotPath_ is set
            Inputs: None

        """

        for coord in self.robotPath_:
            self.matrixMap_[coord[ct.M]][coord[ct.N]] = ct.ROBOT_ROUTE

    # -------------------------------------------------------------------------- #
    # moveIsValid()
    # -------------------------------------------------------------------------- #
    def moveIsValid(self, m, n):
        """ moveIsValid() method of BestPath class

            Summary: checks if the robot can make the attempted move. This includes
                     identifying the radius of the robot and if it will make contact
                     with an object, or go out of bounds
            Inputs:
                x: the current position of the robot + the added direction the robot
                   is going in the m (row) direction
                y: the current position of the robot + the added direction the robot
                   is going in the n (column) direction

            Outputs:
                bool: returns False if the attempted direction met an obstacle or
                      out-of-bounds.
                      returns True if the robot is able to move in that direction
                      without running into an obstacle or going out-of-bounds

        """

        rowStartLocal = m - self.robotSize_
        columnStartLocal = n - self.robotSize_

        rowEndLocal = m + self.robotSize_
        columnEndLocal = n + self.robotSize_

        # create this obstacles matrix
        rowCountLocal = rowStartLocal
        columnCountLocal = columnStartLocal
        while (rowCountLocal <= rowEndLocal):
            while (columnCountLocal <= columnEndLocal):
                # Checks 5 things:
                #    - boundary of x position to the left is valid
                #    - boundary of x position to the right is valid
                if (rowCountLocal < self.mStart_ or rowCountLocal >= self.mEnd_ or
                        columnCountLocal < self.nStart_ or columnCountLocal >= self.nEnd_ or
                        self.matrixMap_[rowCountLocal][columnCountLocal] == 0):
                    return False
                columnCountLocal += 1
            columnCountLocal = columnStartLocal
            rowCountLocal += 1

        return True

    # -------------------------------------------------------------------------- #
    # printMatrixMap()
    # -------------------------------------------------------------------------- #
    def printMatrixMap(self):
        """ printMatrixMap() method of BestPath class

            Summary: This method prints the current state of the matrixMap_
        """
        for r in self.matrixMap_:
            print(r, end="\n")

    # -------------------------------------------------------------------------- #
    # getRoboPath()
    # -------------------------------------------------------------------------- #
    def getRoboPath(self):
        """ getRoboPath() method of BestPath class

            Summary: This method returns the robots path assuming the robot has
                     already traversed the map.

            Output: List of coordinates that the robot took to get to the finish
        """

        return self.robotPath_

    # -------------------------------------------------------------------------- #
    # getMatrixMap()
    # -------------------------------------------------------------------------- #
    def getMatrixMap(self):
        """ getMatrixMap() method of BestPath class

            Summary: This method returns the current state of the map.

            Output: MxN matrix of 2d map
        """

        return self.matrixMap_
