<template>
  <div class="update-camera">
    <el-dialog title="修改摄像头基本信息"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose(updated)"
               @open="updated = false"
               @opened="$refs.name.focus()">
      <el-form :model="updateCameraForm"
               :rules="rules"
               ref="updateCameraForm"
               @submit.native.prevent
               class="update-camera-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="updateCameraForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入摄像头名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="摄像头描述"
                        prop="description">
            <el-input v-model="updateCameraForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      show-word-limit
                      placeholder="请输入摄像头描述"
                      :autosize="{minRows: 3}"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="摄像头URL"
                        prop="camera_url">
            <el-input v-model="updateCameraForm.camera_url"
                      id="camera_url"
                      placeholder="请输入摄像头URL"
                      type="url"
                      @keyup.enter.native="handleSubmit"
                      clearable></el-input>
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
  import {mapState} from 'vuex'

  import {isURL} from 'utils/isURL'
  import {updateCameraRequest} from 'api/cameraManagement'
  
  
  export default {
    name: "updateCamera",
    
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
        updateCameraForm: {
          name: '',
          description: '',
          camera_url: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入摄像头名称', trigger: 'blur'},
            {max: 30, message: '摄像头名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '摄像头描述不能超过300个字符', trigger: 'blur'}
          ],
          camera_url: [
            {required: true, message: '请输入摄像头URL', trigger: 'blur'},
            {validator: URLValidator, trigger: 'blur'}
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
        this.updateCameraForm.name = val.name
        this.updateCameraForm.description = val.description
        this.updateCameraForm.camera_url = val.camera_url
      }
    },
    
    methods: {
      updateCamera() {
        let requestData = {}

        for (let key of Object.keys(this.updateCameraForm)) {
          if (this.updateCameraForm[key] !== this.cameraDataRow[key]) {
            requestData[key] = this.updateCameraForm[key]
          }
        }

        requestData['camera_id'] = this.cameraDataRow.camera_id
        if (Object.keys(requestData).length > 1) {
          const loading = this.$loading({
            lock: true,
            text: '修改中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.8)'
          })
          updateCameraRequest(requestData, this.token)
            .then(res => {
              loading.close()
              if (!res.code) {
                this.$message({
                  type: 'error',
                  message: res['error_msg']
                })
              } else {
                this.$emit('update-camera-data', res.data)
                this.updated = true
                this.$emit('update:isVisible', false)
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  duration: 1500
                })
              }
            })
            .catch(err => {
              loading.close()
              console.log(err);
              this.$message({
                type: 'error',
                message: '网络异常，请检查网络状况'
              })
            })
        } else {
          this.$emit('update:isVisible', false)
        }
      },
      handleSubmit() {
        this.$refs.updateCameraForm.validate(valid => {
          if (valid) {
            this.updateCamera()
          }
        })
      },
      handleClose(updated) {
        if (!updated) {
          this.updateCameraForm.name = this.cameraDataRow.name
          this.updateCameraForm.description = this.cameraDataRow.description
          this.updateCameraForm.camera_url = this.cameraDataRow.camera_url
        }
      }
    }
  }
</script>

<style scoped>
  .update-camera-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>