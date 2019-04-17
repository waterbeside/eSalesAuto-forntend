const common = {
  state: {
    isCollapse: false
  },
  mutations: {
    SET_TOGGLE_MENU: (state) => {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {

  }
}

export default common
