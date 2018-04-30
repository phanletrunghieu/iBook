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

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}