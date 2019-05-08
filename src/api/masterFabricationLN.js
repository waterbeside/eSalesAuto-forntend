import request from '@/utils/request'
import settings from '@/settings.js'

export function getList(params) {
  return new Promise((resole,reject)=>{
    request({
      url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln',
      method: 'get',
      params
    })
  })
}

export function checkCustomerFabCodeExist(params) {
  return new Promise((resole,reject)=>{
    request({
      url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln/check_exist',
      method: 'get',
      params
    }).then(res=>{
      resole(res.data.is_exist);
    }).catch(error=>{
      reject(error);
    })
  })
}

