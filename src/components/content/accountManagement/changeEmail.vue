<template>
  <div class="change-email">
    <el-dialog title="修改邮箱"
               width="450px"
               :center="true"
               :show-close="false"
               :destroy-on-close="true"
               :visible.sync="$_isVisible"
               @closed="handleClose"
               @close="$emit('update:isVisible', false)"
               @opened="$refs.password.focus()">
      <el-form :model="changeEmailForm"
               :rules="rules"
               ref="changeEmailForm"
               class="change-email-form">
        <div class="wrapper">
          <el-form-item label="用户密码"
                        prop="password">
            <el-input v-model="changeEmailForm.password"
                      id="password"
                      ref="password"
                      @keyup.enter.native="$refs.newEmail.focus()"
                      placeholder="请输入用户密码"
                      type="password"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="新邮箱"
                        prop="new_email">
            <el-input v-model="changeEmailForm.new_email"
                      id="new_email"
                      ref="newEmail"
                      @keyup.enter.native="$refs.captcha.focus()"
                      placeholder="请输入新邮箱地址"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="验证码"
                        prop="captcha"
                        class="captcha-item">
            <el-input v-model="changeEmailForm.captcha"
                      id="captcha"
                      ref="captcha"
                      placeholder="验证码"
                      @keyup.enter.native="handleSubmit"
                      clearable></el-input>
          </el-form-item>
          <div class="captcha-btn">
            <el-button icon="el-icon-message"
                       @click="sendChangeEmailCaptcha"
                       :disabled="Boolean(time)"
                       circle></el-button>
            <span class="timer" :class="{invisible: !time}">{{time}}</span>
          </div>
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
  import isEmail from 'utils/isEmail'
  import {hasUser} from 'api/utils'
  import {sendCaptcha} from 'api/utils'
  import {changeEmailRequest} from 'api/account'
  import {UPDATE_USER_INFO} from 'store/mutationTypes'

  export default {
    name: "changeEmail",
    data() {
      let checkEmail = (rule, value, callback) => {
        if (value) {
          const $_isEmail = isEmail(value)
          if ($_isEmail.status) {
            hasUser({email: value})
              .then(res => {
                if (res.code && !res.data) {
                  callback()
                } else {
                  callback(new Error('该邮箱已绑定其他用户'))
                }
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '网络异常, 请检查网络状况'
                })
              })
          } else {
            callback(new Error($_isEmail.result))
          }
        }
      }
      return {
        changeEmailForm: {
          password: '',
          new_email: '',
          captcha: ''
        },
        rules: {
          new_email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 5, max: 5, message: '验证码为您邮箱收到的五位数字', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符'}
          ]
        },
        time: 0,
        counter: null
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
        set() {
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.counter)
    },
    methods: {
      sendChangeEmailCaptcha() {
        this.$refs.changeEmailForm.validate((valid, obj) => {
          if (!obj.hasOwnProperty('new_email')) {
            sendCaptcha({email: this.changeEmailForm.new_email, flag: 'update'})
              .then(res => {
                if (!res.code) {
                  this.$message({
                    type: 'error',
                    message: res['error_msg']
                  })
                } else {
                  this.time = 60
                  if (this.counter) {
                    clearInterval(this.counter)
                  }
                  this.counter = setInterval(() => {
                    if (this.time !== 0) {
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
      changeEmail() {
        this.changeEmailForm.username = this.$store.state.userInfo.username
        let token = this.$store.state.userInfo.token
        changeEmailRequest(this.changeEmailForm, token)
          .then(res => {
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$message({
                type: 'success',
                message: '邮箱修改成功',
                duration: 1500
              })
              this.$store.commit(UPDATE_USER_INFO, {email: this.changeEmailForm.new_email})
              this.$emit('update:isVisible', false)
            }
          })
      },
      handleSubmit() {
        this.$refs.changeEmailForm.validate(valid => {
          if (valid) {
            this.changeEmail()
          }
        })
      },
      handleClose() {
        this.changeEmailForm.new_email = ''
        this.changeEmailForm.captcha = ''
        this.changeEmailForm.password = ''
      }
    },
  }
</script>

<style scoped>
  .change-email-form {
    margin: 0 auto;
    width: 78%;
  }

  .submit-btn {
    margin-right: 15px;
  }

  .invisible {
    display: none;
  }

  .captcha-btn {
    position: absolute;
    left: 238px;
    bottom: 120px;
  }

  .captcha-item {
    width: 150px;
  }

  .timer {
    margin-left: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }
</style>