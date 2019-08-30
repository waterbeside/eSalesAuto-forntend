
import { login, logout, getInfo } from '@/api/user'
import { getList,getDetail, add, del,batchEdit,edit,checkCustomerFabCodeExist ,getCustomerFabCodes } from '@/api/sppo'
import { getList as goGetList, 
         getDetail as goGetDetail, 
         add as goAdd, 
         del as goDel, 
         batchEdit as goBatchEdit,
         edit as goEdit
        } from '@/api/go'

import {getBrandCode, getBrandLabel} from '@/api/genBrand'
import {getFactoryIds} from '@/api/genFactory'
import {checkFabricTypeExist} from '@/api/fabFabric'
import {checkWashTypeExist,getWashTypes} from '@/api/genWash'
import {getList as fabLnGetCustomerFabCodes} from '@/api/masterFabricationLN'
import {getSizes} from '@/api/masterSizes'
import {getMarkets} from '@/api/masterGoMarket'
import {getGarmentParts} from '@/api/masterQtyLd'



export let passportAPI = { login,logout,getInfo }
export let sppoAPI =  { getList,getDetail,add,del ,batchEdit,edit,checkCustomerFabCodeExist,getCustomerFabCodes}
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
    getBrandLabel,
    getFactoryIds,
    getWashTypes,
    checkFabricTypeExist,
    checkWashTypeExist,
    checkCustomerFabCodeExist,
    getSizes,
    getMarkets,
    getGarmentParts,
    fabLnGetCustomerFabCodes,

}
