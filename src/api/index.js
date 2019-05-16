
import { login, logout, getInfo } from '@/api/user'
import { getList,getDetail, add, del,checkCustomerFabCodeExist,batchEdit,edit } from '@/api/sppo'
import { getList as goGetList, 
         getDetail as goGetDetail, 
         add as goAdd, 
         del as goDel, 
         batchEdit as goBatchEdit,
         edit as goEdit
        } from '@/api/go'

import {getBrandCode} from '@/api/genBrand'
import {getFactoryIds} from '@/api/genFactory'
import {checkFabricTypeExist} from '@/api/fabFabric'
import {checkWashTypeExist,getWashTypes} from '@/api/genWash'
import {getList as getCustomerFabCodes} from '@/api/masterFabricationLN'
import {getSizes} from '@/api/masterSizes'

export let passportAPI = { login,logout,getInfo }
export let sppoAPI =  { getList,getDetail,add,del ,checkCustomerFabCodeExist,batchEdit,edit}
export let goAPI =  { 
    getList     :goGetList,
    getDetail   :goGetDetail, 
    add         :goAdd, 
    del         :goDel, 
    batchEdit   :goBatchEdit,
    edit        :goEdit 
}
export let assistAPI =  { 
    getBrandCode,
    getFactoryIds,
    getWashTypes,
    checkFabricTypeExist,
    checkWashTypeExist,
    checkCustomerFabCodeExist,
    getCustomerFabCodes,
    getSizes,
}

 
