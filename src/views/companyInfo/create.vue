<template>
  <div class="app-container">
    <el-form ref="companyInfoCreationForm" :rules="rules" :model="companyInfo" label-width="100px">
      <el-form-item :label="$t('企业编码')" prop="code">
        <el-input v-model="companyInfo.code" style="width: 200px;" />
      </el-form-item>
      <el-form-item :label="$t('企业名称')" prop="name">
        <el-input v-model="companyInfo.name" style="width: 200px;" />
      </el-form-item>
      <el-form-item :label="$t('企业类型')" prop="type">
        <el-select v-model="companyInfo.type" placeholder="请选择">
          <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('地址')" prop="address">
        <el-input v-model="companyInfo.address" style="width: 200px;"/>
      </el-form-item>
      <el-form-item :label="$t('联系人')" prop="contactName">
        <el-input v-model="companyInfo.contactName" style="width: 200px;"/>
      </el-form-item>
      <el-form-item :label="$t('联系电话')" prop="contactMobile">
        <el-input v-model="companyInfo.contactMobile" style="width: 200px;"/>
      </el-form-item>
      <el-form-item :label="$t('状态')" prop="status">
        <el-select v-model="companyInfo.status" placeholder="请选择">
          <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createData()">{{ $t('table.confirm') }}</el-button>
        <router-link :to="'/companyInfo/list'">
          <el-button>{{ $t('table.cancel') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { createCompanyInfo } from '@/api/companyInfo'
import { loadCompanyInfoTypes, loadCompanyInfoStatuses } from '@/api/dict'
import { isValidMobile } from '@/utils/validate'

export default {
  name: 'CompanyInfoCreate',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value)) {
          callback(new Error('请输入有效的手机号'))
        }
      }
      callback()
    }
    return {
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
      statuses: [],
      rules: {
        name: [{
          required: true, message: '请输入企业名称', trigger: 'blur'
        }],
        type: [{
          required: true, message: '请选择企业类型', trigger: 'change'
        }],
        address: [{
          required: true, message: '请输入地址', trigger: 'blur'
        }],
        contactName: [{
          required: true, message: '请输入联系人', trigger: 'blur'
        }],
        contactMobile: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          validator: validateMobile, trigger: ['blur', 'change']
        }],
        status: [{
          required: true, message: '请选择状态', trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getStatuses()
    this.getTypes()
  },
  methods: {
    getStatuses() {
      loadCompanyInfoStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    createData: function() {
      this.$refs.companyInfoCreationForm.validate((valid) => {
        if (valid) {
          createCompanyInfo(this.companyInfo).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            if (err.data.errorMsg) {
              console.log(err.data.errorMsg)
            }
          })
        }
      })
    }
  }
}
</script>
