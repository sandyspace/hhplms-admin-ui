import request from '@/utils/request'

export function getStepsOfProcess(processId) {
  return request({
    url: '/wf/processes/' + processId + '/steps',
    method: 'get'
  })
}
