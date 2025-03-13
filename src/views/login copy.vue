<template>
  <div class="login">

    <div class="login-container" v-if="!registeFlag">
      <div class="login-header">
        <h2>欢迎使用仿真实验室</h2>
      </div>

      <!-- tab 切换栏 -->
      <div class="login-tabs">
        <el-tabs v-model="activeTab" class="custom-tabs"
          style="width: 400px;--el-color-primary:#ff6634;--el-text-color-primary:#999;--el-font-size-base: 17px; "
          stretch="true" @tab-click="handleTabChange">
          <!-- --el-border-radius-base:30px -->
          <el-tab-pane name="account">
            <template #label>
              <div class="login-tabs-span">
                <span :class="{ 'active-tab': activeTab === 'account' }">{{ !isWechatLoginFlag ? '账号登录' : '微信扫码登录'
                  }}</span>
              </div>
            </template>

            <div class="login-form" v-if="!isWechatLoginFlag">

                <el-form ref="loginRef" :model="formData" :rules="rules" label-width="auto" style="max-width: 600px">
                  <el-form-item prop="userno">
                    <el-input v-model="formData.userno" style="width: 100%;height: 50px;
                        margin-top: 20px;--el-border-radius-base: 30px;" size="large" type="text" placeholder="请输入学号" :prefix-icon="User" clearable/>
                  </el-form-item>

                  <el-form-item prop="password">
                    <el-input v-model="formData.password" style="width: 100%;height: 50px;--el-border-radius-base: 30px;" size="large"
                      type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable />
                  </el-form-item>

                  <el-form-item>
                    <label class="remember-account">
                      <input type="checkbox" v-model="formData.rememberAccount">
                      <span>记住当前账号</span>
                    </label>
                    <el-button class="login-button" 
                      :loading="loading"
                      :disabled="!formData.userno && !formData.password" 
                      :class="{ loginBtn: formData.userno && formData.password }" @click.prevent="handleLogin">
                      
                        <span v-if="!loading">登 录</span>
                        <span v-else>登 录 中...</span>
                    </el-button>
                  </el-form-item>

                </el-form>

            </div>

            <!-- 微信扫码登录 -->
            <div class="login-form" v-else>
              <div class="form-item-weixin">
                <span>微信扫码关注公众号登录</span>
              </div>
              <div class="qrcode-wrapper">
                <div class="qrcode-img">
                  <img :src="codeImage" alt="weixin" width="252px">
                </div>
              </div>

            </div>


          </el-tab-pane>
          <el-tab-pane name="phone">
            <template #label>
              <div class="login-tabs-span">
                <span :class="{ 'active-tab': activeTab === 'phone' }">手机号登录</span>
              </div>
            </template>

            <el-form ref="loginPhoneRef" :model="formData" :rules="rules" label-width="auto" style="max-width: 600px">
              <el-form-item prop="phonenumber">
                <el-input v-model="formData.phonenumber" style="width: 100%;
                        margin-top: 20px;height: 50px;--el-border-radius-base: 30px;" size="large" type="text" placeholder="请输入手机号码"
                  :prefix-icon="Iphone" :clearable="!isPhoneValid" >
                  <template #suffix>
                    <el-icon class="valid-icon" v-if="isPhoneValid"><CircleCheck /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="formData.smsCode" style="width: 100%;height: 50px;--el-border-radius-base: 30px;" size="large"
                  type="text" placeholder="请输入短信验证码" :prefix-icon="ChatDotSquare" clearable>
                  <template #append>
                    <el-button  :disabled="!isPhoneValid" :class="{ activeYzm: isPhoneValid }" @click="handleSendCode">{{ countdown >
                              0 ? `${countdown}s` : '获取验证码' }}</el-button>
                  </template>
                </el-input>
                <!-- style="color: #ff6634;" -->
              </el-form-item>

              <!-- 滑动验证 -->
              <!-- <Verify
                ref="verify"
                :captchaType="'blockPuzzle'"
                :imgSize="{ width: '330px', height: '155px' }"
                :mode="'pop'"
                @success="capctchaCheckSuccess"
              ></Verify> -->

              <el-form-item>
                <label class="remember-account">
                  <input type="checkbox" v-model="formData.rememberPhoneNumber">
                  <span>记住当前账号</span>
                </label>
                <!-- <button class="login-button" @click="handleSubjectChange">登录</button> -->
                <el-button class="login-button" 
                  :loading="loading"
                  :disabled="!formData.phonenumber && !formData.smsCode"
                  :class="{ loginBtn: formData.phonenumber && formData.smsCode }" 
                  @click.prevent="handleSmsLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              </el-form-item>
            </el-form>


          </el-tab-pane>
        </el-tabs>
      </div>


      <!-- 登录按钮底部 -->
      <div class="login-footer" v-if="!isWechatLoginFlag">
        <span class="forgot-password">忘记密码</span>

        <span class="split-line" style="margin: 0 15px 0 15px;color: #999;">|</span>

        <span class="quick-register" @click="register">快速注册</span>
      </div>

      <div class="other-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        <div class="login-methods">
          <div class="method-item">
            <el-button size="small" round class="login-btn">
              <!-- --el-color-primary  --el-color-primary-light-7 --el-color-primary-light-9 -->
              <el-icon v-show="isWechatLoginFlag">
                <User />
              </el-icon>
              <img class="weixin-icon" src="../assets/images/weixin.png" alt="weixin-1" width="15px"
                v-show="!isWechatLoginFlag" />&nbsp;&nbsp;
              <i class="wechat-icon" @click="weixinLogin(isWechatLoginFlag)">{{ isWechatLoginFlag ? '账户密码登录' : '微信扫码登录' }}</i>
            </el-button>

          </div>
        </div>
      </div>
    </div>

    <!-- 注册页面 -->
    <div class="login-container" v-else="registeFlag">
      <div class="login-header">
        <h2>欢迎使用仿真实验室</h2>
      </div>

      <div class="login-form"
        style="margin: 0 auto;width: 400px;--el-color-primary:#ff6634;--el-text-color-primary:#999;--el-font-size-base: 17px;">

        <el-form ref="registerUserRef" :model="formData" :rules="registerRules" label-width="auto" style="max-width: 600px">
          <el-form-item prop="phonenumber">
            <el-input v-model="formData.phonenumber" style="width: 100%;
                        margin-top: 20px;height: 50px;--el-border-radius-base: 30px;" size="large" type="text" placeholder="请输入手机号"
              :prefix-icon="Iphone" :clearable="!isPhoneValid">
              <template #suffix>
                    <el-icon class="valid-icon" v-if="isPhoneValid"><CircleCheck /></el-icon>
                  </template>
            </el-input>
          </el-form-item>
          <el-form-item>

            <el-input v-model="formData.smsCode" style="width: 100%;height: 50px;--el-border-radius-base: 30px;" size="large" type="text"
              placeholder="请输入短信验证码" :prefix-icon="ChatDotSquare" clearable>
              <template #append>
                <el-button :disabled="!isPhoneValid" :class="{ activeYzm: isPhoneValid }" @click="handleSendCode">{{ countdown > 0 ?
                        `获取验证码${countdown}s` : '获取验证码' }}</el-button>
              </template>

            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formData.password" style="width: 100%;height: 50px;--el-border-radius-base: 30px;" size="large"
              type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable />

          </el-form-item>
          <el-form-item prop="isagree">
            <label class="remember-account">
              <input type="checkbox" v-model="formData.isagree">
              <span style="cursor: pointer;">我已阅读并同意<span style="color: #40a9ff;" @click="goToUserAgreement">《POROSEYE用户协议》</span>和
              <span style="color: #40a9ff;" @click="goToPrivacyPolicy">《隐私政策》</span></span>
              
            </label>
            <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
            <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
            <el-button class="login-button" 
              :loading="loading"
              :disabled="!formData.phonenumber && !formData.smsCode && !formData.password"
              :class="{ loginBtn: formData.phonenumber && formData.smsCode && formData.password }" @click="handleRegisterUser">
                <span v-if="!loading">注 册</span>
                <span v-else>注 册 中...</span>
            </el-button>
          </el-form-item>
        </el-form>

      </div>

      <!-- tab 切换栏 -->
      <div class="login-tabs" style="margin-top: 100px;">
        <span @click="register">已有账户,
          <span style="color: #ff6634;cursor: pointer;font-size: 16px;">直接登录</span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { User, Lock, Iphone, Message, ChatDotSquare,CircleCheck } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getToken, setToken, removeToken , setLoginType, getLoginType, removeLoginType} from '@/utils/auth'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

