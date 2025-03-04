<template>
  <div class="app-container home">
    <!-- 添加顶部导航栏 -->
    <div class="top-navbar">
      <div class="nav-left">
        <h1>POROSEYE实验·精品实验-------{{ subjectIdTmp }} === {{ route.query.subjectId }}</h1>
        <span class="exp-count">{{experimentList.length}}个</span>
      </div>
      <div class="nav-right">
        <el-input
          v-model="searchText"
          placeholder="搜索实验"
          prefix-icon="Search"
          class="search-input"
          @input="searchExperiment(searchText)"
        />
        <!-- <el-button type="primary" class="create-btn">
          <el-icon><Plus /></el-icon>新建实验
        </el-button> -->
      </div>
    </div>
    
    <!-- 左侧导航栏 -->
    <div class="content-wrapper">

      <div class="sidebar">
      <div class="chapter-list">

        <div class="sidebar-header">
          <el-tabs 
          v-model="activeTab"
          class="custom-tabs"
          style="width: 235px;--el-color-primary:#ff9900"
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
                  style="width: 100%;font-size: 16px;cursor: pointer;">
                  <el-table-column type="expand">
                    <template #default="scope">
                      <el-collapse >
                        <!-- 分册 -->
                        <el-collapse-item v-for="(item, index) in scope.row.mtVolumeList" :key="index" :title="item.volumeName" @click="clickCollapseItem(item)" >
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
                    style="font-size: 16px;"
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
                
                
                <!-- <div class="favorite-btn" @click.stop="toggleFavorite(item)">
                  <el-icon :class="{ 'is-favorite': item.isFavorite }">
                    <Star />
                  </el-icon>
                </div> -->
              </div>
              <div class="exp-info">
                <!-- <h3>{{ item.experimentName }}</h3> -->
                <div class="exp-stats">
                  <h3>{{ item.experimentName }}</h3>
                  <!-- <span><el-icon style="position: relative;top: 2px;"><View /></el-icon> {{ item.views }}次查看</span> -->
                  <el-dropdown trigger="click">
                    <el-button size="small" circle>
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
    <div class="version-tabs">
      <!-- <div 
        class="version-item"
        :class="{ active: currentVersion === 'all' }"
        @click="handleVersionAllChange('all')"
      >全部
    </div> -->
    <div>
      <el-tag  class="version-item"
        :class="{ active: currentVersion11111 === 'all' }"
        @click="handleVersionAllChange('all')" type="info" size="large">全部</el-tag>
    </div>
      <!-- <div 
        v-for="(version, index) in textbookLibraryNameArr" 
        :key="index"
        class="version-item"
        :class="{ active: currentVersion === version.id }"
        @click="handleVersionChange(version)"
      >
        {{ version.textbookVersionName }}
      </div> -->

      <div>
        <el-tag v-model="textbookLibraryFrom.id"
        class="version-item"
        v-for="(version, index) in textbookLibraryNameArr" 
        :key="index"
        
        :class="{ active: currentVersion11111 === version.id + '-' + version.textbookLibraryId }"
        @click="handleVersionChange(version)" type="info" size="large"> {{ version.textbookVersionName }}</el-tag>
      </div>
    </div>
    <div class="textbook-list">
      <div class="textbook-row">
        <div class="textbook-item all-books">
          <div class="cover-wrapper">
            <img src="/src/assets/images/all.jpg" alt="全部教材" />
          </div>
          <div class="overlay">
              <span>所有教材资源</span><br>
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
          <!-- <div class="cover-wrapper" @click="handleTextbookClick(item)">
            <img :src="item.coverImg" :alt="item.title" class="textbook-cover"/>
          </div> -->
          <!--   clickCurrentId.value = item.textbookLibraryId + '-' + item.volumeId -->
          <!-- <div class="book-info" :style="[item.id + '-' + item.textbookLibraryId + '-' + item.volumeId == clickCurrentId ? dynamicStyles : 'none' ]">
              <span class="version">{{ item.textbookVersionName }}</span>
              <span class="grade">{{ item.volumeName }}</span>
            </div> -->
        </div>
      </div>
    </div>
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
  </div>
