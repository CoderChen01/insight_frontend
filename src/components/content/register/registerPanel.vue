<template>
  <div class="register-main">
    <!-- the register title start -->
    <div class="register-header">
      <div class="title-zh">insight智能监控管理系统</div>
      <div class="title-en">Insight intelligent monitor management system</div>
    </div>
    <!-- the register title end -->

    <!-- the register panel start -->
    <div class="register-panel-main">
      <div class="logo">
        <img src="~assets/img/logo.png" alt="logo">
      </div>
      <div class="register-panel-form">
        <!-- form start -->
        <el-form :rules="rules"
                 ref="registerForm"
                 label-width="100px"
                 inline
                 :model="registerForm">
          <div class="wrapper">
            <el-form-item label="用户名" prop="username">
              <div class="com-input">
                <el-input id="username"
                          ref="username"
                          v-model="registerForm.username"
                          @keyup.enter.native="$refs.nickname.focus()"
                          placeholder="用户名"
                          clearable></el-input>
              </div>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <div class="com-input">
                <el-input id="nickname"
                          v-model="registerForm.nickname"
                          ref="nickname"
                          @keyup.enter.native="$refs.password.focus()"
                          placeholder="昵称"
                          clearable></el-input>
              </div>
            </el-form-item>
          </div>
          <div class="wrapper">
            <el-form-item label="密码" prop="password">
              <div class="com-input">
                <el-input id="password"
                          type="password"
                          ref="password"
                          @keyup.enter.native="$refs.checkPassword.focus()"
                          v-model="registerForm.password"
                          placeholder="密码"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <div class="com-input">
                <el-input id="checkPassword"
                          ref="checkPassword"
                          @keyup.enter.native="$refs.email.focus()"
                          v-model="registerForm.checkPassword"
                          placeholder="请再次输入密码"
                          show-password></el-input>
              </div>
            </el-form-item>
          </div>
          <div class="wrapper">
            <el-form-item label="邮箱" prop="email">
              <div class="com-input">
                <el-input id="email"
                          v-model="registerForm.email"
                          ref="email"
                          @keyup.enter.native="$refs.captcha.focus()"
                          placeholder="邮箱"
                          clearable></el-input>
              </div>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <div class="captcha-input">
                <el-input id="captcha"
                          ref="captcha"
                          @keyup.enter.native="register"
                          v-model="registerForm.captcha"
                          placeholder="验证码"
                          clearable></el-input>
              </div>
            </el-form-item>
            <div class="btn-wrapper">
              <el-button icon="el-icon-message"
                         @click="sendRegisterCaptch"
                         :disabled="Boolean(time)"
                         circle></el-button>
              <span class="timer" :class="{invisible: !time}">{{time}}</span>
            </div>
          </div>
          <div class="wrapper">
            <div class="btn-form">
              <el-button class="register-btn"
                         icon="el-icon-check"
                         @click="register"
                         type="success"
                         circle></el-button>
              <el-button class="return-btn"
                         icon="el-icon-close"
                         type="info"
                         @click="goToLast"
                         circle></el-button>
            </div>
          </div>
        </el-form>
        <!-- form end -->
      </div>
    </div>
    <!-- the register panel end -->

  </div>
</template>

<script>
  import isEmail from 'utils/isEmail'
  import isUsername from 'utils/isUsername'
  import {register} from 'api/register'
  import {sendCaptcha, hasUser} from "api/utils"


  export default {
    name: "register",
    data() {
      let checkUsername = (rule, value, callback) => {
        if(value) {
          const $_isUsername = isUsername(value)
          if($_isUsername.status) {
            hasUser({username: value})
              .then(res => {
                if(res.code && !res.data) {
                  callback()
                } else {
                  callback(new Error('用户名已存在，请更换'))
                }
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '网络异常，请检查网络状况'
                })
              })
          }
          else {
            callback(new Error($_isUsername.result))
          }
        }
      }
      let checkEmail = (rule, value, callback) => {
        if(value) {
          const $_isEmail = isEmail(value)
          if($_isEmail.status) {
            hasUser({email: value})
              .then(res => {
                if(res.code && !res.data) {
                  callback()
                }
                else {
                  callback(new Error('该邮箱已绑定其他用户'))
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
          if(this.registerForm.checkPassword) {
            this.$refs.registerForm.validateField('checkPassword')
          }
          callback()
        }
      }
      let reValidatePass = (rule, value, callback) => {
        if(value) {
          if(value !== this.registerForm.password) {
            callback(new Error('两次输入密码不一致'))
          }
          callback()
      }
      }
      return {
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {validator: checkUsername, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '验证码为您邮箱收到的五位数字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符'}
          ],
          checkPassword: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: reValidatePass, trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 3, max: 20, message: '昵称为 3 到 20 个字符', trigger: 'blur'}
          ]
        },
        registerForm: {
          username: '',
          nickname: '',
          email: '',
          captcha: '',
          password: '',
          checkPassword: ''
        },
        time: 0,
        counter: null
      }
    },
    mounted() {
      this.$refs.username.focus()
    },
    beforeDestroy() {
      clearInterval(this.counter)
    },
    methods: {
      goToLast() {
        for (let key of Object.keys(this.registerForm)) {
          this.registerForm[key] = ''
        }
        this.$router.go(-1)
      },
      sendRegisterCaptch() {
        this.$refs.registerForm.validate((valid, obj) => {
          if(!obj.hasOwnProperty('email')) {
            sendCaptcha({email: this.registerForm.email, flag: 'register'})
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
      register() {
        this.$refs.registerForm.validate(valid => {
          if(valid) {
            register(this.registerForm)
              .then(res => {
                if(res.code) {
                  this.$message({
                    type: 'success',
                    message: '注册成功, 为您跳转到登陆页面'
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
  .register-main {
    width: 888px
  }

  .register-header {
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

  .register-panel-main {
    position: relative;
    margin-top: 50px;
    width: 100%;
    height: 465px;
    background-color: #FFFFFF
  }

  .logo img {
    display: block;
    margin: auto auto 60px auto;
    width: 30%
  }

  .logo {
    position: relative;
    top: 25px
  }

  .register-panel-form {
    margin: 40px auto auto;
    width: 750px
  }

  .com-input {
    width: 250px
  }

  .captcha-input {
    width: 150px
  }

  .btn-wrapper {
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
    display: none;
  }

  .wrapper {
    margin-top: 20px
  }

  .btn-form {
    margin: 0 auto auto 320px
  }

  .return-btn {
    margin-left: 30px
  }
</style>