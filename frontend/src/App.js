import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

function App() {
  const [returnData, setReturnData] = useState({});
  const [m, setM] = useState(0);
  const [n, setN] = useState(0);
  const [roboRadius, setRoboRadius] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [startCoord, setStartCoord] = useState([0, 0]);
  const [endCoord, setEndCoord] = useState([0, 0]);
  const [submitSimulationFlag, setSubmitSimulationFlag] = useState(false);

  const handleSubmit = () => {
    submitSimulationFlag(true);
  }

  useEffect(() => {
    if (submitSimulationFlag === true) {
      const submitSimulation = async () => {
        const newSimulation = {
          "m": m,
          "n": n,
          "roboRadius": roboRadius,
          "obstacles": obstacles,
          "startCoord": startCoord,
          "endCoord": endCoord
        }

        fetch("http://localhost:8000/runSimulator", {
          method: "POST",
          body: JSON.stringify(newSimulation)
        }).then(setReturnData)
      }
      submitSimulation();
    }
    setSubmitSimulationFlag(false);

  }, [returnData, submitSimulationFlag])

  return (
    <Container fluid style={{ backgroundColor: '#EFEBE9' }}>
      <h1>HELLO WORLD</h1>
      <Row className="spacer15"></Row>
      <Row className="spacer15"></Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Set number of Rows of graph (m)</Form.Label>
                  <Form.Control placeholder="m" onChange={(e) => { setM(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Set number of Columns of graph</Form.Label>
                  <Form.Control placeholder="n" onChange={(e) => { setN(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Set Radius of Robot</Form.Label>
                  <Form.Control placeholder="radius" onChange={(e) => { setRoboRadius(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Set Obstacles</Form.Label>
                  <Form.Control placeholder="[[x,y,radius], ...]" onChange={(e) => { setObstacles(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Start Coordinates</Form.Label>
                  <Form.Control placeholder="[x,y]" onChange={(e) => { setStartCoord(e.target.value) }} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Coordinates</Form.Label>
                  <Form.Control placeholder="[x,y]" onChange={(e) => { setEndCoord(e.target.value) }} />
                </Form.Group>
                <Button size="lg" variant="outline-dark" onClick={handleSubmit} style={{ marginRight: '10px' }}>Submit Simulation</Button>
              </Form >
            </Card.Body >
          </Card >
        </Col >
      </Row >
      <Row className="spacer15"></Row>
      <Row className="spacer15"></Row>
    </Container >
  );
}

export default App;
