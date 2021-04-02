<template>
  <div class="cmaera-management-root">
    <management-style>
      <template v-slot:manamgeMain>
        <div class="header">
          <el-page-header @back="handleBack"
                          :content="currentPage">
          </el-page-header>
        </div>
        <div class="camera-management-main">
          <camera-group v-show="cameraGroupVisible"
                      @retrieve-group="toCamera"></camera-group>
          <camera v-if="cameraGroupID && isCamera"
                :cameraGroupID="cameraGroupID"></camera>
        </div>
      </template>
    </management-style>
  </div>
</template>

<script>
  import cameraGroup from 'components/content/cameraManagement/cameraGroup'
  import camera from 'components/content/cameraManagement/camera'
  import managementStyle from 'components/common/managementStyle'


  export default {
    name: "cameraManagementMain",
    components: {
      cameraGroup,
      camera,
      managementStyle
    },
    data() {
      return {
        cameraGroupVisible: true,
        isCamera: false,
        cameraGroupID: '',
        currentPage: '摄像头分组'
      }
    },
    methods: {
      handleBack() {
        this.cameraGroupID = ''
        this.isCamera = false
        this.cameraGroupVisible = true
        this.currentPage = '摄像头分组'
      },
      toCamera(cameraGroupID) {
        this.cameraGroupVisible = false
        this.cameraGroupID = cameraGroupID
        this.isCamera = true
        this.currentPage = '摄像头'
      }
    }
  }
</script>

<style scoped>
  .header {
    margin-bottom: 15px;
    height: 38px;
    border-bottom: solid 1px #e6e6e6;
    user-select: none;
  }
</style>