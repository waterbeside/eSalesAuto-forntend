import request from '@/utils/request'
import settings from '@/settings.js'

export function getMarkets(params) {
  return  request({
    url: settings.apiBaseUrl+'/api/v1/master_go_market',
    method: 'get',
    params
  })
}

