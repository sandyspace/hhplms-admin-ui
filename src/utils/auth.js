const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export function getToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token) {
  return window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeToken() {
  return window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(refreshToken) {
  return window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function removeRefreshToken() {
  return window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}
