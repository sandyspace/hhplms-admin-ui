<template>
  <el-card class="box-card" style="height: 350px">
    <div slot="header" class="clearfix">
      <span>企业信息</span>
    </div>
    <el-form v-if="companyInfoShow" ref="companyInfoForm" :model="companyInfo" label-position="left" label-width="150px">
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
      <el-form-item label="联系电话">
        <span>{{ companyInfo.contactMobile }}</span>
      </el-form-item>
      <el-form-item label="状态">
        <el-tag>{{ companyInfo.status | keyToValue(statuses) }}</el-tag>
      </el-form-item>
    </el-form>
    <div v-else align="center" style="font-size: 16px">你还未上传企业信息或加入企业</div>
  </el-card>
</template>

<script>
import { getCompanyInfoOfSelf } from '@/api/companyInfo'
import { loadCompanyInfoTypes, loadCompanyInfoStatuses } from '@/api/dict'

export default {
  name: 'CompanyInfo',
  data() {
    return {
      companyInfoShow: false,
      companyInfo: {
        code: null,
        name: null,
        type: null,
        address: null,
        contactName: null,
        contactMobile: null,
        status: null
      },
      types: [],
      statuses: []
    }
  },
  created() {
    this.getTypes()
    this.getStatuses()
    this.getCompanyInfo()
  },
  methods: {
    getCompanyInfo() {
      getCompanyInfoOfSelf().then(response => {
        if (response.data.content) {
          this.companyInfo = response.data.content
          this.companyInfoShow = true
        }
      })
    },
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    getStatuses() {
      loadCompanyInfoStatuses().then(response => {
        this.statuses = response.data.content
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
.box-card-component {
  .box-card-header {
    position: relative;
    height: 320px;
  }
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table-column;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
