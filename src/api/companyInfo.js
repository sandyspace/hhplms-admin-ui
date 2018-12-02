import request from '@/utils/request'

export function loadCompanyInfos(queryParams) {
  return request({
    url: '/ana/companyInfos',
    method: 'get',
    params: queryParams
  })
}

export function getAvailableCompanyInfos() {
  return request({
    url: '/ana/companyInfos/available',
    method: 'get'
  })
}

export function getCompanyInfoOfSelf() {
  return request({
    url: '/ana/account/companyInfo',
    method: 'get'
  })
}

export function updateSelfCompanyInfo(companyInfo) {
  return request({
    url: '/api/ana/account/companyInfo',
    method: 'put',
    data: companyInfo
  })
}

export function getCompanyInfoOfAccount(loginName) {
  return request({
    url: '/ana/accounts/' + loginName + '/companyInfo',
    method: 'get'
  })
}

export function loadDetail(id) {
  return request({
    url: '/ana/companyInfos/' + id,
    method: 'get'
  })
}

export function deleteCompanyInfo(id) {
  return request({
    url: '/ana/companyInfos/' + id,
    method: 'delete'
  })
}

export function createCompanyInfo(companyInfo) {
  return request({
    url: '/ana/companyInfos',
    method: 'post',
    data: companyInfo
  })
}

export function updateCompanyInfo(id, companyInfo) {
  return request({
    url: '/ana/companyInfos/' + id,
    method: 'put',
    data: companyInfo
  })
}

export function updateCompanyInfoStatus(id, updateStatusRequest) {
  return request({
    url: '/ana/companyInfos/' + id + '/updateStatus',
    method: 'patch',
    data: updateStatusRequest
  })
}

