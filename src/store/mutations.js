import {
  STORE_USER_INFO,
  UPDATE_USER_INFO,
  DELETE_USER_INFO,
  ISSCROLLTOBOTTOM
} from './mutationTypes'


const mutations = {
  [STORE_USER_INFO](state, paload) {
    if (Object.keys(state.userInfo).length < 1) {
      state.userInfo = paload
    }
    if (!localStorage.getItem('userInfo')) {
      localStorage.setItem('userInfo', JSON.stringify(paload))
    }
  },
  [UPDATE_USER_INFO](state, paload) {
    for (let key of Object.keys(paload)) {
      state.userInfo[key] = paload[key]
    }
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
  },
  [DELETE_USER_INFO](state) {
    state.userInfo = {}
    localStorage.removeItem('userInfo')
  },
  [ISSCROLLTOBOTTOM](state, paload) {
    state.isScrollToBottom = paload
  }
}

export default mutations