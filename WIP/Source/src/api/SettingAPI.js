const KEY_SETTING_TIME_AUTO_SAVE = 'setting_time_auto_save';
const KEY_SETTING_TIME_AUTO_SYNC = 'setting_time_auto_sync';

export function getTimeAutoSave(){
  return localStorage.getItem(KEY_SETTING_TIME_AUTO_SAVE) || 1;
}

export function setTimeAutoSave(time) {
  localStorage.setItem(KEY_SETTING_TIME_AUTO_SAVE, time);
}

export function getTimeAutoSync(){
  return localStorage.getItem(KEY_SETTING_TIME_AUTO_SYNC) || 1;
}

export function setTimeAutoSync(time) {
  localStorage.setItem(KEY_SETTING_TIME_AUTO_SYNC, time);
}