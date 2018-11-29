<template>
  <el-card shadow="never">
    <div slot="header" >
      <span>审核之前请确认企业信息真实有效</span>
    </div>
    <div>
      <el-form ref="companyInfoForm" :model="companyInfo" label-position="left" label-width="100px" style="margin-left: 50px; margin-top:50px;">
        <el-form-item label="企业编码">
          <span>{{ companyInfo.code }}</span>
        </el-form-item>
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
        <el-form-item label="联系方式">
          <span>{{ companyInfo.contactMobile }}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { getCompanyInfoOfAccount } from '@/api/companyInfo'
import { loadCompanyInfoTypes } from '@/api/dict'

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
      types: []
    }
  },
  created() {
    this.getTypes()
    this.getDistributorInfoOfAccount()
  },
  methods: {
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    getCompanyInfoOfAccount() {
      getCompanyInfoOfAccount(this.loginName).then(response => {
        this.companyInfo = response.data.content
      })
    }
  }
}
</script>
