import request from '@/utils/request'
import settings from '@/settings.js'
// import qs from 'qs'

/**
 * 取得SPPO列表
 * @param Object params 
 */
export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'get',
    params
  })
}

/**
 * 新建Sppo
 * @param Object data 
 */
export function add(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'post',
    data
  })
}

/**
 * 编辑Sppo
 * @param Object data 
 */
export function edit(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'put',
    data
  })
}

/**
 * 批量编辑Sppo
 * @param Object data 
 */
export function batchEdit(data) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo/batch',
    method: 'put',
    data
  })
}



/**
 * 删除
 * @param Object data 
 */
export function del(data) {
  // data = qs.stringify(data) ;
  console.log(data)
  return request({
    url: settings.apiBaseUrl+'/api/v1/sppo',
    method: 'delete',
    data
  })
}

/**
 * 检查Customer_Fab_Code是否存在
 * @param Object params 
 */
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

