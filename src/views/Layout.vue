<template>
  <el-container class="wrapper">
    <!-- 左侧区域 -->
    <sidebar />
    <!-- 右侧内容展示 -->
    <el-container direction="vertical">
      <navbar />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Sidebar,
    Navbar
  }
}
</script>

<style>
.wrapper {
  min-height: 100vh;
}
</style>
