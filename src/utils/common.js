export function changeCaseJsonKey(jsonObj,type = 0){
    for (var key in jsonObj){
        let nkey =  type ? key.toUpperCase() : key.toLowerCase();
        jsonObj[nkey] = jsonObj[key];
        if(nkey != key){
            delete(jsonObj[key]);
        }
    }
    return jsonObj;
}


export async function asyncForEach(arr, callback){
    const length = arr.length;
    const O = Object(arr);
    let k = 0;
    while (k < length) {
      if (k in O) {
        const kValue = O[k];
        await callback(kValue, k, O);
      }
      k++;
    }
  };


  export let myCache = {
    get:(key,s=0)=>{
      let storageObj = s === 's' ? window.sessionStorage : window.localStorage ;
      if(!storageObj){
        return null;
      }
      let res = storageObj.getItem(key)
      let now = (new Date()).valueOf();
      if(res){
          let data = JSON.parse(res);
          if(typeof(data.exp)=='undefined'){
            return data;
          }
          if(data.exp === 0 || parseInt(data.exp) > (new Date()).valueOf() ){
            return typeof(data.data)!='undefined' ? data.data : null;
          }
          return null
      }else{
        return null;
      }
    },

    set:(key,value,exp=0)=>{
      let storageObj = exp === 's' ? window.sessionStorage : window.localStorage ;
      if(!storageObj){
        return null;
      }
      
      let now = (new Date()).valueOf();
      let setData = {
        exp:exp === 0 ? 0 : exp*1000 + now,
        data:value
      }
      let dataString = JSON.stringify(setData);
      storageObj.setItem(key,dataString);
      return;
    },

    do:async(key,[fun,data=null],exp=0)=>{
      let res = myCache.get(key,exp);
      if(res === null){
        if(typeof(fun)=='function'){
          res = await fun(data);
        }
        myCache.set(key,res,exp);
      }else{
        // console.log('mycache:'+key)
      }
      return res;
    }
  }

