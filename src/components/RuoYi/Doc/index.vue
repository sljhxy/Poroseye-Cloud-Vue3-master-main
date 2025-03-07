<template>
  <div>
    <!-- <svg-icon icon-class="question" @click="goto" /> -->
    <h4 style="color: #40a9ff;font-weight: bold;cursor: pointer;" @click="goto">《隐私政策》</h4>
    <div>
      
    </div>
  </div>
</template>

<script setup>
const url = ref('http://doc.ruoyi.vip/ruoyi-cloud');

function goto() {
  window.open(url.value)
}
</script>