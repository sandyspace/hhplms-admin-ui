<template>
  <div class="app-container" >
    <el-form ref="dataForm" :rules="rules" :model="account" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
      <el-form-item :label="$t('用户名')" prop="loginName">
        <el-input v-model="account.loginName"/>
      </el-form-item>
      <el-form-item :label="$t('真实姓名')" prop="title">
        <el-input v-model="account.realName"/>
      </el-form-item>

      <el-form-item :label="$t('昵称')" prop="title">
        <el-input v-model="account.nickName"/>
      </el-form-item>

      <el-form-item :label="$t('电子邮件')" prop="email">
        <el-input v-model="account.email"/>
      </el-form-item>

      <el-form-item :label="$t('手机号')" prop="mobile">
        <el-input v-model="account.mobile"/>
      </el-form-item>

      <el-form-item :label="$t('性别')" prop="gender">
        <el-select v-model="account.gender" placeholder="请选择">
          <el-option v-for="item in genders" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
        <router-link :to="'/account/list'">
          <el-button>{{ $t('table.cancel') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { loadGenders } from '@/api/dict'
import { detailSelect, updateAccount } from '@/api/account'

export default {
  name: 'AccountEdit',
  filters: {
    genderFormatter: function(value) {
      if (value === 'male') {
        return '男'
      } else if (value === 'female') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  data() {
    return {
      account: {
        loginName: '',
        nickName: '',
        email: '',
        mobile: '',
        gender: '',
        distributorId: 0
      },
      genders: [],
      statuses: [],
      rules: {
        loginName: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }],
        email: [{
          required: true, message: '请输入邮箱', trigger: 'blur'
        }, {
          type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
        }],
        mobile: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          min: 11, max: 11, message: '手机号必须是11位', trigger: ['blur', 'change']
        }],
        gender: [{
          required: true, message: '请选择性别', trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.fetchData()
    this.getGenders()
  },
  methods: {
    fetchData() {
      detailSelect(this.$route.params.id).then(response => {
        this.account = response.data.content
      })
    },
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    handleUpdate: function(id) {
      this.$router.push({ name: '用户修改', params: { id: id }})
    },
    updateData: function() {
      updateAccount(this.$route.params.id, this.account).then(response => {
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
  }
}

</script>
