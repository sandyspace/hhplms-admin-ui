<template>
  <div class="app-container">
    <el-form ref="accountCreationForm" :rules="rules" :model="account" label-width="100px">
      <el-form-item :label="$t('用户名')" prop="loginName">
        <el-input v-model="account.loginName" style="width: 200px;" />
      </el-form-item>
      <el-form-item :label="$t('真实姓名')" prop="realName">
        <el-input v-model="account.realName" style="width: 200px;"/>
      </el-form-item>

      <el-form-item :label="$t('昵称')" prop="nickName">
        <el-input v-model="account.nickName" style="width: 200px;"/>
      </el-form-item>

      <el-form-item :label="$t('电子邮件')" prop="email">
        <el-input v-model="account.email" style="width: 200px;"/>
      </el-form-item>

      <el-form-item :label="$t('手机号')" prop="mobile">
        <el-input v-model="account.mobile" style="width: 200px;"/>
      </el-form-item>

      <el-form-item :label="$t('性别')" prop="gender">
        <el-select v-model="account.gender" placeholder="请选择">
          <el-option v-for="item in genders" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('状态')" prop="status">
        <el-select v-model="account.status" placeholder="请选择">
          <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" :label="$t('用户类型')" prop="type">
        <el-select v-model="account.type" placeholder="请选择">
          <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" :label="$t('所属企业')" prop="companyId">
        <el-select v-model="account.companyId" :placeholder="'选择企业'" clearable style="width: 150px">
          <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{ $t('table.confirm') }}</el-button>
        <router-link :to="'/account/list'">
          <el-button>{{ $t('table.cancel') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadGenders, loadAccountTypes, loadAccountStatuses } from '@/api/dict'
import { createAccount } from '@/api/account'
import { isValidMobile, isValidLoginName } from '@/utils/validate'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee } from '@/utils/user'

export default {
  name: 'AccountCreate',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value)) {
          callback(new Error('请输入有效的手机号'))
        }
      }
      callback()
    }
    const validateLoginName = (rule, value, callback) => {
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
      account: {
        loginName: null,
        realName: null,
        nickName: null,
        email: null,
        mobile: null,
        gender: null,
        status: null,
        type: null,
        companyId: null
      },
      genders: [],
      statuses: [],
      types: [],
      companyInfos: [],
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
        type: [{
          required: true, message: '请选择用户类型', trigger: 'change'
        }],
        status: [{
          required: true, message: '请选择状态', trigger: 'change'
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    this.getGenders()
    this.getStatus()
    if (this.ifEmployee()) {
      this.getTypes()
      this.getCompanyInfos()
    }
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatus() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes() {
      loadAccountTypes().then(response => {
        this.types = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    onSubmit() {
      this.$refs.accountCreationForm.validate((valid) => {
        if (valid) {
          createAccount(this.account).then(response => {
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
