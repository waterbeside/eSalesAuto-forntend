import {assistAPI} from '@/api'
const cacheData = {
  namespaced: true,

  state: {
    factorys: [],
    factorys_go: [],
  },
  mutations: {
    SET_FACTORYS: (state, data) => {
      state.factorys = data
    },
    SET_FACTORYS_GO: (state, data) => {
      state.factorys_go = data
    },
    SET_WASH_TYPES: (state, data) => {
      state.washTypes = data
    }
  },
  actions: {
    getFactorys({ commit, state },type){
      return new Promise((resolve, reject) => {
        type = type || 0;
        let cacheList = type ? state.factorys_go : state.factorys;
        if(cacheList && cacheList.length > 0){
          resolve(cacheList);
          return ;
        }
        assistAPI.getFactoryIds({type}).then((res)=>{
          let list = res.data.list;
          if(type){
            commit('SET_FACTORYS_GO', list)
          }else{
            commit('SET_FACTORYS', list)
          }
          resolve(list);
          return ;
        }).catch(error=>{
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    }
  }
}

export default cacheData;
