<template>
  <div class="nav">
    <!--menu start-->
    <div class="menu">
      <el-menu mode="horizontal"
               :default-active="this.$route.name"
                @select="handleSelect">
        <!-- logo start -->
        <li class="logo el-menu-item" @click="returnMain">
          <h1>
            <img src="~assets/img/logo.png" alt="logo" width="130">
          </h1>
        </li>

        <!--menu items start-->
        <el-menu-item v-for="(item, i) in navItemsList" :key="i" :index="item.index">{{ item.name }}
        </el-menu-item>
        <!--menu items end-->

        <!-- display user informantion and some user operations-->
        <!-- profie start-->
        <li class="profile el-menu-item">
          <el-dropdown @command="handleCommand">
            <span class="nickname el-dropdown-link">
              <i class="el-icon-user-solid" style="font-size: 15px"></i>
              <span>{{ nickname }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu v-slot:default>
              <el-dropdown-item icon="el-icon-edit-outline"
                                command="change-password">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-postcard"
                                command="change-email">更换邮箱</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-close"
                                command="logout">注销用户</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button"
                                command="quit">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!--profile end-->
      </el-menu>
    </div>
    <!--menu end-->
    <div class="acount-management">
      <change-password :isVisible.sync="changePasswordVisible"></change-password>
      <change-email :isVisible.sync="changeEmailVisible"></change-email>
      <close-user :isVisible.sync="closeUserVisible"></close-user>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import changePassword from 'components/content/accountManagement/changePassword'
  import changeEmail from 'components/content/accountManagement/changeEmail'
  import closeUser from 'components/content/accountManagement/closeUser'
  import {
    DELETE_USER_INFO,
    STORE_AISKILLGROUP_DATA,
    STORE_CAMERAGROUP_DATA,
    STORE_FACEGROUP_DATA
  } from 'store/mutationTypes'
  import {getFaceGroupRequest} from 'api/faceManagement'
  import {getAISkillGroupRequest} from 'api/AISkillManagement'
  import {getCameraGroupRequest} from 'api/cameraManagement'

  export default {
    name: "navHeader",
    components: {
      changePassword,
      changeEmail,
      closeUser
    },
    data() {
      return {
        navItemsList: [
          {index: 'cameraManagement', name: '摄像头管理'},
          {index: 'AISkillManagement', name: 'AI技能接口管理'},
          {index: 'faceManagement', name: '人脸库管理'},
          {index: 'incidentManagement', name: '事件总览'}
        ],
        changePasswordVisible: false,
        changeEmailVisible: false,
        closeUserVisible: false
      }
    },
    computed: {
      nickname() {
        return this.$store.state.userInfo.nickname
      },
      ...mapState({
        token: state => state.userInfo.token
      })
    },
    created() {
      if (this.$route.name === 'index') {
        this.$router.push({name: 'cameraManagement'})
      }
      this.getAllData()
    },
    methods: {
      getFaceGroupData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        getFaceGroupRequest(this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(STORE_FACEGROUP_DATA, res.data)
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
      getAISkillGroupData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        getAISkillGroupRequest(this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(STORE_AISKILLGROUP_DATA, res.data)
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
      getCameraGroupData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        getCameraGroupRequest(this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(STORE_CAMERAGROUP_DATA, res.data)
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
      getAllData() {
        this.getFaceGroupData()
        this.getCameraGroupData()
        this.getAISkillGroupData()
      },
      handleSelect(index) {
        if (this.$route.name !== index){
          return this.$router.replace({name: index})
        }
      },
      handleCommand(command) {
        if (command === 'quit') {
          this.quitSystem()
        }
        if (command === 'change-password') {
          this.changePassword()
        }
        if (command === 'change-email') {
          this.changeEmail()
        }
        if (command === 'logout') {
          this.closeUser()
        }
      },
      quitSystem() {
        this.$store.commit(DELETE_USER_INFO)
        return this.$router.replace({name: 'login'})
      },
      changePassword() {
        this.changePasswordVisible = true
      },
      changeEmail() {
        this.changeEmailVisible = true
      },
      closeUser() {
        this.closeUserVisible=true
      },
      returnMain() {
        if (this.$route.name !== 'cameraManagement') {
          this.$router.push({name: 'cameraManagement'})
        }
      }
    }
  }
</script>

<style scoped>
  .nav {
    width: 1200px;
    margin: 0 auto;
  }
  .logo {
    position: relative;
    bottom: 5px;
    margin-right: 20px;
  }
  .menu {
    user-select: none;
  }
  .profile {
    float: right;
  }
  .el-menu {
    border: none;
  }
</style>