import Verify from "@/components/Verifition/Verify";

const loginDialog = ref(false);

const activeTab = ref('account');
const countdown = ref(0);
const isWechatLogin = ref(false);


//导入相关登录接口
import {clientLogin, getQRCode, checkQRCode, getSmsCode, registerAppUser, smsLogin } from "@/api/login"

import useClientUserStore from '@/store/modules/clientUser'
import useSmsUserStore from '@/store/modules/smsUser'

const userStore = useClientUserStore()
const smsStore = useSmsUserStore()


const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const loading = ref(false);


const redirect = ref(undefined);
watch(route, (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect;
}, { immediate: true });


const formData = ref({
  phonenumber:'',
  userno: '',
  password: '',
  smsCode: '',
  uuid: '',
  rememberAccount: false,
  rememberPhoneNumber: false,
  isagree: ''
});


//清空表单数据
const resetFormData = () => {
  formData.value = {
    phonenumber: null,
    userno: null,
    password: null,
    smsCode: null,
    uuid: null
  };
};

const rules = {
  userno: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 5, max: 16, message: '学号长度为6-16位', trigger: 'blur' }
  ],
  phonenumber: [
    { required: true, message: '请输入正确的手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
  ],
}


const registerRules = {
  phonenumber: [
    { required: true, message: '请输入正确的手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  isagree: [
    { required: true, message: '请勾选相关协议', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
  ],
}


// 添加手机号验证计算属性
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(formData.value.phonenumber)
})


