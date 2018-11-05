import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'Access-Token'
const REFRESH_TOKEN_KEY = 'Refresh-Token'

export function getToken() {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(ACCESS_TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(REFRESH_TOKEN_KEY, refreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(REFRESH_TOKEN_KEY)
}
