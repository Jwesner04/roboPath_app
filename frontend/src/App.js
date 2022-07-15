// -------------------------------------------------------------------------- #
// This file includes a user interface for running the robo simulation        #
//                                                                            #
// © 2022 Jonathan Wesner                                                     #
//                                                                            #
//                                                                            #
// App() UI                                                                   #
// -------------------------------------------------------------------------- #
import React, { useState, useEffect } from 'react';
import './App.css';
import instructionImg from './images/Instructions.jpg'
import robotImg from './images/robot.jpg'
import interpreterImg from './images/interpreter.jpg'
import { Container, Button, Row, Col, Card, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
// References to Icons: https://icons.getbootstrap.com/
import { PlusSquareFill, TrashFill, MapFill, Robot, Truck } from 'react-bootstrap-icons';
import { Facebook, Twitter, Google, Instagram, Linkedin, Github } from 'react-bootstrap-icons';

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

  const outputGraph = () => {
    if (returnData["roboMap"] !== undefined) {
      return (
        returnData["roboMap"].map((m, row) => (
          <tr key={row}>
            {m.map((n, column) => (
              <td key={row - column} style={{ color: "#FFFFFF" }}>{n}</td>
            ))}
          </tr>))
      )
    }
  }

  const displayInstructions = () => {
    return (
      <Card className='mt-3' style={{ height: 650 }}>
        <Card.Img variant="top" src={instructionImg} style={{ height: 300 }} />
        <Card.Body>
          <Card.Title>Instructions/Directions</Card.Title>
          <ul className='mb-3'>
            <li key="1" style={{ fontSize: "14px" }}>
              It is assumed that all values are an integer
            </li>
            <li key="2" style={{ fontSize: "14px" }}>
              No need to fill intacles, but if obstacles are filled in,
              it is possible that obstacles will interfere with the robot
            </li>
            <li key="3" style={{ fontSize: "14px" }}>
              It is also possible there is no safe path for the robot
              to reach its destination depending on radius of the robot
              and the number and size of obstacles on the course
            </li>
            <li key="4" style={{ fontSize: "14px" }}>
              There is no limit to obstacles. If an obstacle is out-of-bounds
              the obstacle will not render on the map. If part of the obstacle
              is out-of-bounds, only a part of the obstacle will show
            </li>
            <li key="5" style={{ fontSize: "14px" }}>
              The graph is in a (X,Y) coordinate system. So think of a normal
              x,y plane when inputing a point.
            </li>
            <li key="6" style={{ fontSize: "14px" }}>
              If no (X,Y) coordinate for start and finish are given, expect
              an empty return.
            </li>
          </ul>
        </Card.Body>
      </Card >
    );
  }

  const displayInterpretGraph = () => {
    return (
      <Card className='mt-3' style={{ height: 650 }}>
        <Card.Img variant="top" src={interpreterImg} style={{ height: 300 }} />
        <Card.Body style={{ backgroundColor: "#FDF5E6" }}>
          <Card.Title>Interpret the Graph Values (Idealy, this would be updated as a simulator)</Card.Title>
          <ul className='mb-3'>
            <li key="1" style={{ fontSize: "14px" }}>
              Value = 0: Obstacle occupies that area
            </li>
            <li key="2" style={{ fontSize: "14px" }}>
              Value = 1: That coordinate is available for the robot to travel
            </li>
            <li key="3" style={{ fontSize: "14px" }}>
              Value = 2: The actual path the robot took
            </li>
          </ul>
        </Card.Body>
      </Card>
    )
  }

  const displaySizeOfMapInput = () => {
    return (
      <Card className='mt-3' style={{ height: 500, backgroundColor: "#BC8F8F", color: "#E0FFFF" }}>
        < MapFill style={{ height: 30, width: 30 }} />
        <Card.Body>
          <Card.Title>Size of map (MxN) for simulation</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Set number of Rows of graph (m)</Form.Label>
              <Form.Control placeholder="m rows integer" onChange={(e) => { setM(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Set number of Columns of graph</Form.Label>
              <Form.Control placeholder="n columns integer" onChange={(e) => { setN(e.target.value) }} />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    )
  }

  const displayRobotInfo = () => {
    return (
      <Card className='mt-3' style={{ height: 500, backgroundColor: "#BC8F8F", color: "#E0FFFF" }}>
        <Robot style={{ height: 30, width: 30 }} />
        <Card.Body>
          <Card.Title>Robot Info</Card.Title>
          <Form>
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
          </Form>
        </Card.Body>
      </Card>
    )
  }

  const displayInsertObstaclesInput = () => {
    return (
      <Card className='mt-3' style={{ height: 500, backgroundColor: "#BC8F8F", color: "#E0FFFF" }}>
        <Truck style={{ height: 30, width: 30 }} />
        <Card.Body>
          <Card.Title>Obstacles - 1 Radius = 1 cell</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Add Obstacle <PlusSquareFill type="submit" onClick={() => { setObstacleForm(!obstacleForm) }} /> </Form.Label>
              {displayObstacleForm()}
            </Form.Group>
            {displayObstacles()}
          </Form>
        </Card.Body>
      </Card>
    )
  }

  const displayHeader = () => {
    return (
      <Card>
        <Card.Img variant="top" src={robotImg} style={{ height: 500 }} />
        <Card.ImgOverlay>
          <div className='d-flex justify-content-center  h-100'>
            <div style={{ color: "#BC8F8F" }}>
              <h1 className='mb-3' style={{ height: 100 }}>Robot Simulation</h1>
            </div>
          </div>
        </Card.ImgOverlay>
      </Card >

    )
  }

  const displayFooter = () => {
    // References: https://react-bootstrap.github.io/components/cards/#header-and-footer
    return (
      <footer>
        <section className='mb-4'>
          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#3b5998' }}
            href='#!'
            role='button'
          >
            <Facebook />
          </a>

          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#55acee' }}
            href='#!'
            role='button'
          >
            <Twitter />
          </a>

          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#dd4b39' }}
            href='#!'
            role='button'
          >
            <Google />
          </a>
          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#ac2bac' }}
            href='#!'
            role='button'
          >
            <Instagram />
          </a>

          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#0082ca' }}
            href='https://www.linkedin.com/in/jonathan-wesner-81063668/'
            role='button'
          >
            <Linkedin />
          </a>

          <a
            className='btn btn-primary btn-floating m-1'
            style={{ backgroundColor: '#333333' }}
            href='https://github.com/jwesner04'
            role='button'
          >
            <Github />
          </a>
        </section>
        <p>
          © 2022 Copyright: Robot Simulator
        </p>
      </footer>
    )
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

  return (
    <div>
      <Container fluid>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row>
          {displayHeader()}
        </Row>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row style={{ backgroundColor: '#212529' }}>
          <Col md={{ span: 5, offset: 1 }} >
            {displayInstructions()}
          </Col>
          <Col md={{ span: 5 }}>
            {displayInterpretGraph()}
          </Col>
        </Row >
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row style={{ backgroundColor: '#212529' }}>
          <Col xs={6} md={4}>
            {displaySizeOfMapInput()}
          </Col>
          <Col xs={6} md={4}>
            {displayRobotInfo()}
          </Col>
          <Col xs={6} md={4}>
            {displayInsertObstaclesInput()}
          </Col>
        </Row >
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row style={{ backgroundColor: '#212529' }}>
          <Col md={{ span: 4, offset: 5 }} className='mt-3'>
            <Button size="lg" variant="outline-light" onClick={handleSubmit}>Submit Simulation</Button>
          </Col>
        </Row>
        <Row className="spacer15" style={{ backgroundColor: '#212529' }}></Row>
        <Row style={{ backgroundColor: '#212529' }}>
          <table className="table table-bordered table-hover table-sm">
            <tbody>
              {outputGraph()}
            </tbody>
          </table>
        </Row>
        <Row className=" text-center text-muted p-3" style={{ backgroundColor: '#212529' }}>
          {displayFooter()}
        </Row>
      </Container>
    </div >

  );
}

export default App;
