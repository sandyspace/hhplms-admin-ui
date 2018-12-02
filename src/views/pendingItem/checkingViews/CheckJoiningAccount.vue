<template>
  <el-card shadow="never">
    <div slot="header" >
      <span>审核之前请确认该账号是本企业的员工</span>
    </div>
    <div>
      <el-form ref="accountForm" :model="account" label-position="left" label-width="100px" style="margin-left: 10px; margin-top:10px;" size="mini">
        <el-form-item label="用户名">
          <span>{{ account.loginName }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{ account.realName }}</span>
        </el-form-item>
        <el-form-item label="昵称">
          <span>{{ account.nickName }}</span>
        </el-form-item>
        <el-form-item label="手机">
          <span>{{ account.mobile }}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ account.email }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ account.gender | keyToValue(genders) }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ account.status | keyToValue(statuses) }}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { getAccountByLoginName } from '@/api/account'
import { loadGenders, loadAccountStatuses } from '@/api/dict'

export default {
  name: 'CheckJoiningAccount',
  props: {
    loginName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      account: {
        loginName: null,
        nickName: null,
        realName: null,
        mobile: null,
        email: null,
        gender: null,
        status: null
      },
      genders: [],
      statuses: []
    }
  },
  created() {
    this.getGenders()
    this.getStatuses()
    this.getAccount()
  },
  methods: {
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatuses() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getAccount() {
      getAccountByLoginName(this.loginName).then(response => {
        this.account = response.data.content
      })
    }
  }
}
</script>
