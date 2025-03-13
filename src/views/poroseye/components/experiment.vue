<template>

  <div class="app-container experiment">
    <!-- 头部 -->
  <poroseye-header :qhExperimentFlag="false" />
  <div class="experiment-header">
      <h1 class="title">{{experimentNameRes}} - {{ experimentIdRes }}</h1>
      <div class="stats">
        <span class="likes">
          <el-icon><Star /></el-icon>
          999 收藏
        </span>
        <span class="hot-tag">HOT</span>
        <div class="info-header">
          <el-button color="#ff9900" style="--el-color-black:#fff;" type="warning" >去做实验</el-button>
          <el-button
            type="info"
            style="--el-color-primary:#606266;--el-color-primary-light-7:#dcdfe6;--el-color-primary-light-9:#fff；border-style: none;"
            @click="back"
          >
            返回
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="experiment-content">
      
      <div class="video-section">
        <vue3videoPlay v-bind="options" />
        <!-- <vue3videoPlay v-bind="options" />
        <vue3videoPlay v-bind="options" />
        <vue3videoPlay v-bind="options" />
        <vue3videoPlay v-bind="options" /> -->
      </div>

      <div class="experiment-info">
      
        <el-scrollbar :height="experimentDataMsg ? '750px' : 'auto'">
        <div class="info-content">
            
    <!-- <div v-for="(item, index) in experimentItems" :key="index" class="info-item">
      <div class="item-header">
        <h3>{{ item.title }}</h3>
        <el-button 
          class="expand-btn" 
          type="text"
          @click="toggleExpand(index)"
        >
          <el-icon>
            <component :is="item.isExpanded ? 'Minus' : 'Plus'" />
          </el-icon>
        </el-button>
      </div>



      <div class="item-content" :class="{ 'expanded': item.isExpanded }">
        <el-input
          
          v-model="item.content"
          type="textarea"
          :rows="4"
        
          disabled="true"
          @blur="autoSave(index)"
        />

        <span v-if="item.isExpanded">{{ item.content }}</span>
      </div>
    </div> -->
    <div class="info-item">
        <el-collapse  v-model="activeNames" @change="handleChange(val)">
        
          <el-collapse-item title="实验原理" name="1">
            <div v-if="experimentDataMsg">
              {{ experimentDataMsg.experimentPrinciple.text }}
            </div>
            <div v-else>
              暂无内容
            </div>
          </el-collapse-item>

          <el-collapse-item title="实验目标" name="2">
            <div v-if="experimentDataMsg">
              {{ experimentDataMsg.experimentTarget.text }}
            </div>
          </el-collapse-item>

          <el-collapse-item title="实验素材" name="3">
            <div v-if="experimentDataMsg">
              <span v-for="(item, index) in experimentDataMsg.experimentMaterials" :key="index">
                {{ item.sourceMaterial.fileName }}
              </span>
            </div>
          </el-collapse-item>

          <el-collapse-item title="实验步骤" name="4">
            <div>

              <div class="steps-content">
              <el-empty v-if="steps.length === 0" description="暂无数据" />
              <el-tree
                v-else
                :data="steps"
                :props="{
                  children: 'children',
                  label: 'label'
                }"
                node-key="id"
                default-expand-all
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node">
                    <span class="node-content">
                      <span class="step-index">步骤【{{ getStepNumber(node) }}】</span>
                      <span class="step-line"></span>
                      <span :class="['step-label', { 'first-level': getLevel(node) === 1 }]">
                        {{ data.stepName }}
                      </span>
                      <el-tag size="small" type="success" class="ml-2">
                        分数：{{ data.stepScore }}
                      </el-tag>
                    </span>
                  
                  </span>
                </template>
              </el-tree>
            </div>
            </div>
          </el-collapse-item>
      </el-collapse>
    </div>

  </div>
        </el-scrollbar>
      </div>
    </div>
  </div>

</template>
  
