import request from '@/utils/request'

export function getRouteFragment(processId, fromStepId) {
  return request({
    url: '/rs/wf/routes/' + processId + '/' + fromStepId,
    method: 'get'
  })
}
