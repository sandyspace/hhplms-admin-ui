<template>
  <div class="app-container">
    <el-form ref="tempRoleCreationForm" :rules="rules" :model="tempRole" label-width="80px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="tempRole.code" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="tempRole.name" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="tempRole.type" placeholder="请选择类型">
          <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input
          :rows="4"
          v-model="tempRole.memo"
          type="textarea"
          style="width: 300px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <router-link :to="'/tempRole/list'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidCode } from '@/utils/validate'
import { loadTempRoleTypes } from '@/api/dict'
import { createTempRole } from '@/api/tempRole'

export default {
  name: 'TempRoleCreation',
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
      types: [],
      tempRole: {
        code: null,
        name: null,
        type: null,
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
        type: [{
          required: true, message: '请选择类型', trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getTypes()
  },
  methods: {
    getTypes() {
      loadTempRoleTypes().then(response => {
        this.types = response.data.content
      })
    },
    onSubmit() {
      this.$refs.tempRoleCreationForm.validate((valid) => {
        if (valid) {
          createTempRole(this.tempRole).then(response => {
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
