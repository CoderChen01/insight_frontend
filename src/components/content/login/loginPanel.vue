<template>
  <div class="login-main">

    <!-- the login title start -->
    <div class="login-header">
      <div class="title-zh">insight智能监控管理系统</div>
      <div class="title-en">Insight intelligent monitor management system</div>
    </div>
    <!-- the login title end -->

    <!-- the login panel start -->
    <div class="login-panel-main">
      <div class="login-panel-decoration">
        <img src="~assets/img/login/loginDecoration.png" alt="登录装饰图">
      </div>
      <div class="login-panel-form">
        <div class="logo">
          <img src="~assets/img/logo.png" alt="logo">
        </div>
        <el-form :model="loginForm" ref="loginForm" :rules="rules">
          <div class="username-input mb25">
            <el-form-item prop="usernameOrEmail">
              <el-input
                prefix-icon="el-icon-user-solid"
                placeholder="用户名或邮箱"
                ref="username"
                v-model="loginForm.usernameOrEmail"
                @keyup.enter.native="$refs.password.focus()"
                clearable>
              </el-input>
            </el-form-item>
          </div>
          <div class="password-input mb25">
            <el-form-item prop="password">
              <el-input
                prefix-icon="el-icon-warning"
                placeholder="请输入密码"
                ref="password"
                v-model="loginForm.password"
                @keyup.enter.native="login('loginForm')"
                show-password>
              </el-input>
            </el-form-item>
          </div>
          <div class="login-register-btn clearfix">
            <el-button
              class="login-btn"
              type="primary"
              size="small"
              @click="login('loginForm')"
              round>
              登录
            </el-button>
            <el-button
              class="register-btn"
              type="primary"
              size="small"
              round
              @click="toRegister">
              注册
            </el-button>
          </div>
        </el-form>
        <div class="get-pwd">
          <el-link class="font-css"
                   type="primary"
                   @click="toForgetPassword">忘记密码？</el-link>
        </div>
      </div>
    </div>
    <!-- the login panel end -->

  </div>
</template>


<script>
  import {loginRequest} from 'api/login'
  import isEmail from 'utils/isEmail'
  import isUsername from 'utils/isUsername'
  import {STORE_USER_INFO} from "store/mutationTypes";


  export default {
    name: 'loginPanel',
    data() {
      let usernameValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入用户名或邮箱'))
        }
        let $_isUsername = isUsername(value)
        if($_isUsername.status) {
          this.username= this.loginForm.usernameOrEmail
          this.email = ''
          callback()
        } else {
          let usernameError = new Error($_isUsername.result)
          let $_isEmail = isEmail(value)
          if ($_isEmail.status) {
            this.email = this.loginForm.usernameOrEmail
            this.username = ''
            callback()
          } else {
            let emailError = new Error($_isEmail.result)
            if(value.indexOf('@') !== -1 ) {
              callback(emailError)
            }
            callback(usernameError)
          }
        }
      }

      return {
        rules: {
          usernameOrEmail: [
            {validator: usernameValidator, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符', trigger: 'blur'}
          ]
        },
        loginForm: {
          usernameOrEmail: '',
          password: ''
        },
        email: '',
        username: ''
      }
    },
    mounted() {
      this.$refs.username.focus()
    },
    methods: {
      toRegister() {
        return this.$router.push({name: 'register'})
      },
      toForgetPassword() {
        return this.$router.push({name: 'forgetPassword'})
      },
      $_login(requestData) {
        const loading = this.$loading({
          lock: true,
          text: '正在登陆...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        loginRequest(requestData)
          .then(response => {
            loading.close()
            if(response.code){
              this.$store.commit(STORE_USER_INFO, response.data)
              this.$message({
                type: 'success',
                message: '登录成功',
                duration: 1500
              })
              return this.$router.replace({name: 'index'})
            }
            else {
              this.$message({
                type: 'error',
                message: response['error_msg']
              })
            }
          })
          .catch(err => {
            loading.close()
            this.$message({
              message: '网络异常，请检查网络状况',
              type: 'error'
            })
          })
      },
      login(formName) {
        return this.$refs[formName].validate(valid => {
          if(valid) {
            if(!this.username) {
              let requestData = {
                email: this.email,
                password: this.loginForm.password
              }
              this.$_login(requestData)
            }
            else {
              let requestData = {
                username: this.username,
                password: this.loginForm.password
              }
              this.$_login(requestData)
            }
          }
        })
      }
    }
  }
</script>


<style scoped>
  .login-main {
    width: 888px
  }

  .login-header {
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

  .login-panel-main {
    position: relative;
    margin-top: 50px;
    width: 100%;
    height: 465px;
    background-color: #FFFFFF
  }

  .login-panel-decoration img {
    width: 485px
  }

  .logo img {
    display: block;
    margin: auto auto 35px auto;
    width: 75%
  }

  .login-panel-decoration {
    position: absolute;
    top: 50%;
    margin-top: -172px;
    left: -10px
  }

  .login-panel-form {
    position: absolute;
    top: 50%;
    margin-top: -150px;
    right: 75px;
    width: 320px
  }

  .mb25 {
    margin-bottom: 25px
  }

  .login-register-btn {
    position: relative
  }

  .login-btn {
    float: left;
    width: 45%
  }

  .register-btn {
    float: right;
    width: 45%
  }

  .font-css{
    font-size: 12px
  }

  .get-pwd {
    float: right;
    margin-top: 20px;
  }
</style>