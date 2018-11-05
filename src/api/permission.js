import request from '@/utils/request'

export function getPermissions() {
  return request({
    url: '/rs/ana/permissions',
    method: 'get'
  })
}

export function getApiList() {
  return request({
    url: '/rs/ana/apis',
    method: 'get'
  })
}

export function getPermissionsOfRole(roleId) {
  return request({
    url: '/rs/ana/roles/' + roleId + '/permissions',
    method: 'get'
  })
}

export function getApiListOfRole(roleId) {
  return request({
    url: '/rs/ana/roles/' + roleId + '/apis',
    method: 'get'
  })
}
