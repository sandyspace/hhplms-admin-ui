<template>
  <div class="app-container">
    <el-form ref="roleEditForm" :rules="rules" :model="role" label-width="80px">
      <el-form-item label="编码" prop="code">
        <span>{{ role.code }}</span>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="role.name" style="width: 150px;" />
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="分类" prop="category">
        <span>{{ role.category| keyToValue(categories) }}</span>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="类型" prop="type">
        <span>{{ role.type | keyToValue(types) }}</span>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" label="所属企业" prop="companyId">
        <span>{{ role.companyId | idToName(companyInfos) }}</span>
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
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
        <router-link :to="'/role/list'">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadRoleCategories, loadRoleTypes } from '@/api/dict'
import { updateRole, loadDetail } from '@/api/role'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee } from '@/utils/user'

export default {
  name: 'RoleEdit',
  data() {
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
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
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
    this.getDetail()
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
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
    getDetail() {
      loadDetail(this.$route.params.id).then(response => {
        this.role = response.data.content
      }).catch(error => {
        console.log(error.data.errorMsg)
      })
    },
    onSubmit() {
      this.$refs.roleEditForm.validate((valid) => {
        if (valid) {
          updateRole(this.$route.params.id, {
            name: this.role.name,
            memo: this.role.memo
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
