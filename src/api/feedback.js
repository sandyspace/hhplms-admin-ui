import request from '@/utils/request'

export function loadFeedbacks(queryParams) {
  return request({
    url: '/rs/sys/feedbacks',
    method: 'get',
    params: queryParams
  })
}

export function deleteFeedback(id) {
  return request({
    url: '/rs/sys/feedbacks/' + id,
    method: 'delete'
  })
}