const handleTabChange = (tab) => {
  activeTab.value = tab.props.name
  // 清空搜索内容并重新加载数据
  if (activeTab.value == 'account') {
    // 重新加载教材版本数据
    // getLibraryList()
    getCookie()
  } else if (activeTab.value == 'phone') {

    getCookie()
    resetFormData()//先重置表单
    // 重新加载知识点数据
  }
}

//账号登录
function handleLogin(){

  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
  // 校验表单
  // if (formData.value.userno == '') {
  //   ElMessage.warning('学号不能为空')
  //   return
  // }

  // if (formData.value.password == '') {
  //   ElMessage.warning('密码不能为空')
  //   return
  // }

  // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
    if (formData.value.rememberAccount) {
        Cookies.set("userno", formData.value.userno, { expires: 30 });
        Cookies.set("password", encrypt(formData.value.password), { expires: 30 });
        Cookies.set("rememberAccount", formData.value.rememberAccount, { expires: 30 });
    } else {
        // 否则移除
        Cookies.remove("userno");
        Cookies.remove("password");
        Cookies.remove("rememberAccount");
    }


    // 调用action的登录方法
    userStore.clientLogin(formData.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        console.log('客户端登录成功。。。。。')
        router.push({ path: redirect.value || "/", query: otherQueryParams });
        console.log('客户端登录成功。。。。。')
      }).catch(() => {
        loading.value = false;
      });

    }
  })
}



//短信验证码登录
function handleSmsLogin() {
  
  proxy.$refs.loginPhoneRef.validate(valid => {
    if (valid) {
      
      loading.value = true;

       // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (formData.value.rememberPhoneNumber) {
          Cookies.set("phonenumber", formData.value.phonenumber, { expires: 30 });
          Cookies.set("rememberPhoneNumber", formData.value.rememberPhoneNumber, { expires: 30 });
      } else {
          // 否则移除
          Cookies.remove("phonenumber");
          Cookies.remove("rememberPhoneNumber");
      }


      smsStore.smsLogin(formData.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        console.log('手机端短信登录成功。。。1111111。。')
        router.push({ path: redirect.value || "/", query: otherQueryParams });
        console.log('客户端登录成功。。。。。')
      }).catch(() => {
        loading.value = false;
      });
    }
  });

}


//短信注册
function handleRegisterUser() {
  proxy.$refs.registerUserRef.validate(valid => {
  
    if(valid) {
      loading.value = true;

      formData.value.isagree = formData.value.isagree ? '1' : '0'
        registerAppUser(formData.value).then((res) => {
          console.log('注册用户成功。。。')
          // registeFlag
          if(res.code === 200) {
            ElMessageBox.alert("<font color='#ff6634'>恭喜你，您的账号 " + formData.value.phonenumber + " 注册成功！</font>", "系统提示", {
              dangerouslyUseHTMLString: true,
              type: "success",
            }).then(() => {
              loading.value = false;
              registeFlag.value = !registeFlag.value//切换到手机登录页面
              activeTab.value = 'phone'//切换到手机登录页面
              router.push("/login");
            }).catch(() => {});
          }

          //错误提示
          if(res.code == 500) {
            ElMessage.error(res.msg)
          }
        }).catch(() => {
          loading.value = false;
        });
    }
    
  })
}

  

