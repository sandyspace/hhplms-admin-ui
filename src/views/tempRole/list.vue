<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'编码'" v-model="queryParams.code" clearable style="width: 100px;" class="filter-item" />
      <el-input :placeholder="'名称'" v-model="queryParams.name" clearable style="width: 150px;" class="filter-item" />
      <el-select v-model="queryParams.type" :placeholder="'类型'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <router-link :to="'/role/tempCreate'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="tempRoleListLoading"
      :data="tempRoles"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="role-table-expand">
            <el-form-item label="类型">
              <span>{{ props.row.type | keyToValue(types) }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status | keyToValue(statuses) }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.memo }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="编码" prop="code" />
      <el-table-column label="名称" prop="name" />
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <router-link :to="'/role/tempEdit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="prepareToAddPermissionsToTempRole(scope.row.id)">分配菜单</el-button>
          <el-button type="text" size="small" @click="prepareToAddApisToTempRole(scope.row.id)">分配接口</el-button>
          <el-button type="text" size="small" @click="deleteTempRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="totalCount>0" :current-page="queryParams.pageNo" :page-sizes="[10,20,30,50]" :page-size="queryParams.pageSize" :total="totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="permissionAssignmentDialogVisible" title="分配菜单">
      <el-tree
        v-if="permissions.length>0"
        ref="permissionsTree"
        :data="permissions"
        :default-checked-keys="permissionIdsOfTempRole"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all />
      <div v-if="permissions.length>0" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="permissionAssignmentDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddPermissionsToTempRole">确 定</el-button>
      </div>
      <div v-else align="center" style="font-size: 16px">暂无菜单分配</div>
    </el-dialog>
    <el-dialog :visible.sync="apiAssignmentDialogVisible" title="分配接口">
      <el-checkbox-group v-if="apis.length>0" v-model="apiIdsOfTempRole">
        <el-checkbox-button v-for="api in apis" :label="api.id" :key="api.id">{{ api.title }}</el-checkbox-button>
      </el-checkbox-group>
      <div v-if="apis.length>0" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="apiAssignmentDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddApisToTempRole">确 定</el-button>
      </div>
      <div v-else align="center" style="font-size: 16px">暂无接口分配</div>
    </el-dialog>
  </div>
</template>

<script>
import { loadTempRoles, addPermissionsToTempRole, removeTempRole } from '@/api/tempRole'
import { permissionsAvailableToAssignTempRole, apisAvailableToAssignTempRole, getPermissionsOfTempRole, getApiListOfTempRole } from '@/api/permission'
import { loadTempRoleTypes, loadTempRoleStatuses } from '@/api/dict'

export default {
  name: 'TempRoleList',
  data() {
    return {
      currentTempRoleId: null,
      permissionAssignmentDialogVisible: false,
      permissionIdsOfTempRole: [],
      permissions: [],
      defaultProps: {
        children: 'subPermissions',
        label: 'title'
      },
      apiAssignmentDialogVisible: false,
      apiIdsOfTempRole: [],
      apis: [],
      types: [],
      statuses: [],
      tempRoleListLoading: true,
      tempRoles: [],
      queryParams: {
        code: null,
        name: null,
        type: null,
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  created() {
    this.getTypes()
    this.getStatuses()
    this.getTempRoles()
  },
  methods: {
    getTypes() {
      loadTempRoleTypes().then(response => {
        this.types = response.data.content
      })
    },
    getStatuses() {
      loadTempRoleStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getTempRoles() {
      this.tempRoleListLoading = true
      loadTempRoles(this.queryParams).then(response => {
        this.tempRoles = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.tempRoleListLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.getTempRoles()
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo
      this.getTempRoles()
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.getTempRoles()
    },
    prepareToAddPermissionsToTempRole(tempRoleId) {
      const getPermissionIds = function(permissions) {
        let permissionIds = []
        if (permissions) {
          permissions.forEach(permission => {
            if (permission.subPermissions && permission.subPermissions.length !== 0) {
              const subPermissionIds = getPermissionIds(permission.subPermissions)
              permissionIds = permissionIds.concat(subPermissionIds)
            } else {
              permissionIds.push(permission.id)
            }
          })
        }
        return permissionIds
      }
      this.permissions = []
      this.permissionIdsOfTempRole = []
      this.currentTempRoleId = tempRoleId
      getPermissionsOfTempRole(tempRoleId).then(response => {
        const permissionsOfTempRole = response.data.content
        this.permissionIdsOfTempRole = getPermissionIds(permissionsOfTempRole)
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        permissionsAvailableToAssignTempRole().then(response => {
          if (response.data.content) {
            this.permissions = response.data.content
          }
        }).catch(error => {
          throw new Error(error)
        })
      }).then(() => {
        this.permissionAssignmentDialogVisible = true
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    doAddPermissionsToTempRole() {
      const halfCheckedPermissionIds = this.$refs.permissionsTree.getHalfCheckedKeys()
      const checkedPermissionIds = this.$refs.permissionsTree.getCheckedKeys()
      const permissionIds = halfCheckedPermissionIds.concat(checkedPermissionIds)
      addPermissionsToTempRole(this.currentTempRoleId, permissionIds).then(response => {
        this.$notify({
          title: '成功',
          message: '给模板角色分配菜单成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    prepareToAddApisToTempRole(tempRoleId) {
      this.apis = []
      this.apiIdsOfTempRole = []
      this.currentTempRoleId = tempRoleId
      getApiListOfTempRole(tempRoleId).then(response => {
        const apiListOfTempRole = response.data.content
        if (apiListOfTempRole) {
          apiListOfTempRole.forEach(api => {
            this.apiIdsOfTempRole.push(api.id)
          })
        }
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        apisAvailableToAssignTempRole().then(response => {
          if (response.data.content) {
            this.apis = response.data.content
          }
        }).catch(error => {
          throw new Error(error)
        })
      }).then(() => {
        this.apiAssignmentDialogVisible = true
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    doAddApisToTempRole() {
      addPermissionsToTempRole(this.currentTempRoleId, this.apiIdsOfTempRole).then(response => {
        this.$notify({
          title: '成功',
          message: '给模板角色分配接口成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    deleteTempRole(id) {
      this.$confirm('再次确认是否要删除此模板角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeTempRole(id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getTempRoles()
        }).catch(error => {
          console.log(error.message)
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
  .role-table-expand {
    font-size: 0;
  }
  .role-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .role-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
