import request from '@/utils/request'
import { da } from 'element-plus/es/locales.mjs'

// 登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: { username, password, code, uuid }
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}


//客户端登录
export function clientLogin(userno, password) {
  return request({
    url: '/auth/clientLogin',
    headers: {
      isToken: false,
      repeatSubmit: false,
      login_type: 'client_user'
    },
    method: 'post',
    data: { userno, password}
  })
}



// 退出方法
export function clientLogout() {
  return request({
    url: '/auth/clientLogout',
    method: 'delete'
  })
}


// 获取客户端用户详细信息
export function getUserInfo() {
  return request({
    url: '/glxt/baseUser/getStuInfo',
    headers: {
      login_type: 'client_user'
    },
    method: 'get'
  })
}


//获取二维码
export function getQRCode() {
  return request({
    url: '/auth/getQRCode',
    headers: {
      isToken: false
    },
    method: 'post',
    timeout: 30000
  })
}

//扫描二维码的登录轮询接口
export function checkQRCode(data) {
  return request({
    url: '/auth/wxcheck',
    method: 'get',
    params: data
  })
}


//短信登录
//获取验证码
export function getSmsCode(data) {
  return request({
    url: '/auth/sendCode/' + data,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}



//短信注册
export function registerAppUser(phoneNumber, smsCode, uuid, password) {
  return request({
    url: '/auth/registerAppUser',
    headers: {
      isToken: false
    },
    data: { phoneNumber, smsCode, uuid, password},
    method: 'post'
  })
}

//短信登录
export function smsLogin(phoneNumber, smsCode, uuid) {
  return request({
    url: '/auth/smsLogin',
    headers: {
      isToken: false
    },
    data: { phoneNumber, smsCode, uuid},
    method: 'post'
  })
}


// 获取短信用户详细信息
export function getSmsInfo() {
  return request({
    url: '/appUser/getInfo',
    method: 'get'
  })
}


// 退出方法
export function smsLogout() {
  return request({
    url: '/auth/smsLogout',
    method: 'delete'
  })
}

