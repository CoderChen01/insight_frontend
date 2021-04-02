<template>
  <div class="change-password">
    <el-dialog title="修改密码"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.password.focus()">
      <el-form :model="changePasswordForm"
               :rules="rules"
               ref="changePasswordForm"
               class="change-password-form">
        <div class="wrapper">
          <el-form-item label="原密码"
                        prop="password">
            <el-input v-model="changePasswordForm.password"
                      id="password"
                      ref="password"
                      @keyup.enter.native="$refs.newPassword.focus()"
                      placeholder="请输入原密码"
                      type="password"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码"
                        prop="new_password">
            <el-input v-model="changePasswordForm.new_password"
                      id="new_password"
                      ref="newPassword"
                      @keyup.enter.native="$refs.checkPassword.focus()"
                      placeholder="请输入新密码"
                      type="password"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="checkPassword">
            <el-input v-model="changePasswordForm.checkPassword"
                      id="checkPassword"
                      ref="checkPassword"
                      placeholder="请再次输入新密码"
                      type="password"
                      @keyup.enter.native="handleSubmit"
                      show-password></el-input>
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
  import {changePasswordRequest} from 'api/account'

  export default {
    name: "changePassword",
    data() {
      let validatePass = (rule, value, callback) => {
        if(value) {
          if(this.changePasswordForm.checkPassword) {
            this.$refs.changePasswordForm.validateField('checkPassword')
          }
          callback()
        }
      }
      let reValidatePass = (rule, value, callback) => {
        if(value) {
          if(value !== this.changePasswordForm.new_password) {
            callback(new Error('两次输入密码不一致'))
          }
          callback()
        }
      }
      return {
        changePasswordForm: {
          password: '',
          new_password: '',
          checkPassword: ''
        },
        rules: {
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符', trigger: 'blur'}
          ],
          new_password: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符'}
          ],
          checkPassword: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: reValidatePass, trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      $_isVisible: {
        get() {
          return this.isVisible
        },
        set() {}
      }
    },
    methods: {
      changePassword() {
        this.changePasswordForm.username = this.$store.state.userInfo.username
        let token = this.$store.state.userInfo.token
        changePasswordRequest(this.changePasswordForm, token)
          .then(res => {
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$message({
                type: 'success',
                message: '密码修改成功，返回登录页面...'
              })
              localStorage.removeItem('userInfo')
              return this.$router.replace({name: 'login'})
            }
          })
          .catch(err => {
            console.log(err);
            this.$message({
              type: 'error',
              message: '网络异常，请检查网络状况'
            })
          })
      },
      handleSubmit() {
        this.$refs.changePasswordForm.validate(valid => {
          if (valid) {
            this.changePassword()
          }
        })
      },
      handleClose() {
        this.changePasswordForm.new_password = ''
        this.changePasswordForm.password = ''
        this.changePasswordForm.checkPassword = ''
      }
    }
  }
</script>

<style scoped>
  .change-password-form {
    margin: 0 auto;
    width: 78%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>