import request from '@/utils/request'

export function loadAvailableProcesses() {
  return request({
    url: '/rs/wf/processes/available',
    method: 'get'
  })
}

export function loadDetail(code) {
  return request({
    url: '/rs/wf/processes/' + code + '/detail',
    method: 'get'
  })
}
