<template>
  <div class="app-container" >
    <el-form ref="accountEditForm" :rules="rules" :model="account" label-width="100px">
      <el-form-item :label="$t('用户名')" prop="loginName">
        <span>{{ account.loginName }}</span>
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
        <el-select v-model="account.gender" placeholder="请选择" style="width: 100px">
          <el-option v-for="item in genders" :key="item.key" :label="item.value" :value="item.key"/>
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
import { loadGenders } from '@/api/dict'
import { loadDetail, updateAccount } from '@/api/account'
import { isValidMobile } from '@/utils/validate'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee } from '@/utils/user'

export default {
  name: 'AccountEdit',
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
      account: {
        loginName: null,
        realName: null,
        nickName: null,
        email: null,
        mobile: null,
        gender: null,
        companyId: null
      },
      genders: [],
      statuses: [],
      companyInfos: [],
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
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    this.getGenders()
    if (this.ifEmployee()) {
      this.getCompanyInfos()
    }
    this.fetchData()
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    fetchData() {
      loadDetail(this.$route.params.id).then(response => {
        this.account = response.data.content
      })
    },
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    onSubmit() {
      this.$refs.accountEditForm.validate((valid) => {
        if (valid) {
          const account = {
            realName: this.account.realName,
            nickName: this.account.nickName,
            email: this.account.email,
            gender: this.account.gender,
            mobile: this.account.mobile,
            companyId: this.account.companyId
          }
          updateAccount(this.$route.params.id, account).then(response => {
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
