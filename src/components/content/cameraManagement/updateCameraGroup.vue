<template>
  <div class="update-camera-group">
    <el-dialog title="修改摄像头分组"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose(updated)"
               @open="updated = false"
               @opened="$refs.name.focus()">
      <el-form :model="updateCameraGroupForm"
               :rules="rules"
               ref="updateCameraGroupForm"
               @submit.native.prevent
               class="update-camera-group-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="updateCameraGroupForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入分组名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组描述"
                        prop="description">
            <el-input v-model="updateCameraGroupForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      show-word-limit
                      placeholder="请输入分组描述"
                      :autosize="{minRows: 3}"
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

  import {updateCameraGroupRequest} from 'api/cameraManagement'
  import {UPDATE_CAMERAGROUP_DATA} from 'store/mutationTypes'
  
  
  export default {
    name: "updateCameraGroup",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      cameraGroupDataRow: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        updateCameraGroupForm: {
          name: '',
          description: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'},
            {max: 30, message: '分组名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '分组描述不能超过300个字符', trigger: 'blur'}
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
      cameraGroupDataRow: function (val) {
        this.updateCameraGroupForm.name = val.name
        this.updateCameraGroupForm.description = val.description
      }
    },
    methods: {
      updateCameraGroup() {
        let requestData = {}
        for (let key of Object.keys(this.updateCameraGroupForm)) {
          if (this.updateCameraGroupForm[key] !== this.cameraGroupDataRow[key]) {
            requestData[key] = this.updateCameraGroupForm[key]
          }
        }
        requestData['camera_group_id'] = this.cameraGroupDataRow.camera_group_id
        if (Object.keys(requestData).length > 1) {
          const loading = this.$loading({
            lock: true,
            text: '修改中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.8)'
          })
          updateCameraGroupRequest(requestData, this.token)
            .then(res => {
              loading.close()
              if (!res.code) {
                this.$message({
                  type: 'error',
                  message: res['error_msg']
                })
              } else {
                this.$store.commit(UPDATE_CAMERAGROUP_DATA, res.data)
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
        this.$refs.updateCameraGroupForm.validate(valid => {
          if (valid) {
            this.updateCameraGroup()
          }
        })
      },
      handleClose(updated) {
        if (!updated) {
          this.updateCameraGroupForm.name = this.cameraGroupDataRow.name
          this.updateCameraGroupForm.description = this.cameraGroupDataRow.description
        }
        this.$emit('update:isVisible', false)
      },
    }
  }
</script>

<style scoped>
  .update-camera-group-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>