</template>

<script setup name="Index">

import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance();
import { ref, computed, onMounted, watch  } from 'vue'

import {useRoute, useRouter} from 'vue-router'
// 添加关于弹框控制变量
const showAboutDialog = ref(false)
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

//存用户选中了教材版本-分册后获取章节的数据
const chapterResult = ref([])


const textbookLibraryFrom = ref({})

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
    console.log(libraryList.value)
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
  queryExperimentParams.value.subjectId = subjectIdTmp.value
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
  queryExperimentParams.value.subjectId = subjectIdTmp.value
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
  querySubjectParams.value.subjectType = subjectIdTmp.value
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
  dynamicStyles.value = [{ color: '#409EFF' }, {fontWeight: 'bold'}]
  //用户选择的数据
  selectTextbookLibraryItem.value = item
  
}

//弹框确认按钮
const finalSelectTextbookLibraryItem = ref()
const confirmSelect = (currentLevel, item) => {

  if(currentVersion.value == 'all') {
    ElMessage.warning('请先选择教材版本')
    return
  }
  console.log(clickCurrentId.value)

  if(clickCurrentId.value == undefined) {
    ElMessage.warning('请先选择教材分册')
    return
  }
  // 处理确认选择逻辑
  showAboutDialog.value = false
  console.log('点击了确认按钮')
  console.log(currentLevel)
  console.log(selectTextbookLibraryItem)
  console.log('点击了确认按钮')

  finalSelectTextbookLibraryItem.value = selectTextbookLibraryItem.value

  // currentLevel.value = currentLevel
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
  queryExperimentParams.value.subjectId = route.query.subjectId//科目id
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

// 修改实验列表数据，添加 isFavorite 属性
const expList = ref([
  {
    id: 1,
    title: '2023江苏卷第10题',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 2500,
    isFavorite: false
  },
  {
    id: 2,
    title: '探究两个互成角度的力的合成规律的实验',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 6000,
    isFavorite: true
  },
  {
    id: 3,
    title: '探究小车速度随时间变化的规律',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 3900,
    isFavorite: false
  },
  {
    id: 4,
    title: '探究小车速度随时间变化的规律',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 3900,
    isFavorite: false
  },
  {
    id: 5,
    title: '探究小车速度随时间变化的规律',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 3900,
    isFavorite: false
  },
  {
    id: 6,
    title: '探究小车速度随时间变化的规律',
    img: 'https://motong-java.oss-accelerate.aliyuncs.com/motong/2025/1/3/8b85d5727b916bca0e356aa61f0d837b_400-340DummyCover.png',
    views: 3900,
    isFavorite: false
  },
  {
    id: 1,
    title: '化学',
    version: '新人教版',
    grade: '九年级上',
    cover: '...'
  },
  {
    id: 2,
    title: '化学',
    version: '人教版',
    grade: '九年级下',
    cover: '...'
  },

])
const toggleTag = (tag) => {
  filterTags.value.forEach(t => t.active = false)
  tag.active = true
}
// 添加处理函数
const watchVideo = (item) => {
  console.log('观看视频:', item.title)

  // router.push('/experiment')
  router.push({
    path: '/experiment',
    query: { 
      experimentId: item.experimentInfoId,//实验值（字典维护的）
      experimentName: item.experimentName,//实验名称
      type: 'experiment',
      _t: Date.now() // 添加时间戳参数强制刷新列表
    }
  })
  
  // 这里添加观看视频的逻辑
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



getSubjectList()
// getLibraryList() //获取教材版本列表
// getKnowledgeList() //获取知识点列表
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin-top: 100px;
  margin-left:30px;
  .top-navbar {
    background: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;

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
        font-size: 14px;
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
    padding: 0 24px 24px;
    .sidebar {
    
    width: 240px;
    background: #fff;
    border-right: 1px solid #e6e6e6;
    height: 100vh;
    .sidebar-header {
      display: flex;
      // border-bottom: 1px solid #e6e6e6;
      span {
        font-size: 16px;
        flex: 1;
        text-align: center;
        padding: 5px 0;
        cursor: pointer;
        color: #606266;
        &.active-tab {
          color: #ff9900;
          // border-bottom: 2px solid #ff9900;
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
      // --el-table-row-hover-bg-color:#ff9900; //表格获取光标的背景色
      margin: 10px 0;

    }

    .el-collapse {
      width: 180px;
      margin: auto;
      margin-left: 50px;
      
      --el-collapse-border-color: transparent !important;
      --el-collapse-header-font-size: 16px;//字体大小
      --el-collapse-header-text-color:hsl(230, 14.2%, 58.4%);//字体颜色
    }

    .el-collapse-item__arrow {
      margin: 0 8px 0 -70px;
    }

    .el-collapse-item__header {
      font-weight: bold;
      padding-left: 50px;
      // --el-collapse-border-color: transparent !important;

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
          // background:#ff7613;
          // background-color:#f5f7fa;
          // opacity: 0.5;
          border-radius: 10px;
          font-weight: bold;
        }
        &.active {
          // color:#ff9900;
          // background: #e49400;
          font-weight: bold;
        }
        &.main-chapter {
          font-weight: 500;
          color: #303133;


          //教材版本按钮样式
          .btn-chapter{
            border-radius: 10px;
            width: 200px;
            &:hover {
              color: #606266;
              background: #f5f7fa;
              border: #f5f7fa;
              // opacity: 0.2;
              font-weight: bold;
            }
          }

          // .focused-style {
          //   background-color: #4CAF50;
          //   color: white;
          //   border-color: #45a049;
          //   box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
          // }
        }
        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
  .main-content {
    flex: 1;
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
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
      .exp-item {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s;
        margin-bottom: 24px;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f5f7fa;
          font-weight: bold;
          // #ebf5ff  #409EFF   fff1e7 浅色
        } 
        //点击更多更改背景色
        // .el-button {
        //   --el-color-primary-light-7:#fff1e7;
        //   --el-color-primary-light-9:#fff1e7;
        //   --el-color-primary: #ff7613;
        // }
        .exp-info {
          padding: 0 10px 10px;
          h3 {
            font-size: 16px;
            // font-weight: bold;
            margin-bottom: 12px;
            color: #303133;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
          }
          .exp-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #999;
            font-size: 14px;
            padding: 0 4px;
            span {
              flex: 1;
              margin-right: 12px;
            }
            .el-dropdown {
              margin-left: auto;
            }

          
          }
        }
      }
    }
  }
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

  max-height: 100px;
    overflow-y: auto;
    // padding: 20px;
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
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #e6e6e6;

    text-align: center;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: bold;

    }
  }

  .textbook-content {



    .education-level {
      position: sticky;
      top: 0;
      background: white;
      z-index: 2;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      gap: 16px;
      // margin: 20px 0;
      padding: 4px;
      background: #f5f7fa;
      border-radius: 30px;
      width: fit-content;
      margin: 0px auto;
      
      .level-item {
        padding: 10px 40px;
        border-radius: 24px;
        cursor: pointer;
        color: #606266;
        background: #f5f7fa;
        font-size: 16px;
        transition: all 0.3s ease;

        &:hover:not(.active) {
          color: #409EFF;
        }

        &.active {
          background: white;
          color: #409EFF;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
    .version-tabs {
      display: flex;
      flex-wrap: wrap; // 添加换行
      justify-content: flex-start; // 改为左对齐
      gap: 5px;
      margin: 20px 0;
      padding: 4px;
      // background: #f5f7fa;
      border-radius: 30px;
      margin: 20px auto;
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
          background: #e8f6ff;
          color: #409EFF;
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


</style>

