<script setup>
// 引入视频插件组件和样式
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css
import { reactive } from 'vue';
const { proxy } = getCurrentInstance();

//导入实验API
import { getExperimentDataRes } from '@/api/poroseye/experimentInfo'


//导入实验步骤API
import { listExperimentInfoStep } from '@/api/poroseye/experimentInfoStep'

//头部组件
import PoroseyeHeader from '@/views/poroseye/components/poroseyeHeader.vue'

//默认展开的数据---实验原理
const activeNames = ref(['1'])


const props = defineProps({
  experimentId:{
    type: Number,
    default: 0
  },

  experimentName:{
    type: String,
    default: 'default'
  }
})


const defaultProps = {
  children: 'children',
  label: 'label'
}

const route = useRoute()

const options = reactive({
  width: "100%", //播放器宽度 也可以使用px
  height: "100%", //播放器高度  同理可以使用px
  color: "#409eff", //主题色
  title: "", //视频名称
  src: "https://motong-static.oss-cn-beijing.aliyuncs.com/videos/MajorAndJunior/%E6%B0%B4%E7%9A%84%E6%B2%B8%E8%85%BE.mp4", //视频源
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.5", "0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: false, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    "audioTrack",
    "quality",
    "speedRate",
    "volume",
    "setting",
    "pip",
    "pageFullScreen",
    "fullScreen",
  ], //显示所有按钮,
})

  const experimentItems = ref([
  {
    title: '实验目的：',
    content: '学习实验室制取氧气的方法之一——加热高锰酸钾制氧气。',
    placeholder: '请填写实验目的',
    isExpanded: false
  },
  {
    title: '实验原理：',
    content: '',
    placeholder: '请填写实验原理',
    isExpanded: false
  },

  {
    title: '实验目标：',
    content: '实验目标：',
    placeholder: '请填写实验原理',
    isExpanded: false
  },
  {
    title: '实验用品：',
    content: '实验用品：',
    placeholder: '请填写实验用品',
    isExpanded: false
  },
  {
    title: '实验步骤：',
    content: '实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：实验步骤：',
    placeholder: '请填写实验步骤',
    isExpanded: false
  }
])

const toggleExpand = (index) => {
  experimentItems.value[index].isExpanded = !experimentItems.value[index].isExpanded
}

const autoSave = (index) => {
  // 这里添加自动保存逻辑
  console.log('自动保存:', experimentItems.value[index].content)
}


//获取实验详细信息
const experimentDataMsg = ref()
function getExperimentList(id) {
  getExperimentDataRes(id).then(response => {
    experimentDataMsg.value = response.data;
    console.log('experimentDataMsg.value')
    console.log(experimentDataMsg.value)
    console.log('experimentDataMsg.value')
  });

}
//科目
const experimentIdRes = ref()
const experimentNameRes = ref()

//监听科目动态
watch(() => [props.experimentId, props.experimentName], ([newExperimentId, newExperimentName]) => {
  
  experimentIdRes.value = newExperimentId
  experimentNameRes.value = newExperimentName
  getExperimentList(experimentIdRes.value)

},{ immediate: true })

// 获取步骤编号
const getStepNumber = (node) => {
  const level = getLevel(node)
  let numbers = []
  let currentNode = node
  
  while (currentNode.parent && currentNode.parent.level !== undefined) {
    const siblings = currentNode.parent.childNodes
    const index = siblings.findIndex(n => n === currentNode) + 1
    numbers.unshift(index)
    currentNode = currentNode.parent
  }
  
  return numbers.join('.')
}

// 获取节点层级
const getLevel = (node) => {
  if(null == node) {
    return 0
  }
  let level = 1
  let parent = node.parent
  while (parent && parent.level !== 0) {
    level++
    parent = parent.parent
  }
  return level
}


const steps = ref([])//存实验步骤数据

