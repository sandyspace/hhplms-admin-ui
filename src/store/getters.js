const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  uploadedImgBasePath: state => state.app.uploadedImgBasePath,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  profile: state => state.user.profile,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  type: state => state.user.type,
  subType: state => state.user.subType,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