const goToUserAgreement = () => {
  router.push('/user-agreement');
};

const goToPrivacyPolicy = () => {
  router.push('/privacy-policy');
};

const toggleLoginMode = () => {
  isWechatLogin.value = !isWechatLogin.value;
};

//发送验证码
const handleSendCode = () => {
  //开启验证
  // proxy.$refs.verify.show()

  if (countdown.value > 0) return;
  //获取短信验证码
  getSmsCode(formData.value.phonenumber).then(res => {
    if(res.code === 200) {
      formData.value.uuid = res.data.uuid
    }
    if(res.code === 500) {
      ElMessage.error(res.data.msg)
    }
  });
  //一分钟有效时间
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      loading.value = false;
      ElMessage.error('登录超时，验证码已失效,请重新发送进行登录')
      clearInterval(timer);
    }
  }, 1000);
};



const showPassword = ref(false);
const showPassworType = ref(false)

//切换密码显示与隐藏
const togglePassword = () => {
  showPassword.value = !showPassword.value;
  showPassworType.value = !showPassworType.value;
};

//快速注册密码
const registeFlag = ref(false)
const register = () => {
  console.log('kuaisu ')
  registeFlag.value = !registeFlag.value;
  //重置数据
  resetFormData()
}

//微信扫码登录
const isWechatLoginFlag = ref(false)
const weixinLogin = (value) => {
  loading.value = false //取消登录加载过程
  isWechatLoginFlag.value = !isWechatLoginFlag.value;
  activeTab.value = 'account'

  console.log(value)
  if(value == false) {//切换微信扫码
    scan()
    // wcLogin()
  } else{
    //停止轮询
    clearInterval(loginTimer.value);
    console.log('停止了')
  }
}


function wcLogin() {
  console.log(smsStore.codeImage)
  console.log(smsStore.loginTimer)
  codeImage.value = smsStore.codeImage;
  smsStore.wxlogin().then(() => {
    
    console.log('codeImage.value')
    console.log(codeImage.value)
    console.log('codeImage.value')
    clearInterval(smsStore.loginTimer)
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        console.log('微信扫码登录成功。。。1111111。。')
        router.push({ path: redirect.value || "/", query: otherQueryParams });
        console.log('微信扫码登录成功。。。。。')
      }).catch(() => {
        loading.value = false;
      });
}


