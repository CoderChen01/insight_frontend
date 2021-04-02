<template>
  <div class="camera">
    <create-camera :isVisible.sync="createCameraVisible"
                   :cameraGroupID="cameraGroupID"
                   @update-camera-data="handleChange"
                   @create-camera-data="handleAdd"></create-camera>
    <update-camera :isVisible.sync="updateCameraVisible"
                   @update-camera-data="handleChange"
                   :cameraDataRow="cameraDataRow"></update-camera>
    <set-ai-skill-settings :isVisible.sync="setAISkillSettingsVisible"
                           @update-camera-data="handleChange"
                           :cameraDataRow="cameraDataRow"></set-ai-skill-settings>
    <set-extraction-settings :isVisible.sync="setExtractionSettingsVisible"
                             @update-camera-data="handleChange"
                             :cameraDataRow="cameraDataRow"></set-extraction-settings>
    <div class="create-camera-btn">
      <el-button type="primary"
                 size="medium"
                 @click="handleCreate"
                 icon="el-icon-plus">新建摄像头
      </el-button>
    </div>
    <div class="camera-data-table">
      <el-table :data="cameraData"
                row-key="camera_id"
                style="width: 100%; user-select: none">
        <template v-slot:empty>
          <empty-data>
            <template v-slot:emptyText>
              <div>还没有创建摄像头</div>
              <el-button
                type="text"
                @click="handleCreate">马上创建&gt;
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
              class="camera-data-detail">
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">名称</span>
                </template>
                <span> {{ props.row['name'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">描述</span>
                </template>
                <span> {{ props.row['description'] ? props.row['description'] : '暂无描述信息'}} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">摄像头ID</span>
                </template>
                <span> {{ props.row['camera_id'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">摄像头URL</span>
                </template>
                <span> {{ props.row['camera_url'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">状态</span>
                </template>
                <span> {{ props.row['state'] }} </span>
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
          label="名称">
        </el-table-column>
        <el-table-column
          prop="camera_id"
          label="技能ID">
        </el-table-column>
        <el-table-column
          label="状态">
          <template v-slot="scope">
            <template v-if="(scope.row['state'] === '连接失败') || (scope.row['state'] === '工作中出错')">
              <span style="color: #F56C6C;">{{ scope.row['state'] }}</span>
            </template>
            <template v-else>
              <span style="color: #67C23A;">{{ scope.row['state'] }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="最近一次修改时间">
        </el-table-column>
        <el-table-column
          width="330"
          label="操作">
          <template v-slot="scope">
            <template v-if="scope.row['state'] === '工作中'">
              <el-button
                size="small"
                @click="handleOperation(scope.row['camera_id'], false)"
                type="text">暂停抽帧
              </el-button>
            </template>
            <template v-else>
              <el-button
                size="small"
                @click="handleOperation(scope.row['camera_id'], true)"
                type="text">开始抽帧
              </el-button>
            </template>
            <el-button
              size="small"
              @click="handleExtract(scope.row)"
              type="text">配置抽帧设置
            </el-button>
            <el-button
              size="small"
              @click="handleAISkill(scope.row)"
              type="text">配置AI技能接口
            </el-button>
            <el-button
              size="small"
              @click="handleUpdate(scope.row)"
              type="text">修改
            </el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.row['camera_id'])"
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

  import createCamera from './createCamera'
  import updateCamera from './updateCamera'
  import setAISkillSettings from './setAISkillSettings'
  import setExtractionSettings from './setExtractionSettings'
  import emptyData from 'components/common/emptyData'
  import {
    deleteCameraRequest,
    getCameraRequest,
    cameraStartRequest,
    cameraStopRequest
  } from 'api/cameraManagement'



  export default {
    name: "camera",
    components: {
      'set-ai-skill-settings': setAISkillSettings,
      createCamera,
      updateCamera,
      setExtractionSettings,
      emptyData
    },

    props: {
      cameraGroupID: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        createCameraVisible: false,
        updateCameraVisible: false,
        setAISkillSettingsVisible: false,
        setExtractionSettingsVisible: false,
        cameraData: [],
        cameraDataRow: null,
        cameraID: ''
      }
    },

    computed: {
      ...mapState({
        token: state => state.userInfo.token
      })
    },

    created() {
      this.getCameraData()
    },

    methods: {
      getCameraData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        getCameraRequest({'camera_group_id': this.cameraGroupID}, this.token)
          .then(res => {
            loading.close()
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.cameraData = res.data
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
      deleteCamera(cameraID) {
        deleteCameraRequest({camera_id: cameraID, force: true}, this.token)
          .then(res => {
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.cameraData.forEach((item, index, array) => {
                if (item['camera_id'] === cameraID) {
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
        this.createCameraVisible = true
      },
      handleUpdate(cameraDataRow) {
        this.cameraDataRow = cameraDataRow
        this.updateCameraVisible = true
      },
      handleDelete(cameraID) {
        this.$confirm('将永久删除该接口，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCamera(cameraID)
        })
      },
      handleAdd(cameraData) {
        this.cameraData.push(cameraData)
      },
      handleChange(data) {
        this.cameraData.forEach((item, index, array) => {
          if (item['camera_id'] === data['camera_id']) {
            array.splice(index, 1, data)
          }
        })
      },
      handleExtract(cameraDataRow) {
        this.cameraDataRow = cameraDataRow
        this.setExtractionSettingsVisible = true
      },
      handleAISkill(cameraDataRow) {
        this.cameraDataRow = cameraDataRow
        if (cameraDataRow['state'] === 10 || cameraDataRow['state'] === 11) {
          this.$message.warning('请先配置抽帧设置')
        } else {
          this.setAISkillSettingsVisible = true
        }
      },
      handleOperation(camera_id, isStart) {
        if (isStart) {
          cameraStartRequest({camera_id}, this.token)
          .then(res => {
            if (!res.code) {
              this.$message.error(res['error_msg'])
            } else {
              this.handleChange(res['data'])
              this.$message({
                type: 'success',
                message: '任务启动成功',
                duration: 1500
              })
            }
          })
          .catch(err => {
            this.$message.error('网络异常，请检查网络状况')
          })
        } else {
          cameraStopRequest({camera_id}, this.token)
            .then(res => {
              if (!res.code) {
                this.$message.error(res['error_msg'])
              } else {
                this.handleChange(res['data'])
                this.$message({
                  type: 'success',
                  message: '任务已暂停',
                  duration: 1500
                })
              }
            })
            .catch(err => {
              this.$message.error('网络异常，请检查网络状况')
            })
        }
      }
    }
  }
</script>

<style scoped>
  .create-camera-btn {
    margin-bottom: 10px;
  }
  .camera-data-detail {
    font-size: 0;
  }
  .camera-data-detail .label-color {
    color: #99a9bf;
  }
  .camera-data-detail .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>