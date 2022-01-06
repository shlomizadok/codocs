import React from 'react';
import Login from './User/Login';

function Welcome(props) {
  console.log(props)
  return (
    <>
    <h2>Welcome to the app... now login</h2>
    <p>Learn React (tests pass!)</p>
    <Login />
    </>
  );
}

export default Welcome;