<template>
  <div class="home-container">
   
   <!-- <div style="width: 100px;height: 200px;background-color: #C3A6E0;"></div> -->
   <!-- <div style="width: 100px;height: 200px;background-color: #A8E6CF;"></div> -->

    <poroseye-header :qhExperimentFlag="true" v-show="qhExperimentFlag"/>
    

    <!-- <poroseye-header :qhExperimentFlag="false" v-else/> -->
    <!-- <header class="header_tmp" v-else>
      <div class="logo">
        <img class="logo-image" src="/src/assets/images/logo.1a5e41c3.png"/>
      </div>
      <div class="user-info">
        <div class="user-avatar">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
        <div class="user-details">
          <span class="username">测试用户</span>
        </div>
        <el-dropdown trigger="click" class="custom-dropdown">
          <el-button class="user-dropdown-btn" link>
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/poroseye/components/profile')">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header> -->

    <!-- 圆角 -->
    <!-- <div class="corner-arc"></div> -->
    
    <main class="main-content" v-if="qhExperimentFlag">
      <div class="sidebar">
        <!-- filter: invert(53%) sepia(78%) saturate(2597%) hue-rotate(335deg) brightness(102%) contrast(114%);cursor: pointer;"  -->
        <!-- <div class="sidebar-logo" @click="handlerxd"> -->
        <div class="sidebar-logo" @click="handleShowAboutDialog">
          <img src="/src/assets/images/qh.png" alt="Logo" />
          <span>{{getAcademicStage(currentXD)}}</span>
        </div>
        
        
        <!-- 左侧科目 -->
        <div class="menu-item" v-for="(item, index) in mt_school_subject" :key="index"
            @click="handleSubjectChange(item)"
            @mouseover="handleMouseOver(item.value)"
            @mouseleave="handleMouseOut()"
            :class="{ active: item.value === clickCurrentSubjectId }">
          <div class="subject-card">
            <div class="icon-container">
              <img class="subject-icon" :src="getSubjectIcon(item)" :alt="item.label" />
            </div>
            <span :class="{ 'hover-text': item.value === hoverSubjectId }" 
                  :style="[item.value == clickCurrentSubjectId ? dynamicSubjectStyles : 'color:grey' ]">
              {{ item.label }}
            </span>
          </div>
        </div>


         <!-- 添加底部关于按钮 -->
          <div class="sidebar-footer">
            <el-button link class="about-btn" @click="showProductDialog = true">
            <el-icon style="position: relative;left: 35px;"><Warning /></el-icon><br><br><br><br>
            关于产品
          </el-button>
          </div>
      </div>
      
      <div class="content-area">
           <!-- 添加顶部导航栏 -->
    <div class="top-navbar">
      <div class="nav-left">
        <!-- -------{{ clickCurrentSubjectId }} -->
        <h1>POROSEYE实验</h1>
        <span class="exp-count">{{experimentList.length}}个</span>
      </div>
      <div class="nav-right">
        <el-input
          v-model="searchText"
          placeholder="搜索实验"
          prefix-icon="Search"
          class="search-input"
          style="--el-color-primary: #ff9900"
          @input="searchExperiment(searchText)"
        />
        <!-- <el-button type="primary" class="create-btn">
          <el-icon><Plus /></el-icon>新建实验
        </el-button> -->
      </div>
    </div>



     <!-- 左侧导航栏 -->
     <div class="content-wrapper">

