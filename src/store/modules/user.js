import { login, accountLogin, retrieveUserProfile } from '@/api/login'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken } from '@/utils/auth'

const user = {
  state: {
    profile: null,
    roles: [],
    name: '',
    type: '',
    subType: '',
    avatar: '',
    token: getToken(),
    refreshToken: getRefreshToken()
  },
  mutations: {
    SET_PROFILE: (state, profile) => {
      state.profile = profile
    },
    CLEAR_PROFILE: (state) => {
      state.profile = null
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_SUB_TYPE: (state, subType) => {
      state.subType = subType
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_TOKEN: (state) => {
      state.token = null
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
    }
  },
  actions: {
    login({ commit }, loginRequest) {
      return new Promise((resolve, reject) => {
        login(loginRequest.username, loginRequest.password).then(response => {
          const token = response.data.token
          const refreshToken = response.data.refreshToken
          commit('SET_TOKEN', token)
          setToken(token)
          commit('SET_REFRESH_TOKEN', refreshToken)
          setRefreshToken(refreshToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    accountLogin({ commit }, loginRequest) {
      return new Promise((resolve, reject) => {
        accountLogin(loginRequest.username, loginRequest.password).then(response => {
          const token = response.data.token
          const refreshToken = response.data.refreshToken
          commit('SET_TOKEN', token)
          setToken(token)
          commit('SET_REFRESH_TOKEN', refreshToken)
          setRefreshToken(refreshToken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    retrieveUserProfile({ commit }) {
      return new Promise((resolve, reject) => {
        retrieveUserProfile().then(response => {
          const profile = response.data
          commit('SET_PROFILE', profile)
          if (profile.roles && profile.roles.length !== 0) {
            const roles = []
            profile.roles.forEach(role => {
              roles.push(role.code)
            })
            commit('SET_ROLES', roles)
          }
          commit('SET_NAME', profile.basicInfo.loginName)
          commit('SET_TYPE', profile.basicInfo.type)
          commit('SET_SUB_TYPE', profile.basicInfo.subType)
          commit('SET_AVATAR', profile.basicInfo.headImgUrl || 'static/avatar/' + profile.basicInfo.gender + '.png')
          resolve(profile.permissions)
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({ commit }) {
      return new Promise(resolve => {
        commit('CLEAR_PROFILE')
        commit('CLEAR_TOKEN')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
