# -------------------------------------------------------------------------- #
# This file includes the main for this test app                              #
#                                                                            #
# © 2022 Jonathan Wesner                                                     #
#                                                                            #                                                                   #
#                                                                            #
# main() app                                                                 #
# -------------------------------------------------------------------------- #

# Defining main function
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from roboLib import roboPathClass
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Below is for Testing Purposes ONLY
# with open('data/defaultData.json', 'r') as f:
#    data = json.load(f)


@app.post("/runSimulator")
async def getRobotMap(data: dict) -> dict:
    # Read in default data and setup a object instance to be used for the life of
    # this app
    bestPathObj = roboPathClass.RoboPath(
        data["m"], data["n"], data["robotSize"])

    # insert obstacles
    obstaclesOutput = await bestPathObj.insertObstacles(data["obstacles"])

    shortestPathOutput = await bestPathObj.bestSafePath(data["startCoord"], data["endCoord"])

    return {
        "obstaclesValid": obstaclesOutput,
        "mapValid": shortestPathOutput,
        "roboMap": bestPathObj.getMatrixMap()
    }


# @app.post("/runSimulator")
# async def set(data: dict):
#    data["startCoord"]
#    return {
#        "data": {"Todo added."}
#    }


if __name__ == "__main__":
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)
