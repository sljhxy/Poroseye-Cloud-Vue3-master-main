<template>
  <div class="home-container">
   
    <header class="header" :style="{ left: qhExperimentFlag ? '120px' : '0' }">
     <div class="logo">
       <img class="logo-image" src="/src/assets/images/logo.1a5e41c3.png"/>
     </div>
     <!-- {{ userSmsStore }} -->
     <div class="user-info">
       <div class="user-avatar">
         <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
         <!-- <el-avatar :size="32" :src="userClientStore.avatar"></el-avatar> -->
       </div>
       <div class="user-details">
        <!-- {{ userSmsStore }} -->
          <!-- {{ userClientStore}} -->
         <span class="username" v-if="userClientStore.loginType == 'client_user'">{{userClientStore.username}}</span>
         <span class="username" v-else-if="userSmsStore.loginType == 'app_user'">{{userSmsStore.username ? userSmsStore.username : userSmsStore.phoneNumber}}</span>
       </div>

       <el-dropdown trigger="click" class="custom-dropdown">
         <el-button class="user-dropdown-btn" link>
           <el-icon><ArrowDown /></el-icon>
         </el-button>
         <template #dropdown>
           <el-dropdown-menu>
             <el-dropdown-item>
               <router-link to="/user/profile">
                 <el-icon><User /></el-icon>个人中心
               </router-link>
               
             </el-dropdown-item>
             <!-- <el-dropdown-item>
               <el-icon><Setting /></el-icon>设置
             </el-dropdown-item> -->
             <el-dropdown-item divided @click="logout">
               <el-icon><SwitchButton /></el-icon>退出登录
             </el-dropdown-item>
           </el-dropdown-menu>
         </template>
       </el-dropdown>
     </div>
   </header>
  </div>
</template>


<script setup>

import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance();
import useClientUserStore from '@/store/modules/clientUser'
import useSmsUserStore from '@/store/modules/smsUser'

const userClientStore = useClientUserStore()
const userSmsStore = useSmsUserStore()
// width: qhExperimentFlag ? 'calc(100% - 120px)' : '100%'
const props = defineProps({
  qhExperimentFlag:{
    type: Boolean,
    default: true
  },

})

console.log(userSmsStore)

//注销登录
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--orange', // 添加自定义类名
  }).then(() => {
    if(userClientStore.id) {
      userClientStore.clientLogout().then(() => {
        location.href = '/index';
      })
    }
    if(userSmsStore.id) {
      userSmsStore.smsLogout().then(() => {
        location.href = '/index';
      })
    }
  
  }).catch(() => { });
}
</script>


<style lang="scss" scoped>

.home-container{
  margin-bottom: 80px;
   width: 100%;
   .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 80px;
    background-color: #22252a;
    color: white;
    position: fixed;
    top: 0;
    /* left值通过:style绑定动态设置 */
    right: 0;
    // width: 100%; /* 添加宽度100% */
    z-index: 1000;
  }


.logo {

  .logo-image {
    height: 22px; /* 调整高度 */
    width: auto; /* 保持宽高比 */
    object-fit: contain; /* 确保图片完整显示 */
    image-rendering: -webkit-optimize-contrast; /* 提高图片清晰度 */
    image-rendering: crisp-edges; /* 现代浏览器中提高边缘清晰度 */
    transform: translateZ(0); /* 启用GPU加速，减少模糊 */
    margin-left: 20px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 40px;
  transition: all 0.3s ease;
  
  // &:hover {
  //   background-color: grey;
  // }
  


  .user-avatar {
    display: flex;
    align-items: center;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    
    .username {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
    }
    
    .user-role {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .user-dropdown-btn {
    padding: 0 4px;
    color: #909399;
    
    &:hover {
      color: #ff9900;
    }
  }
}

.device-info, .mobile-icon {
  color: #aaa;
}

.user-avatar img {
  width: 24px;
  height: 24px;
  border-radius: 50%;

}

.user-name {
  color: #fff;
}
}

</style>