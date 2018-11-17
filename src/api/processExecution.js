import request from '@/utils/request'

export function loadProcessExecutions(queryParams) {
  return request({
    url: '/rs/wf/processExecutions',
    method: 'get',
    params: queryParams
  })
}

export function checkProcessExecution(processExecutionId) {
  return request({
    url: '/rs/wf/processExecutions/' + processExecutionId + '/check',
    method: 'post'
  })
}
