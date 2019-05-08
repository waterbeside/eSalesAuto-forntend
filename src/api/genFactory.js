import request from '@/utils/request'
import settings from '@/settings.js'

export function getFactoryIds(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/gen_factory/get_factory_ids',
    method: 'get',
    params
  })
}