//获取二维码
const codeImage = ref('')//二维码图片
const ticketData = ref('')//票证信息
const userInfo = ref({})//用户信息
const loginTimer = ref()
const scan = async () => {
  //调用二维码接口，获取 ticket
  const ticketRes = await getQRCode()
  ticketData.value = ticketRes.data.ticket;

  //固定链接通过 ticket调用微信API，获取微信二维码图片
  codeImage.value = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticketData.value}`;
  if(ticketData.value) {
    //设置定时器轮询checkQRCode 轮询登录接口
    loginTimer.value = setInterval(async () => {
      const res = await checkQRCode({ticket: ticketData.value})
      //!= -1 表示关注成功
      const scanResData = res.data.scanResult;
      if (scanResData != -1) {
        //停止轮询
        clearInterval(loginTimer.value);
        //存储用户信息
        userInfo.value.access_token = res.data.token.access_token;
        userInfo.value.avator = res.data.user.avatar;
        userInfo.value.nickname = res.data.user.wxNickName;
        userInfo.value.userId = res.data.user.id;
        userInfo.value.loginType = res.data.login_type;
        console.log('微信扫码登录成功。。。2222222。。')
        console.log(smsStore.$id)
        console.log('微信扫码登录成功。。。2222222。。')
        setToken(userInfo.value.access_token)
        setLoginType(userInfo.value.loginType)
        smsStore.token = userInfo.value.access_token
        smsStore.loginType = userInfo.value.loginType
        smsStore.avatar = userInfo.value.avator
        smsStore.nickname = userInfo.value.nickname
        console.log(smsStore.token)
        if(getToken()) {
          console.log('微信扫码登录成功')
          const query = route.query;
          const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
            if (cur !== "redirect") {
              acc[cur] = query[cur];
            }
            return acc;
          }, {});
          console.log('微信扫码登录成功。。。1111111。。')
          router.push({ path: redirect.value || "/", query: otherQueryParams });
          console.log('微信扫码登录成功。。。。。')
          clearInterval(loginTimer.value);
        }
      } else if(scanResData == -2) {
        //== -2 表示二维码过期
        clearInterval(loginTimer.value);
      } 
      // else if(scanResData == -1) {
      //   ElMessage.error('您没有关注公众号，需要关注公众号才能登录')
      // }
      
    }, 3000);
  }
}



function getCookie() {
  const userno = Cookies.get("userno");
  const password = Cookies.get("password");
  const rememberAccount = Cookies.get("rememberAccount");
  const rememberPhoneNumber = Cookies.get("rememberPhoneNumber");
  const phonenumber = Cookies.get("phonenumber");
  formData.value = {
    userno: userno === undefined ? formData.value.userno : userno,
    password: password === undefined ? formData.value.password : decrypt(password),
    phonenumber: phonenumber === undefined ? formData.value.phonenumber : phonenumber,
    rememberAccount: rememberAccount === undefined ? false : Boolean(rememberAccount),
    rememberPhoneNumber: rememberPhoneNumber === undefined ? false : Boolean(rememberPhoneNumber)
  };
  console.log(phonenumber)
  console.log(rememberPhoneNumber)
}


function capctchaCheckSuccess() {

}

getCookie()
</script>

<style lang='scss' scoped>
.layout{
  background-image: url("../assets/images/login-bg.png");
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  background-image: url("../assets/images/login-bg.png");


  //手机号输入正常后的样式
  :deep(.valid-icon) {
    color: #67c23a;
    font-size: 16px;
    margin-right: 8px;
  }

  .login-container {
    width: 480px;
    height: 600px;
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 11px 15px 12px rgba(0, 0, 0, 0.1);
  }

  .login-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      font-size: 25px;
      color: #333;
      font-weight: 900;
    }

  }

  .login-tabs {
    display: flex;
    // border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;

  }

  .form-item-weixin {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  // 微信二维码样式
  .qrcode-wrapper {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    .qrcode-img {

      width: 200px;
      height: 200px;
      border: 1px solid #eee;

      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
  }

  //验证码样式
  .activeYzm{
    color:#ff6634;

    &:hover {
      color:#ff6634;
    }
  }


//记住账户样式
  .remember-account {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #666;
    font-size: 14px;
      input[type="checkbox"] {
        margin-right: 8px;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 1px solid #dcdfe6;
        border-radius: 30px;
        background-color: #fff;
        transition: all 0.3s;
        position: relative;
        cursor: pointer;

        &:checked {
          background-color: #ff6634;
          border-color: #ff6634;

          &::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 5px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }

        &:hover {
          border-color: #ff6634;
          cursor: pointer;
        }
      }

  }

  .login-button {
    width: 100%;
    height: 50px;
    background: #ffdfd3;
    border: none;
    border-radius: 30px;
    color: #fff;
    font-size: 16px;
    // cursor: pointer;
    margin-bottom: 10px;

    // &:hover {
    //   background: #ff6634;
    // }

  
  }

  .loginBtn {
      background: #ff6634;
    }

  .login-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    font-size: 14px;
    margin-top: 20px;

    .forgot-password,
    .quick-register {
      color: #666;
      cursor: pointer;

      &:hover {
        color: #ff6634;
      }
    }
  }

  .other-login {
    .divider {
      display: flex;
      align-items: center;
      color: #999;
      font-size: 14px;
      margin: 20px 0;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #eee;
      }

      span {
        padding: 0 12px;
      }
    }

    .login-methods {
      display: flex;
      justify-content: center;
      gap: 40px;

      .method-item {
        text-align: center;
        cursor: pointer;
        color: #666;
        font-size: 14px;

        .login-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s;

          .weixin-icon {
            filter: brightness(0.5);
            transition: all 0.3s;
          }

          &:hover {
            .weixin-icon {
              filter: invert(53%) sepia(78%) saturate(2597%) hue-rotate(335deg) brightness(102%) contrast(114%);
            }

            .wechat-icon {
              color: var(--el-color-primary);
            }
          }
        }

        .wechat-icon {
          font-size: 15px;
          transition: all 0.3s;
        }




        //其他登录方式按钮样式
        .el-button {
          --el-color-primary: #ff6634; //字体颜色
          --el-color-primary-light-7: #ff6634; //获取光标边框颜色
          --el-color-primary-light-9: white; //获取光标的背景颜色
        }


        .wechat-icon {
          font-size: 15px;
        }

        i {
          font-style: normal;
        }

        &:hover {
          color: #ff6634;
        }
      }
    }
  }
}


</style>
