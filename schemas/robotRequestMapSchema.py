# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #                                                                   #
#                                                                            #
# schema used for a HTTP GET REQUEST                                         #
# -------------------------------------------------------------------------- #
from pydantic import BaseModel


class RobotRequestMapData(BaseModel):
    m: int
    n: int
    robotRadius: int
    obstacles: list[list[int]]
    startCoord: list[int]
    endCoord: list[int]
