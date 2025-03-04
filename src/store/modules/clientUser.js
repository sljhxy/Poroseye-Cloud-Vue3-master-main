import { clientLogin, clientLogout, getClientInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
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
      avatar: ''
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
          getClientInfo().then(res => {
            const user = res.user
            const avatar = (isEmpty(user.avatar)) ? defAva : user.avatar
            this.id = user.id
            this.username = user.userName
            this.userno = user.userNo
            this.avatar = avatar
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      clientLogout() {
        return new Promise((resolve, reject) => {
          clientLogout(this.token).then(() => {
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

export default useClientUserStore
