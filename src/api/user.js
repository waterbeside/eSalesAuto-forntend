import request from '@/utils/request'
import settings from '@/settings.js'

export function login(data) {
  return request({
    url: settings.apiBaseUrl+'/passport/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: settings.apiBaseUrl+'/passport',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: settings.apiBaseUrl+'/user/logout',
    method: 'post'
  })
}

