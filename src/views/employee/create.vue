<template>
  <div class="app-container">
    <el-form ref="employCreationForm" :rules="rules" :model="employee" label-width="80px">
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="employee.loginName" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="employee.realName" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="邮件" prop="email">
        <el-input v-model="employee.email" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="employee.mobile" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="employee.tel" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="employee.gender" placeholder="请选择性别">
          <el-option v-for="gender in genders" :key="gender.key" :label="gender.value" :value="gender.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="employee.idCard" style="width: 200px;" />
      </el-form-item>
      <el-form-item label="头衔">
        <el-input v-model="employee.title" style="width: 100px;" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="employee.status" placeholder="请选择状态">
          <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <router-link :to="'/employee/list'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidMobile, isValidLoginName } from '@/utils/validate'
import { createEmployee } from '@/api/employee'
import { loadGenders, loadEmployeeStatuses } from '@/api/dict'

export default {
  name: 'EmployeeCreate',
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value)) {
          callback(new Error('请输入有效的手机号'))
        }
      }
      callback()
    }
    var validateLoginName = (rule, value, callback) => {
      if (value !== '') {
        if (value !== '') {
          if (!isValidLoginName(value)) {
            callback(new Error('用户名以字母开头,长度在4-30之间,只能包含字符,数字和下划线'))
          }
        }
      }
      callback()
    }

    return {
      statuses: [],
      genders: [],
      employee: {
        loginName: null,
        realName: null,
        email: null,
        mobile: null,
        tel: null,
        gender: null,
        idCard: null,
        title: null,
        status: null
      },
      rules: {
        loginName: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }, {
          validator: validateLoginName, trigger: ['blur', 'change']
        }],
        email: [{
          required: true, message: '请输入邮箱', trigger: 'blur'
        }, {
          type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
        }],
        mobile: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          validator: validateMobile, trigger: ['blur', 'change']
        }],
        gender: [{
          required: true, message: '请选择性别', trigger: 'change'
        }],
        status: [{
          required: true, message: '请选择状态', trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getGenders()
    this.getStatuses()
  },
  methods: {
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatuses() {
      loadEmployeeStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    onSubmit() {
      this.$refs.employCreationForm.validate((valid) => {
        if (valid) {
          createEmployee(this.employee).then(response => {
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
