<template>
  <management-style>
    <template v-slot:manamgeMain>
      <div class="header">
        <el-page-header @back="handleBack"
                        :content="currentPage">
        </el-page-header>
      </div>
      <div class="face-management-main">
        <face-group v-show="faceGroupVisible"
                    @retrieve-group="toFace"></face-group>
        <face v-if="faceGroupID && isFace"
              :faceGroupID="faceGroupID"></face>
      </div>
    </template>
  </management-style>
</template>

<script>
  import face from 'components/content/faceManagement/face'
  import faceGroup from 'components/content/faceManagement/faceGroup'
  import managementStyle from 'components/common/managementStyle'


  export default {
    name: "faceManagementMain",
    components: {
      face,
      faceGroup,
      managementStyle
    },
    data() {
      return {
        faceGroupVisible: true,
        isFace: false,
        faceGroupID: '',
        currentPage: '人脸库'
      }
    },
    methods: {
      handleBack() {
        this.faceGroupID = ''
        this.isFace = false
        this.faceGroupVisible = true
        this.currentPage = '人脸库'
      },
      toFace(faceGroupID) {
        this.faceGroupVisible = false
        this.faceGroupID = faceGroupID
        this.isFace = true
        this.currentPage = '人脸'
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