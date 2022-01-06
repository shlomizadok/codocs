import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { isUserPersisted } from './components/User/userUtils';
import Dashboard from './components/Dashboard';
import Space from './components/Space/Space';
import Doc from './components/Doc/Doc';
import Welcome from './components/Welcome';
import './App.css';


class App extends Component {
  render() {
    if (isUserPersisted()) {
      return (
        <div className="wrapper">
          <h1><a href="/">Application</a></h1>
          <BrowserRouter>
            <Routes>
              <Route path="/spaces/:id" element={< Space/>} />
              <Route path="/docs/:id" element={< Doc/>} />  
              <Route path="/" element={<Dashboard />} />
  
            </Routes>
          </BrowserRouter>
        </div>
      );
    }
    return (
      <Welcome />
    )
  }
}

export default App;