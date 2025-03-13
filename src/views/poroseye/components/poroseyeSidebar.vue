<template>
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
</template>

<script setup>


</script>

<style lang="scss" scoped>

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

</style>