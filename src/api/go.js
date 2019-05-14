import request from '@/utils/request'
import settings from '@/settings.js'
// import qs from 'qs'

/**
 * 取得GO列表
 * @param Object params 
 */
export function getList(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/go',
    method: 'get',
    params
  })
}

/**
 * Sppo Detail
 * @param Object data 
 */
export function getDetail(params) {
  return request({
    url: settings.apiBaseUrl+'/api/v1/go/detail',
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
    url: settings.apiBaseUrl+'/api/v1/go',
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
    url: settings.apiBaseUrl+'/api/v1/go',
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
    url: settings.apiBaseUrl+'/api/v1/go/batch',
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
    url: settings.apiBaseUrl+'/api/v1/go',
    method: 'delete',
    data
  })
}

