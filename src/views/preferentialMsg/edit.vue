<template>
  <div class="app-container" >
    <el-form ref="preferentialMsgEditForm" :rules="rules" :model="preferentialMsg" label-position="left" label-width="100px" style="margin-left:50px;">
      <el-form-item :label="$t('标题')" prop="title" style="width: 300px;">
        <el-input v-model="preferentialMsg.title"/>
      </el-form-item>
      <el-form-item :label="$t('内容')" prop="content" style="width: 600px;">
        <el-input v-model="preferentialMsg.content" :rows="10" maxlength="300" placeholder="请输入内容" type="textarea"/>
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
          :on-preview="handlePreview"
          :file-list="fileList"
          class="avatar-uploader"
          accept="image/*"
          action="">
          <img v-if="preferentialMsg.imgUrl" :src="uploadedImgBasePath + preferentialMsg.imgUrl" class="avatar">
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
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { loadDetail, updatePreferentialMsg } from '@/api/preferentialMsg'
import { uploadImg } from '@/api/image'

export default {
  name: 'PreferentialMsgEdit',
  data() {
    return {
      fileList: [],
      companyInfos: [],
      preferentialMsg: {
        title: null,
        content: null,
        companyId: null,
        imgUrl: ''
      },
      rules: {
        title: [{
          required: true, message: '请输入标题', trigger: 'blur'
        }],
        content: [{
          required: true, message: '请输入类容', trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['type', 'uploadedImgBasePath'])
  },
  created() {
    if (this.ifEmployee()) {
      this.getCompanyInfos()
    }
    this.fetchData()
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    fetchData() {
      loadDetail(this.$route.params.id).then(response => {
        this.preferentialMsg = response.data.content
      })
    },
    onSubmit() {
      this.$refs.preferentialMsgEditForm.validate((valid) => {
        if (valid) {
          const preferentialMsg = {
            title: this.preferentialMsg.title,
            content: this.preferentialMsg.content,
            companyId: this.preferentialMsg.companyId,
            imgUrl: this.preferentialMsg.imgUrl
          }
          updatePreferentialMsg(this.$route.params.id, preferentialMsg).then(response => {
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
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
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

<style>
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
