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
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from roboLib import roboPathClass
from schemas import robotRequestMapSchema
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "localhost:3000"
    "localhost:3001",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

# Below is for Testing Purposes ONLY
# with open('data/defaultData.json', 'r') as f:
#    data = json.load(f)


@app.post("/getRobotMap")
async def getRobotMap(data: robotRequestMapSchema.RobotRequestMapData) -> dict:
    # Read in default data and setup a object instance to be used for the life of
    # this app
    bestPathObj = roboPathClass.RoboPath(
        data.m, data.n, data.robotRadius)

    # insert obstacles
    obstaclesOutput = bestPathObj.insertObstacles(data.obstacles)

    shortestPathOutput = bestPathObj.bestSafePath(
        data.startCoord, data.endCoord)

    data = {
        "obstaclesValid": obstaclesOutput,
        "mapValid": shortestPathOutput,
        "roboMap": bestPathObj.getMatrixMap()
    }

    return data


if __name__ == "__main__":
    uvicorn.run("app:app", reload=True)
