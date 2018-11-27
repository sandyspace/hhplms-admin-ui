import request from '@/utils/request'

export function loadEmployees(queryParams) {
  return request({
    url: '/rs/ana/employees',
    method: 'get',
    params: queryParams
  })
}

export function loadDetail(id) {
  return request({
    url: '/rs/ana/employees/' + id,
    method: 'get'
  })
}

export function createEmployee(employee) {
  return request({
    url: '/rs/ana/employees',
    method: 'post',
    data: employee
  })
}

export function updateEmployee(id, employee) {
  return request({
    url: '/rs/ana/employees/' + id,
    method: 'put',
    data: employee
  })
}

export function addRolesToEmployee(employeeId, roleIds) {
  return request({
    url: '/rs/ana/employees/' + employeeId + '/roles',
    method: 'post',
    data: roleIds
  })
}

export function updateStatus(id, updateStatusRequest) {
  return request({
    url: '/rs/ana/employees/' + id + '/updateStatus',
    method: 'patch',
    data: updateStatusRequest
  })
}

export function resetPwd(id) {
  return request({
    url: '/rs/ana/employees/' + id + '/resetPwd',
    method: 'patch'
  })
}

export function changePwd(changePasswordRequest) {
  return request({
    url: '/rs/ana/employees/changePwd',
    method: 'patch',
    data: changePasswordRequest
  })
}

export function updateSelfInfo(updateEmployeeRequest) {
  return request({
    url: '/rs/ana/employee/update',
    method: 'put',
    data: updateEmployeeRequest
  })
}
