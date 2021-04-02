import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import {AISkillManagementModule} from 'store/modules/interface'
import {faceManagementModule} from 'store/modules/face'
import {cameraManagementModule} from './modules/camera'


Vue.use(Vuex)

const state = {
  userInfo: {},
  isScrollToBottom: false
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    interface: AISkillManagementModule,
    face: faceManagementModule,
    camera: cameraManagementModule
  }
})
