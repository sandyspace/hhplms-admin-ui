export function isEmployee(userType) {
  return userType === 'employee'
}

export function canOperateRole(userType, roleType) {
  return userType === 'employee' || (userType === 'account' && roleType !== 'pre-assigned')
}
