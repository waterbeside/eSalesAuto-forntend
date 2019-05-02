
import { login, logout, getInfo } from '@/api/user'
import { getList, del } from '@/api/sppo'


export let passportAPI = { login,logout,getInfo }
export let sppoAPI =  { getList,del }
 
