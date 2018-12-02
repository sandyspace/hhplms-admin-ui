<template>
  <div>
    <el-card v-show="switcher.selfCompanyInfoViewOn" class="box-card" style="height: 400px">
      <div slot="header" class="clearfix">
        <span>企业信息</span>
        <el-button v-if="ifUpdateBtnShow()" style="float: right; padding: 3px 0" type="text" @click="showSelfCompanyInfoEditView()">更新</el-button>
      </div>
      <el-form v-if="companyInfoShow" ref="companyInfoForm" :model="companyInfo" label-position="left" label-width="150px" size="mini">
        <el-form-item label="企业名称">
          <span>{{ companyInfo.name }}</span>
        </el-form-item>
        <el-form-item label="企业类型">
          <span>{{ companyInfo.type | keyToValue(types) }}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{ companyInfo.address }}</span>
        </el-form-item>
        <el-form-item label="联系人">
          <span>{{ companyInfo.contactName }}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span>{{ companyInfo.contactPhone }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag>{{ companyInfo.status | keyToValue(statuses) }}</el-tag>
        </el-form-item>
      </el-form>
      <div v-else-if="!companyInfoShow" align="center" style="font-size: 16px">你还未上传企业信息或加入企业</div>
    </el-card>
    <el-card v-show="switcher.selfCompanyInfoEditViewOn" class="box-card-edit" style="height: 400px;margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>更新企业信息</span>
      </div>
      <div class="text item">
        <el-form ref="selfCompanyInfoEditForm" :model="companyInfo" :rules="rules" label-position="left" label-width="150px" size="mini">
          <el-form-item :label="$t('企业名称')" prop="name">
            <el-input v-model="companyInfo.name" style="width: 200px;" />
          </el-form-item>
          <el-form-item :label="$t('企业类型')" prop="type">
            <el-select v-model="companyInfo.type" placeholder="请选择">
              <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('地址')" prop="address">
            <el-input v-model="companyInfo.address" style="width: 200px;"/>
          </el-form-item>
          <el-form-item :label="$t('联系人')" prop="contactName">
            <el-input v-model="companyInfo.contactName" style="width: 200px;"/>
          </el-form-item>
          <el-form-item :label="$t('联系电话')" prop="contactPhone">
            <el-input v-model="companyInfo.contactPhone" style="width: 200px;"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfoOfSelf, updateSelfCompanyInfo } from '@/api/companyInfo'
import { loadCompanyInfoTypes, loadCompanyInfoStatuses } from '@/api/dict'
import { isValidMobile, isValidPhone } from '@/utils/validate'

export default {
  name: 'CompanyInfo',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!isValidMobile(value) && !isValidPhone(value)) {
          callback(new Error('请输入有效的联系电话'))
        }
      }
      callback()
    }
    return {
      companyInfoShow: false,
      switcher: {
        selfCompanyInfoViewOn: true,
        selfCompanyInfoEditViewOn: false
      },
      companyInfo: {
        code: null,
        name: null,
        type: null,
        address: null,
        contactName: null,
        contactPhone: null,
        status: null,
        createdBy: ''
      },
      types: [],
      statuses: [],
      rules: {
        name: [{
          required: true, message: '请输入企业名称', trigger: 'blur'
        }],
        type: [{
          required: true, message: '请选择企业类型', trigger: 'change'
        }],
        address: [{
          required: true, message: '请输入地址', trigger: 'blur'
        }],
        contactName: [{
          required: true, message: '请输入联系人', trigger: 'blur'
        }],
        contactPhone: [{
          required: true, message: '请输入联系电话', trigger: 'blur'
        }, {
          validator: validatePhone, trigger: ['blur', 'change']
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['name', 'subType'])
  },
  created() {
    this.getTypes()
    this.getStatuses()
    this.getCompanyInfo()
  },
  methods: {
    getCompanyInfo() {
      getCompanyInfoOfSelf().then(response => {
        if (response.data.content) {
          this.companyInfo = response.data.content
          this.companyInfoShow = true
        }
      })
    },
    showSelfCompanyInfoEditView() {
      this.switcher.selfCompanyInfoViewOn = false
      this.switcher.selfCompanyInfoEditViewOn = true
    },
    back() {
      this.switcher.selfCompanyInfoViewOn = true
      this.switcher.selfCompanyInfoEditViewOn = false
    },
    ifUpdateBtnShow() {
      return this.name === this.companyInfo.createdBy && this.subType !== 'company'
    },
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    getStatuses() {
      loadCompanyInfoStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    updateData() {
      updateSelfCompanyInfo(this.companyInfo).then(response => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
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
