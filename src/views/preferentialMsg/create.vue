<template>
  <div class="app-container">
    <el-form ref="preferentialMsgCreationForm" :model="preferentialMsg" :rules="rules" label-width="100px">
      <el-form-item :label="$t('标题')" prop="title">
        <el-input v-model="preferentialMsg.title" style="width: 400px" />
      </el-form-item>
      <el-form-item :label="$t('内容')" prop="content" style="width: 600px">
        <el-input v-model="preferentialMsg.content" :rows="10" maxlength="300" placeholder="请输入内容" type="textarea"/>
      </el-form-item>
      <el-form-item :label="$t('状态')" prop="status">
        <el-select v-model="preferentialMsg.status" placeholder="请选择" style="width: 120px">
          <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ifEmployee()" :label="$t('所属企业')" prop="companyId">
        <el-select v-model="preferentialMsg.companyId" :placeholder="'选择企业'" clearable style="width: 150px">
          <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('图片')" prop="img" style="width: 500px">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :http-request="uploadImage"
          class="avatar-uploader"
          accept="image/*"
          action="">
          <img v-if="preferentialMsg.imgUrl" :src="'/static/img/' + preferentialMsg.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('table.confirm') }}</el-button>
        <router-link :to="'/preferentialMsg/list'">
          <el-button>{{ $t('table.cancel') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmployee } from '@/utils/user'
import { loadPreferentialMsgStatuses } from '@/api/dict'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { createdPreferentialMsg } from '@/api/preferentialMsg'
import { uploadImg } from '@/api/image'

export default {
  name: 'PreferentialMsgCreate',
  data() {
    return {
      statuses: [],
      companyInfos: [],
      preferentialMsg: {
        title: null,
        content: null,
        status: null,
        companyId: null,
        imgUrl: null
      },
      rules: {
        title: [{
          required: true, message: '请输入标题', trigger: 'blur'
        }],
        content: [{
          required: true, message: '请输入类容', trigger: 'blur'
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
    this.getStatuses()
    if (this.ifEmployee()) {
      this.getCompanyInfos()
    }
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    getStatuses() {
      loadPreferentialMsgStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    onSubmit() {
      this.$refs.preferentialMsgCreationForm.validate((valid) => {
        if (valid) {
          createdPreferentialMsg(this.preferentialMsg).then(response => {
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
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleAvatarSuccess(res, file) {
      console.log(URL.createObjectURL(file.raw))
    },
    uploadImage(e) {
      const formData = new FormData()
      formData.append('file', e.file)
      formData.append('subDir', 'preferentialMsg')
      uploadImg(formData).then(response => {
        this.preferentialMsg.imgUrl = response.data.content
      })
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
