import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { endWith } from '@/utils/stringUtils'
import { getToken } from '@/utils/auth'

const UNAUTHORIZED = 401
const INTERNAL_SERVER_ERROR = 500

const popupMessage = function(msg, type) {
  Message({
    message: msg,
    type: type,
    duration: 5 * 1000
  })
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const status = error.response.status
    if (status === UNAUTHORIZED) {
      const url = error.request.responseURL
      if (endWith(url, 'login')) {
        popupMessage(error.response.data.message, 'error')
      } else {
        MessageBox.confirm('你已被登出，点击取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('logout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
    } else {
      if (status === INTERNAL_SERVER_ERROR) {
        if (error.response.data.errorMsg) {
          popupMessage(error.response.data.errorMsg, 'error')
        }
      } else {
        popupMessage(error.message, 'error')
      }
    }
    return Promise.reject(error)
  }
)

export default service
