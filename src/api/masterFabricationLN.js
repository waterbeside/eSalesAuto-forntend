import request from '@/utils/request'
import settings from '@/settings.js'

export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln',
    method: 'get',
    params
  })
}

export function getDetail(id,params) {
  return request({
    url: `${settings.apiBaseUrl}/api/v1/master_fabrication_ln/${id}`,
    method: 'get',
    params
  })
}


/**
 * 删除
 */
export function del(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln',
    method: 'delete',
    data
  })
}

/**
 * 更新用户详情
 */
export function updateItem(id,data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln/'+id,
    method: 'patch',
    data
  })
}

/**
 * 新增用户
 */
export function createItem(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln',
    method: 'post',
    data
  })
}

export function getCustomerFabCodes(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/master_fabrication_ln/get_customer_fab_codes',
    method: 'get',
    params
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

