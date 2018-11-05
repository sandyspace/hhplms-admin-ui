import request from '@/utils/request'

export function loadGenders() {
  return request({
    url: '/rs/sys/genders',
    method: 'get'
  })
}

export function loadAccountTypes() {
  return request({
    url: '/rs/sys/account/types',
    method: 'get'
  })
}

export function loadAccountStatuses() {
  return request({
    url: '/rs/sys/account/statuses',
    method: 'get'
  })
}

export function loadEmployeeStatuses() {
  return request({
    url: '/rs/sys/employee/statuses',
    method: 'get'
  })
}

export function loadPermissionTypes() {
  return request({
    url: '/rs/sys/permission/types',
    method: 'get'
  })
}

export function loadPermissionStatuses() {
  return request({
    url: '/rs/sys/permission/statuses',
    method: 'get'
  })
}

export function loadRoleCategories() {
  return request({
    url: '/rs/sys/role/categories',
    method: 'get'
  })
}

export function loadRoleTypes() {
  return request({
    url: '/rs/sys/role/types',
    method: 'get'
  })
}

export function loadRoleStatuses() {
  return request({
    url: '/rs/sys/role/statuses',
    method: 'get'
  })
}
