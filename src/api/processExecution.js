import request from '@/utils/request'

export function loadProcessExecutions(queryParams) {
  return request({
    url: '/wf/processExecutions',
    method: 'get',
    params: queryParams
  })
}

export function checkProcessExecution(processExecutionId) {
  return request({
    url: '/wf/processExecutions/' + processExecutionId + '/check',
    method: 'post'
  })
}
