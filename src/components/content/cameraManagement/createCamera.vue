<template>
  <div class="create-camera-root">
    <el-dialog :title="createCameraTitle"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               :close-on-click-modal="false"
               @close="handleClose"
               @open="createCameraFormVisible = true"
               @opened="$refs.name.focus()">
      <div class="create-camera" v-show="createCameraFormVisible">
        <el-form :model="createCameraForm"
                 :rules="createCameraFormRules"
                 ref="createCameraForm"
                 class="create-camera-form">
          <div class="wrapper">
            <el-form-item label="名称"
                          prop="name">
              <el-input v-model="createCameraForm.name"
                        id="name"
                        ref="name"
                        @keyup.enter.native="$refs.description.focus()"
                        placeholder="请输入摄像头名称"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头描述"
                          prop="description">
              <el-input v-model="createCameraForm.description"
                        id="description"
                        ref="description"
                        type="textarea"
                        maxlength="300"
                        placeholder="请输入摄像头描述"
                        show-word-limit
                        :autosize="{minRows: 3}"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头ID"
                          prop="camera_id">
              <el-input v-model="createCameraForm.camera_id"
                        id="camera_id"
                        ref="cameraID"
                        placeholder="请输入摄像头唯一标识ID"
                        @keyup.enter.native="$refs.cameraURL.focus()"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头URL"
                          prop="camera_url">
              <el-input v-model="createCameraForm.camera_url"
                        id="camera_url"
                        ref="cameraURL"
                        placeholder="请输入摄像头URL"
                        type="url"
                        @keyup.enter.native="handleSubmit"
                        clearable></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="camera-preview" v-if="cameraPreviewVisible">
        <div class="image-loading" v-if="!previewImageURL">
          <i class="el-icon-loading"></i>
        </div>
        <el-image
          v-if="previewImageURL"
          style="width: 100%"
          :src="previewImageURL"
          fit="contain">
        </el-image>
      </div>
      <div class="set-extraction" v-show="setExtractionFormVisible">
        <el-form :model="setExtractionForm"
                 :rules="setExtractionFormRules"
                 ref="setExtractionForm"
                 class="set-extraction-form">
          <div class="wrapper">
            <el-form-item label="抽帧频率">
              <el-radio-group v-model="setExtractionForm.frequency" style="line-height: unset">
                <el-radio
                  v-for="item in frequencyChoices"
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
                     @click="handleClose"
                     circle></el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {isID} from 'utils/isID'
  import {
    createCameraRequest,
    hasCameraID,
    cameraPreviewRequest,
    cameraSetExtractionSettingsRequest
  } from 'api/cameraManagement'


  export default {
    name: "createCamera",

    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      cameraGroupID: {
        type: String,
        required: true
      }
    },

    data() {
      let IDValidator = (rule, value, callback) => {
        if (value) {
          if (isID(value)) {
            hasCameraID({camera_id: value}, this.token)
              .then(res => {
                if (res.code) {
                  if (res.data) {
                    callback(new Error('该摄像头ID已存在'))
                  } else {
                    callback()
                  }
                }
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '网络异常，请检查网络状况'
                })
              })
          }else {
            callback(new Error('ID格式不合法，为6-20位字母、数字或下划线'))
          }
        }
      }
      let URLValidator = (rule, value, callback) => {
        if (value) {
          if (value.indexOf('rtsp://') === -1
              && value.indexOf('rtmp://') === -1) {
            callback(new Error('视频流地址不合法，支持RTSP或RTMP'))
          } else {
            callback()
          }
        }
      }
      return {
        createCameraForm: {
          name: '',
          description: '',
          camera_id: '',
          camera_url: ''
        },
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
        createCameraFormRules: {
          name: [
            {required: true, message: '请输入摄像头名称', trigger: 'blur'},
            {max: 30, message: '摄像头名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '摄像头描述不能超过300个字符', trigger: 'blur'}
          ],
          camera_id: [
            {required: true, message: '请输入摄像头ID', trigger: 'blur'},
            {validator: IDValidator, trigger: 'blur'}
          ],
          camera_url: [
            {required: true, message: '请输入摄像头URL', trigger: 'blur'},
            {validator: URLValidator, trigger: 'blur'}
          ]
        },
        setExtractionFormRules: {
          start_time: [
            {required: true, message: '开始时间是必须的', trigger: 'change'}
          ],
          end_time: [
            {required: true, message: '结束时间是必须的', trigger: 'change'}
          ]
        },
        previewImageURL: '',
        createCameraFormVisible: true,
        setExtractionFormVisible: false,
        cameraPreviewVisible: false,
        createCameraTitle: '创建摄像头'
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

    methods: {
      createCamera() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        this.createCameraForm.camera_group_id = this.cameraGroupID
        createCameraRequest(this.createCameraForm, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$emit('create-camera-data', res.data)

              this.$message({
                type: 'success',
                message: '摄像头创建成功',
                duration: 1500
              })

              this.createCameraFormVisible = false
              this.cameraPreviewVisible = true
              this.createCameraTitle = '摄像头预览'
              this.getCameraPreview(this.createCameraForm['camera_id'])
            }
          })
          .catch(err => {
            loading.close()
            this.$message.error('网络异常，请检查网络状况')
          })
      },
      getCameraPreview(camera_id) {
        cameraPreviewRequest(camera_id, this.token)
        .then(res => {
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            this.previewImageURL = `data:image/png;base64,${res['data']}`
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      },
      setExtraction() {
        const loading = this.$loading({
          lock: true,
          text: '配置抽帧中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        cameraSetExtractionSettingsRequest({
          camera_id: this.createCameraForm.camera_id,
          ...this.setExtractionForm
        }, this.token)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            this.$emit('update-camera-data', res['data'])
            this.$emit('update:isVisible', false)
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
        if (this.createCameraFormVisible) {
          this.$refs.createCameraForm.validate(valid => {
            if (valid) {
              this.createCamera()
            }
          })
        } else if (this.cameraPreviewVisible) {
          this.cameraPreviewVisible = false
          this.setExtractionFormVisible = true
          this.createCameraTitle = '抽帧设置'
        } else if (this.setExtractionFormVisible) {
          this.$refs.setExtractionForm.validate(valid => {
            if (valid) {
              this.setExtraction()
            }
          })
        }
      },
      handleClose() {
        this.$emit('update:isVisible', false)
        for (let key of Object.keys(this.createCameraForm)) {
          this.createCameraForm[key] = ''
        }
        for (let key of Object.keys(this.setExtractionForm)) {
          this.setExtractionForm[key] = ''
        }
        this.setExtractionFormVisible = false
        this.cameraPreviewVisible = false
        this.previewImageURL = ''
      }
    }
  }
</script>

<style scoped>
  .create-camera-form,
  .set-extraction-form{
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
  .image-loading {
    width: 100%;
    height: 220px;
    text-align: center;
    line-height: 220px;
    font-size: 30px;
  }
</style>
