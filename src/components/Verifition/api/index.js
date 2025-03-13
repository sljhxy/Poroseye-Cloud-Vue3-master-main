import request from '@/utils/request'

//获取验证图片
// export function reqGet(data) {
//   return request({
//     url: '/auth/captcha/get',
//     method: 'post',
//     data
//   })
// }
export function reqGet() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

//滑动或者点选验证
export function reqCheck(data) {
  return request({
    url: '/auth/captcha/check',
    method: 'post',
    data
  })
}
