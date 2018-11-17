<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'姓名'" v-model="queryParams.realName" clearable style="width: 100px;" class="filter-item" />
      <el-input :placeholder="'手机'" v-model="queryParams.mobile" clearable style="width: 150px;" class="filter-item" />
      <el-select v-model="queryParams.gender" :placeholder="'性别'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="gender in genders" :key="gender.key" :label="gender.value" :value="gender.key"/>
      </el-select>
      <el-select v-model="queryParams.status" :placeholder="'状态'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <router-link :to="'/employee/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="employeeListLoading"
      :data="employees"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="employee-table-expand">
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.loginName }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ props.row.realName }}</span>
            </el-form-item>
            <el-form-item label="邮件">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.tel }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender }}</span>
            </el-form-item>
            <el-form-item label="身份证">
              <span>{{ props.row.idCard }}</span>
            </el-form-item>
            <el-form-item label="头衔">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="雇员ID" prop="id" />
      <el-table-column label="姓名" prop="realName" />
      <el-table-column label="手机号" prop="mobile" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <router-link :to="'/employee/detail/'+scope.row.id">
            <el-button type="text" size="small">查看</el-button>
          </router-link>
          <router-link :to="'/employee/edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="prepareToAddRolesToEmployee(scope.row.id)">分配角色</el-button>
          <el-button type="text" size="small" @click="resetPwd(scope.row.id)">重置密码</el-button>
          <el-dropdown @command="changeEmployeeStatus">
            <span class="el-dropdown-link">
              更新状态<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="status in statuses" :key="status.key" :disabled="status.key === scope.row.status" :command="scope.row.id + '@' + status.key"><span class="el-dropdown-menu-item">{{ status.value }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="totalCount>0" :current-page="queryParams.pageNo" :page-sizes="[10,20,30,50]" :page-size="queryParams.pageSize" :total="totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="roleAssignmentDialogVisible" title="分配角色">
      <el-checkbox-group v-model="roleIdsOfEmployee">
        <el-checkbox-button v-for="role in availableRoles" :label="role.id" :key="role.id">{{ role.name }}</el-checkbox-button>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleAssignmentDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddRolesToEmployee">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadEmployees, addRolesToEmployee, updateStatus, resetPwd } from '@/api/employee'
import { loadAvailableRoles, getRolesOfEmployee } from '@/api/role'
import { loadGenders, loadEmployeeStatuses } from '@/api/dict'

export default {
  name: 'EmployeeList',
  data() {
    return {
      roleAssignmentDialogVisible: false,
      currentEmployeeId: null,
      availableRoles: [],
      roleIdsOfEmployee: [],
      genders: [],
      statuses: [],
      employees: [],
      employeeListLoading: true,
      queryParams: {
        realName: null,
        mobile: null,
        gender: null,
        status: null,
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  created() {
    this.getGenders()
    this.getStatuses()
    this.getEmployees()
  },
  methods: {
    getEmployees() {
      this.employeeListLoading = true
      loadEmployees(this.queryParams).then(response => {
        this.employees = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.employeeListLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.getEmployees()
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo
      this.getEmployees()
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.getEmployees()
    },
    getGenders() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatuses() {
      loadEmployeeStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    changeEmployeeStatus(command) {
      const commandEntries = command.split('@')
      const employeeId = parseInt(commandEntries[0])
      const employeeStatus = commandEntries[1]
      updateStatus(employeeId, {
        status: employeeStatus
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
        this.getEmployees()
      })
    },
    resetPwd(id) {
      this.$confirm('确认要重置密码吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd(id).then(response => {
          this.$notify({
            title: '成功',
            message: '重置密码成功',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          if (error.data.errorMsg) {
            console.log(error.data.errorMsg)
          }
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消重置密码',
          type: 'warning',
          duration: 2000
        })
      })
    },
    prepareToAddRolesToEmployee(employeeId) {
      this.currentEmployeeId = employeeId
      this.roleIdsOfEmployee = []
      getRolesOfEmployee(employeeId).then(response => {
        const rolesOfEmployee = response.data.content
        rolesOfEmployee.forEach(role => {
          this.roleIdsOfEmployee.push(role.id)
        })
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        loadAvailableRoles().then(response => {
          this.availableRoles = response.data.content
        }).catch(error => {
          throw new Error(error)
        })
      }).then(() => {
        this.roleAssignmentDialogVisible = true
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    doAddRolesToEmployee() {
      addRolesToEmployee(this.currentEmployeeId, this.roleIdsOfEmployee).then(response => {
        this.$notify({
          title: '成功',
          message: '角色分配成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
      this.roleAssignmentDialogVisible = false
    }
  }
}
</script>

<style scoped>
  .employee-table-expand {
    font-size: 0;
  }
  .employee-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .employee-table-expand .el-form-item {
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
