<template>
  <div class="app-container">
    <el-form ref="roleCreationForm" :rules="rules" :model="role" label-width="80px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="role.code" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="role.name" style="width: 150px;" />
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="分类" prop="category">
        <el-select v-model="role.category" placeholder="请选择分类" @change="handleCategoryChange()">
          <el-option v-for="category in categories" :key="category.key" :label="category.value" :value="category.key"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="类型" prop="type">
        <el-select v-model="role.type" placeholder="请选择类型">
          <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key" :disabled="roleTypeDisabled(role.category, type.key)" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="所属企业" prop="companyId">
        <el-select v-model="role.companyId" :placeholder="'请选择企业'" :disabled="companyIdDisabled(role.category)">
          <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input
          :rows="4"
          v-model="role.memo"
          type="textarea"
          style="width: 300px;"
        />
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
import { mapGetters } from 'vuex'
import { isValidCode } from '@/utils/validate'
import { loadRoleCategories, loadRoleTypes } from '@/api/dict'
import { createRole } from '@/api/role'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee } from '@/utils/user'

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
        companyId: null,
        memo: null
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
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    if (this.ifEmployee()) {
      this.getCategories()
      this.getTypes()
      this.getCompanyInfos()
    }
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    roleTypeDisabled(roleCategory, roleType) {
      if (roleCategory === 'employee') {
        if (roleType === 'pre-assigned') {
          return true
        }
      }
      return false
    },
    companyIdDisabled(roleCategory) {
      if (roleCategory === 'employee') {
        return true
      }
      return false
    },
    handleCategoryChange() {
      if (this.role.category === 'employee') {
        this.role.companyId = null
        if (this.role.type === 'pre-assigned') {
          this.role.type = ''
        }
      }
    },
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
