import React from 'react';

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup, createOrUpdateUser } from './userUtils';

const clientId = process.env.GOOGLE_CLIENT_ID;

function Login() {
  const onSuccess = (res) => {
    refreshTokenSetup(res);
    if (!localStorage.getItem('currentUser'))
      createOrUpdateUser(res.profileObj);
    
    // window.location.reload();  
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;