import React, { Component } from 'react';

import browserHistory from "../utils/browserHistory";
import GoogleDriveAPI from '../utils/google-drive-api';

class HomeScreen extends Component {

  constructor(props){
    super(props);

    this.testSync = this.testSync.bind(this);
  }

  testSync(){
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
        <div>HomeScreen</div>
        <button onClick={GoogleDriveAPI.signIn}>Sign In</button>
        <button onClick={GoogleDriveAPI.signOut}>Sign Out</button>
      </div>
    );
  }
}

export default HomeScreen;
