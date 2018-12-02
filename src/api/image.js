import request from '@/utils/request'

export function uploadImg(param) {
  return request({
    url: '/uploadImg',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
