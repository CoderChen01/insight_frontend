<template>
  <div class="close-user">
    <el-dialog title="注销用户"
               width="450px"
               :center="true"
               :show-close="false"
               :destroy-on-close="true"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.password.focus()">
      <el-form :model="closeUserForm"
               :rules="rules"
               ref="closeUserForm"
               @submit.native.prevent
               class="close-user-form">
        <div class="wrapper">
          <el-form-item label="用户密码"
                        prop="password">
            <el-input v-model="closeUserForm.password"
                      id="password"
                      ref="password"
                      @keyup.enter.native="handleSubmit"
                      placeholder="请输入用户密码"
                      type="password"
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
  import {closeUserRequest} from 'api/account'
  import {DELETE_USER_INFO} from 'store/mutationTypes'


  export default {
    name: "closeUser",
    data() {
      return {
        closeUserForm: {
          password: ''
        },
        rules: {
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 16, message: '密码为 6 到 16 个字符'}
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
        set(){}
      }
    },
    methods: {
      closeUser() {
        this.closeUserForm.username = this.$store.state.userInfo.username
        this.closeUserForm.force = true
        let token = this.$store.state.userInfo.token
        closeUserRequest(this.closeUserForm, token)
        .then(res => {
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
            })
          } else {
            this.$store.commit(DELETE_USER_INFO)
            this.$message({
              type: 'success',
              message: '注销用户成功，返回登录界面...',
              duration: 1500
            })
            return this.$router.replace({name: 'login'})
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '网络异常，请检查网络状况'
          })
        })
      },
      handleSubmit() {
        this.$refs.closeUserForm.validate(valid => {
          if (valid) {
            this.$confirm('注销用户将要强制停止所有任务' +
              '并删除有关用户所有数据，是否继续？', '警告', {
              confirmButtonText: '确定注销',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.closeUser()
              })
          }
        })
      },
      handleClose() {
        this.closeUserForm.password = ''
        this.$emit('update:isVisible', false)
      }
    }
  }
</script>

<style scoped>
  .close-user-form {
    margin: 0 auto;
    width: 75%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>