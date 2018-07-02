const KEY_UID = 'uid';
const KEY_USER_NAME = 'name';
const KEY_USER_EMAIL = 'email';
const KEY_USER_AVATAR = 'profile_picture';

export function getUID(){
  return localStorage.getItem(KEY_UID);
}

export function setUID(uid) {
  localStorage.setItem(KEY_UID, uid);
}

export function getName(){
  return localStorage.getItem(KEY_USER_NAME) || "Unregisted user";
}

export function setName(name) {
  localStorage.setItem(KEY_USER_NAME, name);
}

export function getEmail(){
  return localStorage.getItem(KEY_USER_EMAIL);
}

export function setEmail(email) {
  localStorage.setItem(KEY_USER_EMAIL, email);
}

export function getAvatar(){
  return localStorage.getItem(KEY_USER_AVATAR) || "/images/default-avatar.png";
}

export function setAvatar(avatar) {
  localStorage.setItem(KEY_USER_AVATAR, avatar);
}

export function isSignIn(){
  var uid = localStorage.getItem(KEY_UID);
  var email = localStorage.getItem(KEY_USER_EMAIL);
  return !!uid && !!email;
}

export function setUserInfo(id, email, name, avatar) {
  setUID(id);
  setEmail(email);
  setName(name);
  setAvatar(avatar);
}

export function clearUserInfo() {
  localStorage.removeItem(KEY_UID);
  localStorage.removeItem(KEY_USER_NAME);
  localStorage.removeItem(KEY_USER_EMAIL);
  localStorage.removeItem(KEY_USER_AVATAR);
}