<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" /> -->
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        
        <!-- <screenfull id="screenfull" class="right-menu-item" /> -->
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item" />
        </el-tooltip> -->
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            {{ userStore.loginType }}-{{userSmsStore.loginType  }} {{ userStore.id }}-{{ userSmsStore.nickname}}
            <!-- <img :src="userStore.id" class="user-avatar" /> -->
            <span>{{userStore.id ? userStore.username : userSmsStore.phoneNumber}}</span>
            <el-icon class="avatar-icon"><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <!-- <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
              </el-dropdown-item> -->
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import useAppStore from '@/store/modules/app'
import useClientUserStore from '@/store/modules/clientUser'
import useSmsUserStore from '@/store/modules/smsUser'
import useSettingsStore from '@/store/modules/settings'

const appStore = useAppStore()
const userStore = useClientUserStore()
const userSmsStore = useSmsUserStore()
const settingsStore = useSettingsStore()

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if(userStore.id) {
      userStore.clientLogout().then(() => {
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

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}

function toggleTheme() {
  settingsStore.toggleTheme()
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 100px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #1e1e1e;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: url('/src/assets/images/logo.1a5e41c3.png');
  background-repeat: no-repeat;
  background-position: 7%;

  background-color: #1e1e1e;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 16px;

    .right-menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: var(--navbar-text);
      cursor: pointer;
      transition: background 0.3s;
      color:grey;

      &:hover {
        // background: rgba(255, 255, 255, 0.1);
        color: #ff9900;
      }

   
    }

    .avatar-container {
      height: 100%;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);

          .avatar-icon {
            color: #ff9900;
          }
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 6px;
        }

        .avatar-icon {
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

