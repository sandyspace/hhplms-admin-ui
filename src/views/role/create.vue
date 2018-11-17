<template>
  <div class="app-container">
    <el-form ref="roleCreationForm" :rules="rules" :model="role" label-width="80px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="role.code" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="role.name" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="role.category" placeholder="请选择分类">
          <el-option v-for="category in categories" :key="category.key" :label="category.value" :value="category.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="role.type" placeholder="请选择类型">
          <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属企业" prop="companyId">
        <el-select v-model="role.companyId" :placeholder="'请选择企业'">
          <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <router-link :to="'/role/list'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidCode } from '@/utils/validate'
import { loadRoleCategories, loadRoleTypes } from '@/api/dict'
import { createRole } from '@/api/role'
import { getAvailableCompanyInfos } from '@/api/companyInfo'

export default {
  name: 'RoleCreation',
  data() {
    var validateCode = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidCode(value)) {
          callback(new Error('编码以字母开头,长度在4-30之间,只能包含字符,数字和下划线'))
        }
      }
      callback()
    }

    return {
      categories: [],
      types: [],
      companyInfos: [],
      role: {
        code: null,
        name: null,
        category: null,
        type: null,
        companyId: null
      },
      rules: {
        code: [{
          required: true, message: '请输入编码', trigger: 'blur'
        }, {
          validator: validateCode, trigger: ['blur', 'change']
        }],
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }],
        category: [{
          required: true, message: '请选择分类', trigger: 'change'
        }],
        type: [{
          required: true, message: '请选择类型', trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getCategories()
    this.getTypes()
    this.getCompanyInfos()
  },
  methods: {
    getCategories() {
      loadRoleCategories().then(response => {
        this.categories = response.data.content
      })
    },
    getTypes() {
      loadRoleTypes().then(response => {
        this.types = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    onSubmit() {
      this.$refs.roleCreationForm.validate((valid) => {
        if (valid) {
          createRole(this.role).then(response => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.log(err.data.errorMsg)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
