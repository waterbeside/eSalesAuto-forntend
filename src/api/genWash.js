import request from '@/utils/request'
import settings from '@/settings.js'

export function checkWashTypeExist(params) {
  return new Promise((resole,reject)=>{

    request({
      url: settings.apiBaseUrl+'/api/v1/gen_wash_type/check_exist',
      method: 'get',
      params
    }).then(res=>{
      resole(res.data.is_exist);
    }).catch(error=>{
      reject(error);
    })
  })

}



