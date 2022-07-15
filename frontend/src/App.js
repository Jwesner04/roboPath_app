import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Button, Row, Col, Card, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
// References to Icons: https://icons.getbootstrap.com/
import { PlusSquareFill, TrashFill } from 'react-bootstrap-icons';

function App() {
  const [returnData, setReturnData] = useState({});
  const [m, setM] = useState(0);
  const [n, setN] = useState(0);
  const [robotRadius, setRobotRadius] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [startCoordX, setStartCoordX] = useState(0);
  const [startCoordY, setStartCoordY] = useState(0);
  const [endCoordX, setEndCoordX] = useState(0);
  const [endCoordY, setEndCoordY] = useState(0);
  const [submitSimulationFlag, setSubmitSimulationFlag] = useState(false);
  const [obstacleX, setObstacleX] = useState(0);
  const [obstacleY, setObstacleY] = useState(0);
  const [obstacleRadius, setObstacleRadius] = useState(0);
  const [obstacleForm, setObstacleForm] = useState(false);
  const [obstacleDisplayList, setObstacleDisplayList] = useState([])
  const [numObstacles, setNumObstacles] = useState([])
  const [graph, setGraph] = useState([])
  const [mapValid, setMapValid] = useState(false)
  const [obstacleValid, setObstacleValid] = useState(false)
  const [graphElements, setGraphElements] = useState([])


  const addObstacle = () => {
    // set candidate accordingly and push back to a setCandidates
    const obstacle = [obstacleX, obstacleY, obstacleRadius]
    setNumObstacles(numObstacles + 1);

    setObstacles([...obstacles, obstacle]);

    // collapse candidate form
    setObstacleForm(!obstacleForm);

    setObstacleDisplayList([...obstacleDisplayList,
    <Dropdown.ItemText key={numObstacles}>
      xLoc={obstacleX} : yLoc={obstacleY} : radius={obstacleRadius} < TrashFill type="submit" />
    </Dropdown.ItemText>]);
  }

  const displayObstacles = () => {
    // References: https://react-bootstrap.github.io/components/dropdowns/#dark-dropdowns
    return (
      <Dropdown>
        <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">
          Submitted Obstacles
        </Dropdown.Toggle>

        <Dropdown.Menu variant="dark">
          {obstacleDisplayList.map((item, index) => (
            <div key={index}>
              {item}
            </div>))}
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  const displayObstacleForm = () => {
    return (
      obstacleForm && (
        <Card>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>X Center Location</Form.Label>
              <Form.Control placeholder="x point integer" onChange={(e) => { setObstacleX(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Y Center Location</Form.Label>
              <Form.Control placeholder="y point integer" onChange={(e) => { setObstacleY(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Radius</Form.Label>
              <Form.Control placeholder="radius integer" onChange={(e) => { setObstacleRadius(e.target.value) }} />
            </Form.Group>
            <Button variant="dark" onClick={() => { addObstacle() }}>Add</Button>
          </Card.Body>
        </Card>
      )
    );
  }

  const handleSubmit = () => {
    setSubmitSimulationFlag(true);
  }

  useEffect(() => {
    if (submitSimulationFlag === true) {
      const submitSimulation = async () => {
        // gather start and end location
        const startCoordLocal = [startCoordX, startCoordY];
        const endCoordLocal = [endCoordX, endCoordY];

        const newSimulation = {
          "m": m,
          "n": n,
          "obstacles": obstacles,
          "robotRadius": robotRadius,
          "startCoord": startCoordLocal,
          "endCoord": endCoordLocal
        }

        // GET request using fetch inside useEffect React hook
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSimulation)
        };
        await fetch('http://localhost:8000/getRobotMap', requestOptions)
          .then(response => response.json())
          .then(data => setReturnData(data));
      }

      submitSimulation();
    }

    setSubmitSimulationFlag(false);

  }, [returnData, submitSimulationFlag])

  const outputGraph = () => {
    if (returnData["roboMap"] !== undefined) {
      return (
        returnData["roboMap"].map((m, row) => (
          <tr data-index={row}>
            {m.map((n, column) => (
              <td data-index={row - column}>{n}</td>
            ))}
          </tr>))
      )
    }
  }

  return (
    <div>
      <Container fluid>
        <Row>
          <div
            className='p-5 text-center bg-image'
            style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", height: 400 }}
          >
            <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <div className='d-flex justify-content-center align-items-center h-100'>
                <div className='text-white'>
                  <h1 className='mb-3'>Robot Simulation - Best Path</h1>
                  <h6 className='mb-3'>Instructions: all values must be integer. No need to fill in obstacles, but if obstacles are filled in, it is possible that obstacles will interfere with the robot ever making it to the destination based on the obstacle's width and the robot's width. There is no limit to obstacles. A map will display showing the best route the robot can take. If no start or end coordinates are given, expect an empty graph on submission</h6>
                </div>
              </div>
            </div>
          </div>
        </Row>
        <Row style={{ backgroundColor: '#EFEBE9' }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Set number of Rows of graph (m)</Form.Label>
                    <Form.Control placeholder="m rows integer" onChange={(e) => { setM(e.target.value) }} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Set number of Columns of graph</Form.Label>
                    <Form.Control placeholder="n columns integer" onChange={(e) => { setN(e.target.value) }} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Set Radius of Robot</Form.Label>
                    <Form.Control placeholder="robot radius integer" onChange={(e) => { setRobotRadius(e.target.value) }} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Coordinates</Form.Label>
                    <Form.Control placeholder="x start loc integer" onChange={(e) => { setStartCoordX(e.target.value) }} />
                    <Form.Control className='mt-1' placeholder="y start loc integer" onChange={(e) => { setStartCoordY(e.target.value) }} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>End Coordinates</Form.Label>
                    <Form.Control placeholder="x end loc integer" onChange={(e) => { setEndCoordX(e.target.value) }} />
                    <Form.Control className='mt-1' placeholder="y end loc integer" onChange={(e) => { setEndCoordY(e.target.value) }} />
                  </Form.Group>
                  <Card className="CandidateForm">
                    <Card.Body style={{ width: '27rem' }}>
                      <Form.Group className="mb-3">
                        <Form.Label>Add Obstacle <PlusSquareFill type="submit" onClick={() => { setObstacleForm(!obstacleForm) }} /> </Form.Label>
                        {displayObstacleForm()}
                      </Form.Group>
                      {displayObstacles()}
                    </Card.Body>
                  </Card>
                  <Row className='mt-3'>
                    <Col md={{ span: 6, offset: 0 }}>
                      <Button size="lg" variant="outline-dark" onClick={handleSubmit} style={{ marginRight: '10px' }}>Submit Simulation</Button>
                    </Col>
                  </Row>
                </Form >
              </Card.Body >
            </Card >
          </Col >
        </Row >
        <Row>
          <table className="table table-bordered table-hover table-sm">
            <tbody>
              {outputGraph()}
            </tbody>
          </table>
        </Row>
      </Container >
    </div>

  );
}

export default App;
