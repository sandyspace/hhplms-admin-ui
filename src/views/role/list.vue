<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'编码'" v-model="queryParams.code" clearable style="width: 100px;" class="filter-item" />
      <el-input :placeholder="'名称'" v-model="queryParams.name" clearable style="width: 150px;" class="filter-item" />
      <el-select v-model="queryParams.category" :placeholder="'分类'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="category in categories" :key="category.key" :label="category.value" :value="category.key"/>
      </el-select>
      <el-select v-model="queryParams.type" :placeholder="'类型'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="type in types" :key="type.key" :label="type.value" :value="type.key"/>
      </el-select>
      <el-select v-if="ifEmployee()" v-model="queryParams.companyId" :placeholder="'所属企业'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="companyInfo in companyInfos" :key="companyInfo.id" :label="companyInfo.name" :value="companyInfo.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <router-link :to="'/role/create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="roleListLoading"
      :data="roles"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="role-table-expand">
            <el-form-item label="编码">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="分类">
              <span>{{ props.row.category | keyToValue(categories) }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ props.row.type | keyToValue(types) }}</span>
            </el-form-item>
            <el-form-item v-if="ifEmployee()" label="所属企业">
              <span>{{ props.row.companyId | idToName(companyInfos) }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.status | keyToValue(statuses) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="角色ID" prop="id" />
      <el-table-column label="编码" prop="code" />
      <el-table-column label="名称" prop="name" />
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <router-link v-if="couldOperateRole(scope.row.type)" :to="'/role/edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-button v-if="couldOperateRole(scope.row.type)" type="text" size="small" @click="prepareToAddPermissionsToRole(scope.row.id)">分配菜单</el-button>
          <el-button v-if="couldOperateRole(scope.row.type)" type="text" size="small" @click="prepareToAddApisToRole(scope.row.id)">分配接口</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="totalCount>0" :current-page="queryParams.pageNo" :page-sizes="[10,20,30,50]" :page-size="queryParams.pageSize" :total="totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :visible.sync="permissionAssignmentDialogVisible" title="分配菜单">
      <el-tree
        ref="permissionsTree"
        :data="permissions"
        :default-checked-keys="permissionIdsOfRole"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="permissionAssignmentDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddPermissionsToRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="apiAssignmentDialogVisible" title="分配接口">
      <el-checkbox-group v-model="apiIdsOfRole">
        <el-checkbox-button v-for="api in apis" :label="api.id" :key="api.id">{{ api.title }}</el-checkbox-button>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="apiAssignmentDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="doAddApisToRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadRoles, addPermissionsToRole } from '@/api/role'
import { permissionsAvailableToAssign, getPermissionsOfRole, apisAvailableToAssign, getApiListOfRole } from '@/api/permission'
import { loadRoleCategories, loadRoleTypes, loadRoleStatuses } from '@/api/dict'
import { getAvailableCompanyInfos } from '@/api/companyInfo'
import { isEmployee, canOperateRole } from '@/utils/user'

export default {
  name: 'EmployeeList',
  data() {
    return {
      currentRoleId: null,
      permissionAssignmentDialogVisible: false,
      permissionIdsOfRole: [],
      permissions: [],
      defaultProps: {
        children: 'subPermissions',
        label: 'title'
      },
      apiAssignmentDialogVisible: false,
      apiIdsOfRole: [],
      apis: [],
      categories: [],
      types: [],
      statuses: [],
      companyInfos: [],
      roleListLoading: true,
      roles: [],
      queryParams: {
        code: null,
        name: null,
        category: null,
        type: null,
        companyId: null,
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0
    }
  },
  computed: {
    ...mapGetters(['type'])
  },
  created() {
    this.getCategories()
    this.getTypes()
    this.getStatuses()
    if (this.ifEmployee()) {
      this.getCompanyInfos()
    }
    this.getRoles()
  },
  methods: {
    ifEmployee() {
      return isEmployee(this.type)
    },
    couldOperateRole(roleType) {
      return canOperateRole(this.type, roleType)
    },
    getCategories() {
      loadRoleCategories().then(response => {
        this.categories = response.data.content
      })
    },
    getTypes() {
      loadRoleTypes().then(response => {
        this.types = response.data.content
      })
    },
    getStatuses() {
      loadRoleStatuses().then(response => {
        this.statuses = response.data.content
      })
    },
    getCompanyInfos() {
      getAvailableCompanyInfos().then(response => {
        this.companyInfos = response.data.content
      })
    },
    getRoles() {
      this.roleListLoading = true
      loadRoles(this.queryParams).then(response => {
        this.roles = response.data.content.result
        this.totalCount = response.data.content.totalCount
        this.roleListLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.getRoles()
    },
    handleCurrentChange(pageNo) {
      this.queryParams.pageNo = pageNo
      this.getRoles()
    },
    handleFilter() {
      this.queryParams.pageNo = 1
      this.getRoles()
    },
    prepareToAddPermissionsToRole(roleId) {
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
      this.currentRoleId = roleId
      this.permissionIdsOfRole = []
      getPermissionsOfRole(roleId).then(response => {
        const permissionsOfRole = response.data.content
        this.permissionIdsOfRole = getPermissionIds(permissionsOfRole)
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        permissionsAvailableToAssign(roleId).then(response => {
          this.permissions = response.data.content
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
    doAddPermissionsToRole() {
      const halfCheckedPermissionIds = this.$refs.permissionsTree.getHalfCheckedKeys()
      const checkedPermissionIds = this.$refs.permissionsTree.getCheckedKeys()
      const permissionIds = halfCheckedPermissionIds.concat(checkedPermissionIds)
      addPermissionsToRole(this.currentRoleId, permissionIds).then(response => {
        this.$notify({
          title: '成功',
          message: '给角色分配菜单成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
      })
    },
    prepareToAddApisToRole(roleId) {
      this.currentRoleId = roleId
      this.apiIdsOfRole = []
      getApiListOfRole(roleId).then(response => {
        const apiListOfRole = response.data.content
        if (apiListOfRole) {
          apiListOfRole.forEach(api => {
            this.apiIdsOfRole.push(api.id)
          })
        }
      }).catch(error => {
        throw new Error(error)
      }).then(() => {
        apisAvailableToAssign(roleId).then(response => {
          this.apis = response.data.content
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
    doAddApisToRole() {
      addPermissionsToRole(this.currentRoleId, this.apiIdsOfRole).then(response => {
        this.$notify({
          title: '成功',
          message: '给角色分配接口成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        if (error.data.errorMsg) {
          console.log(error.data.errorMsg)
        }
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
