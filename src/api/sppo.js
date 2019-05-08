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

export function add(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'post',
    data
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


export function checkCustomerFabCodeExist(params){
  return new Promise((resole,reject)=>{
    request({
      url: settings.apiBaseUrl+'/api/v1/sppo/check_customer_fab_code_exist',
      method: 'get',
      params
    }).then(res=>{
      resole(res.data.is_exist);
    }).catch(error=>{
      reject(error);
    })
  })
}

