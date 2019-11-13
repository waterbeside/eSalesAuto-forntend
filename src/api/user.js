import request from '@/utils/request'
import settings from '@/settings.js'

/**
 * 登入
 * @param {Object} data 
 */
export function login(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v2/passport/login',
    method: 'post',
    data
  })
}

/**
 * 取得当前登入用户的信息
 */
export function getInfo() {
  return request({
    url: settings.apiBaseUrl+'/api/v1/passport',
    method: 'get',
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: settings.apiBaseUrl+'/api/v1/passport',
    method: 'delete'
  })
}


/**
 * 更新密码
 */
export function changeMyPass(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/passport/change_pass',
    method: 'patch',
    data
  })
}

/**
 * 取得用户列表
 */
export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user',
    method: 'get',
    params
  })
}

/**
 * 取得用户详情
 */
export function userDetail(id,params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user/'+id,
    method: 'get',
    params
  })
}

/**
 * 更新用户详情
 */
export function userUpdate(id,data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user/'+id,
    method: 'patch',
    data
  })
}

/**
 * 新增用户
 */
export function userCreate(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user',
    method: 'post',
    data
  })
}



/**
 * 删除用户
 */
export function userDelete(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user',
    method: 'delete',
    data
  })
}

/**
 * 验证用户名是否唯一
 */
export function checkUserUnique(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user/check_unique',
    method: 'get',
    params
  })
}


