import {
  CREATE_CAMERAGROUP_DATA,
  STORE_CAMERAGROUP_DATA,
  UPDATE_CAMERAGROUP_DATA,
  DELETE_CAMERAGROUP_DATA
} from '../mutationTypes'

export const cameraManagementModule = {
  state: () => ({
    cameraGroupData: []
  }),
  mutations: {
    [STORE_CAMERAGROUP_DATA](state, payload) {
      state.cameraGroupData = payload
    },
    [CREATE_CAMERAGROUP_DATA](state, payload) {
      state.cameraGroupData.push(payload)
    },
    [UPDATE_CAMERAGROUP_DATA](state, payload) {
      state.cameraGroupData.forEach((item, index, array) => {
        if (item['camera_group_id'] === payload['camera_group_id']) {
          array.splice(index, 1, payload)
        }
      })
    },
    [DELETE_CAMERAGROUP_DATA](state, payload) {
      state.cameraGroupData.forEach((item, index, array) => {
        if (item['camera_group_id'] === payload) {
          array.splice(index, 1)
        }
      })
    }
  }
}
