class GoogleDriveAPI {
  constructor() {
    // Client ID and API key from the Developer Console
    this.CLIENT_ID = '680588350320-u8hu8k5njdosp7h95amoqvj0e5kko70u.apps.googleusercontent.com';
    this.API_KEY = 'AIzaSyA9Im_83i7Hl4dptubdjXO6F39Ios6rJfc';

    // Array of API discovery doc URLs for APIs used by the quickstart
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    this.SCOPES = 'https://www.googleapis.com/auth/drive '
    + 'https://www.googleapis.com/auth/drive.file '
    + 'https://www.googleapis.com/auth/drive.readonly '
    + 'https://www.googleapis.com/auth/drive.appdata '
    + 'https://www.googleapis.com/auth/drive.scripts '
    + 'https://www.googleapis.com/auth/drive.metadata';

    this.DATA_FOLDER = "iBookData";
  }

  addLibrary(callback){
    const element = document.getElementsByTagName("script")[0]
    const fjs = element
    let js = element
    js = document.createElement("script")
    js.id = "google-login"
    js.src = "https://apis.google.com/js/api.js"
    if (fjs && fjs.parentNode) {
      fjs.parentNode.insertBefore(js, fjs)
    } else {
      document.head.appendChild(js)
    }
    js.onload = callback
  }

  handleClientLoad(callback){
    window.gapi.load('client:auth2', ()=>{this.initClient(callback)});
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient(callback) {
    window.gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    }).then(function () {
      if(callback){
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);

        // Handle the initial sign-in state.
        callback(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      }
    });
  }

  /**
   *  Sign in the user upon button click.
   */
  signIn(event) {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  signOut(event) {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  getAppDataFolder(){
    var that=this;
    return new Promise(function(resolve, reject) {
      window.gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)",
        'q': "name = '" + that.DATA_FOLDER + "' and trashed = false and mimeType = 'application/vnd.google-apps.folder'"
      })
      .then(response=>{
        if(response.status === 200 && Array.isArray(response.result.files) && response.result.files.length > 0){
          return resolve(response.result.files[0]);
        }

        //don not find data folder
        window.gapi.client.drive.files.create({resource: {
          'name' : that.DATA_FOLDER,
          'mimeType' : 'application/vnd.google-apps.folder'
        }})
        .then(response=>{
          if(response.status === 200){
            return resolve(response.result);
          }

          reject("Failed to find app data");
        })
      })
      .catch(err=>reject(err.message || err));
    });
  }

  listFiles() {
    return window.gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name, mimeType, iconLink, description, properties, modifiedTime, size, webContentLink, webViewLink)",
      'q': "(name contains '.ibook' or name contains '.iBook') and trashed = false and mimeType != 'application/vnd.google-apps.folder'"
    });
  }

  createFile(filename){
    var that=this;
    return new Promise(function(resolve, reject) {
      that.getAppDataFolder()
      .then(folder=>{
        var fileMetadata = {
         'name' : filename+'.ibook',
         'mimeType' : 'application/vnd.google-apps.document',
         'parents': [folder.id],
        };
        return window.gapi.client.drive.files.create({
          resource: fileMetadata,
          fields: "id, name, mimeType, iconLink, description, properties, modifiedTime, size, webContentLink, webViewLink",
        });
      })
      .then(response=>{
        resolve(response);
      })
      .catch(err=>reject(err.message || err));
    });
  }

  deleteFile(fileId){
    return new Promise(function(resolve, reject) {
      window.gapi.client.drive.files.delete({fileId: fileId})
      .then(response=>{
        if (response.status === 204) {
          return resolve(true);
        }

        reject("Delete failed");
      })
      .catch(err=>reject(err.message || err));
    });
  }

  getFileContent(fileId){
    var url="https://www.googleapis.com/drive/v3/files/" + fileId + "/export?"
          +"mimeType="+encodeURI("text/plain")
          +"&key="+encodeURI(this.API_KEY);

    return new Promise(function(resolve, reject) {
      fetch(url, {
        cache: 'no-cache',
        method: 'GET',
      })
      .then(response => {
        if(response.ok)
          return response.text();


        else
          return Promise.reject("Fail");
      })
      .then(response => {
        resolve(response);
      })
      .catch(err=>reject(err));
    });
  }

  enableShare(fileId){
    var url="https://www.googleapis.com/drive/v3/files/" + fileId + "/permissions";

    return new Promise(function(resolve, reject) {
      var token=window.gapi.auth.getToken();
      fetch(url, {
        cache: 'no-cache',
        method: 'POST',
        headers: {
          'Authorization': token.token_type + " " + token.access_token,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          'role' : "reader",
          'type' : "anyone",
        }),
      })
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(err=>reject(err));
    });
  }

  disableShare(fileId){
    var url="https://www.googleapis.com/drive/v3/files/" + fileId + "/permissions/anyoneWithLink";

    return new Promise(function(resolve, reject) {
      var token=window.gapi.auth.getToken();
      fetch(url, {
        cache: 'no-cache',
        method: 'DELETE',
        headers: {
          'Authorization': token.token_type + " " + token.access_token,
          'content-type': 'application/json',
        },
      })
      .then(response => {
        if (response.status === 204) {
          return resolve(true);
        }

        reject("Fail");
      })
      .catch(err=>reject(err));
    });
  }
}

export default new GoogleDriveAPI();
