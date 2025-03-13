<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style scoped>
.el-button--orange {
      color: #FFFFFF;
  border: 1px solid #1C59FF;
  background: linear-gradient(180deg, #102657 0%, #1B3870 100%);
  --el-color-primary: orange;
  
}
</style>