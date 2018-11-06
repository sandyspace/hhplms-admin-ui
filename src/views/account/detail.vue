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
              <span>{{ account.gender| genderFormatter(genders) }}</span>
            </el-form-item>
            <el-form-item label="昵称">
              <span>{{ account.nickName }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ account.status | statusFormatter(statuses) }}</span>
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
import { detailSelect } from '@/api/account'
import { loadGenders, loadAccountStatuses } from '@/api/dict'

export default {
  name: 'AccountDetails',
  filters: {
    genderFormatter: function(value, genders) {
      for (const i in genders) {
        if (genders[i].key === value) {
          return genders[i].value
        }
      }
    },
    statusFormatter: function(value, statuses) {
      for (const i in statuses) {
        if (statuses[i].key === value) {
          return statuses[i].value
        }
      }
    }
  },
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
        nickName: '',
        grantedRoles: [],
        grantedPermissions: [],
        grantedApiList: []
      },
      genders: [],
      statuses: [],
      defaultProps: {
        children: 'subPermissions',
        label: 'title'
      }
    }
  },
  created() {
    this.getGenders()
    this.getStatus()
    this.fetchData()
  },

  methods: {
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatus: function() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    fetchData() {
      detailSelect(this.$route.params.id).then(response => {
        this.account = response.data.content
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}

</script>
