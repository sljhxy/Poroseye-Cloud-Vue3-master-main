<template>
  <div>
    <!-- <svg-icon icon-class="github"  /> -->
    <h4 style="color: #40a9ff;font-weight: bold;cursor: pointer;" @click="goto" >《POROSEYE用户协议》</h4>
    
  </div>
</template>

<script setup>
const url = ref('https://gitee.com/y_project/RuoYi-Cloud');

function goto() {
  window.open(url.value)
}
</script>
