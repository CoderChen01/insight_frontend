<template>
  <div class="create-face-group">
    <el-dialog title="创建人脸库"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.name.focus()">
      <el-form :model="createFaceGroupForm"
               :rules="rules"
               ref="createFaceGroupForm"
               class="create-face-group-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="createFaceGroupForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入分组名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组描述"
                        prop="description">
            <el-input v-model="createFaceGroupForm.description"
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
                        prop="face_group_id">
            <el-input v-model="createFaceGroupForm.face_group_id"
                      id="face_group_id"
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
                     @click="$emit('update:isVisible', false)"
                     circle></el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {
    createFaceGroupRequest,
    hasFaceGroupID
  } from 'api/faceManagement'
  import {CREATE_FACEGROUP_DATA} from 'store/mutationTypes'
  import {isID} from 'utils/isID'
  
  export default {
    name: "createFaceGroup",
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
            hasFaceGroupID({face_group_id: value}, this.token)
              .then(res => {
                if (res.code) {
                  if (res.data) {
                    callback(new Error('该人脸库ID已存在'))
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
        createFaceGroupForm: {
          name: '',
          description: '',
          face_group_id: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'},
            {max: 30, message: '分组名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '分组描述不能超过300个字符', trigger: 'blur'}
          ],
          face_group_id: [
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
      createFaceGroup() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        createFaceGroupRequest(this.createFaceGroupForm, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(CREATE_FACEGROUP_DATA, res.data)
              this.$emit('update:isVisible', false)
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
        this.$refs.createFaceGroupForm.validate(valid => {
          if (valid) {
            this.createFaceGroup()
          }
        })
      },
      handleClose() {
        for (let key of Object.keys(this.createFaceGroupForm)) {
          this.createFaceGroupForm[key] = ''
        }
      },
    }
  }
</script>

<style scoped>
  .create-face-group-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>