const queryParams = ref({
    pageNum: 1,
    pageSize: 10000,
    experimentInfoId:''

  }
)
const total = ref(0);
/** 查询实验步骤列表 */
function getStepsList() {
  queryParams.value.experimentInfoId = route.query.experimentId
  listExperimentInfoStep(queryParams.value).then(response => {
    steps.value = proxy.handleTree(response.rows, "id", "parentId");
    total.value = steps.value.length
  });
}
getStepsList()
function handleChange(val) {
  console.log('stepChange')
  console.log(val)
  console.log('stepChange')
}

const emit = defineEmits(['onNum'])

//返回主页
function back() {
  emit('onNum', 1)
}

</script>
  
<style lang='scss' scoped>
.experiment {
  // padding: 16px;
  max-width: 100%;
  overflow-x: hidden;
  padding-top: 10px; /* 添加顶部内边距，为固定头部留出空间 */
  .experiment-header {
    margin-bottom: 16px;
    position: fixed; /* 固定定位 */
    top: 100px;
    left: 30px;
    right: 0;
    z-index: 1000; /* 确保在其他元素上方 */
    background-color: #fff; /* 添加背景色 */
    padding: 16px 24px; /* 添加内边距 */
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    transition: all 0.3s ease; /* 平滑过渡效果 */
    .title {
      // font-size: 20px;
      margin-top: 0px;
      color: #303133;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .stats {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #909399;
      font-size: 14px;

      .views, .likes {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .hot-tag {
        background: #ff9900;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      .info-header {
        position: absolute;
        right: 24px;
        padding: 16px;
      }
    }
  }

  .experiment-content {
    display: flex;
    gap: 16px;
    max-height: calc(100vh - 30vh);
    // position: relative; /* 添加相对定位 */
    // z-index: 1000; /* 确保内容区域在适当的层级 */
    .video-section {
      flex: 3; /* 调整比例，原来是1 */
      max-height: 100%;
      
      :deep(.video-player) {
        aspect-ratio: 16/9;
        max-height: 100%;
        border-radius: 8px;
        overflow: hidden;
      }
    }

    .experiment-info {
      flex: 2; /* 调整比例，原来是固定宽度40% */
      background: #fff;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-height: 100%;
      overflow: hidden;

      .info-content {
        .info-item {
          .el-collapse {
            --el-collapse-header-height: 100px; /* 减小行高 */
            --el-collapse-header-font-size: 20px; /* 减小标题字体 */
            --el-collapse-content-font-size: 18px; /* 减小内容字体 */
          }
          
          /* 其他样式保持不变 */
          .steps-content {
            padding: 5px;
          }

          /* 树节点样式调整 */
          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .node-content {
            display: flex;
            align-items: center;
            gap: 12px; /* 减小间距 */
          }

          .step-index {
            color: black;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 14px; /* 减小字体 */
            font-weight: bold;
            min-width: 40px;
            text-align: center;
          }

          .step-line {
            position: relative;
            width: 120px; /* 减小宽度 */
            height: 2px;
            background: repeating-linear-gradient(
              90deg,
              #000,
              #000 2px,
              transparent 2px,
              transparent 4px
            );
          }

          .step-line:after {
            content: '';
            position: absolute;
            top: -5px;
            right: -10px;
            width: 10px;
            height: 10px;
            background-color: #000;
            clip-path: polygon(0 0, 100% 50%, 0 100%);
          }

          .step-label {
            font-size: 13px; /* 减小字体 */
          }

          .first-level {
            font-weight: bold;
            font-size: 14px; /* 减小字体 */
          }

          .el-tag--small {
            margin-left: 12px;
          }
        }
      }
    }
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .experiment {
    .experiment-content {
      flex-direction: column;
      
      .video-section, .experiment-info {
        width: 100%;
        max-width: 100%;
        flex: none;
      }
      
      .video-section {
        max-height: 50vh;
      }
      
      .experiment-info {
        max-height: 50vh;
      }
    }
  }
}
</style>
  