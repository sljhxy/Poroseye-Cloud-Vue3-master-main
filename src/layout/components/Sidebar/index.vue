<template>
  <div :class="{ 'has-logo': showLogo }" class="sidebar-container">

  
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <logo v-if="showLogo" :collapse="isCollapse" />

      
    <!-- 科目列表 -->
    <div class="sidebar">
    <ul>
      <li v-for="(item, index) in mt_school_subject" :key="index" @click="handleSubjectChange(item)">
        <span :style="[item.value == clickCurrentId ? dynamicStyles : 'none' ]">{{ item.label }}</span>
      </li>
    </ul>
  </div>

  
    <!-- 添加底部关于按钮 -->
    <div class="sidebar-footer">
      <el-button link class="about-btn" @click="showAboutDialog = true">
      <el-icon style="position: relative;left: 35px;"><Warning /></el-icon><br><br><br><br>
      关于产品
    </el-button>
    </div>

    <!-- 关于产品弹框 -->
    <el-dialog
      v-model="showAboutDialog"
      width="700px"
      style="border-radius: 15px;position: relative;top: 150px;"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="about-content">
        <p>
          <img src="/src/assets/images/logo-new.8d92fa97.png" alt="logo" style="display: flex;width: 200px;margin: auto;"/>
        </p><br>
        <p>
          魔瞳（北京）科技有限公司是一家互联网教育科技企业，也是中关村高新技术企业，在2021年荣获中关村前沿科技企业称号。公司核心团队人员来自新东方、百度、腾讯、中信等国内头部教育、科技、金融机构，成员平均从业经验十年以上。<br><br>
魔瞳拥有多项自主发明专利和技术专利，运用人工智能、大数据、云计算、混合现实等技术，为国内中小学、职业院校和研究院等机构的教学实验场景提供智能化解决方案，公司服务客户遍布全国多省地市。<br><br><br>

「公司使命」：让知识触手可及！<br>
「公司愿景」：给学校赋能，为老师减负，使学生增效，让家长放心！<br>
「公司价值观」：诚信务实、自驱进取、开放创新、协同分享！
        </p></div>
        

    </el-dialog>
  </div>
</template>

<script setup>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

//导入科目API
import { listSubject } from '@/api/poroseye/subject'
import { watch } from 'vue'
const { proxy } = getCurrentInstance();
const { mt_academic_stage, mt_school_subject,mt_vocal_school_subject, mt_textbooklibrary_time, mt_school_type, mt_vocal_education_type } = proxy.useDict('mt_academic_stage', 'mt_school_subject','mt_vocal_school_subject', 'mt_textbooklibrary_time', 'mt_school_type', 'mt_vocal_education_type');
// 添加关于弹框控制变量
const showAboutDialog = ref(false)
const route = useRoute();
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const loading = ref(true);
// 获取菜单背景色
const getMenuBackground = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-bg)';
  }
  return sideTheme.value === 'theme-dark' ? variables.menuBg : variables.menuLightBg;
});

// 获取菜单文字颜色
const getMenuTextColor = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-text)';
  }
  return sideTheme.value === 'theme-dark' ? variables.menuText : variables.menuLightText;
});

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});



//--------------------------------------------------------------------------------------
/** 查询科目列表 */
const total = ref(0);
const subjectList = ref([]);
const querySubjectParams = ref({
      pageNum: 1,
      pageSize: 10000,
      subjectType: null,
      schoolType: '1',//学校类型
      educationStageType: '1',//学段
      versionReleaseTimeType: null,
    }
);
function getSubjectList() {
  loading.value = true;
  listSubject(querySubjectParams.value).then(response => {
    subjectList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


//将用户选择的科目传到首页
const router = useRouter()
const clickCurrentId = ref('1') //用户选中的科目id

const dynamicStyles = ref() //定义样式变量
function handleSubjectChange(item) {
  router.push({
    path: '/index',
    query: { 
      subjectId: item.value,//科目值（字典维护的）
      type: 'subject',
      _t: Date.now() // 添加时间戳参数强制刷新列表
    }
  })

  clickCurrentId.value = item.value
  
  //设置选择数据的样式
  dynamicStyles.value = [{ color: '#ff9900' }, {fontWeight: 'bold'}]
}


watch(() => clickCurrentId.value, (newValue) => {
  
  clickCurrentId.value = newValue
   //设置选择数据的样式
  dynamicStyles.value = [{ color: '#ff9900' }, {fontWeight: 'bold'}]
}, { immediate: true })


getSubjectList()//获取科目列表

</script>

<style lang="scss" scoped>
.sidebar-container {
  background-color: #1e1e1e;
  // background-color: white;
  // width: 64px;
  //   height: 72px;
  //   background: url(data:image/png;base64,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) 0 0;
    // background-size: 100% 100%;
  .scrollbar-wrapper {
    background-color:  #1e1e1e;
    
  }

  .sidebar-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background-color: #1e1e1e;

    .about-btn {
      width: 100%;
      height: auto;
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: grey;
      transition: all 0.3s;

      &:hover {
        color: #ff9900;
      }


      .text {
        font-size: 20px;
      }
    }
  }
  
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
    
    .el-menu-item, .el-sub-menu__title {
      &:hover {
        background-color: var(--menu-hover, rgba(0, 0, 0, 0.06)) !important;
      }
    }
  
    .el-menu-item {
      color: v-bind(getMenuTextColor);
      
      &.is-active {
        color: var(--menu-active-text, #409eff);
        background-color: var(--menu-hover, rgba(0, 0, 0, 0.06)) !important;
      }
    }
  
    .el-sub-menu__title {
      color: v-bind(getMenuTextColor);
    }
  }

  .sidebar {
  width: 120px;
  height: 100%;
  background-color: #1e1e1e;
  padding: 20px;
}

ul {
  margin: auto;
  list-style-type:none;
  padding: 0;
 
  font-size: 20px;
  line-height: 50px;
}

li {

  margin: 20px;
  color: grey;
  z-index: 100000;
  cursor: pointer;
}

a {

  text-decoration: none;
  color: #df0c0c;
  
}

li:hover {
  color: #ff9900;
}
}
</style>

