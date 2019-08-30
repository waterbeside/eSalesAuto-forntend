import request from '@/utils/request'
import settings from '@/settings.js'

export function getBrandCode(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/gen_brand/get_brand_code',
    method: 'get',
    params
  })
}


export function getBrandLabel(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/gen_brand/get_label',
    method: 'get',
    params
  })
}



