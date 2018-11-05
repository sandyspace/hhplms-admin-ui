import request from '@/utils/request'

export function accountList(account) {
  return request({
    url: '/rs/ana/accounts',
    method: 'get',
    params: account
  })
}

export function accountSelect(id) {
  return request({
    url: '/rs/ana/accounts/' + id,
    method: 'get'
  })
}

export function detailSelect(id) {
  return request({
    url: '/rs/ana/accounts/' + id,
    method: 'get'
  })
}
export function updateAccount(id, user) {
  return request({
    url: '/rs/ana/accounts/' + id,
    method: 'put',
    data: {
      email: user.email,
      gender: user.gender,
      loginName: user.loginName,
      mobile: user.mobile,
      nickName: user.nickName,
      realName: user.realName,
      versionNum: 1
    },
    emulateJSON: true
  })
}
export function addAccount(id, user) {
  return request({
    url: '/rs/ana/accounts',
    method: 'post',
    data: {
      loginName: user.loginName,
      nickName: user.nickName,
      realName: user.realName,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      status: user.status,
      type: user.type,
      versionNum: 1
    },
    emulateJSON: true
  })
}
export function resetPwd(id) {
  return request({
    url: '/rs/ana/accounts/' + id + '/resetPwd',
    method: 'patch'
  })
}

export function updateAccountStatus(id, updateStatusRequest) {
  return request({
    url: '/rs/ana/accounts/' + id + '/updateStatus',
    method: 'patch',
    data: updateStatusRequest
  })
}
