import request from '@/utils/request'
import settings from '@/settings.js'

export function getGarmentParts(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_qty_ld/get_garment_parts',
    method: 'get',
    params
  })
}


