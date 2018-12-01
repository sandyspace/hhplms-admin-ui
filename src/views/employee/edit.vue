<template>
  <div class="app-container">
    <el-form ref="employEditForm" :rules="rules" :model="employee" label-width="80px">
      <el-form-item label="用户名" prop="loginName">
        <span>{{ employee.loginName }}</span>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
        <router-link :to="'/employee/list'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidMobile } from '@/utils/validate'
import { loadDetail, updateEmployee } from '@/api/employee'
import { loadGenders } from '@/api/dict'

export default {
  name: 'EmployeeEdit',
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value)) {
          callback(new Error('请输入有效的手机号'))
        }
      }
      callback()
    }

    return {
      genders: [],
      employee: {
        loginName: null,
        realName: null,
        email: null,
        mobile: null,
        tel: null,
        gender: null,
        idCard: null,
        title: null
      },
      rules: {
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
        }]
      }
    }
  },
  created() {
    this.getGenders()
    this.getDetail()
  },
  methods: {
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getDetail() {
      loadDetail(this.$route.params.id).then(response => {
        this.employee = response.data.content
      }).catch(error => {
        console.log(error.message)
      })
    },
    onSubmit() {
      this.$refs.employEditForm.validate((valid) => {
        if (valid) {
          updateEmployee(this.$route.params.id, {
            realName: this.employee.realName,
            email: this.employee.email,
            mobile: this.employee.mobile,
            tel: this.employee.tel,
            gender: this.employee.gender,
            idCard: this.employee.idCard,
            title: this.employee.title
          }).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.log(err.message)
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
