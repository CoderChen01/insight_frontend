<template>
  <div class="create-camera-group">
    <el-dialog title="创建摄像头分组"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               :close-on-click-modal="false"
               @close="handleClose"
               @opened="$refs.name.focus()">
      <el-form :model="createCameraGroupForm"
               :rules="rules"
               ref="createCameraGroupForm"
               class="create-camera-group-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="createCameraGroupForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入分组名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组描述"
                        prop="description">
            <el-input v-model="createCameraGroupForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      placeholder="请输入分组描述"
                      show-word-limit
                      :autosize="{minRows: 3}"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组ID"
                        prop="camera_group_id">
            <el-input v-model="createCameraGroupForm.camera_group_id"
                      id="camera_group_id"
                      placeholder="请输入分组唯一标识ID"
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
                     @click="handleClose"
                     circle></el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {
    createCameraGroupRequest,
    hasCameraGroupID
  } from 'api/cameraManagement'
  import {CREATE_CAMERAGROUP_DATA} from 'store/mutationTypes'
  import {isID} from 'utils/isID'
  
  
  export default {
    name: "createCameraGroup",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      let IDValidator = (rule, value, callback) => {
        if (value) {
          if (isID(value)) {
            hasCameraGroupID({camera_group_id: value}, this.token)
              .then(res => {
                if (res.code) {
                  if (res.data) {
                    callback(new Error('该摄像头分组ID已存在'))
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
      return {
        createCameraGroupForm: {
          name: '',
          description: '',
          camera_group_id: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'},
            {max: 30, message: '分组名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '分组描述不能超过300个字符', trigger: 'blur'}
          ],
          camera_group_id: [
            {required: true, message: '请输入分组ID', trigger: 'blur'},
            {validator: IDValidator, trigger: 'blur'}
          ]
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
        token: state => state.userInfo.token
      })
    },
    methods: {
      createCameraGroup() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        createCameraGroupRequest(this.createCameraGroupForm, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(CREATE_CAMERAGROUP_DATA, res.data)
              this.handleClose()
              this.$message({
                type: 'success',
                message: '创建成功',
                duration: 1500
              })
            }
          })
          .catch(err => {
            loading.close()
            this.$message({
              type: 'error',
              message: '网络异常，请检查网络状况'
            })
          })
      },
      handleSubmit() {
        this.$refs.createCameraGroupForm.validate(valid => {
          if (valid) {
            this.createCameraGroup()
          }
        })
      },
      handleClose() {
        for (let key of Object.keys(this.createCameraGroupForm)) {
          this.createCameraGroupForm[key] = ''
        }
        this.$emit('update:isVisible', false)
      },
    }
  }
</script>

<style scoped>
  .create-camera-group-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>