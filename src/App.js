import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import config from './config';

import browserHistory from "./utils/browserHistory";
import GoogleDriveAPI from './utils/google-drive-api';

import HomeScreen from './screens/Home';
import FileManagerScreen from './screens/FileManager';

class App extends Component {

  state={
    openDrawer: false,
  };

  constructor(props){
    super(props);

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  componentDidMount(){
    GoogleDriveAPI.addLibrary(()=>{
      console.log('added gapi');
      GoogleDriveAPI.handleClientLoad(this.updateSigninStatus)
    });
  }

  toggleDrawer(){
    this.setState({openDrawer: !this.state.openDrawer});
  }

  updateSigninStatus(isSignedIn){
    if (isSignedIn) {
      console.log("sign in");
      browserHistory.push('/my-file');
    } else {
      console.log("sign out");
      browserHistory.push('/');
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <AppBar
          title={config.app_name}
          //onTitleClick={handleClick}
          iconElementLeft={
            <IconButton
              onClick={this.toggleDrawer}
            >
              <NavigationMenu/>
            </IconButton>
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Refresh" />
              <MenuItem primaryText="Help" />
              <MenuItem primaryText="Sign out" />
            </IconMenu>
          }
        />
        <Drawer
          docked={false}
          open={this.state.openDrawer}
          onRequestChange={(openDrawer) => this.setState({openDrawer})}
        >
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
        <Router history={browserHistory}>
          <div>
            <Route exact path="/" component={HomeScreen}/>
            <Route path="/my-file" component={FileManagerScreen}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
