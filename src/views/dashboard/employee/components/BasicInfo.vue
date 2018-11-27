<template>
  <div>
    <el-card v-show="switcher.basicInfoViewOn" class="box-card" style="height: 400px; margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showPasswordUpdateView()">修改密码</el-button>
        <el-button style="float: right; padding: 3px 10px" type="text" @click="showSelfAccountEditView()">完善信息</el-button>
      </div>
      <div class="text item">
        <el-form ref="selfAccountForm" label-position="left" label-width="150px" size="mini">
          <el-form-item label="用户名">
            <span>{{ profile.basicInfo.loginName }}</span>
          </el-form-item>
          <el-form-item label="邮件">
            <span>{{ profile.basicInfo.email }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ profile.basicInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{ profile.basicInfo.realName }}</span>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{ profile.basicInfo.gender | keyToValue(genders) }}</span>
          </el-form-item>
          <el-form-item label="头衔">
            <span>{{ profile.basicInfo.title }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card v-show="switcher.selfAccountEditViewOn" class="box-card-edit" style="height: 400px;margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>完善信息</span>
      </div>
      <div class="text item">
        <el-form ref="selfAccountEditForm" :model="selfAccount" :rules="selfAccountEditFormRules" label-position="left" label-width="150px" size="mini">
          <el-form-item label="用户名">
            <span>{{ profile.basicInfo.loginName }}</span>
          </el-form-item>
          <el-form-item label="邮件">
            <span>{{ profile.basicInfo.email }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ profile.basicInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="姓名" prop="realName" style="width: 300px">
            <el-input v-model="selfAccount.realName" :placeholder="'请输入姓名'" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="selfAccount.gender" :placeholder="$t('性别')" style="width: 140px">
              <el-option v-for="gender in genders" :key="gender.key" :label="gender.value" :value="gender.key"/>
            </el-select>
          </el-form-item>
          <el-form-item label="头衔" prop="title" style="width: 300px">
            <el-input v-model="selfAccount.title" :placeholder="'请输入头衔'" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit" @click="updateSelfInfo()">确认</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card v-show="switcher.passwordUpdateViewOn" class="box-card-edit" style="height: 300px;margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <div class="text item">
        <el-form ref="updatePwdForm" :model="updatePwdRequest" :rules="updatePwdFormRules" label-position="left" label-width="150px" size="mini">
          <el-form-item label="原密码" prop="originPwd" style="width: 300px">
            <el-input v-model="updatePwdRequest.originPwd" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd" style="width: 300px">
            <el-input v-model="updatePwdRequest.newPwd" type="password"/>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkNewPwd" style="width: 300px">
            <el-input v-model="updatePwdRequest.checkNewPwd" type="password"/>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" icon="el-icon-edit" @click="changePwd()">修改</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadGenders } from '@/api/dict'
import { updateSelfInfo, changePwd } from '@/api/employee'

export default {
  name: 'BasicInfo',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.updatePwdRequest.newPwd) {
        callback(new Error('密码两次输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      updatePwdFormRules: {
        originPwd: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        checkNewPwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      selfAccountEditFormRules: {

      },
      genders: [],
      switcher: {
        basicInfoViewOn: true,
        selfAccountEditViewOn: false,
        passwordUpdateViewOn: false
      },
      selfAccount: {
        loginName: null,
        email: null,
        mobile: null,
        realName: null,
        title: null,
        gender: null
      },
      updatePwdRequest: {
        originPwd: null,
        newPwd: null,
        checkNewPwd: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'profile'
    ])
  },
  created() {
    this.getGenders()
    this.selfAccount.realName = this.profile.basicInfo.realName
    this.selfAccount.title = this.profile.basicInfo.title
    this.selfAccount.gender = this.profile.basicInfo.gender
  },
  methods: {
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    showSelfAccountEditView() {
      this.switcher.basicInfoViewOn = false
      this.switcher.selfAccountEditViewOn = true
      this.switcher.passwordUpdateViewOn = false
    },
    showPasswordUpdateView() {
      this.switcher.basicInfoViewOn = false
      this.switcher.selfAccountEditViewOn = false
      this.switcher.passwordUpdateViewOn = true
    },
    back() {
      this.switcher.basicInfoViewOn = true
      this.switcher.selfAccountEditViewOn = false
      this.switcher.passwordUpdateViewOn = false
    },
    updateSelfInfo() {
      this.$refs.selfAccountEditForm.validate((valid) => {
        if (valid) {
          updateSelfInfo({
            realName: this.selfAccount.realName,
            title: this.selfAccount.title,
            gender: this.selfAccount.gender
          }).then(response => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.back()
          }).catch(error => {
            console.log(error.message)
          })
        }
      })
    },
    changePwd() {
      this.$refs.updatePwdForm.validate((valid) => {
        if (valid) {
          changePwd({
            originPwd: this.updatePwdRequest.originPwd,
            newPwd: this.updatePwdRequest.newPwd
          }).then(response => {
            this.$notify({
              title: '成功',
              message: '修改密码成功',
              type: 'success',
              duration: 2000
            })
            this.back()
          }).catch(error => {
            console.log(error.message)
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
.box-card-component {
  .box-card-header {
    position: relative;
    height: 320px;
  }
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table-column;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
