<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('用户名')" v-model="queryParams.loginName" clearable style="width: 100px;" />
      <el-input :placeholder="$t('手机号')" v-model="queryParams.mobile" clearable style="width: 150px;" />
      <el-input :placeholder="$t('真实姓名')" v-model="queryParams.realName" clearable style="width: 120px;" />
      <el-select v-model="queryParams.gender" :placeholder="$t('性别')" clearable style="width: 100px">
        <el-option v-for="gender in genders" :key="gender.key" :label="gender.value" :value="gender.key"/>
      </el-select>
      <el-select v-model="queryParams.status" :placeholder="$t('状态')" clearable style="width: 100px">
        <el-option v-for="status in statuses" :key="status.key" :label="status.value" :value="status.key"/>
      </el-select>
      <el-select v-if="ifEmployee()" v-model="queryParams.type" :placeholder="$t('用户类型')" clearable style="width: 120px">
        <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
      </el-select>
      <el-select v-if="ifEmployee()" v-model="queryParams.companyId" :placeholder="'所属企业'" clearable style="width: 150px">
        <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <router-link :to="'/account/create'">
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>

    <el-table v-loading="accountListLoading" :data="accounts" element-loading-text="拼命加载中">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="account-table-expand">
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.loginName }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ props.row.realName }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender | keyToValue(genders) }}</span>
            </el-form-item>
            <el-form-item label="邮件">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.tel }}</span>
            </el-form-item>
            <el-form-item label="昵称">
              <span>{{ props.row.nickName }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status | keyToValue(statuses) }}</span>
            </el-form-item>
            <el-form-item v-if="ifEmployee()" label="类型">
              <span>{{ props.row.type | keyToValue(types) }}</span>
            </el-form-item>
            <el-form-item v-if="ifEmployee()" label="所属企业">
              <span>{{ props.row.companyId | idToName(companyInfos) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" prop="id" />
      <el-table-column label="姓名" prop="realName" />
      <el-table-column label="手机号" prop="mobile" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <router-link :to="'/account/detail/'+scope.row.id">
            <el-button type="text" size="small">查看</el-button>
          </router-link>
          <router-link :to="'/account/edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="prepareToAddRolesToAccount(scope.row.id, scope.row.companyId)">分配角色</el-button>
          <el-button type="text" size="small" @click="resetPwd(scope.row.id)">重置密码</el-button>
          <el-dropdown @command="changeAccountStatus">
            <span class="el-dropdown-link">
              更新状态<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="status in statuses" :key="status.key" :disabled="status.key === scope.row.status" :command="scope.row.id + '@' + status.key"><span class="el-dropdown-menu-item">{{ status.value }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-if="ifEmployee()" @command="changeAccountType">
            <span class="el-dropdown-link">
              更新类型<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="type in types" :key="type.key" :disabled="type.key === scope.row.type" :command="scope.row.id + '@' + type.key"><span class="el-dropdown-menu-item">{{ type.value }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <el-dialog :visible.sync="roleAssignmentDialogVisible" title="分配角色">
      <el-checkbox-group v-if="availableRoles.length>0" v-model="roleIdsOfAccount">
        <el-checkbox-button v-for="availableRole in availableRoles" :key="availableRole.id" :label="availableRole.id">{{ availableRole.name }}</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="availableRoles.length>0" slot="footer" class="dialog-footer">
        <el-button @click="roleAssignmentDialogVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="addRolesToAccount()">{{ $t('table.confirm') }}</el-button>
      </div>
      <div v-else align="center" style="font-size: 16px">暂无角色分配</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadGenders, loadAccountTypes, loadAccountStatuses } from '@/api/dict'
import { loadAccounts, resetPwd, updateAccountStatus, updateAccountType, addRoleToAccount } from '@/api/account'
import { loadAvailableRolesOfCompany, getRolesOfAccount } from '@/api/role'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee } from '@/utils/user'

export default {
  name: 'AccountList',
  data() {
    return {
      accounts: [],
      totalCount: 0,
      accountListLoading: true,
      queryParams: {
        gender: null,
        status: null,
        type: null,
        loginName: null,
        mobile: null,
        realName: null,
        companyId: null,
        pageNo: 1,
        pageSize: 10
      },
      genders: [],
      statuses: [],
      types: [],
      companyInfos: [],
      roleAssignmentDialogVisible: false,
      currentAccountId: null,
      roleIdsOfAccount: [],
      availableRoles: []
    }
  },
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    this.getGenders()
    this.getStatus()
    if (this.ifEmployee()) {
      this.getTypes()
      this.getCompanyInfos()
    }
    this.fetchData()
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNo = val
      this.fetchData()
    },
    fetchData() {
      this.accountListLoading = true
      loadAccounts(this.queryParams).then(response => {
        this.accounts = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.accountListLoading = false
      })
    },
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatus() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes() {
      loadAccountTypes().then(response => {
        this.types = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.fetchData()
    },
    prepareToAddRolesToAccount(accountId, companyId) {
      this.availableRoles = []
      this.roleIdsOfAccount = []
      this.currentAccountId = accountId
      getRolesOfAccount(accountId).then(response => {
        const rolesOfAccount = response.data.content
        if (rolesOfAccount && rolesOfAccount.length !== 0) {
          rolesOfAccount.forEach(role => {
            this.roleIdsOfAccount.push(role.id)
          })
        }
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        loadAvailableRolesOfCompany(companyId || -99).then(response => {
          if (response.data.content) {
            this.availableRoles = response.data.content
          }
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
    addRolesToAccount() {
      addRoleToAccount(this.currentAccountId, this.roleIdsOfAccount).then(response => {
        this.$notify({
          title: '成功',
          message: '分配成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        if (err.data.errorMsg) {
          console.log(err.data.errorMsg)
        }
      })
      this.roleAssignmentDialogVisible = false
    },
    resetPwd: function(id) {
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
    changeAccountStatus(command) {
      const commandEntries = command.split('@')
      const accountId = parseInt(commandEntries[0])
      const accountStatus = commandEntries[1]
      updateAccountStatus(accountId, {
        status: accountStatus
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
    changeAccountType(command) {
      const commandEntries = command.split('@')
      const accountId = parseInt(commandEntries[0])
      const accountType = commandEntries[1]
      updateAccountType(accountId, {
        type: accountType
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '修改类型成功',
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
  .account-table-expand {
    font-size: 0;
  }
  .account-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .account-table-expand .el-form-item {
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
