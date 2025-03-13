<template>

  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
    <!-- <transition name="sidebarLogoFade"> -->
      <div key="expand" class="sidebar-logo-link" @click="switchXD">
        <img style=" filter: invert(53%) sepia(78%) saturate(2597%) hue-rotate(335deg) brightness(102%) contrast(114%);cursor: pointer;" 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEX0lEQVR4nO3dP2icZRzA8e/z3iVnG8VJxwSx4KS2KjgXdHCUUkWdiouoexVXEergVrsIdRAp4uhQxKEOohYs2IqjkdBB0EXKmRxcnschJO3vaJILzd373PX7gYPAPQe/e/ly75/k3qRSCtK2pu0BVBeDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUNBte4BRy8vLOz83zfR7XVpa2uvpxX6/f7OU0s05v9w0zfcAw+GQbrdLKYWUEmtra6ysrJBzJqUEbL2XnPPOmpwz3W6X1dXVKbyr8VUXRNv6/T6dTme3p4+UUh4BaJrmCnAW+HhKo02Fu4y72NzcZGFh4W6PDNy6Y+k54CvgaDuTHj6D2MXGxsa4S093u93rwLMTHGdqDGIPB4jiceBn4O3JTTMdBrGPA0TRSSmdBy4ww8dmBjGGA0QB8Nby8vJV4LEJjTNRBjGmfr/P+vr6LSCPsfxEKeU34NUJj3Xoav1oew44Amy2PcgdNoGHgIUx1x9NKV0CjgPvT2qow1ZjEJ+llN4EqOn/gd3DRbL3gOeB14G/Dm2gCalul7Edw5w5mXP+FXix7UH2U10QwH9tDzAhjwLfAh+0PcheagxinIO2mZVS+hD4mq1jpOrUGMSDbQ8wBaeaprnO1gFnVaoLIqV0ve0ZpuRYzvmTtocYVd1ZxmAweGFxcfEMsERdp52HqVNKGTRNc7ntQUZVFwTwN3P2K+VZUt0uQ+0yCAUGocAgFBiEAoNQUN1pZ6/XI+e5vnoNsPPn+bXxE0KBQSgwCAUGocAgFBiEgupOO4ETwBPAgb4MMWN6wE3gh7YHGVVdEKWUa7Weo0/Au8D5toe4U3W7jJTSp23PMC2llFNtzzCquiCAd1JKbwDDtgeZglv7L5muGoMA+DLn/Axwo+1B7je1BgFwY21t7Wng87YHmZSU0sNtzzCq5iAACnCmlDLz913YxRdtDzCqurOMXVwArgKXgGMHeN2PwEellNre5wOdTufPUspPbQ8yqrYNtZdfBoPB8V6vdxE4PeZr/gC+meBMc6f2XcaoPvAKW9+o3ldKaek+uqZxKGYtiG3ncs4vMebX69u43+WsmuUtdXk4HD5ZSrkyzmKjGM+sb6V/gJOM+U0vo9jfvGyhs6WU14D1/RYaxd7maetcYuveVDtXN0spR0opjD480NzdPAUB8DvwFLevbv6720KjuLtZug5xEGdSSt8B1/ZatH1Xet2WarrTm9o3b7sM3SODUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhIL/AcCp2rnv/rniAAAAAElFTkSuQmCC" class="sidebar-logo" />
        <span class="sidebar-title" @click="showDialog">小学</span>
      </div>
    <!-- </transition> -->
    <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEX0lEQVR4nO3dP2icZRzA8e/z3iVnG8VJxwSx4KS2KjgXdHCUUkWdiouoexVXEergVrsIdRAp4uhQxKEOohYs2IqjkdBB0EXKmRxcnschJO3vaJILzd373PX7gYPAPQe/e/ly75/k3qRSCtK2pu0BVBeDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUNBte4BRy8vLOz83zfR7XVpa2uvpxX6/f7OU0s05v9w0zfcAw+GQbrdLKYWUEmtra6ysrJBzJqUEbL2XnPPOmpwz3W6X1dXVKbyr8VUXRNv6/T6dTme3p4+UUh4BaJrmCnAW+HhKo02Fu4y72NzcZGFh4W6PDNy6Y+k54CvgaDuTHj6D2MXGxsa4S093u93rwLMTHGdqDGIPB4jiceBn4O3JTTMdBrGPA0TRSSmdBy4ww8dmBjGGA0QB8Nby8vJV4LEJjTNRBjGmfr/P+vr6LSCPsfxEKeU34NUJj3Xoav1oew44Amy2PcgdNoGHgIUx1x9NKV0CjgPvT2qow1ZjEJ+llN4EqOn/gd3DRbL3gOeB14G/Dm2gCalul7Edw5w5mXP+FXix7UH2U10QwH9tDzAhjwLfAh+0PcheagxinIO2mZVS+hD4mq1jpOrUGMSDbQ8wBaeaprnO1gFnVaoLIqV0ve0ZpuRYzvmTtocYVd1ZxmAweGFxcfEMsERdp52HqVNKGTRNc7ntQUZVFwTwN3P2K+VZUt0uQ+0yCAUGocAgFBiEAoNQUN1pZ6/XI+e5vnoNsPPn+bXxE0KBQSgwCAUGocAgFBiEgupOO4ETwBPAgb4MMWN6wE3gh7YHGVVdEKWUa7Weo0/Au8D5toe4U3W7jJTSp23PMC2llFNtzzCquiCAd1JKbwDDtgeZglv7L5muGoMA+DLn/Axwo+1B7je1BgFwY21t7Wng87YHmZSU0sNtzzCq5iAACnCmlDLz913YxRdtDzCqurOMXVwArgKXgGMHeN2PwEellNre5wOdTufPUspPbQ8yqrYNtZdfBoPB8V6vdxE4PeZr/gC+meBMc6f2XcaoPvAKW9+o3ldKaek+uqZxKGYtiG3ncs4vMebX69u43+WsmuUtdXk4HD5ZSrkyzmKjGM+sb6V/gJOM+U0vo9jfvGyhs6WU14D1/RYaxd7maetcYuveVDtXN0spR0opjD480NzdPAUB8DvwFLevbv6720KjuLtZug5xEGdSSt8B1/ZatH1Xet2WarrTm9o3b7sM3SODUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhAKDUGAQCgxCgUEoMAgFBqHAIBQYhIL/AcCp2rnv/rniAAAAAElFTkSuQmCC" class="sidebar-logo" alt="logo"/> -->
  </div>


  <!-- 切换学段弹框 -->
  <el-dialog
        v-model="openDialog"
        width="800px"
        title="选择学段"
        style="border-radius: 15px;position: relative;top: 50px;text-align: center;"
        :close-on-click-modal="false"
        destroy-on-close>
        <div class="textbook-content">
          <div class="education-level">
            <!-- 学段 -->
            <div 
              v-for="(level, index) in mt_academic_stage" 
              :key="index"
              class="level-item"
              :class="{ active: currentLevel === level.value }"
              @click="handleLevelChange(level)"
            >
              {{ level.label }}
            </div>
          </div>
          <el-divider />
        </div>
        <template #footer>
          <el-divider />
          <div class="dialog-footer">
            <div class="dialog-footer-btn">
              <el-button  @click="cancleDialog(currentLevel)">取消</el-button>
              <el-button  type="primary" @click="confirmSelect(currentLevel,item)">确定</el-button>
            </div>
          
          </div>
        </template>
    </el-dialog>
