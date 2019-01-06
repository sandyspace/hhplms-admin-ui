import request from '@/utils/request'

export function loadTempRoles(queryParams) {
  return request({
    url: '/ana/tempRoles',
    method: 'get',
    params: queryParams
  })
}

export function createTempRole(tempRole) {
  return request({
    url: '/ana/tempRoles',
    method: 'post',
    data: tempRole
  })
}

export function updateTempRole(id, tempRole) {
  return request({
    url: '/ana/tempRoles/' + id,
    method: 'put',
    data: tempRole
  })
}

export function removeTempRole(id) {
  return request({
    url: '/ana/tempRoles/' + id,
    method: 'delete'
  })
}

export function loadDetail(id) {
  return request({
    url: '/ana/tempRoles/' + id,
    method: 'get'
  })
}

export function addPermissionsToTempRole(tempRoleId, permissionIds) {
  return request({
    url: '/ana/tempRoles/' + tempRoleId + '/permissions',
    method: 'post',
    data: permissionIds
  })
}
