import { smsLogin, smsLogout, getSmsInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

const useSmsUserStore = defineStore(
  'smsUser',
  {
    state: () => ({
      token: getToken(),
      id: '',
      userno: '',
      username:'',
      phoneNumber:'',
      avatar: ''
    }),
    actions: {
      // 登录
      smsLogin(userInfo) {
        const phoneNumber = userInfo.phoneNumber.trim()
        const smsCode = userInfo.smsCode
        // const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          smsLogin(phoneNumber, smsCode, uuid).then(res => {
            let data = res.data
            setToken(data.access_token)
            this.token = data.access_token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      //注册用户
      registerSmsUser(){
        const phoneNumber = userInfo.phoneNumber.trim()
        const smsCode = userInfo.smsCode
        const password = userInfo.password
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          registerAppUser(phoneNumber, smsCode, uuid, password).then(res => {
            let data = res.data
            setToken(data.access_token)
            this.token = data.access_token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getSmsInfo().then(res => {
            const user = res.user
            const avatar = (isEmpty(user.avatar)) ? defAva : user.avatar
            this.id = user.id
            this.username = user.userName
            this.userno = user.userNo
            this.phoneNumber = user.phoneNumber
            this.avatar = avatar
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      smsLogout() {
        return new Promise((resolve, reject) => {
          smsLogout(this.token).then(() => {
            this.token = ''
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useSmsUserStore
