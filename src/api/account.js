import request from '@/utils/request'

export function loadAccounts(queryParams) {
  return request({
    url: '/ana/accounts',
    method: 'get',
    params: queryParams
  })
}

export function loadDetail(id) {
  return request({
    url: '/ana/accounts/' + id,
    method: 'get'
  })
}

export function getAccountByLoginName(loginName) {
  return request({
    url: '/ana/accounts/' + loginName + '/basicInfo',
    method: 'get'
  })
}

export function updateAccount(id, account) {
  return request({
    url: '/ana/accounts/' + id,
    method: 'put',
    data: account
  })
}

export function createAccount(account) {
  return request({
    url: '/ana/accounts',
    method: 'post',
    data: account
  })
}

export function resetPwd(id) {
  return request({
    url: '/ana/accounts/' + id + '/resetPwd',
    method: 'patch'
  })
}

export function updateAccountType(id, updateTypeRequest) {
  return request({
    url: '/ana/accounts/' + id + '/updateType',
    method: 'patch',
    data: updateTypeRequest
  })
}

export function updateAccountStatus(id, updateStatusRequest) {
  return request({
    url: '/ana/accounts/' + id + '/updateStatus',
    method: 'patch',
    data: updateStatusRequest
  })
}

export function addRoleToAccount(id, ids) {
  return request({
    url: '/ana/accounts/' + id + '/roles',
    method: 'post',
    data: ids
  })
}

export function changePwd(changePasswordRequest) {
  return request({
    url: '/ana/accounts/changePwd',
    method: 'patch',
    data: changePasswordRequest
  })
}

export function updateSelfInfo(updateAccountRequest) {
  return request({
    url: '/ana/account/update',
    method: 'put',
    data: updateAccountRequest
  })
}
