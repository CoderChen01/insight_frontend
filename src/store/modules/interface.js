import {
  CREATE_AISKILLGROUP_DATA,
  STORE_AISKILLGROUP_DATA,
  UPDATE_AISKILLGROUP_DATA,
  DELETE_AISKILLGROUP_DATA
} from '../mutationTypes'

export const AISkillManagementModule = {
  state: () => ({
    AISkillGroupData: []
  }),
  mutations: {
    [STORE_AISKILLGROUP_DATA](state, payload) {
      state.AISkillGroupData = payload
    },
    [CREATE_AISKILLGROUP_DATA](state, payload) {
      state.AISkillGroupData.push(payload)
    },
    [UPDATE_AISKILLGROUP_DATA](state, payload) {
       state.AISkillGroupData.forEach((item, index, array) => {
        if (item['ai_skill_group_id'] === payload['ai_skill_group_id']) {
          array.splice(index, 1, payload)
        }
      })
    },
    [DELETE_AISKILLGROUP_DATA](state, payload) {
      state.AISkillGroupData.forEach((item, index, array) => {
        if (item['ai_skill_group_id'] === payload) {
          array.splice(index, 1)
        }
      })
    }
  }
}
