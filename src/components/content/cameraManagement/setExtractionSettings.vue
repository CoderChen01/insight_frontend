<template>
  <div class="set-extraction-root">
    <el-dialog title="配置抽帧信息"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               :close-on-click-modal="false"
               @closed="handleClose(updated)"
               @close="$emit('update:isVisible', false)"
               @open="updated = false">
      <el-form :model="setExtractionForm"
               :rules="setExtractionFormRules"
               ref="setExtractionForm"
               class="set-extraction-form">
        <div class="wrapper">
          <el-form-item label="抽帧频率">
            <el-radio-group v-model="setExtractionForm.frequency" style="line-height: unset">
              <el-radio
                v-for="item in frequencyChoices"
                :key="item['frequency']"
                :label="item['frequency']">{{ item['helpText'] }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="start_time">
            <el-time-picker
              placeholder="开始时间"
              value-format="HH:mm"
              format="HH:mm"
              v-model="setExtractionForm.start_time"
              :picker-options="{
                  selectableRange: '00:00:00 - 23:59:00'
                }"></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="end_time">
            <el-time-picker
              placeholder="结束时间"
              value-format="HH:mm"
              format="HH:mm"
              v-model="setExtractionForm.end_time"
              :picker-options="{
                  selectableRange: '00:00:00 - 23:59:00'
                }"></el-time-picker>
          </el-form-item>
        </div>
      </el-form>
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
  import {mapState} from "vuex"
  import {cameraSetExtractionSettingsRequest} from 'api/cameraManagement'

  export default {
    name: "setExtractionSettings",

    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      cameraDataRow: {
        type: Object,
        default: {}
      }
    },

    data() {
      return {
        setExtractionForm: {
          frequency: 1,
          start_time: '',
          end_time: ''
        },
        frequencyChoices: [
          {
            helpText: '每1秒1张图片(推荐)',
            frequency: 1
          },
          {
            helpText: '每2秒1张图片',
            frequency: 2
          },
          {
            helpText: '每3秒1张图片',
            frequency: 3
          }
        ],
        setExtractionFormRules: {
          start_time: [
            {required: true, message: '开始时间是必须的', trigger: 'change'}
          ],
          end_time: [
            {required: true, message: '结束时间是必须的', trigger: 'change'}
          ]
        },
        updated: false
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
        token: state => state.userInfo.token
      })
    },

    watch: {
      cameraDataRow: function (val) {
        if (val['extraction_settings']) {
          this.setExtractionForm.frequency = val['extraction_settings'].frequency
          this.setExtractionForm.start_time = val['extraction_settings'].start_time
          this.setExtractionForm.end_time = val['extraction_settings'].end_time
        } else {
          this.setExtractionForm.frequency = 1
          this.setExtractionForm.start_time = ''
          this.setExtractionForm.end_time = ''
        }
      }
    },

    methods: {
      setExtraction() {
        const loading = this.$loading({
          lock: true,
          text: '配置抽帧中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        cameraSetExtractionSettingsRequest({
          camera_id: this.cameraDataRow['camera_id'],
          ...this.setExtractionForm
        }, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message.error(res['error_msg'])
            } else {
              this.$emit('update-camera-data', res['data'])
              this.$emit('update:isVisible', false)
              this.updated = true
              this.$message({
                type: 'success',
                message: '抽帧设置成功',
                duration: 1500
              })
            }
          })
          .catch(err => {
            loading.close()
            this.$message.error('网络异常，请检查网络状况')
          })
      },
      handleSubmit() {
        this.$refs.setExtractionForm.validate(valid => {
          if (valid) {
            let flag = false
            if (this.cameraDataRow['extraction_settings']) {
              for (let key of Object.keys(this.setExtractionForm)) {
                if (this.setExtractionForm[key] !== this.cameraDataRow['extraction_settings'][key]) {
                  flag = true
                }
              }
            }
            if (flag) {
              this.setExtraction()
            } else {
              this.$emit('update:isVisible', false)
            }
          }
        })
      },
      handleClose(updated) {
        if (!updated) {
          if (this.cameraDataRow['extraction_settings']) {
            this.setExtractionForm.frequency = this.cameraDataRow['extraction_settings']['frequency']
            this.setExtractionForm.start_time = this.cameraDataRow['extraction_settings']['start_time']
            this.setExtractionForm.end_time = this.cameraDataRow['extraction_settings']['end_time']
          } else {
            this.setExtractionForm.frequency = 1
            this.setExtractionForm.start_time = ''
            this.setExtractionForm.end_time = ''
          }
        }
      }
    }
  }
</script>

<style scoped>
  .set-extraction-form{
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>