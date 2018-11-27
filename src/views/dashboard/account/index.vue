<template>
  <div class="dashboard-employee-container">
    <el-row :gutter="20" type="flex">
      <el-col>
        <el-row :gutter="10" type="flex">
          <el-col>
            <div class="chart-wrapper">
              <basic-info />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col>
            <company-info />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BasicInfo from './components/BasicInfo'
import CompanyInfo from './components/CompanyInfo'

export default {
  name: 'DashboardAccount',
  components: {
    BasicInfo,
    CompanyInfo
  }
}
</script>

<style>
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
