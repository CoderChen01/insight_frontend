<template>
  <div class="set-ai-skill-settings">
    <el-dialog title="配置AI接口"
               width="1050px"
               :center="true"
               :show-close="false"
               :close-on-click-modal="false"
               style="user-select: none;"
               @open="getPreviewImage"
               @closed="handleClose"
               @close="$emit('update:isVisible', false)"
               :visible.sync="$_isVisible">
      <div class="header-dropdown">
        <el-dropdown @command="handleCommand">
          <el-button type="primary">
            选择接口分组<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu v-slot:default>
            <el-dropdown-item v-for="AISkillGroup in AISkillGroupData"
                              :key="AISkillGroup['ai_skill_group_id']"
                              :command="AISkillGroup['ai_skill_group_id']">
              {{ AISkillGroup['name'] }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="danger"
                   style="margin-left: 20px"
                   icon="el-icon-error"
                   @click="clearAISkillSetting">清空配置
        </el-button>
      </div>
      <div class="content-ai-skill-no-data" v-show="noDataVisible || initNoDataVisible">
        <div class="empty-data">
          <empty-data v-show="noDataVisible">
            <template v-slot:emptyText>
              该分组下没有AI接口数据
            </template>
          </empty-data>
          <empty-data v-if="initNoDataVisible">
            <template v-slot:emptyText>
              请选择AI接口分组
            </template>
          </empty-data>
        </div>
      </div>
      <div class="content-ai-skill-setting" v-show="!noDataVisible && !initNoDataVisible">
        <div class="ai-skill-collapse">
          <el-scrollbar wrap-style="overflow: auto;"
                        view-style="overflow: hidden;"
                        style="height: 500px;">
            <el-collapse v-model="activeAISkillName" style="margin: 0 20px;">
              <ai-skill-setting v-for="AISkill in currentAISkillData"
                                :key="AISkill['ai_skill_id']"
                                @deactiveCollapse="handleDeactive"
                                @saveAISkill="handleSaveAISkill"
                                @removeAISkill="handleRemoveAISkill"
                                :previewImage="previewImage"
                                :oldAISkillSettings="oldAISkillSettings"
                                :AISkill="AISkill">
              </ai-skill-setting>
            </el-collapse>
          </el-scrollbar>
        </div>
      </div>
      <template v-slot:footer>
        <div class="form-btn">
          <el-button class="submit-btn"
                     icon="el-icon-check"
                     type="success"
                     @click="handleSubmit"
                     circle></el-button>
          <el-button class="cancle-btn"
                     icon="el-icon-close"
                     type="info"
                     @click="$emit('update:isVisible', false)"
                     circle></el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import AISkillSetting from './AISkillSetting'
  import emptyData from 'components/common/emptyData'
  import {cameraPreviewRequest} from 'api/cameraManagement'
  import {getAISkillRequest} from 'api/AISkillManagement'
  import {cameraSetAISkillSettingsRequest} from 'api/cameraManagement'

  export default {
    name: "setAISkillSettings",

    components: {
      emptyData,
      'ai-skill-setting': AISkillSetting
    },

    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      cameraDataRow: {
        type: Object,
        default: {}
      },
    },

    data() {
      return {
        currentAISkillData: [],
        previewImage: '',
        activeAISkillName: [],
        AISkillSettings: null,
        noDataVisible: false,
        initNoDataVisible: true,
        updated: false
      }
    },

    watch: {
      cameraDataRow: function (val) {
        if (val) {
          this.AISkillSettings = val['ai_skill_settings'].map(item => {
            const oldAISkillSetting = {}
            oldAISkillSetting.ai_skill_id = item['ai_skill']['ai_skill_id']
            if (item['face_relevance']) {
              oldAISkillSetting.face_relevance = {}
              oldAISkillSetting.face_relevance.similarity = item['face_relevance']['similarity']
              oldAISkillSetting.face_relevance.quality = item['face_relevance']['quality']
              oldAISkillSetting.face_relevance.face_groups_id = item['face_relevance']['face_group'].map(
                item => item['face_group_id']
              )
            }
            oldAISkillSetting.coordinates = JSON.parse(item['coordinates'])
            return oldAISkillSetting
          })
        }
      }
    },

    computed: {
      $_isVisible: {
        get() {
          return this.isVisible
        },
        set() {}
      },
      ...mapState({
        token: state => state.userInfo.token,
        AISkillGroupData: state => state.interface.AISkillGroupData
      }),
      oldAISkillSettings() {
        return this.cameraDataRow['ai_skill_settings']
      }
    },

    methods: {
      getPreviewImage() {
        if (this.cameraDataRow['state'] === 10) {
          this.$message.error('摄像头连接失败')
          this.$emit('update:isVisible', false)
        }
        const cameraID = this.cameraDataRow['camera_id']
        cameraPreviewRequest(cameraID, this.token)
        .then(res => {
          if (!res.code) {
            if (res['data']) {
              this.$emit('update-camera-data', res['data'])
            }
            this.$message.error(res['error_msg'])
          } else {
            this.previewImage = res['data']
          }
        })
        .catch(err => {
          this.$message.error('摄像头连接失败')
        })
      },
      getAISkill(AISkillGroupID) {
        getAISkillRequest({ai_skill_group_id: AISkillGroupID}, this.token)
        .then(res => {
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            if (res['data'].length > 0) {
              this.currentAISkillData = res['data']
              this.noDataVisible = false
            } else {
              this.noDataVisible = true
            }
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      },
      setAISkillSettings(data) {
        cameraSetAISkillSettingsRequest(data, this.token)
        .then(res => {
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            this.$emit('update-camera-data', res['data'])
            this.$emit('update:isVisible', false)
            if (data['ai_skill_settings'].length > 0) {
              this.$message({
                type: 'success',
                message: 'AI技能接口配置成功',
                duration: 1500
              })
            } else {
              this.$message({
                type: 'warning',
                message: 'AI技能接口配置已清空',
                duration: 1500
              })
            }

          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      },
      handleCommand(AISkillGroupID) {
        if (this.initNoDataVisible) {
          this.initNoDataVisible = false
        }
        this.getAISkill(AISkillGroupID)
      },
      handleDeactive(AISkillID) {
        this.activeAISkillName.forEach((item, index, array) => {
          if (item === AISkillID) {
            array.splice(index, 1)
          }
        })
      },
      handleSaveAISkill(AISkillSetting) {
        if (!this.updated) {
          this.updated = true
        }
        const oldAISkillSettingIndex = this.AISkillSettings.findIndex(item => {
          return item['ai_skill_id'] === AISkillSetting['ai_skill_id']
        })
        if (oldAISkillSettingIndex !== -1) {
          this.AISkillSettings.splice(oldAISkillSettingIndex, 1, AISkillSetting)
        } else {
          this.AISkillSettings.push(AISkillSetting)
        }
      },
      handleRemoveAISkill(AISkillID) {
        if (!this.updated) {
          this.updated = true
        }
        this.AISkillSettings.forEach((item, index, array) => {
          if (item['ai_skill_id'] === AISkillID) {
            array.splice(index, 1)
          }
        })
      },
      handleSubmit() {
        if (Object.keys(this.AISkillSettings).length === 0
          && Object.keys(this.cameraDataRow['ai_skill_settings']).length === 0) {
          this.$message.error('请至少为摄像头配置一个AI技能接口')
        } else if (this.updated) {
          const data = {
            camera_id: this.cameraDataRow['camera_id'],
            ai_skill_settings: this.AISkillSettings
          }
          this.setAISkillSettings(data)
        } else {
          this.$emit('update:isVisible', false)
        }
      },
      clearAISkillSetting() {
        const data = {
          camera_id: this.cameraDataRow['camera_id'],
          ai_skill_settings: []
        }
        this.$confirm('将要清空该摄像头的AI接口配置，是否继续', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.setAISkillSettings(data)
          this.$emit('update:isVisible', false)
        })
      },
      handleClose() {
        this.previewImage = ''
        this.currentAISkillData = []
        this.AISkillSettings = []
        this.activeAISkillName = []
        this.noDataVisible = false
        this.updated = false
        this.initNoDataVisible = true
      }
    }
  }
</script>

<style scoped>
  .header-dropdown {
    margin-bottom: 20px;
  }
  .content-ai-skill-no-data {
    margin: 0 360px;
    width: 400px;
    height: 500px;
  }
  .empty-data {
    position: absolute;
    top: 50%;
    margin-top: -110px;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>