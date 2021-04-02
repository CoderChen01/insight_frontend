<template>
  <el-collapse-item :name="AISkill['ai_skill_id']">
    <template v-slot:title>
      <el-checkbox :value="selectedAISkill"
                   @click.prevent.native="handleRemove">
        {{ AISkill['name'] }}
      </el-checkbox>
    </template>
    <div class="ai-skill-setting-main">
      <div class="preview-area-selection-util">
        <div style="margin-bottom: 20px">分析区域划分(默认全图)</div>
        <template v-if="previewImage">
          <analysis-area-selection-util :b64Image="previewImage"
                                        :oldCoordinates="oldCoordinates"
                                        @initCoordinates="coordinates = $event"
                                        @coordinates="handleCoordinates"></analysis-area-selection-util>
        </template>
        <template v-else>
          <div class="preview-loading">
            <i class="el-icon-loading"></i>
          </div>
        </template>
      </div>
      <div class="face-relevance">
        <div class="face-switch">
          <span style="margin-right: 20px">是否关联人脸</span>
          <span>
            <el-switch v-model="hasFace"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="faceSettingVisible = !faceSettingVisible">
            </el-switch>
          </span>
        </div>
        <div class="face-setting"
             v-show="faceSettingVisible">
          <div class="face-select">
            <span style="margin-right: 20px">人脸库选择</span>
            <el-select v-model="faceRelevance.face_groups_id"
                       placeholder="请选择人脸库"
                       multiple>
              <el-option
                v-for="faceGroup in faceGroupData"
                :key="faceGroup['face_group_id']"
                :label="faceGroup['name']"
                :value="faceGroup['face_group_id']">
              </el-option>
            </el-select>
          </div>
          <div class="similarity-slider">
            <span>相似度阈值</span>
            <el-slider v-model="faceRelevanceSimilarity"
                       @input="faceRelevance.similarity = $event / 100"
                       style="width: 500px"
                       :format-tooltip="formatTooltip"></el-slider>
          </div>
          <div class="quality-selection">
            <span style="margin-right: 20px">人脸质量要求</span>
            <el-radio-group v-model="faceRelevance.quality">
              <el-radio v-for="qualityRadio in qualityData"
                        :key="qualityRadio['label']"
                        :label="qualityRadio['label']">
                {{ qualityRadio['helpText'] }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="save-cancel-btn">
        <el-button
          @click="handleSave"
          type="primary">保存并收起
        </el-button>
        <el-button
          @click="handleCancel">取消</el-button>
      </div>
    </div>
  </el-collapse-item>
</template>

<script>
  import {mapState} from 'vuex'

  import analysisAreaSelectionUtil from 'components/common/analysisAreaSelectionUtil'


  export default {
    name: "AISkillSetting",

    components: {
      analysisAreaSelectionUtil
    },

    props: {
      AISkill: {
        type: Object,
        required: true
      },
      previewImage: {
        type: String,
        required: true
      },
      oldAISkillSettings: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        hasFace: false,
        faceSettingVisible: false,
        selectedAISkill: false,
        qualityData: [
          {
            label: 0,
            helpText: '无'
          },
          {
            label: 1,
            helpText: '低'
          },
          {
            label: 2,
            helpText: '中'
          },
          {
            label: 3,
            helpText: '高'
          }
        ],
        faceRelevanceSimilarity: 80,
        faceRelevance: {
          face_groups_id: [],
          similarity: 0.80,
          quality: 2
        },
        coordinates: null,
        AISkillSetting: null,
        oldCoordinates: {}
      }
    },

    computed: {
      ...mapState({
        faceGroupData: state => state.face.faceGroupData
      })
    },

    created() {
      if (this.oldAISkillSettings.length > 0) {
        this.oldAISkillSettings.forEach(item => {
          if (item['ai_skill']['ai_skill_id'] === this.AISkill['ai_skill_id']) {
            this.selectedAISkill = true
            if (item['face_relevance']) {
              this.hasFace = true
              this.faceSettingVisible = true
              this.faceRelevanceSimilarity = item['face_relevance']['similarity'] * 100
              this.faceRelevance.similarity = item['face_relevance']['similarity']
              this.faceRelevance.quality = item['face_relevance']['quality']
              this.faceRelevance.face_groups_id = item['face_relevance']['face_group'].map(
                item => item['face_group_id']
              )
            }
            this.oldCoordinates = JSON.parse(item['coordinates'])
            this.coordinates = Object.assign({}, this.coordinates, this.oldCoordinates)
          }
        })
      }
    },

    methods: {
      handleCoordinates(coordinates) {
        this.coordinates = coordinates
      },
      handleSave() {
        this.AISkillSetting = {
          ai_skill_id: this.AISkill['ai_skill_id'],
          coordinates: this.coordinates
        }
        if (this.hasFace) {
          this.AISkillSetting['face_relevance'] = this.faceRelevance
          if (this.faceRelevance['face_groups_id'].length === 0) {
            this.$message.error('请选择人脸分组')
          } else {
            this.selectedAISkill = true
            this.$emit('deactiveCollapse', this.AISkill['ai_skill_id'])
            this.$emit('saveAISkill', this.AISkillSetting)
          }
        } else {
          this.selectedAISkill = true
          this.$emit('deactiveCollapse', this.AISkill['ai_skill_id'])
          this.$emit('saveAISkill', this.AISkillSetting)
        }
      },
      handleRemove() {
        this.selectedAISkill = false
        this.$emit('removeAISkill', this.AISkill['ai_skill_id'])
      },
      handleCancel() {
        this.$emit('deactiveCollapse', this.AISkill['ai_skill_id'])
      },
      formatTooltip(value) {
        return value / 100
      }
    }
  }
</script>

<style scoped>
  .preview-area-selection-util {
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .face-switch {
    margin-bottom: 20px;
  }
  .face-select {
    margin-bottom: 20px;
  }
  .similarity-slider {
    margin-bottom: 20px;
  }
  .preview-loading {
    width: 700px;
    height: 400px;
    text-align: center;
    line-height: 400px;
    font-size: 30px;
  }
  .save-cancel-btn {
    margin-top: 30px;
  }
</style>