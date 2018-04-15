const KEY_UID = 'uid';
const KEY_NAME = 'name';
const KEY_EMAIL = 'email';
const KEY_AVATAR = 'profile_picture';

export function getUID(){
  return localStorage.getItem(KEY_UID);
}

export function setUID(uid) {
  localStorage.setItem(KEY_UID, uid);
}

export function getName(){
  return localStorage.getItem(KEY_NAME) || "Unregisted user";
}

export function setName(name) {
  localStorage.setItem(KEY_NAME, name);
}

export function getEmail(){
  return localStorage.getItem(KEY_EMAIL);
}

export function setEmail(email) {
  localStorage.setItem(KEY_EMAIL, email);
}

export function getAvatar(){
  return localStorage.getItem(KEY_AVATAR) || "/images/default-avatar.png";
}

export function setAvatar(avatar) {
  localStorage.setItem(KEY_AVATAR, avatar);
}

export function setUserInfo(id, email, name, avatar) {
  setUID(id);
  setEmail(email);
  setName(name);
  setAvatar(avatar);
}

export function clearUserInfo() {
  localStorage.removeItem(KEY_UID);
  localStorage.removeItem(KEY_NAME);
  localStorage.removeItem(KEY_EMAIL);
  localStorage.removeItem(KEY_AVATAR);
}
