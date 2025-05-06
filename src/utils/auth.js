import Cookies from 'js-cookie'

const TokenKey = 'Poroseye-Token'

const loginKey = 'login_type'

const ExpiresInKey = 'Poroseye-Expires-In'



export function setLoginType(value) {
  return Cookies.set(loginKey, value)
}

export function getLoginType() {
  return Cookies.get(loginKey)
}

export function removeLoginType() {
  return Cookies.remove(loginKey)
}


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('token', token)
  Cookies.set(TokenKey, token)
  console.log('获取到的token 为：', Cookies.get(TokenKey))
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
