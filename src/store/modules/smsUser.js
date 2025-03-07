import { smsLogin, smsLogout, getSmsInfo, registerAppUser, getQRCode, checkQRCode } from '@/api/login'
import { getToken, setToken, removeToken , setLoginType, getLoginType, removeLoginType} from '@/utils/auth'
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
      loginType: getLoginType(),
      phoneNumber:'',
      avatar: '',
      roles: [],
      permissions:[],
      codeImage:'',
      nickname:'',
      ticketData:'',//票证信息 用于获取微信二维码
      loginTimer:''//定时器
    }),
    actions: {
      //微醺登科
      wxlogin() {

        return new Promise (async (resolve, reject) => {
          //调用二维码接口，获取 ticket
          // debugger
          const ticketRes = await getQRCode()
          console.log('二维码接口返回的ticket：', ticketRes.data.ticket)
          this.ticketData = ticketRes.data.ticket;

          //固定链接通过 ticket调用微信API，获取微信二维码图片
          this.codeImage = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${this.ticketData}`;
          if(this.ticketData) {
            //设置定时器轮询checkQRCode 轮询登录接口
            this.loginTimer = setInterval(async () => {
              const res = await checkQRCode({ticket: this.ticketData})
              //!= -1 表示关注成功
              const scanResData = res.data.scanResult;
              if (scanResData != -1) {
                //停止轮询
                clearInterval(this.loginTimer);
                //存储用户信息
                setToken(res.data.token.access_token)
                setLoginType('app_user')
                this.avator = res.data.user.avatar;
                this.nickname = res.data.user.wxNickName;
                this.id = res.data.user.id;
                // if(res.data.token.access_token) {
                //   console.log('微信扫码登录成功')
                //   const query = route.query;
                //   const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
                //     if (cur !== "redirect") {
                //       acc[cur] = query[cur];
                //     }
                //     return acc;
                //   }, {});
                //   console.log('微信扫码登录成功。。。1111111。。')
                //   router.push({ path: redirect.value || "/", query: otherQueryParams });
                //   console.log('微信扫码登录成功。。。。。')
                //   clearInterval(loginTimer.value);
                // }
                resolve()
              } else if(scanResData == -2) {
                //== -2 表示二维码过期
                clearInterval(loginTimer);
                reject(error)
              } 
              
            }, 3000);
          }
        })
      },
      // 短信登录
      smsLogin(userInfo) {
        const phoneNumber = userInfo.phonenumber.trim()
        const smsCode = userInfo.smsCode
        // const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          smsLogin(phoneNumber, smsCode, uuid).then(res => {
            let data = res.data
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
      //注册用户
      registerSmsUser(userInfo){
        const phoneNumber = userInfo.phonenumber.trim()
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
            this.phoneNumber = user.phonenumber
            this.avatar = avatar
            this.roles = ['admin']
            this.permissions = ['*:*:*']
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
            removeLoginType()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useSmsUserStore
