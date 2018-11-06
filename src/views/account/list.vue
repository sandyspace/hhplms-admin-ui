<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('用户名')" v-model="listQuery.loginName" clearable style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('手机号')" v-model="listQuery.mobile" clearable style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('真实姓名')" v-model="listQuery.realName" clearable style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.gender" :placeholder="$t('性别')" clearable style="width: 140px">
        <el-option v-for="item in genders" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>

      <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable style="width: 140px">
        <el-option v-for="item in statuses" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>

      <el-select v-model="listQuery.type" :placeholder="$t('用户类型')" clearable style="width: 140px">
        <el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <router-link :to="'/account/create'">
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中">
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
            <el-form-item label="邮件">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.tel }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.gender | genderFormatter(genders) }}</span>
            </el-form-item>
            <el-form-item label="昵称">
              <span>{{ props.row.nickName }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status |statusFormatter(statuses) }}</span>
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
          <el-button type="text" size="small" @click="prepareToAddRolesToAccount(scope.row.id)">分配角色</el-button>
          <el-button type="text" size="small" @click="resetPwd(scope.row.id)">重置密码</el-button>
          <el-dropdown @command="changeAccountStatus">
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
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="分配角色">
      <el-checkbox-group v-model="checkedList">
        <el-checkbox-button v-for="api in roles" :key="api.id" :label="api.id">{{ api.name }}</el-checkbox-button>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="addRoleToAccount()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { loadGenders, loadAccountTypes, loadAccountStatuses } from '@/api/dict'
import { accountList, detailSelect, resetPwd, updateAccountStatus, addRoleToAccount } from '@/api/account'
import { loadAvailableRoles } from '@/api/role'

export default {
  name: 'AccountList',
  filters: {
    genderFormatter: function(value, genders) {
      for (const i in genders) {
        if (genders[i].key === value) {
          return genders[i].value
        }
      }
    },
    statusFormatter: function(value, statuses) {
      for (const i in statuses) {
        if (statuses[i].key === value) {
          return statuses[i].value
        }
      }
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        gender: null,
        status: null,
        type: null,
        loginName: null,
        mobile: null,
        realName: null,
        niceName: null
      },
      genders: [],
      statuses: [],
      types: [],
      roles: [],
      dialogFormVisible: false,
      accountId: '',
      checkedList: []
    }
  },
  created() {
    this.getGenders()
    this.getStatus()
    this.getTypes()
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      accountList(this.listQuery).then(response => {
        this.list = response.data.content.result
        this.total = response.data.content.totalCount
        this.listLoading = false
      })
    },
    getGenders: function() {
      loadGenders().then(response => {
        this.genders = response.data.content
      })
    },
    getStatus: function() {
      loadAccountStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTypes: function() {
      loadAccountTypes().then(response => {
        this.types = response.data.content
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.fetchData()
    },
    handleUpdate: function(id) {
      this.$router.push({ name: 'accountEdit', params: { id: id }})
    },
    show: function(account) {
      this.$router.push({ name: 'accountDetail', params: { id: account.id, account: account }})
    },
    prepareToAddRolesToAccount: function(id) {
      this.dialogFormVisible = true
      this.accountId = id
      this.checkedList = []
      loadAvailableRoles().then(response => {
        this.roles = response.data.content
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        detailSelect(id).then(responses => {
          responses.data.content.grantedRoles.forEach(permission => {
            this.checkedList.push(permission.id)
          })
        })
      }).catch(error => {
        throw new Error(error)
      })
    },
    addRoleToAccount: function() {
      addRoleToAccount(this.accountId, this.checkedList).then(response => {
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
      this.dialogFormVisible = false
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
