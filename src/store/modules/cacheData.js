const cacheData = {
  namespaced: true,

  state: {
    factorys: []
  },
  mutations: {
    SET_FACTORYS: (state, data) => {
      state.factorys = data
    },
    SET_WASH_TYPES: (state, data) => {
      state.washTypes = data
    }
  },
  actions: {
    
  }
}

export default cacheData;
