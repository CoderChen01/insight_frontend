import {
  CREATE_FACEGROUP_DATA,
  STORE_FACEGROUP_DATA,
  UPDATE_FACEGROUP_DATA,
  DELETE_FACEGROUP_DATA
} from '../mutationTypes'

export const faceManagementModule = {
  state: () => ({
    faceGroupData: []
  }),
  mutations: {
    [STORE_FACEGROUP_DATA](state, payload) {
      state.faceGroupData = payload
    },
    [CREATE_FACEGROUP_DATA](state, payload) {
      state.faceGroupData.push(payload)
    },
    [UPDATE_FACEGROUP_DATA](state, payload) {
      state.faceGroupData.forEach((item, index, array) => {
        if (item['face_group_id'] === payload['face_group_id']) {
          array.splice(index, 1, payload)
        }
      })
    },
    [DELETE_FACEGROUP_DATA](state, payload) {
      state.faceGroupData.forEach((item, index, array) => {
        if (item['face_group_id'] === payload) {
          array.splice(index, 1)
        }
      })
    }
  }
}
