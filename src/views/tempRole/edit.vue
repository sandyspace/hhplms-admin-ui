<template>
  <div class="app-container">
    <el-form ref="tempRoleEditForm" :rules="rules" :model="tempRole" label-width="80px">
      <el-form-item label="编码" prop="code">
        <span>{{ tempRole.code }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="tempRole.name" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <span>{{ tempRole.type | keyToValue(types) }}</span>
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
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
        <router-link :to="'/role/tempList'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loadTempRoleTypes } from '@/api/dict'
import { updateTempRole, loadDetail } from '@/api/tempRole'

export default {
  name: 'TempRoleEdit',
  data() {
    return {
      types: [],
      tempRole: {
        code: null,
        name: null,
        type: null,
        memo: null
      },
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getTypes()
    this.getDetail()
  },
  methods: {
    getTypes() {
      loadTempRoleTypes().then(response => {
        this.types = response.data.content
      })
    },
    getDetail() {
      loadDetail(this.$route.params.id).then(response => {
        this.tempRole = response.data.content
      }).catch(error => {
        console.log(error.data.errorMsg)
      })
    },
    onSubmit() {
      this.$refs.tempRoleEditForm.validate((valid) => {
        if (valid) {
          updateTempRole(this.$route.params.id, {
            name: this.tempRole.name,
            memo: this.tempRole.memo
          }).then(response => {
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
