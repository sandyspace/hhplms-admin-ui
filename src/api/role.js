import request from '@/utils/request'

export function loadAvailableRoles() {
  return request({
    url: '/ana/roles/available',
    method: 'get'
  })
}

export function loadAvailableRolesOfCompany(companyId) {
  return request({
    url: '/ana/companyInfos/' + companyId + '/available',
    method: 'get'
  })
}

export function getRolesOfAccount(accountId) {
  return request({
    url: '/ana/accounts/' + accountId + '/roles',
    method: 'get'
  })
}

export function getRolesOfEmployee(employeeId) {
  return request({
    url: '/ana/employees/' + employeeId + '/roles',
    method: 'get'
  })
}

export function loadRoles(queryParams) {
  return request({
    url: '/ana/roles',
    method: 'get',
    params: queryParams
  })
}

export function createRole(role) {
  return request({
    url: '/ana/roles',
    method: 'post',
    data: role
  })
}

export function updateRole(id, role) {
  return request({
    url: '/ana/roles/' + id,
    method: 'put',
    data: role
  })
}

export function removeRole(id) {
  return request({
    url: '/ana/roles/' + id,
    method: 'delete'
  })
}

export function loadDetail(id) {
  return request({
    url: '/ana/roles/' + id,
    method: 'get'
  })
}

export function addPermissionsToRole(roleId, permissionIds) {
  return request({
    url: '/ana/roles/' + roleId + '/permissions',
    method: 'post',
    data: permissionIds
  })
}
