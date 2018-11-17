import request from '@/utils/request'

export function getStepsOfProcess(processId) {
  return request({
    url: '/rs/wf/processes/' + processId + '/steps',
    method: 'get'
  })
}
