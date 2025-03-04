<template>
  <div class="login">

    12312
    <div class="login-container" v-if="!registeFlag">
      <div class="login-header">
        <h2>欢迎使用仿真实验室</h2>
        <!-- <div class="close-icon">×</div> -->
      </div>
      
      <!-- tab 切换栏 -->
       <div class="login-tabs">
        <el-tabs 
          v-model="activeTab"
          class="custom-tabs"
          style="width: 400px;--el-color-primary:#ff6634;--el-text-color-primary:#999;--el-font-size-base: 17px; "
          stretch="true"
          @tab-click="handleTabChange"
        >
        <!-- --el-border-radius-base:30px -->
        <el-tab-pane name="account">
                <template #label>
                  <div class="login-tabs-span">
                    <span  :class="{ 'active-tab': activeTab === 'account' }">{{ !isWechatLoginFlag ? '学号登录' : '微信扫码登录' }}</span>
                  </div>
                </template>

                <div class="login-form" v-if="!isWechatLoginFlag">

                  <div class="item-input">

                    <el-form :model="formData" label-width="auto" style="max-width: 600px">
                      <el-form-item>
                        <el-input
                        v-model="formData.username"
                        style="width: 100%;height: 50px;
                        margin: 20px 0 0 0"
                        size="large"
                        type="text"
                        placeholder="请输入学号"
                        :prefix-icon="User"
                        clearable
                      >  <!-- <template #prepend>
                      <el-button :icon="User" />
                    </template> -->
                  </el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-input
                        v-model="formData.password"
                        style="width: 100%;margin: 0 0 0 0;height: 50px;"
                        size="large"
                        type="password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                      />
                      </el-form-item>

                      <el-form-item>
                        <label class="remember-account">
                      <input type="checkbox" v-model="rememberAccount">
                      <span>记住当前账号</span>
                  </label>
                  <!-- <button class="login-button" @click="handleSubjectChange">登录</button> -->
                  <el-button class="login-button" @click="handleSubjectChange">登录</el-button>
                      </el-form-item>
                    </el-form>
                   
                  
               
                  </div>
                
                  <!-- <div class="form-item">
                    <div class="input-with-icon">
                      <el-icon class="input-icon"><User /></el-icon>
                      <input 
                        v-model="formData.username"
                        type="text" 
                        placeholder="请输入学号"
                      >
                    </div>
                   
                    
                  </div>
                  <div class="form-item">
                    <div class="input-with-icon">
                      <el-icon class="input-icon"><Lock /></el-icon>
                      <input 
                        v-model="formData.password"
                        :type="showPassworType ? 'text' : 'password'" 
                        placeholder="请输入密码"
                        
                      >
                      <span class="eye-icon" @click="togglePassword">
                         {{ showPassword ? '👀' : '👁' }} -->
                        <!-- <el-icon v-if="!showPassword"><Hide /></el-icon>
                        <el-icon v-else><View /></el-icon>
                      </span>
                    </div>
                     
                  </div>-->
                   
                </div>
              

                <div class="login-form" v-else>
                  <div class="form-item-weixin">
                    <span>微信扫码关注公众号登录</span>
                  </div>
                  <div class="qrcode-wrapper">
                    <div class="qrcode-img">
                    <img src="../assets/images/profile.jpg" alt="weixin" width="252px">
                  </div>
                  </div>
                  
                </div>
               


                
        </el-tab-pane>
        <el-tab-pane name="phone">
                <template #label>
                  <div class="login-tabs-span">
                    <span  :class="{ 'active-tab': activeTab === 'phone' }">手机号登录</span>
                  </div>
                </template>

                <el-form :model="formData" label-width="auto" style="max-width: 600px">
                  <el-form-item>
                    <el-input
                        v-model="formData.username"
                        style="width: 100%;
                        margin: 20px 0 0 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="请输入手机号"
                        :prefix-icon="Iphone"
                        clearable
                      />
                  </el-form-item>
                  <el-form-item>
                    <el-input
                        v-model="formData.code"
                        style="width: 100%;margin: 0 0 0 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="短信验证码"
                        :prefix-icon="ChatDotSquare"
                        clearable
                      >
                      <template #append>
                         <el-button 
                          :disabled="countdown > 0"
                          style="color: #ff6634;"
                          @click="handleSendCode">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</el-button>
                       
                      </template>
                    
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <label class="remember-account">
                      <input type="checkbox" v-model="rememberAccount">
                      <span>记住当前账号</span>
                    </label>
                    <!-- <button class="login-button" @click="handleSubjectChange">登录</button> -->
                    <el-button class="login-button" @click="handleSubjectChange">登录</el-button>
                  </el-form-item>
                </el-form>
              


                   

                <!-- <div class="login-form">
                  <div class="form-item">
                    <div class="input-with-icon">
                      <el-icon class="input-icon"><Iphone /></el-icon>
                        <input 
                        v-model="formData.username"
                        type="text" 
                        placeholder="请输入验证码"
                      >
                    </div>
                    
                  </div>
                  <div class="form-item verify-code">
                    <div class="code-input-wrapper">
                      <el-icon class="input-icon"><Message /></el-icon>
                      <input 
                        v-model="formData.code"
                        type="text" 
                        placeholder="请输入验证码"
                      >
                      <span class="split-line">|</span>
                      <button 
                        class="code-button" 
                        :disabled="countdown > 0"
                        @click="handleSendCode"
                      >
                        {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                      </button>
                    </div>
                  </div>
                </div> -->
              

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
              <el-icon v-show="isWechatLoginFlag"><User /></el-icon>
              <img class="weixin-icon" src="../assets/images/weixin.png" alt="weixin-1" width="15px" v-show="!isWechatLoginFlag"/>&nbsp;&nbsp;
              <i class="wechat-icon" @click="weixinLogin">{{ isWechatLoginFlag ? '学号登录' : '微信扫码登录' }}</i>
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

      <el-form :model="formData" label-width="auto" style="max-width: 600px">
        <el-form-item>
          <el-input
                        v-model="formData.username"
                        style="width: 100%;
                        margin: 20px 0 0 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="请输入手机号"
                        :prefix-icon="Iphone"
                        clearable
                      />
        </el-form-item>
        <el-form-item>
                     
          <el-input
                        v-model="formData.code"
                        style="width: 100%;margin: 0 0 0 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="短信验证码"
                        :prefix-icon="ChatDotSquare"
                        clearable
                      >
                      <template #append>
                        <el-button 
                        class="code-button" 
                        :disabled="countdown > 0"
                          @click="handleSendCode">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</el-button>
                      </template>
                    
                    </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
                        v-model="formData.password"
                        style="width: 100%;margin: 0 0 0 0;height: 50px;"
                        size="large"
                        type="password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                      />

        </el-form-item>
      </el-form>
                  
                <!-- <el-input
                        v-model="formData.username"
                        style="width: 100%;
                        margin: 20px 0 20px 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="请输入手机号"
                        :prefix-icon="Iphone"
                        clearable
                      />
              
                


                      <el-input
                        v-model="formData.code"
                        style="width: 100%;margin: 0 0 20px 0;height: 50px;"
                        size="large"
                        type="text"
                        placeholder="短信验证码"
                        :prefix-icon="ChatDotSquare"
                        clearable
                      >
                      <template #append>
                        <el-button 
                        class="code-button" 
                        :disabled="countdown > 0"
                          @click="handleSendCode">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</el-button>
                      </template>
                    
                    </el-input>

                    <el-input
                        v-model="formData.password"
                        style="width: 100%;margin: 0 0 20px 0;height: 50px;"
                        size="large"
                        type="password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                      /> -->


        <!-- <div class="form-item">
          <div class="input-with-icon">
            <el-icon class="input-icon"><Iphone /></el-icon>
            <input 
                      v-model="formData.username"
                      type="text" 
                      placeholder="请输入手机号"
                    >
          </div>
                  
                  </div> -->
                  <!-- <div class="form-item verify-code">
                    <div class="code-input-wrapper">
                      
                      <el-icon class="input-icon"><Message /></el-icon>
                      <input 
                        v-model="formData.code"
                        type="text" 
                        placeholder="请输入验证码"
                      >
                      <span class="split-line">|</span>
                      <button 
                        class="code-button" 
                        :disabled="countdown > 0"
                        @click="handleSendCode"
                      >
                        {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                      </button>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="input-with-icon">
                      <el-icon class="input-icon"><Lock /></el-icon>
                      <input 
                        v-model="formData.password"
                        :type="showPassworType ? 'text' : 'password'" 
                        placeholder="请输入密码"
                        
                      >
                      <span class="eye-icon" @click="togglePassword"> -->
                        <!-- {{ showPassword ? '👀' : '👁' }} -->
                        <!-- <el-icon v-if="!showPassword"><Hide /></el-icon>
                        <el-icon v-else><View /></el-icon>
                      </span>
                    </div> -->
                   
                 <!-- </div> -->
                
                 <label class="remember-account">
                  <input type="checkbox" v-model="rememberAccount">
                  <span style="cursor: pointer;">我已阅读并同意<span style="color: #40a9ff;">《POROSEYE 用户协议》</span></span>
                </label>
                 <!-- <button class="login-button" @click="handleSubjectChange">注册</button> -->
                 <el-button class="login-button" @click="handleSubjectChange">注册</el-button>
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
import { User,Lock,Iphone, Message, ChatDotSquare } from '@element-plus/icons-vue'

const activeTab = ref('account');
const rememberAccount = ref(false);
const countdown = ref(0);
const isWechatLogin = ref(false);

const formData = ref({
  username: '',
  password: '',
  code: ''
});


const handleTabChange = (tab) => {
  activeTab.value = tab.props.name
  // 清空搜索内容并重新加载数据
  if (activeTab.value == 'account') {
    // 重新加载教材版本数据
    // getLibraryList()
  } else if(activeTab.value == 'phone') {

    // 重新加载知识点数据
  }
}

//将用户选择的科目传到首页
const router = useRouter()

function handleSubjectChange() {
  router.push({
    path: '/index',
    query: { 
     
      _t: Date.now() // 添加时间戳参数强制刷新列表
    }
  })

  
}


const toggleLoginMode = () => {
  isWechatLogin.value = !isWechatLogin.value;
};

const handleSendCode = () => {
  if (countdown.value > 0) return;
  // 这里添加发送验证码的逻辑
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
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
  registeFlag.value =!registeFlag.value;
}

//微信扫码登录
const isWechatLoginFlag = ref(false)
const weixinLogin = () => {
  isWechatLoginFlag.value =!isWechatLoginFlag.value;
  activeTab.value = 'account'
}
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  background-image: url("../assets/images/login-background.jpg");

  
  // .eye-icon {
  //   position: absolute;
  //   right: 15px;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   cursor: pointer;
  //   color: #999;
  //   user-select: none;
    
  //   &:hover {
  //     color: #666;
  //   }
  // }
  .login-container {
    width: 480px;
    height: 600px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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

    // .close-icon {
    //   cursor: pointer;
    //   font-size: 20px;
    //   color: #999;
    // }
  }

  .login-tabs {
    display: flex;
    // border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;


    // .el-tabs__item:hover {
    // color: #999; 
    // cursor: pointer;
    // }
    // .tab-item {
    //   padding: 12px 0;
    //   margin-right: 24px;
    //   cursor: pointer;
    //   color: #666;
    //   position: relative;

    //   &.active {
    //     color: #ff6634;
    //     &::after {
    //       content: '';
    //       position: absolute;
    //       bottom: -1px;
    //       left: 0;
    //       width: 100%;
    //       height: 2px;
    //       background: #ff6634;
    //     }
    //   }
    // }
  }

  // .login-form {
    // .form-item {
    //   position: relative;
    //   margin-bottom: 20px;



    //   .input-with-icon {
    //     position: relative;
    //     display: flex;
    //     align-items: center;
    //     background: #f7f7f7;
    //     border: 1px solid #e4e4e4;
    //     border-radius: 22px;

    //     .input-icon {
    //       position: absolute;
    //       left: 15px;
    //       color: #999;
    //       font-size: 18px;
    //     }

    //     input {
    //       padding-left: 45px;
    //       border: none;
    //       background: transparent;

    //       &:focus {
    //         border: none;
    //       }
    //     }
    //   }



    //   &.verify-code {
    //     .code-input-wrapper {
    //       display: flex;
    //       align-items: center;
    //       background: #f7f7f7;
    //       border: 1px solid #e4e4e4;
    //       border-radius: 22px;
    //       padding-right: 15px;

    //       .input-icon {
    //         margin-left: 15px;
    //         color: #999;
    //         font-size: 18px;
    //       }

    //       input {
    //         border: none;
    //         background: transparent;
    //         flex: 1;
            
    //         &:focus {
    //           border-color: transparent;
    //         }

            
           

    //       }

    //       .split-line {
    //         color: #e4e4e4;
    //         margin: 0 10px;
    //       }

        

    //       .code-button {
    //         border: none;
    //         background: transparent;
    //         color: #ff6634;
    //         font-size: 14px;
    //         cursor: pointer;
    //         padding: 100;
    //         white-space: nowrap;
    //         min-width: 80px;
    //         text-align: center;

    //         &:disabled {
    //           color: #999;
    //           cursor: not-allowed;
    //         }
    //       }
    //     }}
    //   input {
    //     width: 100%;
    //     height: 44px;
    //     padding: 0 15px;
    //     border: 1px solid #e4e4e4;
    //     border-radius: 22px;
    //     background: #f7f7f7;
    //     font-size: 14px;

    //     &:focus {
    //       outline: none;
    //       border-color: #ff6634;
    //     }
    //   }

    //   .eye-icon {
    //     position: absolute;
    //     right: 15px;
    //     top: 50%;
    //     transform: translateY(-50%);
    //     cursor: pointer;
    //     color: #999;
    //   }
    // }

    .form-item-weixin {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    // 微信二维码样式
    .qrcode-wrapper{
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      .qrcode-img{
        // display: flex;
        // justify-content: center;
        // align-items: center;
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
   
  // }

  .remember-account {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #666;
    font-size: 14px;
    
    input[type="checkbox"] {
      margin-right: 8px;
     
    }
  }

  .login-button {
    width: 100%;
    height: 50px;
    background: #ffdfd3;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
      background: #ff6634;
    }
  }

  .login-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    font-size: 14px;
    margin-top: 20px;
    .forgot-password, .quick-register {
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
          --el-color-primary :#ff6634;//字体颜色
           --el-color-primary-light-7: #ff6634;//获取光标边框颜色
           --el-color-primary-light-9:white;//获取光标的背景颜色
        }

        .wechat-icon{
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
