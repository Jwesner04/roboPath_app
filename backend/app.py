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
from flask import Flask, jsonify


import json


roboPathData = {
    "pathValid": True,
    "roboPath": [[]]
}


app = Flask(__name__)

m = 10
n = 10
robotSize = 1
bestPathObj = roboPathClass.RoboPath(m, n, robotSize)


@app.route('/getRobotMap', methods=['GET'])
def getRobotMap():

    # Get best path for robot to take
    startCoord = [0, 0]
    endCoord = [8, 8]
    foundShortestPath = bestPathObj.bestSafePath(startCoord, endCoord)

    # Data to be written
    roboMapData = {
        "mapValid": True,
        "roboMap": bestPathObj.getMatrixMap()
    }

    # Serializing json
    roboMapJsonObj = json.dumps(roboMapData, indent=4)

    # Writing to file for reference
    with open("data/roboMapData.json", "w") as outfile:
        outfile.write(roboMapJsonObj)

    return jsonify(roboMapData)


if __name__ == "__main__":
    app.run(debug=True)
