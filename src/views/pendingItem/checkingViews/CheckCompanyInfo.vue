<template>
  <el-card shadow="never">
    <div slot="header" >
      <span>审核之前请确认企业信息真实有效</span>
    </div>
    <div>
      <el-form ref="companyInfoForm" :model="companyInfo" label-position="left" label-width="100px" style="margin-left: 10px; margin-top:10px;" size="mini">
        <el-form-item label="企业名称">
          <span>{{ companyInfo.name }}</span>
        </el-form-item>
        <el-form-item label="企业类型">
          <span>{{ companyInfo.type | keyToValue(types) }}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{ companyInfo.address }}</span>
        </el-form-item>
        <el-form-item label="联系人">
          <span>{{ companyInfo.contactName }}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span>{{ companyInfo.contactPhone }}</span>
        </el-form-item>
        <el-form-item label="企业主姓名">
          <span>{{ companyOwner.realName }}</span>
        </el-form-item>
        <el-form-item label="企业主性别">
          <span>{{ companyOwner.gender | keyToValue(genders) }}</span>
        </el-form-item>
        <el-form-item label="企业主手机">
          <span>{{ companyOwner.mobile }}</span>
        </el-form-item>
        <el-form-item label="企业主邮箱">
          <span>{{ companyOwner.email }}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { getCompanyInfoOfAccount } from '@/api/companyInfo'
import { getAccountByLoginName } from '@/api/account'
import { loadCompanyInfoTypes, loadGenders } from '@/api/dict'

export default {
  name: 'CheckCompanyInfo',
  props: {
    loginName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      companyInfo: {
        code: null,
        name: null,
        type: null,
        address: null,
        contactName: null,
        contactMobile: null
      },
      companyOwner: {
        realName: null,
        gender: null,
        mobile: null,
        email: null
      },
      types: [],
      genders: []
    }
  },
  created() {
    this.getTypes()
    this.getGenders()
    this.getCompanyInfoOfAccount()
  },
  methods: {
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getCompanyInfoOfAccount() {
      getCompanyInfoOfAccount(this.loginName).then(response => {
        this.companyInfo = response.data.content
      }).then(() => {
        getAccountByLoginName(this.loginName).then(response => {
          const account = response.data.content
          this.companyOwner = {
            realName: account.realName,
            gender: account.gender,
            mobile: account.mobile,
            email: account.email
          }
        })
      })
    }
  }
}
</script>
