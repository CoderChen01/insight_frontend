<template>
  <div class="face">
    <create-face :isVisible.sync="createFaceVisible"
                     :faceGroupID="faceGroupID"
                     @create-face-data="handleAdd"></create-face>
    <update-face :isVisible.sync="updateFaceVisible"
                     @update-face-data="handleChange"
                     :faceDataRow="faceDataRow"></update-face>
    <div class="create-face-btn">
      <el-button type="primary"
                 size="medium"
                 @click="handleCreate"
                 icon="el-icon-plus">添加人脸
      </el-button>
    </div>
    <div class="face-data-table">
      <el-table :data="faceData"
                row-key="face_id"
                style="width: 100%;">
        <template v-slot:empty>
          <empty-data>
            <template v-slot:emptyText>
              <div>还没有添加人脸</div>
              <el-button
                type="text"
                @click="handleCreate">马上添加&gt;
              </el-button>
            </template>
          </empty-data>
        </template>
        <el-table-column
          type="expand">
          <template v-slot="props">
            <el-form
              label-position="left"
              label-width="9rem"
              class="face-data-detail">
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">姓名</span>
                </template>
                <span> {{ props.row['name'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">人脸ID</span>
                </template>
                <span> {{ props.row['face_id'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">人脸图片</span>
                </template>
                <el-image
                  style="width: 200px"
                  :src="props.row['face_image'] | generateURL"
                  :preview-src-list="imgList"
                  fit="contain">
                  <template v-slot:error>
                    <span style="color: #F56C6C;"> 人脸图片被损坏请重新创建 </span>
                  </template>
                </el-image>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">最近一次修改时间</span>
                </template>
                <span> {{ props.row['add_time'] }} </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="face_id"
          label="人脸ID">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="最近一次修改时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button
              size="small"
              @click="handleUpdate(scope.row)"
              type="text">修改
            </el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.row['face_id'])"
              type="text">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import createFace from './createFace'
  import emptyData from 'components/common/emptyData'
  import {
    deleteFaceRequest,
    getFaceRequest
  } from 'api/faceManagement'
  import updateFace from './updateFace'

  
  export default {
    name: 'face',
    components: {
      createFace,
      updateFace,
      emptyData
    },
    filters: {
      generateURL (data) {
        return `data:image/png;base64,${data}`
      }
    },
    props: {
      faceGroupID: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        createFaceVisible: false,
        updateFaceVisible: false,
        faceData: [],
        faceDataRow: null
      }
    },
    computed: {
      ...mapState({
        token: state => state.userInfo.token
      }),
      imgList() {
        if (this.faceData.length > 0) {
          return this.faceData.map(item => {
            return 'data:image/png;base64,' + item['face_image']
          })
        }
      }
    },
    created() {
      this.getFaceData()
    },
    methods: {
      getFaceData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })

        getFaceRequest({'face_group_id': this.faceGroupID}, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.faceData = res.data
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
      deleteFace(faceID) {
        deleteFaceRequest({face_id: faceID}, this.token)
          .then(res => {
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.faceData.forEach((item, index, array) => {
                if (item['face_id'] === faceID) {
                  array.splice(index, 1)
                }
              })
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1500
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '网络异常，请检查网络状况'
            })
          })
      },
      handleCreate() {
        this.createFaceVisible = true
      },
      handleUpdate(faceDataRow) {
        this.faceDataRow = faceDataRow
        this.updateFaceVisible = true
      },
      handleDelete(faceID) {
        this.$confirm('将永久删除该人脸，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFace(faceID)
        })
      },
      handleAdd(faceData) {
        this.faceData.push(faceData)
      },
      handleChange(data) {
        this.faceData.forEach((item, index, array) => {
          if (item['face_id'] === data['face_id']) {
            array.splice(index, 1, data)
          }
        })
      }
    }
    
  }
</script>

<style scoped>
  .create-face-btn {
    margin-bottom: 10px;
  }
  .face-data-detail {
    font-size: 0;
  }
  .face-data-detail .label-color {
    color: #99a9bf;
  }
  .face-data-detail .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>