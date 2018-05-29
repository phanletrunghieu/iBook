import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {orangeA700} from 'material-ui/styles/colors';

import browserHistory from "./utils/browserHistory";

import HomeScreen from './screens/Home';
import BookManagerScreen from './screens/BookManager';
import BookViewerScreen from './screens/BookViewer';

class App extends Component {

  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: orangeA700,
      },
      appBar: {
        color: orangeA700
      },
      tabs: {
        backgroundColor: '#FFF',
        textColor: '#000',
        selectedTextColor: '#ff0000',
        selectedBackgroundColor: '#FFF'
      },
      raisedButton: {
        primaryColor: orangeA700,
      },
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
          <div>
            <Route exact path="/" component={HomeScreen}/>
            <Route exact path="/book/:bookId/:chapterId" render={(props)=><BookViewerScreen {...props} />} />
            <Route path="/app" component={BookManagerScreen}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
