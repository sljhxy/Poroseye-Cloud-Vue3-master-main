import { clientLogin, clientLogout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, setLoginType, getLoginType, removeLoginType } from '@/utils/auth'
import { isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

const useClientUserStore = defineStore(
  'clientUser',
  {
    state: () => ({
      token: getToken(),
      id: '',
      userno: '',
      username:'',
      avatar: '',
      loginType: getLoginType(),
      roles: [],
      permissions:[]
    }),
    actions: {
      // 登录
      clientLogin(userInfo) {
        const userno = userInfo.userno.trim()
        const password = userInfo.password
        // const code = userInfo.code
        // const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          clientLogin(userno, password).then(res => {
            let data = res.data
            console.log(data)
            setToken(data.access_token)
            setLoginType(data.login_type)
            this.token = data.access_token
            this.loginType = data.login_type
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getUserInfo() {
        // debugger
        return new Promise((resolve, reject) => {
          // debugger
          getUserInfo().then(res => {
            // debugger
            const user = res.user
            const avatar = (isEmpty(user.avatar)) ? defAva : user.avatar
            this.id = user.id
            this.username = user.userName
            this.userno = user.userNo
            this.avatar = avatar
            this.roles = ['admin']
            this.permissions = ['*:*:*']
            resolve(res)
          }).catch(error => {
            console.log(error)
            reject(error)
          })
        })
      },
      // 退出系统
      clientLogout() {
        return new Promise((resolve, reject) => {
          clientLogout(this.token).then(() => {
            this.token = ''
            this.roles = []
            removeToken()
            removeLoginType()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useClientUserStore
