import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    window.gapi.auth2.getAuthInstance().isSignedIn.get() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

export default PrivateRoute;
