import request from '@/utils/request'

export function loadGenders() {
  return request({
    url: '/sys/genders',
    method: 'get'
  })
}

export function loadAccountTypes() {
  return request({
    url: '/sys/account/types',
    method: 'get'
  })
}

export function loadAccountStatuses() {
  return request({
    url: '/sys/account/statuses',
    method: 'get'
  })
}

export function loadEmployeeStatuses() {
  return request({
    url: '/sys/employee/statuses',
    method: 'get'
  })
}

export function loadPermissionTypes() {
  return request({
    url: '/sys/permission/types',
    method: 'get'
  })
}

export function loadPermissionStatuses() {
  return request({
    url: '/sys/permission/statuses',
    method: 'get'
  })
}

export function loadRoleCategories() {
  return request({
    url: '/sys/role/categories',
    method: 'get'
  })
}

export function loadRoleTypes() {
  return request({
    url: '/sys/role/types',
    method: 'get'
  })
}

export function loadRoleStatuses() {
  return request({
    url: '/sys/role/statuses',
    method: 'get'
  })
}

export function loadTempRoleTypes() {
  return request({
    url: '/sys/tempRole/types',
    method: 'get'
  })
}

export function loadTempRoleStatuses() {
  return request({
    url: '/sys/tempRole/statuses',
    method: 'get'
  })
}

export function loadProcessStatuses() {
  return request({
    url: '/sys/process/statuses',
    method: 'get'
  })
}

export function loadStepStatuses() {
  return request({
    url: '/sys/step/statuses',
    method: 'get'
  })
}

export function loadCompanyInfoTypes() {
  return request({
    url: '/sys/companyInfo/types',
    method: 'get'
  })
}

export function loadCompanyInfoStatuses() {
  return request({
    url: '/sys/companyInfo/statuses',
    method: 'get'
  })
}

export function loadPreferentialMsgStatuses() {
  return request({
    url: '/sys/preferentialMsg/statuses',
    method: 'get'
  })
}
