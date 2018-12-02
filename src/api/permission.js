import request from '@/utils/request'

export function permissionsAvailableToAssign(refRoleId) {
  return request({
    url: '/ana/permissions',
    method: 'get',
    params: {
      refRoleId
    }
  })
}

export function apisAvailableToAssign(refRoleId) {
  return request({
    url: '/ana/apis',
    method: 'get',
    params: {
      refRoleId
    }
  })
}

export function getPermissionsOfRole(roleId) {
  return request({
    url: '/ana/roles/' + roleId + '/permissions',
    method: 'get'
  })
}

export function getApiListOfRole(roleId) {
  return request({
    url: '/ana/roles/' + roleId + '/apis',
    method: 'get'
  })
}
