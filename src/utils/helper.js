export function sync(){
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
