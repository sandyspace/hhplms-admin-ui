<template>
  <div class="app-container">
    <el-form ref="accountForm" :model="account" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="用户信息" name="basicInfo">
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <span>{{ account.loginName }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ account.realName }}</span>
            </el-form-item>
            <el-form-item label="邮件">
              <span>{{ account.email }}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{ account.mobile }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ account.gender| keyToValue(genders) }}</span>
            </el-form-item>
            <el-form-item label="昵称">
              <span>{{ account.nickName }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ account.status | keyToValue(statuses) }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ account.type | keyToValue(types) }}</span>
            </el-form-item>
            <el-form-item label="所属企业">
              <span>{{ account.companyId | idToName(companyInfos) }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="角色信息" name="role">
          <el-tag v-for="role in account.grantedRoles" :key="role.code" size="medium">{{ role.name }}</el-tag>
        </el-tab-pane>
        <el-tab-pane label="菜单权限" name="permissions">
          <template>
            <el-tree :data="account.grantedPermissions" :props="defaultProps" default-expand-all node-key="id"/>
          </template>
        </el-tab-pane>
        <el-tab-pane label="接口权限" name="apiList">
          <el-tag v-for="api in account.grantedApiList" :key="api.name" size="medium">{{ api.title }}</el-tag>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { loadDetail } from '@/api/account'
import { loadGenders, loadAccountStatuses, loadAccountTypes } from '@/api/dict'
import { getAvailableCompanyInfos } from '@/api/companyInfo'

export default {
  name: 'AccountDetails',
  data() {
    return {
      activeTabName: 'basicInfo',
      roles: [],
      account: {
        loginName: '',
        realName: '',
        email: '',
        mobile: '',
        gender: '',
        status: '',
        type: '',
        nickName: '',
        companyId: null,
        grantedRoles: [],
        grantedPermissions: [],
        grantedApiList: []
      },
      genders: [],
      statuses: [],
      types: [],
      companyInfos: [],
      defaultProps: {
        children: 'subPermissions',
        label: 'title'
      }
    }
  },
  created() {
    this.getGenders()
    this.getStatus()
    this.getTypes()
    this.getCompanyInfos()
    this.fetchData()
  },

  methods: {
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatus() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes() {
      loadAccountTypes().then(response => {
        this.types = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    fetchData() {
      loadDetail(this.$route.params.id).then(response => {
        this.account = response.data.content
      })
    }
  }
}
</script>
