import Cookies from 'js-cookie';

const TokenKey = 'sale-u-tok';

export function getToken() {
  if(sessionStorage){
    return sessionStorage.getItem(TokenKey);
  }else{
    return Cookies.get(TokenKey);
  }
}

export function setToken(token) {
  if(sessionStorage){
    return sessionStorage.setItem(TokenKey,token);
  }else{
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  if(sessionStorage){
    return sessionStorage.removeItem(TokenKey);
  }else{
    return Cookies.remove(TokenKey, token)
  }
}
