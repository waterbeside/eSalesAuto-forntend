import request from '@/utils/request'
import settings from '@/settings.js'

export function getSizes(params) {
  return new Promise((resole,reject)=>{
    request({
      url: settings.apiBaseUrl+'/api/v1/master_size/sizes',
      method: 'get',
      params
    }).then(res=>{
      if(res.code === 0 || res.code === 20002 ){
        resole(res.data.size);
      }else{
        reject(new Error('No data'));
      }
    }).catch(error=>{
      reject(error);
    })
  })
}

