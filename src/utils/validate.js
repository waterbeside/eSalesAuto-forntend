/**
 * Created by jiachenpan on 16/11/18.
 */

const _ = require('lodash');
import moment from 'moment'



export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  return true;
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
}

export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 检证color combo格式是否正确
 */
export function checkColorCombo(str,callback){
  let code = 0;
  let msg = '';
  if(_.trim(str.substring(2,3)) != ''){
    msg = "color_combo 第三位必须为空";
    code = 1;
  }
  
  if(typeof(callback)=='function') callback({code,msg});
  return code !== 0 ? false : true;
}

/**
 * 检证collar_cuff_size格式是否正确
 */
export function checkCollarCuffSize(str,callback){
  let code = 0;
  let msg = '';

  let collar_cuff_size_array = str.split('*');
  if(collar_cuff_size_array.length !==2){
    code = 1
  }else{
    for(let el of collar_cuff_size_array){
      let num = _.toNumber(el)
      if( num != el || num <= 0){
        code = 1
        break;
      }
    }
  }
  if(code){
    msg = "'collar_cuff_size'格式必须为:数字*数字";
  }  
  if(typeof(callback)=='function') callback({code,msg});
  return code !== 0 ? false : true;
}

/**
 * 交期验证
 */
export function checkDelivery(obj){
  let now = moment(moment().format('YYYY-MM-DD')).unix();
  let checkDate = moment(obj).unix();
  return checkDate > now ;
}


