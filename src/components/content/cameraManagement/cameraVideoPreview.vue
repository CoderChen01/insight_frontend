<template>
  <div class="camera-video-preview-root">
    <el-dialog :title="title"
               :center="true"
               :visible.sync="$_isVisible"
               :close-on-click-modal="false"
               @close="handleClose"
               @open="createCameraFormVisible = true"
               @opened="getCameraPreview(cameraID)">
      <div class="camera-preview">
        <div class="image-loading" v-show="!previewImageURL">
          <i class="el-icon-loading"></i>
        </div>
        <img
          v-if="previewImageURL"
          style="width: 100%"
          :src="previewImageURL"
          fit="contain">
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {
    cameraVideoPreviewURL,
  } from 'api/cameraManagement'


  export default {
    name: "cameraVideoPreview",

    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      cameraID: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        previewImageURL: '',
        title: '实时预览',
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
      getCameraPreview(cameraId) {
        this.previewImageURL = cameraVideoPreviewURL(cameraId, this.token)
      },
      handleClose() {
        this.$emit('update:isVisible', false)
        this.previewImageURL = ''
        if(window.stop !== undefined)
        {
            window.stop();
        } 
        else if(document.execCommand !== undefined)
        {
            document.execCommand("Stop", false);
        }
      }
    }
  }
</script>

<style scoped>
  .create-camera-form,
  .set-extraction-form{
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
  .image-loading {
    width: 100%;
    height: 220px;
    text-align: center;
    line-height: 220px;
    font-size: 30px;
  }
</style>
