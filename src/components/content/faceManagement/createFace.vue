<template>
  <div class="create-face">
    <el-dialog title="添加人脸"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.name.focus()">
      <el-form :model="createFaceForm"
               :rules="rules"
               ref="createFaceForm"
               class="create-face-form">
        <div class="wrapper">
          <el-form-item label="姓名"
                        prop="name">
            <el-input v-model="createFaceForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.faceID.focus()"
                      placeholder="请输入用户姓名"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="人脸ID"
                        prop="face_id">
            <el-input v-model="createFaceForm.face_id"
                      id="face_id"
                      ref="faceID"
                      placeholder="请输入人脸唯一标识ID"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="人脸图片"
                        prop="face_image">
            <div class="face-image-uploader">
              <el-upload
                action="#"
                :show-file-list="false"
                :before-upload="handleUpload">
                <div class="uploader-text">
                  <img v-if="imageURL"
                       :src="imageURL"
                       class="face-image"
                       alt="face-image">
                  <i v-else class="el-icon-plus face-image-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
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

  import {isID} from 'utils/isID'
  import {
    createFaceRequest,
    hasFaceID
  } from 'api/faceManagement'
  import {getBase64Image} from 'utils/getBase64Image'


  export default {
    name: "createFace",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      faceGroupID: {
        type: String,
        required: true
      }
    },
    data() {
      let IDValidator = (rule, value, callback) => {
        if (value) {
          if (isID(value)) {
            hasFaceID({face_id: value}, this.token)
              .then(res => {
                if (res.code) {
                  if (res.data) {
                    callback(new Error('该人脸ID已存在'))
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
        createFaceForm: {
          name: '',
          face_id: '',
          face_image: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {max: 30, message: '姓名不能超过30个字符', trigger: 'blur'}
          ],
          face_id: [
            {required: true, message: '请输入人脸ID', trigger: 'blur'},
            {validator: IDValidator, trigger: 'blur'}
          ],
          face_image: [
            {required: true, message: '请上传人脸图片', trigger: 'change'}
          ]
        },
        imageURL: ''
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
      createFace() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        this.createFaceForm.face_group_id = this.faceGroupID
        createFaceRequest(this.createFaceForm, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$emit('create-face-data', res.data)
              this.$message({
                type: 'success',
                message: '创建成功',
                duration: 1500
              })
              this.$emit('update:isVisible', false)
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
        this.$refs.createFaceForm.validate(valid => {
          if (valid) {
            this.createFace()
          }
        })
      },
      handleClose() {
        for (let key of Object.keys(this.createFaceForm)) {
          this.createFaceForm[key] = ''
        }
        this.imageURL = ''
      },
      handleUpload(rawFile) {
        const allowTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png'
        ]
        const isLt2M = rawFile.size / 1024 / 1024 < 2;
        const isAllow = allowTypes.find(item => {
          return item === rawFile.type
        })
        if (!(isLt2M && isAllow)) {
          this.$message.error('请传入有效的人脸图片')
          return false
        }
        getBase64Image(rawFile)
        .then(res => {
          this.imageURL = res
          this.createFaceForm.face_image = res.substring(
            res.indexOf('base64,') + 7
          )
        })
        return false
      }
    }
  }
</script>

<style scoped>
  .create-face-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
  .face-image-uploader>>>.el-upload {
    margin: 0 15px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .face-image-uploader>>>.el-upload:hover {
    border-color: #409EFF;
  }
  .face-image-uploader-icon {
    font-size: 35px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .face-image {
    width: 300px;
    display: block;
  }
  .face-image-uploader {
    margin-top: 40px;
  }

</style>