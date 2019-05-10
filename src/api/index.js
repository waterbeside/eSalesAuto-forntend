
import { login, logout, getInfo } from '@/api/user'
import { getList,getDetail, add, del,checkCustomerFabCodeExist,batchEdit,edit } from '@/api/sppo'

import {getBrandCode} from '@/api/genBrand'
import {getFactoryIds} from '@/api/genFactory'
import {checkFabricTypeExist} from '@/api/fabFabric'
import {checkWashTypeExist,getWashTypes} from '@/api/genWash'
import {getList as getCustomerFabCodes} from '@/api/masterFabricationLN'

export let passportAPI = { login,logout,getInfo }
export let sppoAPI =  { getList,getDetail,add,del ,checkCustomerFabCodeExist,batchEdit,edit}
export let assistAPI =  { 
    getBrandCode,
    getFactoryIds,
    getWashTypes,
    checkFabricTypeExist,
    checkWashTypeExist,
    checkCustomerFabCodeExist,
    getCustomerFabCodes,
}

 
