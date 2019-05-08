const cacheData = {
  namespaced: true,

  state: {
    factorys: []
  },
  mutations: {
    SET_FACTORYS: (state, data) => {
      state.factorys = data
    }
  },
  actions: {
    
  }
}

export default cacheData;
