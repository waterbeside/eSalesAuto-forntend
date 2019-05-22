import request from '@/utils/request'
import settings from '@/settings.js'

export function getRoleSelects(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/role/selects',
    method: 'get',
    params
  })
}



