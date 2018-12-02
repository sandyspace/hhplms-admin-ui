import request from '@/utils/request'

export function loadPreferentialMsgs(queryParams) {
  return request({
    url: '/pm/preferentialMsgs',
    method: 'get',
    params: queryParams
  })
}

export function loadDetail(id) {
  return request({
    url: '/pm/preferentialMsgs/' + id,
    method: 'get'
  })
}

export function createdPreferentialMsg(preferentialMsg) {
  return request({
    url: '/pm/preferentialMsgs',
    method: 'post',
    data: preferentialMsg
  })
}

export function updatePreferentialMsg(id, preferentialMsg) {
  return request({
    url: '/pm/preferentialMsgs/' + id,
    method: 'put',
    data: preferentialMsg
  })
}

export function updatePreferentialMsgStatus(id, updateStatusRequest) {
  return request({
    url: '/pm/preferentialMsgs/' + id + '/updateStatus',
    method: 'patch',
    data: updateStatusRequest
  })
}

export function deletePreferentialMsg(id) {
  return request({
    url: '/pm/preferentialMsgs/' + id,
    method: 'delete'
  })
}
