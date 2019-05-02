import request from '@/utils/request'
import settings from '@/settings.js'
import qs from 'qs'

export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'get',
    params
  })
}

export function del(data) {

  // data = qs.stringify(data) ;
  console.log(data)
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'delete',
    data
  })
}


