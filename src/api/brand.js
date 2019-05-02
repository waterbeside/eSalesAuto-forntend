import request from '@/utils/request'
import settings from '@/settings.js'

export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/brand',
    method: 'get',
    params
  })
}