</template>

<script setup>
import logo from '@/assets/logo/logo.png'
import useSettingsStore from '@/store/modules/settings'
import variables from '@/assets/styles/variables.module.scss'
import { tr } from 'element-plus/es/locales.mjs';
import academicStageStore from '@/store/modules/academicStage'
const useAcademicStageStore = academicStageStore()
const { proxy } = getCurrentInstance();
const { mt_academic_stage} = proxy.useDict('mt_academic_stage');
defineProps({
  collapse: {
    type: String,
    required: true
  }
})


const emit = defineEmits(['show-dialog'])
const onenFlag = ref(false)
const router = useRouter()
const switchXD = () => {
  onenFlag.value = true;
  // router.push({
  //   path: '/index',
  //   query: { 
  //     showDialog: '1',//弹框
  //     // type: 'subject',
  //     _d: Date.now() // 添加时间戳参数强制刷新列表
  //   }
  // })

}

const showDialog = () => {
  emit('show-dialog', '穿1')
  console.log('11111111111')
  useAcademicStageStore.getAcademicStageList()

  console.log(useAcademicStageStore.academicStageList.length)
  console.log(useAcademicStageStore.getIsShowDialog('true'))
  console.log(useAcademicStageStore.getIsShowDialog('false'))


  console.log(useAcademicStageStore.selectAcademicStage('99999999'))

  console.log('11111111111')

}








const title = import.meta.env.VITE_APP_TITLE;
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);

// 获取Logo背景色
const getLogoBackground = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-bg)';
  }
  return sideTheme.value === 'theme-dark' ? variables.menuBg : variables.menuLightBg;
});

// 获取Logo文字颜色
const getLogoTextColor = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-text)';
  }
  return sideTheme.value === 'theme-dark' ? '#fff' : variables.menuLightText;
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: normal;
  background: #1e1e1e;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & .sidebar-logo {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-bottom: 5px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #ff9900;
      font-weight: 700;
      line-height: 1.2;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>