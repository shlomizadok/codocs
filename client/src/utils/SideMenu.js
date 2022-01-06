import React, { Component } from 'react';
import { Button, Col, Nav, NavItem } from 'reactstrap';
import SpacesList from './SpacesList';
import AddSpace from '../components/Space/AddSpace';

class SideMenu extends Component {
  state = {
    editing: null,
  };
  
  render() {
    const { editing } = this.state;
    return (
      <Col md={3} xl={2} sm={2} className="col-auto bg-light">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <Nav
            vertical={true} 
            pills={false} 
            tag="nav"
          >
            <NavItem tag="a">
              <Button
                className="my-2"
                color="primary"
                onClick={() => this.setState({ editing: {} })}
              >
                New Space
              </Button>
            </NavItem>
            <SpacesList />
          </Nav>
        </div>
        {editing && (
          <AddSpace
            post={editing}
            onClose={() => this.setState({ editing: null })}
          />
        )}
      </Col>
    ) 
  }
}

export default SideMenu;