<template>
  <div class="app-container" >
    <el-form ref="companyInfoEditForm" :rules="rules" :model="companyInfo" label-width="100px">
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
      <el-form-item :label="$t('联系电话')" prop="contactPhone">
        <el-input v-model="companyInfo.contactPhone" style="width: 200px;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
        <router-link :to="'/companyInfo/list'">
          <el-button>{{ $t('table.cancel') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { loadDetail, updateCompanyInfo } from '@/api/companyInfo'
import { loadCompanyInfoTypes } from '@/api/dict'
import { isValidMobile, isValidPhone } from '@/utils/validate'

export default {
  name: 'CompanyInfoEdit',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value) && !isValidPhone(value)) {
          callback(new Error('请输入有效的联系电话'))
        }
      }
      callback()
    }
    return {
      types: [],
      companyInfo: {
        code: null,
        name: null,
        type: null,
        address: null,
        contactName: null,
        contactPhone: null
      },
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
        contactPhone: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          validator: validatePhone, trigger: ['blur', 'change']
        }]
      }
    }
  },
  created() {
    this.getTypes()
    this.fetchData()
  },
  methods: {
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    fetchData() {
      loadDetail(this.$route.params.id).then(response => {
        this.companyInfo = response.data.content
      })
    },
    updateData: function() {
      this.$refs.companyInfoEditForm.validate((valid) => {
        if (valid) {
          const companyInfo = {
            code: this.companyInfo.code,
            name: this.companyInfo.name,
            type: this.companyInfo.type,
            address: this.companyInfo.address,
            contactName: this.companyInfo.contactName,
            contactPhone: this.companyInfo.contactPhone
          }
          updateCompanyInfo(this.$route.params.id, companyInfo).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
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
