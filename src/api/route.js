import request from '@/utils/request'

export function getRouteFragment(processId, fromStepId) {
  return request({
    url: '/wf/routes/' + processId + '/' + fromStepId,
    method: 'get'
  })
}
