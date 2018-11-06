import request from '@/utils/request'

export function loadAvailableRoles() {
  return request({
    url: '/rs/ana/roles/available',
    method: 'get'
  })
}

export function getRolesOfEmployee(employeeId) {
  return request({
    url: '/rs/ana/employees/' + employeeId + '/roles',
    method: 'get'
  })
}

export function loadRoles(queryParams) {
  return request({
    url: '/rs/ana/roles',
    method: 'get',
    params: queryParams
  })
}

export function createRole(role) {
  return request({
    url: '/rs/ana/roles',
    method: 'post',
    data: role
  })
}

export function updateRole(id, role) {
  return request({
    url: '/rs/ana/roles/' + id,
    method: 'put',
    data: role
  })
}

export function loadDetail(id) {
  return request({
    url: '/rs/ana/roles/' + id,
    method: 'get'
  })
}

export function addPermissionsToRole(roleId, permissionIds) {
  return request({
    url: '/rs/ana/roles/' + roleId + '/permissions',
    method: 'post',
    data: permissionIds
  })
}
