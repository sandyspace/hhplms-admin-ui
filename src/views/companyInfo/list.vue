<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('企业编码')" v-model="queryParams.code" clearable style="width: 150px;" />
      <el-select v-model="queryParams.type" :placeholder="$t('企业类型')" clearable style="width: 200px">
        <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
      </el-select>
      <el-input :placeholder="$t('联系人')" v-model="queryParams.contactName" clearable style="width: 120px;" />
      <el-input :placeholder="$t('联系电话')" v-model="queryParams.contactPhone" clearable style="width: 150px;" />
      <el-select v-model="queryParams.status" :placeholder="$t('状态')" clearable style="width: 120px">
        <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <router-link :to="'/companyInfo/create'">
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>

    <el-table v-loading="companyListLoading" :data="companyInfos" element-loading-text="拼命加载中">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="company-info-table-expand">
            <el-form-item label="企业类型">
              <span>{{ props.row.type | keyToValue(types) }}</span>
            </el-form-item>
            <el-form-item label="企业编码">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status | keyToValue(statuses) }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="企业名称" prop="name" />
      <el-table-column label="联系人" prop="contactName" />
      <el-table-column label="联系电话" prop="contactPhone" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/companyInfo/edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-dropdown @command="changeCompanyInfoStatus">
            <span class="el-dropdown-link">
              更新状态<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="status in statuses" :key="status.key" :disabled="status.key === scope.row.status" :command="scope.row.id + '@' + status.key"><span class="el-dropdown-menu-item">{{ status.value }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" size="small" @click="removeCompanyInfo(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-show="totalCount>0"
        :current-page="queryParams.pageNo"
        :page-sizes="[10,20,30,50]"
        :page-size="queryParams.pageSize"
        :total="totalCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { loadCompanyInfos, deleteCompanyInfo, updateCompanyInfoStatus } from '@/api/companyInfo'
import { loadCompanyInfoTypes, loadCompanyInfoStatuses } from '@/api/dict'

export default {
  name: 'CompanyInfoList',
  data() {
    return {
      types: [],
      statuses: [],
      companyInfos: [],
      companyListLoading: true,
      queryParams: {
        code: null,
        type: null,
        contactName: null,
        contactPhone: null,
        status: null,
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  created() {
    this.getStatuses()
    this.getTypes()
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.fetchData()
    },
    fetchData() {
      this.companyListLoading = true
      loadCompanyInfos(this.queryParams).then(response => {
        this.companyInfos = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.companyListLoading = false
      })
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.fetchData()
    },
    getStatuses() {
      loadCompanyInfoStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes() {
      loadCompanyInfoTypes().then(response => {
        this.types = response.data.content
      })
    },
    changeCompanyInfoStatus(command) {
      const commandEntries = command.split('@')
      const companyInfoId = parseInt(commandEntries[0])
      const companyInfoStatus = commandEntries[1]
      updateCompanyInfoStatus(companyInfoId, {
        status: companyInfoStatus
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    },
    removeCompanyInfo(id) {
      this.$confirm('确认要删除企业吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompanyInfo(id).then(response => {
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          if (err.data.errorMsg) {
            console.log(err.data.errorMsg)
          }
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消删除',
          type: 'warning',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
  .company-info-table-expand {
    font-size: 0;
  }
  .company-info-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .company-info-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
    font-weight: 500;
  }
  .el-dropdown-menu-item {
    font-size: 12px;
    font-weight: 500;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
