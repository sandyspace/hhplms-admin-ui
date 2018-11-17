<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="queryParams.createdTimeRange"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        start-placeholder="留言日期从"
        end-placeholder="留言日期到"
        value-format="timestamp"
      />
      <el-input :placeholder="$t('联系人')" v-model="queryParams.contact" clearable style="width: 120px;" />
      <el-input :placeholder="$t('联系电话')" v-model="queryParams.contactMobile" clearable style="width: 150px;" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table v-loading="feedbackListLoading" :data="feedbacks" element-loading-text="拼命加载中">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="feedback-table-expand">
            <el-form-item label="内容">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="标题" prop="name" />
      <el-table-column label="联系人" prop="contact" />
      <el-table-column label="联系电话" prop="contactMobile" />
      <el-table-column label="留言时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="removeFeedback(scope.row.id)">删除</el-button>
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
import { loadFeedbacks, deleteFeedback } from '@/api/feedback'

export default {
  name: 'FeedbackList',
  data() {
    return {
      feedbacks: [],
      feedbackListLoading: true,
      queryParams: {
        createdTimeRange: [],
        contact: null,
        contactMobile: null,
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  created() {
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
      this.feedbackListLoading = true
      const queryParams = {
        contact: this.queryParams.contact,
        contactMobile: this.queryParams.contactMobile,
        pageNo: this.queryParams.pageNo,
        pageSize: this.queryParams.pageSize
      }
      if (this.queryParams.createdTimeRange && this.queryParams.createdTimeRange.length === 2) {
        queryParams.createdTimeFrom = this.queryParams.checkedTimeRange[0]
        queryParams.createdTimeTo = this.queryParams.checkedTimeRange[1]
      }
      loadFeedbacks(queryParams).then(response => {
        this.feedbacks = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.feedbackListLoading = false
      })
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.fetchData()
    },
    removeFeedback(id) {
      this.$confirm('确认要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFeedback(id).then(response => {
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
  .feedback-table-expand {
    font-size: 0;
  }
  .feedback-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .feedback-table-expand .el-form-item {
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
