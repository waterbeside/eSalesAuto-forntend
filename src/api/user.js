import request from '@/utils/request'
import settings from '@/settings.js'

export function login(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/passport/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: settings.apiBaseUrl+'/api/v1/passport',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: settings.apiBaseUrl+'/api/v1/user/logout',
    method: 'post'
  })
}

