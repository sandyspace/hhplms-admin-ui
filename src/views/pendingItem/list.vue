<template>
  <div class="app-container">
    <div class="filter-container">
      <el-switch
        v-model="queryParams.activeFlag"
        active-color="#13ce66"
        inactive-color="#3399ff"
        active-text="未处理"
        inactive-text="已处理"
        active-value="Y"
        inactive-value="N"
      />
      <el-select v-model="queryParams.processId" :placeholder="'流程'" clearable style="width: 180px" @change="handleProcessIdChange" @clear="handleProcessIdClear">
        <el-option v-for="process in processes" :key="process.id" :label="process.name" :value="process.id"/>
      </el-select>
      <el-select v-model="queryParams.currentStepId" :placeholder="'当前事项'" clearable style="width: 130px">
        <el-option v-for="step in steps" :key="step.id" :label="step.name" :value="step.id"/>
      </el-select>
      <el-select v-model="queryParams.stepStatus" :placeholder="'事项状态'" clearable style="width: 130px">
        <el-option v-for="stepStatus in stepStatues" :key="stepStatus.key" :label="stepStatus.value" :value="stepStatus.key"/>
      </el-select>
      <el-date-picker
        v-model="queryParams.checkedTimeRange"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        start-placeholder="审核日期从"
        end-placeholder="审核日期到"
        value-format="timestamp"
      />
      <el-date-picker
        v-model="queryParams.initTimeRange"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        start-placeholder="流程启动日期从"
        end-placeholder="流程启动日期到"
        value-format="timestamp"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>
    <el-table
      v-loading="processExecutionListLoading"
      :data="processExecutions"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="pending-item-table-expand">
            <el-form-item label="审核人">
              <span>{{ props.row.checkedBy }}</span>
            </el-form-item>
            <el-form-item label="审核时间">
              <span>{{ props.row.checkedTime | parseTime }}</span>
            </el-form-item>
            <el-form-item label="事项状态">
              <span>{{ props.row.stepStatus | keyToValue(stepStatues) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="50" />
      <el-table-column label="流程状态">
        <template slot-scope="scope">
          <span>{{ scope.row.processStatus | keyToValue(processStatuses) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程" prop="process.name" />
      <el-table-column label="当前事项" prop="currentStep.name" />
      <el-table-column label="处理状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activeFlag | keyToValue(stepFlags) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="initBy" />
      <el-table-column label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.initTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.activeFlag === 'Y'" type="text" size="small" @click="prepareToCheck(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="totalCount>0" :current-page="queryParams.pageNo" :page-sizes="[10,20,30,50]" :page-size="queryParams.pageSize" :total="totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="stepCheckDialogVisible" :title="'审核 '+dialogTitle">
      <div class="dashboard-container">
        <component :is="checkingView" :login-name="initBy" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="doTerminate">拒 绝</el-button>
        <el-button size="mini" type="primary" @click="doCheck">通 过</el-button>
        <el-button size="mini" @click="stepCheckDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadProcessExecutions, checkProcessExecution, terminateProcessExecution } from '@/api/processExecution'
import { loadProcessStatuses, loadStepStatuses } from '@/api/dict'
import { loadAvailableProcesses } from '@/api/processInfo'
import { getStepsOfProcess } from '@/api/step'
import { getRouteFragment } from '@/api/route'
import CheckCompanyInfo from './checkingViews/CheckCompanyInfo'
import CheckJoiningAccount from './checkingViews/CheckJoiningAccount'

export default {
  name: 'PendingItemList',
  components: {
    CheckCompanyInfo,
    CheckJoiningAccount
  },
  data() {
    return {
      processes: [],
      steps: [],
      processStatuses: [],
      stepStatues: [],
      stepFlags: [{
        key: 'Y',
        value: '未处理'
      }, {
        key: 'N',
        value: '已处理'
      }],
      processExecutionListLoading: true,
      processExecutions: [],
      queryParams: {
        processId: null,
        processStatus: null,
        currentStepId: null,
        stepStatus: null,
        activeFlag: 'Y',
        checkedTimeRange: [],
        initTimeRange: [],
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      stepCheckDialogVisible: false,
      currentProcessExecutionId: null,
      initBy: null,
      checkingView: '',
      dialogTitle: ''
    }
  },
  created() {
    this.getProcessExecutions()
    this.getAvailableProcesses()
    this.getProcessStatuses()
    this.getStepStatuses()
  },
  methods: {
    getProcessExecutions() {
      this.processExecutionListLoading = true
      const queryParams = {
        processId: this.queryParams.processId,
        currentStepId: this.queryParams.currentStepId,
        stepStatus: this.queryParams.stepStatus,
        activeFlag: this.queryParams.activeFlag,
        pageNo: this.queryParams.pageNo,
        pageSize: this.queryParams.pageSize
      }
      if (this.queryParams.checkedTimeRange && this.queryParams.checkedTimeRange.length === 2) {
        queryParams.checkedTimeFrom = this.queryParams.checkedTimeRange[0]
        queryParams.checkedTimeTo = this.queryParams.checkedTimeRange[1]
      }
      if (this.queryParams.initTimeRange && this.queryParams.initTimeRange.length === 2) {
        queryParams.initTimeFrom = this.queryParams.initTimeRange[0]
        queryParams.initTimeTo = this.queryParams.initTimeRange[1]
      }
      loadProcessExecutions(queryParams).then(response => {
        this.processExecutions = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.processExecutionListLoading = false
      }).catch(error => {
        if (error.response.data.errorMsg) {
          console.log(error.response.data.errorMsg)
        }
        this.processExecutionListLoading = false
      })
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.getProcessExecutions()
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.getProcessExecutions()
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo
      this.getProcessExecutions()
    },
    getAvailableProcesses() {
      loadAvailableProcesses().then(response => {
        this.processes = response.data.content
      })
    },
    handleProcessIdChange(processId) {
      if (processId) {
        getStepsOfProcess(processId).then(response => {
          this.steps = response.data.content
        })
      }
    },
    handleProcessIdClear() {
      this.queryParams.currentStepId = null
      this.steps = []
    },
    getProcessStatuses() {
      loadProcessStatuses().then(response => {
        this.processStatuses = response.data.content
      })
    },
    getStepStatuses() {
      loadStepStatuses().then(response => {
        this.stepStatues = response.data.content
      })
    },
    prepareToCheck(processExecution) {
      this.currentProcessExecutionId = processExecution.id
      this.initBy = processExecution.initBy
      this.dialogTitle = processExecution.currentStep.name
      this.checkingView = ''
      getRouteFragment(processExecution.process.id, processExecution.currentStep.id).then(response => {
        this.checkingView = response.data.content.viewOnChecking
        this.stepCheckDialogVisible = true
      })
    },
    doTerminate() {
      terminateProcessExecution(this.currentProcessExecutionId).then(response => {
        this.$notify({
          title: '成功',
          message: '已拒绝',
          type: 'success',
          duration: 2000
        })
        this.getProcessExecutions()
        this.stepCheckDialogVisible = false
      }).catch(error => {
        console.log(error.message)
      })
    },
    doCheck() {
      checkProcessExecution(this.currentProcessExecutionId).then(response => {
        this.$notify({
          title: '成功',
          message: '审核完成',
          type: 'success',
          duration: 2000
        })
        this.getProcessExecutions()
        this.stepCheckDialogVisible = false
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>

<style scoped>
  .pending-item-table-expand {
    font-size: 0;
  }
  .pending-item-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .pending-item-table-expand .el-form-item {
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
