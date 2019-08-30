import moment from 'moment'

/**
 * 把json的key转为大写或小写
 * @param {Object} jsonObj 
 * @param {Integer} type 0:转小写,1:转大写
 */
export function changeCaseJsonKey(jsonObj, type = 0) {
  for (var key in jsonObj) {
    let nkey = type ? key.toUpperCase() : key.toLowerCase();
    jsonObj[nkey] = jsonObj[key];
    if (nkey != key) {
      delete(jsonObj[key]);
    }
  }
  return jsonObj;
}


/**
 * 支持async-await的ForEach方法
 * @param {Array} arr 
 * @param {Function} callback 
 */
export async function asyncForEach(arr, callback) {
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


/**
 * 格式化从excel导入的日期字段
 * @param {Integer} numb  从EXCEL导入的日期字段所生成的整数(距1900-01-01的天数)
 * @param {String} format  格式化后的分隔符
 */
export function formatDateFromExcel(numb, format = 'YYYY-MM-DD') {
  // let time = new Date((parseInt(numb) - 1) * 24 * 3600000 + 1)
  // time.setYear(time.getFullYear() - 70)
  let time = new Date(1900, 0, numb - 1);
  return moment(time).format(format)
}

export function deepCopy(object) {
  let resultObject = {};
  for (let obj in object) {
    if (typeof (object[obj]) == "object" && !Array.isArray(object[obj])) {
      let x = {}
      x[obj] = deepCopy(object[obj])
      Object.assign(resultObject, x);
    } else {
      let x = {};
      x[obj] = object[obj];
      Object.assign(resultObject, x);
    }
  }
  return resultObject;
}


/**
 * myCache工具
 */
export let myCache = {
  get: (key, s = 0) => {
    let storageObj = s === 's' ? window.sessionStorage : window.localStorage;
    if (!storageObj) {
      return null;
    }
    let res = storageObj.getItem(key)
    let now = (new Date()).valueOf();
    if (res) {
      let data = JSON.parse(res);
      if (typeof (data.exp) == 'undefined') {
        return data;
      }
      if (data.exp === 0 || parseInt(data.exp) > (new Date()).valueOf()) {
        return typeof (data.data) != 'undefined' ? data.data : null;
      }
      return null
    } else {
      return null;
    }
  },

  set: (key, value, exp = 0) => {
    let storageObj = exp === 's' ? window.sessionStorage : window.localStorage;
    if (!storageObj) {
      return null;
    }
    let now = (new Date()).valueOf();
    let setData = {
      exp: exp === 0 ? 0 : exp * 1000 + now,
      data: value
    }
    let dataString = JSON.stringify(setData);
    storageObj.setItem(key, dataString);
    return;
  },

  do: (key, [fun, data = null, type = "res"], exp = 0) => {
    return new Promise((resole, reject) => {
      let resData = myCache.get(key, exp);
      if (resData === null) {
        if (typeof (fun) == 'function') {
          fun(data).then(res => {
            resData = res;
            if (type != 'res') {
              let type_arr = type.split('.');
              for (let i in type_arr) {
                resData = resData[type_arr[i]];
              }
            }
            myCache.set(key, resData, exp);
            resole(resData);
          }).catch(err => {
            reject(err);
          });
        } else {
          reject(new Error('Error function'))
        }
      } else {
        resole(resData);
      }
    })

  }
}