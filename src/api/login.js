import request from '@/utils/request'

export function login(username, password) {
  const loginRequest = {
    username,
    password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data: loginRequest
  })
}

export function accountLogin(username, password) {
  const loginRequest = {
    username,
    password
  }
  return request({
    url: '/auth/account/login',
    method: 'post',
    data: loginRequest
  })
}

export function retrieveUserProfile() {
  return request({
    url: '/auth/user/profile',
    method: 'get'
  })
}

