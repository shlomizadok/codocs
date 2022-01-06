import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';
import SideMenu from '../utils/SideMenu';

class Dashboard extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <SideMenu />
          <Col md={9}>
            <p>Some dashboard stuff here... </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;