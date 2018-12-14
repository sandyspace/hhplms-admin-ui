export function isEmployee(userType) {
  return userType === 'employee'
}

export function canOperateRole(userType, roleType, roleCategory) {
  if (userType === 'account') {
    if (roleType === 'created') {
      return true
    }
  } else if (userType === 'employee') {
    if (roleCategory === 'account') {
      return true
    } else {
      if (roleType !== 'pre-assigned') {
        return true
      }
    }
  }
  return false
}
