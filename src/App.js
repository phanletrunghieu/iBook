import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import browserHistory from "./utils/browserHistory";

import HomeScreen from './screens/Home';
import BookManagerScreen from './screens/BookManager';

class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <div>
            <Route exact path="/" component={HomeScreen}/>
            <Route path="/app" component={BookManagerScreen}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
