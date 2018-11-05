import { constantRouterMap } from '@/router'

function buildRouters(permissions) {
  let routers = []
  if (permissions && permissions.length !== 0) {
    routers = doBuildRouters(permissions)
  }
  return routers
}

function doBuildRouters(permissions) {
  const routers = []
  permissions.forEach(permission => {
    const router = toRouter(permission)
    if (permission.subPermissions && permission.subPermissions.length !== 0) {
      router.children = doBuildRouters(permission.subPermissions)
    }
    routers.push(router)
  })
  return routers
}

function toRouter(permission) {
  const router = {}
  router.path = permission.path
  let component
  if (permission.componentUrl && permission.componentUrl !== '') {
    const componentUrl = permission.componentUrl
    component = () => import(`@/views/${componentUrl}`)
  } else {
    component = () => import('@/views/layout/Layout')
  }
  router.component = component
  if (permission.redirectPath && permission.redirectPath !== '') {
    router.redirect = permission.redirectPath
  }
  if (permission.hiddenFlag && permission.hiddenFlag === 'Y') {
    router.hidden = true
  } else {
    router.hidden = false
  }
  if (permission.alwaysShowFlag && permission.alwaysShowFlag === 'Y') {
    router.alwaysShow = true
  } else {
    router.alwaysShow = false
  }
  router.name = permission.name
  router.meta = {
    title: permission.name,
    icon: permission.icon
  }
  if (permission.noCacheFlag && permission.noCacheFlag === 'Y') {
    router.meta.noCache = true
  } else {
    router.meta.noCache = false
  }
  if (permission.roles && permission.roles.length !== 0) {
    const roles = []
    permission.roles.forEach(role => {
      roles.push(role.code)
    })
    router.meta.roles = roles
  }
  return router
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateDynamicRoutes({ commit }, permissions) {
      return new Promise(resolve => {
        const dynamicRouters = buildRouters(permissions)
        dynamicRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', dynamicRouters)
        resolve()
      })
    }
  }
}

export default permission
