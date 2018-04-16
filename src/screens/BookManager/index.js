import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import NavigationMenuIcon from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import InfoIcon from 'material-ui/svg-icons/action/info';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';

import config from '../../config';

import GoogleDriveAPI from '../../api/GoogleDriveAPI';
import {setUserInfo, clearUserInfo, getUID, getName, getEmail, getAvatar} from '../../api/UserAPI';

import './BookManager.css';

class BookManagerScreen extends Component {

  state={
    openDrawer: false,
    user_id: getUID(),
    user_name: getName(),
    user_email: getEmail(),
    user_avatar: getAvatar(),
  };

  constructor(props){
    super(props);

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.sync = this.sync.bind();
  }

  componentDidMount() {
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

      //send token to serviceWorker
      if('serviceWorker' in navigator){
        var token=window.gapi.auth.getToken();
        navigator.serviceWorker.ready.then(()=>{
          navigator.serviceWorker.controller.postMessage({
            type: 'token',
            data: token,
          });
        });
      }

      //save data in localStorage
      var basicProfile=window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
      var user_id=basicProfile.getId();
      var user_name=basicProfile.getName();
      var user_avatar=basicProfile.getImageUrl();
      var user_email=basicProfile.getEmail();

      setUserInfo(user_id, user_email, user_name, user_avatar);

      this.setState({
        user_id: getUID(),
        user_name: getName(),
        user_email: getEmail(),
        user_avatar: getAvatar(),
      });

      //browserHistory.push('/my-file');
    } else {
      console.log("sign out");
      clearUserInfo();

      this.setState({
        user_id: getUID(),
        user_name: getName(),
        user_email: getEmail(),
        user_avatar: getAvatar(),
      });
      //browserHistory.push('/');
    }
  }

  sync(){
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(function(reg) {
        return reg.sync.register('myFirstSync');
      }).catch(function() {
        // system was unable to register for a sync,
        // this could be an OS-level restriction
        console.log('not support sync');
      });
    } else {
      // serviceworker/sync not supported
      console.log('not support sync');
    }
  }

  render() {
    return (
      <div>
        <AppBar
          title={config.app_name}
          //onTitleClick={handleClick}
          iconElementLeft={
            <IconButton
              onClick={this.toggleDrawer}
            >
              <NavigationMenuIcon/>
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
          className="drawer"
        >
          <div className="header">
            <div className="user-info">
              <div className="avatar">
                <img src={this.state.user_avatar} alt="User avatar" width="50" height="50" />
              </div>
              <div className="user-name">{this.state.user_name}</div>
            </div>
          </div>
          {
            !this.state.user_id ?
            (
              <MenuItem leftIcon={<AccountCircleIcon/>} onClick={GoogleDriveAPI.signIn}>Login Google Drive</MenuItem>
            )
            :
            (
              <MenuItem leftIcon={<ExitToAppIcon/>} onClick={GoogleDriveAPI.signOut}>Logout</MenuItem>
            )
          }
          <MenuItem leftIcon={<SettingsIcon/>}>Settings</MenuItem>
          <MenuItem leftIcon={<InfoIcon/>}>About</MenuItem>
        </Drawer>

        <RaisedButton label="Primary" primary={true} onClick={this.sync}/>
      </div>
    );
  }
}

export default BookManagerScreen;
