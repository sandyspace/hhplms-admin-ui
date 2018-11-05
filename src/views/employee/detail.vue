<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="基本信息" name="basicInfo">
        <el-form label-width="80px">
          <el-form-item label="用户名">
            <span>{{ employee.loginName }}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{ employee.realName }}</span>
          </el-form-item>
          <el-form-item label="邮件">
            <span>{{ employee.email }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ employee.mobile }}</span>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{ employee.gender }}</span>
          </el-form-item>
          <el-form-item label="身份证">
            <span>{{ employee.idCard }}</span>
          </el-form-item>
          <el-form-item label="头衔">
            <span>{{ employee.title }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ employee.status }}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="角色信息" name="role">
        <el-tag v-for="role in employee.grantedRoles" :key="role.code" size="medium">{{ role.name }}</el-tag>
      </el-tab-pane>
      <el-tab-pane label="菜单权限" name="permissions">
        <el-tree
          ref="permissionsTree"
          :data="employee.grantedPermissions"
          :props="defaultProps"
          node-key="id"
          default-expand-all />
      </el-tab-pane>
      <el-tab-pane label="接口权限" name="apiList">
        <el-tag v-for="api in employee.grantedApiList" :key="api.name" size="medium">{{ api.title }}</el-tag>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { loadDetail } from '@/api/employee'

export default {
  name: 'EmployeeDetail',
  data() {
    return {
      activeTabName: 'basicInfo',
      employee: {
        loginName: '',
        realName: '',
        email: '',
        mobile: '',
        sex: '',
        idCard: '',
        title: '',
        status: '',
        grantedRoles: [],
        grantedPermissions: [],
        grantedApiList: []
      },
      defaultProps: {
        children: 'subPermissions',
        label: 'title'
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      loadDetail(this.$route.params.id).then(response => {
        this.employee = response.data.content
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
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
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
