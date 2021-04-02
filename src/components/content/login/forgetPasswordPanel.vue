<template>
  <div class="forget-password-main">

    <!-- the forget-password title start -->
    <div class="forget-password-header">
      <div class="title-zh">insight智能监控管理系统</div>
      <div class="title-en">Insight intelligent monitor management system</div>
    </div>
    <!-- the forget-password title end -->

    <!-- the forget-password panel start -->
    <div class="forget-pssword-panel-main">
      <div class="forget-password-panel-form">
        <div class="logo">
          <img src="~assets/img/logo.png" alt="logo">
        </div>
        <div class="forget-password-form">
          <el-form :model="forgetPasswordForm"
                   label-width="100px"
                   ref="forgetPasswordForm"
                   :rules="rules"
                   inline>
            <div class="wrapper">
              <el-form-item label="邮箱"
                            prop="email">
                <div class="email-input">
                  <el-input id="email"
                            ref="email"
                            @keyup.enter.native="$refs.captcha.focus()"
                            v-model="forgetPasswordForm.email"
                            placeholder="请输入您绑定的邮箱"
                            clearable></el-input>
                </div>
              </el-form-item>
              <el-form-item label="验证码"
                            prop="captcha">
                <div class="captcha-input">
                  <el-input id="captcha"
                            ref="captcha"
                            @keyup.enter.native="$refs.newPassword.focus()"
                            v-model="forgetPasswordForm.captcha"
                            placeholder="验证码"
                            clearable></el-input>
                </div>
              </el-form-item>
              <div class="send-captcha-btn">
                <el-button icon="el-icon-message"
                           @click="sendForgetPasswordCaptch"
                           :disabled="Boolean(time)"
                           circle></el-button>
                <span class="timer" :class="{invisible: !time}">{{time}}</span>
              </div>
            </div>
            <div class="wrapper">
              <el-form-item label="设置密码"
                            prop="new_password">
                <div class="new-password-input">
                  <el-input id="new_password"
                            ref="newPassword"
                            @keyup.enter.native="$refs.checkPassword.focus()"
                            v-model="forgetPasswordForm.new_password"
                            placeholder="请输入新的密码"
                            type="password"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="checkPassword">
                <div class="check-password-input">
                  <el-input id="checkPassword"
                            ref="checkPassword"
                            @keyup.enter.native="resetPassword"
                            v-model="forgetPasswordForm.checkPassword"
                            placeholder="请再次输入密码"
                            show-password></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="wrapper">
              <div class="btn-form">
                <el-button class="register-btn"
                           icon="el-icon-check"
                           type="success"
                           @click="resetPassword"
                           circle></el-button>
                <el-button class="return-btn"
                           icon="el-icon-close"
                           type="info"
                           @click="goToLast"
                           circle></el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- the forget-password panel end -->

  </div>
</template>

<script>
  import {hasUser, sendCaptcha} from 'api/utils'
  import isEmail from 'utils/isEmail'
  import {resetPasswordRequest} from "api/account"


  export default {
    name: "forgetPasswordPanel",
    data() {
      let checkEmail = (rule, value, callback) => {
        if(value) {
          const $_isEmail = isEmail(value)
          if($_isEmail.status) {
            hasUser({email: value})
              .then(res => {
                if(res.code && !res.data) {
                  callback(new Error('该邮箱未绑定用户'))
                }
                else {
                  callback()
                }
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '网络异常, 请检查网络状况'
                })
              })
          }
          else {
            callback(new Error($_isEmail.result))
          }
        }
      }
      let validatePass = (rule, value, callback) => {
        if(value) {
          if(this.forgetPasswordForm.checkPassword) {
            this.$refs.forgetPasswordForm.validateField('checkPassword')
          }
          callback()
        }
      }
      let reValidatePass = (rule, value, callback) => {
        if(value) {
          if(value !== this.forgetPasswordForm.new_password) {
            callback(new Error('两次输入密码不一致'))
          }
          callback()
        }
      }
      return {
        rules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '验证码为您邮箱收到的五位数字', trigger: 'blur'}
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
        },
        forgetPasswordForm: {
          email: '',
          captcha: '',
          new_password:'',
          checkPassword: ''
        },
        time: 0,
        counter: null
      }
    },
    mounted() {
      this.$refs.email.focus()
    },
    beforeDestroy() {
      clearInterval(this.counter)
    },
    methods: {
      goToLast() {
        for (let key of Object.keys(this.forgetPasswordForm)) {
          this.forgetPasswordForm[key] = ''
        }
        this.$router.go(-1)
      },
      sendForgetPasswordCaptch() {
        this.$refs.forgetPasswordForm.validate((valid, obj) => {
          if(!obj.hasOwnProperty('email')) {
            sendCaptcha({email: this.forgetPasswordForm.email, flag: 'forget'})
              .then(res => {
                if(!res.code) {
                  this.$message({
                    type: 'error',
                    message: res['error_msg']
                  })
                }
                else {
                  this.time = 60
                  if (this.counter) {
                    clearInterval(this.counter)
                  }
                  this.counter = setInterval(() => {
                    if(this.time !== 0) {
                      this.time -= 1
                    }
                  }, 1000)
                }
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '网络异常，请检查网络状况'
                })
              })
          }
        })
      },
      resetPassword() {
        this.$refs.forgetPasswordForm.validate(valid => {
          if(valid) {
            resetPasswordRequest(this.forgetPasswordForm)
              .then(res => {
                if(res.code) {
                  this.$message({
                    type: 'success',
                    message: '找回密码成功, 为您跳转到登陆页面'
                  })
                  return this.$router.replace({name: 'login'})
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res['error_msg']
                  })
                }
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  type: 'error',
                  message: '网路异常，请您检查网络状况'
                })
              })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .forget-password-main {
    width: 888px
  }

  .forget-password-header {
    margin: 0 auto;
    width: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .title-zh {
    margin-bottom: 5px;
    color: #fff;
    font-size: 30px;
    text-align: center
  }

  .title-en {
    color: #fff;
    font-size: 13px;
    text-align: center
  }

  .forget-pssword-panel-main {
    position: relative;
    margin-top: 50px;
    width: 100%;
    height: 465px;
    background-color: #FFFFFF
  }

  .logo img {
    display: block;
    margin: 0 auto;
    width: 30%
  }

  .logo {
    position: relative;
    top: 50px
  }

  .forget-password-form {
    margin: 110px auto auto;
    width: 750px
  }

  .email-input,
  .new-password-input,
  .check-password-input {
    width: 250px
  }

  .captcha-input {
    width: 150px
  }

  .send-captcha-btn {
    float: right;
    margin-right: 60px
  }

  .timer {
    margin-left: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .invisible {
    display: none
  }

  .wrapper {
    margin-bottom: 30px
  }

  .btn-form {
    margin: 0 auto auto 320px
  }

  .return-btn {
    margin-left: 30px
  }
</style>