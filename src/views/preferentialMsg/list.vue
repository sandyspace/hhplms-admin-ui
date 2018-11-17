<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('标题')" v-model="queryParams.title" clearable style="width: 200px;" />
      <el-select v-model="queryParams.status" clearable placeholder="请选择" style="width: 120px;">
        <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
      </el-select>
      <el-select v-model="queryParams.companyId" :placeholder="'所属企业'" clearable style="width: 150px">
        <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <router-link :to="'/notification/create'">
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>

    <el-table v-loading="preferentialMsgListLoading" :data="preferentialMsgs" element-loading-text="拼命加载中">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="preferential-msg-table-expand">
            <el-form-item label="内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | keyToValue(statuses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属企业">
        <template slot-scope="scope">
          <span>{{ scope.row.companyId | idToName(companyInfos) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-dropdown @command="changePreferentialMsgStatus">
            <span class="el-dropdown-link">
              更新状态<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="status in statuses" :key="status.key" :disabled="status.key === scope.row.status" :command="scope.row.id + '@' + status.key"><span class="el-dropdown-menu-item">{{ status.value }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <router-link :to="'/preferentialMsg/edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="removePreferentialMsg(scope.row.id)" >删除</el-button>
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
import { loadPreferentialMsgs, deletePreferentialMsg, updatePreferentialMsgStatus } from '@/api/preferentialMsg'
import { loadPreferentialMsgStatuses } from '@/api/dict'
import { getAvailableCompanyInfos } from '@/api/companyInfo'

export default {
  name: 'PreferentialMsgList',
  data() {
    return {
      statuses: [],
      companyInfos: [],
      preferentialMsgs: [],
      preferentialMsgListLoading: true,
      queryParams: {
        title: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  created() {
    this.fetchData()
    this.getStatuses()
    this.getCompanyInfos()
  },
  methods: {
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
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.fetchData()
    },
    fetchData() {
      this.preferentialMsgListLoading = true
      loadPreferentialMsgs(this.queryParams).then(response => {
        this.preferentialMsgs = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.preferentialMsgListLoading = false
      })
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.fetchData()
    },
    removePreferentialMsg(id) {
      this.$confirm('确认要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePreferentialMsg(id).then(response => {
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
    },
    changePreferentialMsgStatus(command) {
      const commandEntries = command.split('@')
      const preferentialMsgId = parseInt(commandEntries[0])
      const preferentialMsgStatus = commandEntries[1]
      updatePreferentialMsgStatus(preferentialMsgId, {
        status: preferentialMsgStatus
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>

<style scoped>
  .preferential-msg-table-expand {
    font-size: 0;
  }
  .preferential-msg-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .preferential-msg-table-expand .el-form-item {
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
