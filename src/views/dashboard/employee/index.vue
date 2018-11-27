<template>
  <div class="dashboard-employee-container">
    <el-row :gutter="10" type="flex">
      <el-col>
        <div class="chart-wrapper">
          <BasicInfo/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BasicInfo from './components/BasicInfo'

export default {
  name: 'EmployeeDashboard',
  components: {
    BasicInfo
  }
}
</script>

<style scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