<div class="sidebar_tmp">
<div class="chapter-list">

  <div class="sidebar-header">
    <el-tabs 
    v-model="activeTab"
    class="custom-tabs"
    style="width: 235px;--el-color-primary:#ff9900;"
    stretch="true"
    @tab-click="handleTabChange"
  >
      <el-tab-pane name="library">
          <template #label>
            <div class="sidebar-header">
              <span  :class="{ 'active-tab': activeTab === 'library' }">教材版本</span>
            </div>
          </template>
          <div class="library-item main-chapter">
            <el-button size="large" class="btn-chapter"
            @click="handleShowAboutDialog"
            >
            <el-icon v-show="!selectTextbookLibraryItem"><DocumentCopy /></el-icon>&nbsp;&nbsp;
            {{finalSelectTextbookLibraryItem ? finalSelectTextbookLibraryItem.textbookVersionName + ' ' + finalSelectTextbookLibraryItem.volumeName : '所有教材资源'}}</el-button>
          </div>
          <el-table
            v-if="!chapterResult.length"
            :show-header="false"
            :data="textbookLibraryArr"
            @row-click="clickTable"
            ref="refTable"
            style="--el-fill-color-light:rgba(255, 132, 19, 0.1); 
            width: 100%;font-size: 16px;cursor: pointer;"
            :row-class-name="tableRowClassName"
            >
            <el-table-column type="expand">
              <template #default="scope">
                <el-collapse >
                  <!-- 分册 -->
                  <el-collapse-item v-for="(item, index) in scope.row.mtVolumeList" :key="index" :title="item.volumeName" @click="clickCollapseItem(item)" class="custom-collapse-item">
                    <div>
                      <!-- 章节的详细信息  childrenChapter-->
                      <el-table
                        :show-header="false"
                        :data="childrenChapter"
                        row-key="id"
                        :tree-props="{
                          children: 'children',
                          hasChildren: 'hasChildren',
                          indent: 20
                        }"
                        style="font-size: 16px;"
                        >
                        <el-table-column>
                          <template #default="scope">
                              <span class="chapter-label" v-if="scope.row.chapterTxt.length <= 10" style="font-size: 16px;color: hsl(230, 14.2%, 58.4%);">
                                {{ scope.row.chapterTxt }}
                              </span>

                              <el-tooltip v-if="scope.row.chapterTxt.length > 10" popper-class="testtooltip" 
                                effect="light"
                                :content="scope.row.chapterTxt" placement="top-start">
                                <span style="color: hsl(230, 14.2%, 58.4%);">{{ scope.row.chapterTxt.slice(0, 7) }}...</span>
                              </el-tooltip>

                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
            <el-table-column label="教材版本名称" prop="textbookVersionName"/>
        </el-table>


        <el-table
          v-else
          :show-header="false"
          :data="chapterResult"
          row-key="id"
          :tree-props="{
            children: 'children',
            hasChildren: 'hasChildren',
            indent: 20
          }"
          style="font-size: 16px;">
            <el-table-column>
              <template #default="scope">
                <span class="chapter-label" v-if="scope.row.chapterTxt.length <= 10" style="font-size: 16px;">
                  {{ scope.row.chapterTxt }}
                </span>
                  <el-tooltip v-if="scope.row.chapterTxt.length > 10" popper-class="testtooltip" 
                    effect="light"
                    :content="scope.row.chapterTxt" placement="top-start">
                    <span>{{ scope.row.chapterTxt.slice(0, 7) }}...</span>
                  </el-tooltip>
              </template>
            </el-table-column>
        </el-table>
        
        </el-tab-pane>

        <el-tab-pane name="knowledge">
          <template #label>
            <div class="sidebar-header">
              <span :class="{ 'active-tab': activeTab === 'knowledge' }">知识点</span>
            </div>
          </template>
        <div>
            <el-table
              :show-header="false"
              :data="knowledgeList"
              row-key="id"
              :tree-props="{
                children: 'children',
                hasChildren: 'hasChildren',
                indent: 20
              }"
              style="font-size: 16px;--el-fill-color-light:rgba(255, 132, 19, 0.1);"
              :row-class-name="tableRowClassName"
              >
              <el-table-column>
                <template #default="scope">
                  <span class="knowledge-label">
                    {{ scope.row.knowledge }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
    </el-tabs>
    
  </div>

</div>
</div>



<!-- 右侧内容区域 -->
<div class="main-content">
<div class="exp-list-section">
  <el-row :gutter="24">
    <el-col :span="4" v-for="item in experimentList" :key="item.id">
      <div class="exp-item">
        <image-preview :src="item.thumbnail" :alt="item.experimentName" width="100%" />
        <div class="exp-preview">
          
        </div>
        <div class="exp-info">
          <!-- <h3>{{ item.experimentName }}</h3> -->
          <div class="exp-stats">
            <h3>{{ item.experimentName }}</h3>
            <!-- <span><el-icon style="position: relative;top: 2px;"><View /></el-icon> {{ item.views }}次查看</span> -->
            <el-dropdown trigger="click">
              <el-button size="small" circle style="--el-color-primary:#ff9900;--el-color-primary-light-7:#dcdfe6;--el-color-primary-light-9:#fff；border-style: pink;">
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="watchVideo(item)">
                    <el-icon><VideoPlay /></el-icon>在线视频
                  </el-dropdown-item>
                  <el-dropdown-item @click="startExperiment(item)">
                    <el-icon><VideoPlay /></el-icon>开始实验
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>


        
        
        
      </div>
    </el-col>
  </el-row>

</div>
</div>
</div>



    <!-- 教材版本弹框 -->
    <el-dialog
        v-model="showAboutDialog"
        width="800px"
        title="选择教材"
        style="border-radius: 15px;position: relative;top: 50px;text-align: center;"
        :close-on-click-modal="false"
        class="textbook-dialog"
        destroy-on-close>
        <div class="textbook-content">
          <!-- 固定在顶部的学段选择 -->
          <div class="education-level sticky-top">
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
          
          <!-- 可滚动的内容区域 -->
          <div class="scrollable-content">
            <div class="version-tabs">
              <el-tag class="version-item"
                style="border-style: none;"
                :class="{ active: currentVersion11111 === 'all' }"
                @click="handleVersionAllChange('all')" type="info" size="large">全部</el-tag>
              
              <el-tag v-model="textbookLibraryFrom.id"
                class="version-item"
                style="border-style: none;"
                v-for="(version, index) in textbookLibraryNameArr" 
                :key="index"
                :class="{ active: currentVersion11111 === version.id + '-' + version.textbookLibraryId }"
                @click="handleVersionChange(version)" type="info" size="large"> {{ version.textbookVersionName }}</el-tag>
            </div>
            
            <div class="textbook-list">
              <div class="textbook-row">
                <div class="textbook-item all-books" v-show="currentVersion11111 === 'all'">
                  <div class="cover-wrapper">
                    <img src="/src/assets/images/all.jpg" alt="全部教材" />
                  </div>
                  <div class="overlay">
                    <span :style="[currentVersion11111 == 'all'? 'color:#ff9900' : '']">所有教材资源</span><br>
                  </div>
                </div>
                
                <div class="textbook-item" v-for="item in subjectList" :key="item.id">
                  <el-form v-model="textbookLibraryFrom">
                    <el-form-item v-model="textbookLibraryFrom.textbookVersionName" class="book-info" :style="[item.id + '-' + item.textbookLibraryId + '-' + item.volumeId == clickCurrentId ? dynamicStyles : 'none' ]">
                      <div class="cover-wrapper" @click="handleTextbookClick(item)">
                        <img :src="item.coverImg" :alt="item.title" class="textbook-cover"/>
                      </div>
                      <span class="version">{{ item.textbookVersionName }}</span>
                      <span class="grade">{{ item.volumeName }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 固定在底部的按钮区域 -->
        <template #footer>
          <div class="dialog-footer sticky-bottom">
            <div class="dialog-footer-btn">
              <el-button @click="cancleDialog(currentLevel)" 
                style="--el-color-primary:#606266;--el-color-primary-light-7:#dcdfe6;--el-color-primary-light-9:#fff；border-style: none;">取消</el-button>
              <el-button color="#ff9900" type="primary" @click="confirmSelect(currentLevel,item)" style="--el-color-black:#fff;">确定</el-button>
            </div>
          </div>
        </template>
    </el-dialog>

        

      </div>


      
    </main>


    <!-- -------================= -->
    <main class="main-content" v-else>
     
      
      <div class="content-experiment">

        <experiment 
          :experimentId="experimentID"
          :experimentName="experimentName"
          @onNum="finalNum"
          />
        
      </div>
      
    </main>

    <!-- -------================= -->




     <!-- 弹学段框  暂时不用  后续再说-->
     <el-dialog    
        v-model="showXDDialog"
        width="500px"
        title="选择学段"
        style="border-radius: 15px;position: relative;top: 50px;text-align: center;
        background: linear-gradient(135deg, #fff6e0, #ffdfb0, #ffc78a, #ff9a56);
        box-shadow: 0 15px 35px rgba(255, 154, 86, 0.35);
        "
        :close-on-click-modal="false"
        class="textbook-dialog"
        destroy-on-close>
        <div class="dialog-content">
          <div class="stage-options">
            <div 
              v-for="(level, index) in mt_academic_stage" 
              :key="index"
              class="stage-item"
              :class="{ active: selectedStage === level.value }"
              @click="selectedStage = level.value"
            >
              <span>{{ level.label }}</span>
            </div>
            
            <div class="confirm-btn" @click="confirmStageSelection">
              <span>确定</span>
            </div>
          </div>
        </div>
    </el-dialog>


     <!-- 关于产品弹框 -->
     <el-dialog
      v-model="showProductDialog"
      width="700px"
      style="border-radius: 15px;position: relative;top: 150px;"
      :close-on-click-modal="false"
      destroy-on-close>
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
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance();
import { ref, computed, onMounted, watch  } from 'vue'

import {useRoute, useRouter} from 'vue-router'
// 添加关于弹框控制变量
const showAboutDialog = ref(false)
//学段弹框控制变量
const showAcademicStageDialog = ref(false)

const searchText = ref('')
const loading = ref(true);

const isFocused = ref(false); // 响应式状态，记录焦点状态
const router = useRouter()

const route = useRoute()

const { mt_academic_stage, mt_school_subject,mt_vocal_school_subject, mt_textbooklibrary_time, mt_school_type, mt_vocal_education_type } = proxy.useDict('mt_academic_stage', 'mt_school_subject','mt_vocal_school_subject', 'mt_textbooklibrary_time', 'mt_school_type', 'mt_vocal_education_type');

//导入教材版本API
import { listLibrary, getLibrary} from "@/api/poroseye/library";

//导入知识点API
import { listKnowledge} from "@/api/poroseye/knowledge";

//导入科目API
import { listSubject, getSubject, delSubject, addSubject, updateSubject, addOrUpdateChapter, delChapter, getChapterList, getChapterMaxId, subjectExist} from "@/api/poroseye/subject";


//导入实验API
import { listExperimentInfoMountsystem } from '@/api/poroseye/experimentInfo'


//实验详情组件
import experiment from './poroseye/components/experiment.vue'

//个人详情组件
import PoroseyeHeader from '@/views/poroseye/components/poroseyeHeader.vue'

//获取学段store
import academicStageStore from '@/store/modules/academicStage'
const useAcademicStageStore = academicStageStore()

import useClientUserStore from '@/store/modules/clientUser'
import useSmsUserStore from '@/store/modules/smsUser'

const userClientStore = useClientUserStore()
const userSmsStore = useSmsUserStore()

const showAcademicStageDialogTmp = computed(() => {
  return useAcademicStageStore.academicStageList.length > 0 ? showAcademicStageDialog.value = true : showAcademicStageDialog.value = false
})

//存用户选中了教材版本-分册后获取章节的数据
const chapterResult = ref([])


const textbookLibraryFrom = ref({})

const clickCurrentSubjectId = ref() //用户选中的科目id
const dynamicSubjectStyles = ref() //定义样式变量

function handleSubjectChange(item) {

  clickCurrentSubjectId.value = item.value

  getSubjectList()
  queryExperimentParams.value.textbookLibraryId = '' //清空教材
  queryExperimentParams.value.volumeId = ''//清空分册
  getExperimentList()
  //设置选择数据的样式
  dynamicSubjectStyles.value = [{ color: '#ff9900' }, {fontWeight: 'bold'}]
}


/** 查询教材版本列表 */
const libraryList = ref([]);//教材版本列表
const libraryTotal = ref(0);
const queryLibraryParams = ref({
    pageNum: 1,
    pageSize: 100000,
    textbookVersionName: null,
    modifyBy: null,
    modifyTime: null,
});
function getLibraryList() {
  loading.value = true;
  listLibrary(queryLibraryParams.value).then(response => {
    libraryList.value = response.rows;
    libraryTotal.value = response.total;
    loading.value = false;

    //处理数据
    for (let i = 0; i < libraryList.value.length; i++) {
      console.log(libraryList.value[i].id)
      let libraryId = libraryList.value[i].id;//教材版本ID
      getVolumeListByLiabraryId(libraryId)
    }
    
  });
}


//获取教材版本下的分册列表
const mtVolumeList = ref([]);
function getVolumeListByLiabraryId(id) {
  getLibrary(id).then(response => {
    mtVolumeList.value = response.data.mtVolumeList;
    // console.log(mtVolumeList.value )
    for (let i = 0; i < subjectList.value.length; i++) {
      if (subjectList.value[i].textbookLibraryId == id) {
        subjectList.value[i].mtVolumeList = mtVolumeList.value
      }
    }
    // console.log(libraryList.value)
  });
}

//点击教材版本处理方法
const flag = ref(true)//控制箭头隐藏和现实
const currentId = ref()//操作当前的id
function handlerVolumeList(library) {

  flag.value = !flag.value
  currentId.value = library.id
  getVolumeListByLiabraryId(library.id);
  console.log('点击了')
  console.log(mtVolumeList.value)
}

const refTable = ref()
function clickTable(row,index,e){
  console.log(row)
  //根据科目id和教材版本id获取实验列表
  queryExperimentParams.value.subjectId = clickCurrentSubjectId.value
  queryExperimentParams.value.textbookLibraryId = row.textbookLibraryId
  queryExperimentParams.value.volumeId = ''
  getExperimentList()
  console.log('进来了------进行获取实验列表。。。。。。。。。。。。')

  // refTable.value.toggleRowExpansion(row.mtVolumeList)
}

//点击分册名称获取章节
function clickCollapseItem(item) {

  console.log('进入了分册')
  console.log(item)

   //根据教材版本id和分册id获取实验列表
  queryExperimentParams.value.subjectId = clickCurrentSubjectId.value
  queryExperimentParams.value.textbookLibraryId = item.textbookLibraryId
  queryExperimentParams.value.volumeId = item.id
  getExperimentList()
  console.log('进入了分册')


  findChapterList(item.id)//获取章节列表
}

// 获取章节列表方法
const childrenChapter = ref([])
function findChapterList(volumeId) {
  getChapterList(volumeId).then(response => {
    childrenChapter.value = response.data;
  });
}


// 获取知识点列表
const knowledgeList = ref([]);
const knowledgeTotal = ref(0);
const queryKnowledgeListParams = ref({
    pageNum: 1,
    pageSize: 100000,
    knowledge: null,
    schoolTypeId: '1',
    subjectId: null,
    academicStageId: null,
});

function getKnowledgeList() {
  loading.value = true;
  listKnowledge(queryKnowledgeListParams.value).then(response => {
    knowledgeList.value = proxy.handleTree(response.rows, "id", "parentId");
    knowledgeTotal.value = knowledgeList.value.length
    loading.value = false;
  });
}

// 修改 tab 切换处理方法
const activeTab = ref('library')
const handleTabChange = (tab) => {
  activeTab.value = tab.props.name
  // 清空搜索内容并重新加载数据
  if (activeTab.value == 'library') {
    // 重新加载教材版本数据
    // getLibraryList()
    getSubjectList()
  } else if(activeTab.value == 'knowledge') {

    // 重新加载知识点数据
    getKnowledgeList()
  }
}

// 当前选中的学段
const currentLevel = ref('1') // 默认选中小学

//点击教材按钮弹框
function handleShowAboutDialog() {

  //如果用户已经选择则进行赋值
  console.log('finalSelectTextbookLibraryItem')
  console.log(finalSelectTextbookLibraryItem)
  console.log('finalSelectTextbookLibraryItem')
  if(finalSelectTextbookLibraryItem.value != undefined){
    console.log('11111111111111111111111111111111')
    currentLevel.value = currentLevel.value //学段
    currentVersion.value = finalSelectTextbookLibraryItem.value.id
    clickCurrentId.value = finalSelectTextbookLibraryItem.value.id + '-' + finalSelectTextbookLibraryItem.value.textbookLibraryId + '-' + finalSelectTextbookLibraryItem.value.volumeId
    showAboutDialog.value = true
    textbookLibraryFrom.value.id = finalSelectTextbookLibraryItem.value.id + '-' + finalSelectTextbookLibraryItem.value.textbookLibraryId
    textbookLibraryFrom.value.textbookVersionName = finalSelectTextbookLibraryItem.value.id + '-' + finalSelectTextbookLibraryItem.value.textbookLibraryId + '-' + finalSelectTextbookLibraryItem.value.volumeId
    return
  }

  //将已经选择的分册置空
  clickCurrentId.value = undefined
  currentVersion11111.value = 'all'//默认全部
  //将搜索条件置为空
  querySubjectParams.value.textbookLibraryId = ''
  querySubjectParams.value.educationStageType = ''
  querySubjectParams.value.subjectType = ''
  showAboutDialog.value = true
  //获取所有的教材版本
  // getLibraryList()

  //获取教材版本-分册列表
  // getSubjectList()
  listSubject(querySubjectParams.value).then(response => {
    subjectList.value = response.rows;
    subjectTotal.value = response.total;
    finalLibrary.value = subjectList.value //要处理的教材版本数据-包括重复的  弹框中要用
    loading.value = false;
  
  });
  
}


// 处理学段切换
const handleLevelChange = (level) => {
  currentLevel.value = level.value

  //将其他搜索条件置空
  querySubjectParams.value.textbookLibraryId = ''
  querySubjectParams.value.educationStageType = ''
  currentVersion.value = 'all'
  // 可以在这里添加其他联动逻辑，比如更新教材列表
  // updateTextbookList(level)
  console.log('点了我了' + level.value)
  console.log('点了我了' + currentLevel.value)
  //获取教材版本列表
  getSubjectList()
}


// 当前选中的版本
const currentVersion = ref('all') // 默认选中全部

// 默认全部的教材出来
const handleVersionAllChange = (value) => {
  currentVersion11111.value = value

  //将已经选择的分册置空
  clickCurrentId.value = undefined
  //将搜索条件置为空
  querySubjectParams.value.textbookLibraryId = ''
  querySubjectParams.value.educationStageType = ''
  getSubjectList()
  
}

// 处理版本切换
const currentVersion11111 = ref('all') // 默认选中全部
const handleVersionChange = (version) => {
  currentVersion11111.value = version.id + '-' + version.textbookLibraryId
  currentVersion.value = version.id
  // 动态获取教材版本-分册列表
  querySubjectParams.value.textbookLibraryId = version.textbookLibraryId
    listSubject(querySubjectParams.value).then(response => {
    subjectList.value = response.rows;
    subjectTotal.value = response.total;
    loading.value = false;
  });
}


/** 查询科目列表 */
const subjectTotal = ref(0);
const subjectList = ref([]);
const querySubjectParams = ref({
      pageNum: 1,
      pageSize: 10000,
      subjectType: null,
      textbookLibraryId:'',
      schoolType: '1',//学校类型
      educationStageType: '',//学段
      versionReleaseTimeType: null,
    }
);

const finalLibrary = ref([])
const finalLibraryList = ref([])
function getSubjectList() {
  loading.value = true;
  querySubjectParams.value.educationStageType = currentLevel.value
  querySubjectParams.value.subjectType = clickCurrentSubjectId.value
  listSubject(querySubjectParams.value).then(response => {
    subjectList.value = response.rows;
    subjectTotal.value = response.total;
    finalLibrary.value = subjectList.value //要处理的教材版本数据-包括重复的  弹框中要用
    finalLibraryList.value = subjectList.value //要处理的教材版本数据-包括重复的  首页列表要用到
    loading.value = false;


    //处理数据
    for (let i = 0; i < subjectList.value.length; i++) {
      let libraryId = subjectList.value[i].textbookLibraryId;//教材版本ID
      getVolumeListByLiabraryId(libraryId)
    }
  });
}

//对教材版本进行去重
const textbookLibraryNameArr = computed(() => {
  let obj = {}
   //去重
  let array = []
  array = finalLibrary.value.reduce((newArray, next) => {
  obj[next.textbookLibraryId] ? "" : (obj[next.textbookLibraryId] = true && newArray.push(next));
    return newArray
  },[]);
  let textbookLibraryResTmp = [];
  textbookLibraryResTmp = array
  return textbookLibraryResTmp
});


const textbookLibraryArr = computed(() => {
  let obj = {}
   //去重
  let array = []
  array = finalLibraryList.value.reduce((newArray, next) => {
  obj[next.textbookLibraryId] ? "" : (obj[next.textbookLibraryId] = true && newArray.push(next));
    return newArray
  },[]);
  let textbookLibraryResTmp = [];
  textbookLibraryResTmp = array
  return textbookLibraryResTmp
});



//用户选中了教材分册后的处理方法

const dynamicStyles = ref() //定义样式变量

const clickCurrentId = ref() //用户选中的教材分册

const selectTextbookLibraryItem = ref()//用户选择的数据

function handleTextbookClick(item) {

  if(currentVersion11111.value == 'all') {
    ElMessage.warning('请先选择教材版本')
    return
  }

  //用户选的当前数据相关ID
  clickCurrentId.value = item.id + '-' + item.textbookLibraryId + '-' + item.volumeId

  //设置选择数据的样式
  dynamicStyles.value = [{ color: '#ff9900' }, {fontWeight: 'bold'}]
  //用户选择的数据
  selectTextbookLibraryItem.value = item
  
}

//弹框确认按钮
const finalSelectTextbookLibraryItem = ref()
const confirmSelect = (currentLevel, item) => {

  // if(currentVersion.value == 'all') {
  //   ElMessage.warning('请先选择教材版本')
  //   return
  // }
  console.log(clickCurrentId.value)

  // if(clickCurrentId.value == undefined) {
  //   ElMessage.warning('请先选择教材分册')
  //   return
  // }
  // 处理确认选择逻辑
  showAboutDialog.value = false
  console.log('点击了确认按钮')
  console.log(currentLevel)
  console.log(selectTextbookLibraryItem)
  console.log('点击了确认按钮')

  finalSelectTextbookLibraryItem.value = selectTextbookLibraryItem.value

  // currentLevel.value = currentLevel
  currentXD.value = currentLevel
  //获取章节
  getChapterList(finalSelectTextbookLibraryItem.value.volumeId).then(response => {
    chapterResult.value = response.data;
  });


  //将已经选择的分册置空
  // clickCurrentId.value = undefined
  currentVersion.value = 'all'//默认全部
}

//弹框取消按钮
const cancleDialog = (val) => {
  currentLevel.value = val
  //先将最终的章节列表情况
  chapterResult.value = []
  //将已经选择的分册置空
  clickCurrentId.value = undefined
  currentVersion.value = 'all'//默认全部
  showAboutDialog.value = false
  currentLevel.value = '1' // 默认选中小学
  currentXD.value = currentLevel.value
  finalSelectTextbookLibraryItem.value = undefined
  // if(finalSelectTextbookLibraryItem.value != undefined) {    
  //   libraryList.value = []
  //   //获取章节
  //   getChapterList(finalSelectTextbookLibraryItem.value.volumeId).then(response => {
  //   chapterResult.value = response.data;
  // });
  // }
}



//获取实验列表
const queryExperimentParams = ref({
  schoolType: '1',
  academicStageType:'',
  subjectId:'',
  textbookLibraryId:'',
  volumeId:'',
  courseSystems:[],
  experimentName:'',
  pageNum: 1,
  pageSize: 1000000,
  
})
const experimentList = ref([]) // 当前显示的实验列表
function getExperimentList() {
  // loading.value = true;
  queryExperimentParams.value.subjectId = clickCurrentSubjectId.value//科目id
  listExperimentInfoMountsystem(queryExperimentParams.value).then(response => {
    experimentList.value = response.rows;
    // loading.value = false;
  });
}




getExperimentList()

//搜索实验
function searchExperiment(value) {
  queryExperimentParams.value.experimentName = value
  getExperimentList()

}



// 筛选标签
const filterTags = ref([
  { label: '全部', value: 'all', active: true },
  { label: '探究实验', value: 'research', active: false },
  { label: '学案', value: 'case', active: false },
  { label: '互动课件', value: 'interactive', active: false }
])


const toggleTag = (tag) => {
  filterTags.value.forEach(t => t.active = false)
  tag.active = true
}
// 添加处理函数
const experimentID = ref()
const experimentName = ref()
const qhExperimentFlag = ref(true)
const watchVideo = (item) => {
  console.log('观看视频:', item.title)

  experimentID.value = item.experimentInfoId//实验值
  experimentName.value = item.experimentName//实验名称
  qhExperimentFlag.value = !qhExperimentFlag.value
  // router.push('/experiment')
  // router.push({
  //   path: '/experiment',
  //   query: { 
  //     experimentId: item.experimentInfoId,//实验值（字典维护的）
  //     experimentName: item.experimentName,//实验名称
  //     type: 'experiment',
  //     _t: Date.now() // 添加时间戳参数强制刷新列表
  //   }
  // })
  
  // 这里添加观看视频的逻辑
}

//接收子组件传送的数据
const finalNum = (value) => {
  if(value == 1) {
    //返回首页
    qhExperimentFlag.value = !qhExperimentFlag.value
  }
  console.log('接收到子组件的数据为：' + value)
}

const startExperiment = (item) => {
  console.log('开始实验:', item.experimentName)
  //跳转到开始实验的页面
  location.href = 'https://motong-pc.oss.poroseye.com/?d=%E6%8E%A2%E7%A9%B6%E5%87%B8%E9%80%8F%E9%95%9C%E6%88%90%E5%83%8F%E7%9A%84%E8%A7%84%E5%BE%8B&title=%E6%8E%A2%E7%A9%B6%E5%87%B8%E9%80%8F%E9%95%9C%E6%88%90%E5%AE%9E%E5%83%8F%E7%9A%84%E8%A7%84%E5%BE%8B'
  // location.href = 'https://motong-pc.oss.poroseye.com/?d=' + item.experimentInfoId + '&title=' + item.experimentName
}
// 添加收藏切换方法
const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite;
  // 这里可以添加收藏相关的后端接口调用
}


const currentChapter = ref(1)

const selectChapter = (chapter) => {
  currentChapter.value = chapter.id
  // 这里可以根据选中的章节更新右侧的实验列表
  // 模拟更新实验列表
  expList.value = expList.value.map(item => ({
    ...item,
    title: `${chapter.title}-${item.id}号实验`
  }))
}


// 添加切换相关的变量

const currentSelected = ref(1)
const currentList = computed(() => {
  return activeTab.value === 'chapter' ? libraryList.value : knowledgeList.value
})

// 切换标签方法
const switchTab = (tab) => {
  activeTab.value = tab
  currentSelected.value = 1
  // 更新实验列表
  updateExpList()
}

// 选择项目方法
const selectItem = (item) => {
  currentSelected.value = item.id
  // 更新实验列表
  updateExpList()
}

// 更新实验列表方法
const updateExpList = () => {
  const prefix = activeTab.value === 'chapter' ? '章节' : '知识点'
  const selectedItem = currentList.value.find(item => item.id === currentSelected.value)
  
  expList.value = expList.value.map(item => ({
    ...item,
    title: `${prefix}-${selectedItem?.title}-${item.id}号实验`
  }))
}





// 更新教材列表方法也需要更新，添加版本参数
const updateTextbookList = (level, version) => {
  console.log('更新教材列表:', level, version)
  // 这里添加根据学段和版本筛选教材的逻辑
}


//科目
const subjectIdTmp = ref()

//监听科目动态
watch(() => route.query.subjectId, (newQuery) => {
  
  subjectIdTmp.value = newQuery
  getSubjectList()
  queryExperimentParams.value.textbookLibraryId = '' //清空教材
  queryExperimentParams.value.volumeId = ''//清空分册
  getExperimentList()
  console.log('监听.........................')
},{ immediate: true })


//切换学段弹框
const showXDDialog = ref(false)
const handlerxd = () => {
  showXDDialog.value = true
}

// 在现有的 ref 声明后添加
const selectedStage = ref('1') // 默认选中小学

// 添加确认选择学段的方法
const currentXD = ref('1')
const confirmStageSelection = () => {
  currentLevel.value = selectedStage.value
  currentXD.value = selectedStage.value
  // 更新相关数据
  getSubjectList()
  showXDDialog.value = false
}

//根据ID获取学段名称
const getAcademicStage = (academicStaged) => {
  return mt_academic_stage.value.find(item => item.value === academicStaged)?.label || '';
}

const subjects = ref( [
      { label: '生物', value: 'biology' },
      { label: '化学', value: 'chemistry' },
      { label: '物理', value: 'physics' },
      { label: '地理', value: 'geography' },
])

const subjectIcons = ref({
  //生物
  biology: {
    default:'data:image/png;base64,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',
    selectSub:'data:image/png;base64,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'
  },

  //化学
  chemistry: {
    default:'data:image/png;base64,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',
    selectSub:'data:image/png;base64,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'
  },

  //物理
  physics: {
    default:'data:image/png;base64,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',
    selectSub:'data:image/png;base64,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'
  },

  //地理
  geography:{
    default:'data:image/png;base64,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',
    selectSub:'data:image/png;base64,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'
  }
})

const hoverSubjectId = ref()

const getSubjectIcon = (item) => {

   // 根据科目值获取对应的图标
   let iconType = 'default'; // 默认显示灰色图标
    
    // 如果当前科目被点击选中或者鼠标悬停在上面，则显示彩色图标
    if (item.value === clickCurrentSubjectId.value || item.value === hoverSubjectId.value) {
      iconType = 'selectSub';
    }

    // 根据科目类型返回对应的图标
    if (item.value === '3') { // 生物
      return subjectIcons.value.biology[iconType];
    } else if (item.value === '4') { // 物理
      return subjectIcons.value.physics[iconType];
    } else if (item.value === '5') { // 化学
      return subjectIcons.value.chemistry[iconType];
    } else  if (item.value === '2'){//地理
      return subjectIcons.value.geography[iconType];
    }
}

// 添加鼠标悬停事件处理函数
const handleMouseOver = (value) =>  {
    hoverSubjectId.value = value;
}
  
const handleMouseOut = () => {
    hoverSubjectId.value = null;
}

//关于产品弹框
const showProductDialog = ref(false)







getSubjectList()
</script>

<style scoped lang="scss">

/* 表格行悬停样式 */
:deep(.el-table__row) {
  &:hover {
    //教材版本悬停的样式
    td {
      color: #ff9900 !important;
      font-weight: bold;
    }

    // 知识点悬停的样式
    .knowledge-label, .chapter-label {
      color: #ff9900 !important;
      font-weight: bold;
    }
  }
}

/* 自定义折叠面板样式 */
:deep(.el-collapse) {
  .el-collapse-item.custom-collapse-item {
    .el-collapse-item__header {
      flex-direction: row-reverse !important;
      justify-content: flex-end !important;
      padding-left: 10px !important;
      
      /* 悬停时的背景色 */
      &:hover {
        background-color: rgba(255, 153, 0, 0.1) !important;
        color: #ff9900;
      }
      
      /* 箭头样式调整 */
      .el-collapse-item__arrow {
        margin-right: 18px !important;
        margin-left: 0 !important;
        // order: -1 !important;
      }
    }
    
    /* 激活状态的样式 */
    // .el-collapse-item__header.is-active {
    //   background-color: rgba(255, 153, 0, 0.2) !important;
    // }
  }
}


.home-container {
  // min-height: 100vh;
  display: flex;
  width: 100%;
  height: 100%;
  // flex-direction: column;
  background-color: #22252a;


.corner-arc {
  position: fixed;
  top: 110px; /* 与header底部对齐 */
  left: 150px; /* 与sidebar右侧对齐 */
  width: 30px;
  height: 30px;
  // background-color: #333; /* 与sidebar背景色一致 */
  z-index: 1001;
  transform: translate(-100%, -100%);
  border-radius: 15px 0 0 0;
  
}

.header {
  // background-image: url('/src/assets/images/logo.1a5e41c3.png');
  // background-repeat: no-repeat;
  // background-position: 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  background-color: #22252a;
  color: white;
  position: fixed;
  top: 0;
  left: 120px;/**sidebar 的宽度 */
  right: 0;
  z-index: 1000;
}

.header_tmp {
  width: 100%;
  height: 80px;
  background-color: #22252a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  color: white;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
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



.sidebar {
  width: 120px;
  background-color: #22252a;
  color: white;
  padding: 0;
  position: fixed;
  top: 0; /* header的高度 */
  left: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  

  //logo 样式
  .sidebar-logo {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
    transition: all 0.3s ease;
    margin-top: 10px;
    margin-bottom: 50px;
    img {
      width: 36px;
      height: 36px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 14px;
      color: #ff9900;
      font-weight: 500;
    }
    
    &:hover {
      transform: scale(1.05);
      cursor: pointer;
      
      img {
        filter: brightness(1.2);
      }
      
      span {
        color: #ffb340;
      }
    }
  }

  .menu-item{
    // margin-top: 90px;

    &:hover {
      cursor: pointer;
    }

  }


  //底部关于产品样式
  .sidebar-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;

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
}

/* 修复弧形交界处 */
.sidebar::before {
  content: "";
  position: absolute;
  top: -30px;
  right: 0;
  width: 30px;
  height: 30px;
  /* background-color: #f5f5f5; */
  border-radius: 0 0 0 30px;
  z-index: 101;
}

.content-area {
  position: fixed;
  min-height: calc(100vh - 80px);
  position: relative;
  border-top-left-radius: 20px; 
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin-top: 70px;
  margin-left: 30px;
  background-color: #22252a;
  max-height: calc(100vh - 80px);
  width: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
  .top-navbar {
    position: fixed;
    top: 80px;
    left: 120px;
    border-top-left-radius: 20px;//交界处的角度
    right: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-size: 20px;
        color: #303133;
        margin: 0;
      }

      .exp-count {
        color: #909399;
        font-size: 12px;
        margin-top: 9px;
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .search-input {
        width: 300px;
      }

      .create-btn {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }


  .content-wrapper {
    display: flex;
    margin-top: 60px;
    min-height: 100%;
    overflow: hidden;
    &.scrollable {
      overflow-y: auto;
    }
    .sidebar_tmp {
      position: fixed;
      top: 140px;
      padding: 0 10px;
      left: 120px;
      bottom: 0;
      width: 255px;
      overflow-y: auto;
      background-color: #fff;
      z-index: 999;
      // border-radius: 15px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f5f7fa;
    }
    
    .chapter-list {
      .sidebar-header {
        position: sticky;
        top: 0;
        background: white;
        z-index: 2;
        
        .custom-tabs {
          .el-tabs__header {
            margin-bottom: 0;
          }
          
          .el-tabs__nav-wrap {
            &::after {
              height: 1px;
            }
          }
        }
      }
    }
    .sidebar-header {
      display: flex;
      /* // border-bottom: 1px solid #e6e6e6; */
      span {
        font-size: 16px;
        flex: 1;
        text-align: center;
        padding: 5px 0;
        cursor: pointer;
        color: #606266;
        &.active-tab {
          color: #ff9900;
          /* // border-bottom: 2px solid #ff9900; */
          font-weight: bold;
          font-size: 16px;
          &:hover {
            color: #ff9900;
            font-weight: bold;
          }
        }
      }

      .el-tabs__item {
      --el-font-size-base: 16px;
    }
    

    }


    .el-table {
      --el-table-border-color: transparent !important;//去掉上下边框
      /* // --el-table-row-hover-bg-color:#ff9900; //表格获取光标的背景色 */
      margin: 10px 0;

    }

    .el-collapse {
      width: 180px;
      margin: auto;
      margin-left: 50px;
      
      --el-collapse-border-color: transparent !important;
      --el-collapse-header-font-size: 16px;//字体大小
      --el-collapse-header-text-color:hsl(230, 14.2%, 58.4%);
    }

    .el-collapse-item__arrow {
      margin: 0 8px 0 -70px;
    }

    .el-collapse-item__header {
      font-weight: bold;
      padding-left: 50px;
      /* // --el-collapse-border-color: transparent !important; */

      color: red($color: #000000);
    }

    
    .el-collapse-item__content {
      padding-left: 20px;
      padding-bottom: 2511px;
      
    }


    .chapter-list {
      padding: 1px 0;
      .library-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        cursor: pointer;
        color: #606266;
        &:hover {
          /* // background:#ff7613;
          // background-color:#f5f7fa;
          // opacity: 0.5; */
          border-radius: 10px;
          font-weight: bold;
        }
        &.active {
            // color:#ff9900;
          // background: #e49400; */
          font-weight: bold;
        }
        &.main-chapter {
          font-weight: 500;
          color: #303133;


          /* //教材版本按钮样式 */
          .btn-chapter{
            border-radius: 10px;
            width: 200px;
            &:hover {
              color: #606266;
              background: #f5f7fa;
              border: #f5f7fa;
              /* // opacity: 0.2; */
              font-weight: bold;
            }
          }

          
        }
        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
  .main-content {
    // margin-left: 247px;
    padding: 24px;
    width: calc(100% - 247px);
    overflow-y: auto;
    background: #f5f7fa;
    min-height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    border-top-left-radius: 35px;
    .header {
      background: #fff;
      padding: 16px 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      .header-left {
        h2 {
          font-size: 20px;
          margin-bottom: 16px;
          color: #303133;
        }
        .filter-tags {
          display: flex;
          gap: 8px;
          .el-tag {
            cursor: pointer;
            transition: all 0.3s;
            &.active {
              background-color: #409EFF;
              color: white;
            }
            &:hover {
              transform: translateY(-1px);
            }
          }
        }
      }
      .header-right {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        .search-input {
          width: 300px;
        }
      }
    }
    .exp-list-section {
      margin-top: 120px;
      margin-left: 120px;
      .el-row {
        margin: 0 !important;
      }

      .el-col {
        padding: 12px;
      }

      .exp-item {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        height: 100%;
        display: flex;
        flex-direction: column;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .exp-info {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          
          h3 {
            font-size: 16px;
            color: #303133;
            margin: 0 0 12px;
            line-height: 1.4;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .exp-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;

            .el-button {
              margin-left: 12px;
            }
          }
        }
      }
    }
  }
}
}

.content-experiment {
  z-index: 10001;
  background-color: #ffffff;
  padding: 24px;
  // box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  // min-height: calc(100vh - 80px);
  margin-left: -45px;
  margin-top: 80px;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 20px;
}




.el-dropdown-menu {
  .el-dropdown-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}
.exp-preview {
  .favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }

    .el-icon {
      font-size: 20px;
      color: #909399;

      transition: all 0.3s;

      &.is-favorite {
        color: #f56c6c;

      }
    }
  }
  }
 


//弹框样式
.textbook-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    max-height: 70vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: #f5f7fa;
    }
  }
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #e6e6e6;
    text-align: center;
    position: sticky;
    top: 0;
    background: white;
    z-index: 3;
    .el-dialog__title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .textbook-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .education-level {
      position: sticky;
      top: 0;
      background: white;
      z-index: 2;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      gap: 16px;
      background: #f5f7fa;
      border-radius: 30px;
      width: fit-content;
      margin: 0 auto;
      
      .level-item {
        padding: 10px 40px;
        border-radius: 24px;
        cursor: pointer;
        color: #606266;
        background: #f5f7fa;
        font-size: 16px;
        transition: all 0.3s ease;

        &:hover:not(.active) {
          // color: #409EFF;
          color: #ff9900;
        }

        &.active {
          background: white;
          color: #ff9900;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
    
    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 15px;
      max-height: calc(70vh - 120px); /* 减去顶部和底部的高度 */
    }
    
    .version-tabs {
      display: flex;
      flex-wrap: wrap; // 添加换行
      justify-content: flex-start; // 改为左对齐
      gap: 5px;
      padding: 4px;
      // background: #f5f7fa;
      border-radius: 30px;
      margin-bottom: 20px;
      width: 100%; // 设置宽度为100%
      .version-item {
        height: 37px;
        padding: 8px 24px;
        border-radius: 10px;
        cursor: pointer;
        // color: #606266;
        background: #f5f7fa;
        font-size: 14px;
        transition: all 0.3s ease;
        white-space: nowrap; // 防止文字换行
        margin: 4px; // 添加外边距

        &.active {
          background: rgba(255, 132, 19, 0.1);
          transition: all 0.3s ease;
          // color: #409EFF;
          color: #ff9900;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }   
    
      }
    }

    .version-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;

      .version-btn {
        padding: 8px 24px;
        background: #f5f7fa;
        color: #606266;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 14px;

        &:hover:not(.active) {
          background: #e4e7ed;
        }

        &.active {
          background: #409EFF;
          color: white;
        }
      }
    
    }

    .textbook-list {
      padding: 0px;
      padding-bottom: 20px;

      .textbook-row {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;
      }

      .textbook-item {
        .cover-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-5px);
            
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

  }


ul {
  margin: auto;
  
  padding: 0;
  font-size: 20px;
  line-height: 30px;
}

li {
  margin: 20px;
  color: grey;
  z-index: 100000;
  list-style-type:none;
  cursor: pointer;
  &:hover {
    color: #ff9900;
  }
}


}

//学段样式
//学段弹框布局
.dialog-content {
  padding: 20px 0;
  // background: linear-gradient(135deg, #fff6e0, #ffdfb0, #ffc78a, #ff9a56);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  border-radius: 15px;
  
  .stage-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    
    .stage-item, .confirm-btn {
      width: 90%;
      height: 60px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      span {
        font-weight: 500;
      }
    }
    
    .stage-item {
      background-color: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 180, 107, 0.5);
      color: #f0883a;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      
      &.active {
        background: linear-gradient(45deg, #ff9966, #ff7e38);
        border: none;
        color: #fff;
        box-shadow: 0 6px 20px rgba(255, 126, 56, 0.4);
      }
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 126, 56, 0.25);
      }
    }
    
    .confirm-btn {
      background: linear-gradient(45deg, #ff9966, #ff7e38);
      color: #fff;
      margin-top: 20px;
      box-shadow: 0 6px 20px rgba(255, 126, 56, 0.4);
      border: none;
      
      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 25px rgba(255, 126, 56, 0.5);
      }
    }
  }
}

.el-dialog__header {
  font-weight: bold;
  font-size: 20px;
  background: linear-gradient(to right, #fff6e0, #ff9a56);
  border-radius: 15px 15px 0 0;
}

// 修改弹框整体样式
// :deep(.el-dialog) {
//   border-radius: 15px;
//   overflow: hidden;
//   background: linear-gradient(135deg, #fff6e0, #ffdfb0, #ffc78a, #ff9a56);
//   box-shadow: 0 15px 35px rgba(255, 154, 86, 0.35);
// }

// 添加背景动画
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 学科菜单样式

.menu-item {
  display: flex;
  justify-content: center;
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px 0;
  position: relative;
}

.subject-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1%;
  border-radius: 12px;
  // background-color: rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}


.subject-icon {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.menu-item span {
  font-size: 20px;
  margin-top: 1px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.hover-text {
  color: #ff9900 !important;
  font-weight: bold;
}



.menu-item.active span {
  color: #ff9900;
  font-weight: bold;
}


}






</style>

