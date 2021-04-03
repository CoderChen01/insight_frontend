<template>
  <div class="incident-management">
    <view-incident
      :isVisible.sync="viewIncidentVisible"
      :incident="currentIncident">
    </view-incident>

    <!-- all count start -->
    <div class="all-count">
      <i class="el-icon-data-analysis"></i>
      当前总数据量：{{ allCount }}
<!--      <el-tooltip-->
<!--        class="delet-all-incidents"-->
<!--        effect="light"-->
<!--        content="点击删除当前所有数据"-->
<!--        placement="top">-->
<!--        <i class="el-icon-delete"-->
<!--           style="color: #409EFF; margin-left: 10px; cursor: pointer"-->
<!--           @click="handleDeleteAllIncidents"></i>-->
<!--      </el-tooltip>-->
    </div>
    <!-- all conunt end -->

    <!-- selector start -->
    <div class="selector clearfix" style="user-select: none">
      <div class="camera-selector fl mr15">
        <span style="margin-right: 12px; font-size: 13px">选择摄像头</span>
        <el-select v-model="cameraID"
                   @change="handleSubmit">
          <el-option-group
            v-for="group in cameraOptions"
            :key="group.key"
            :label="group['label']">
            <template v-if="cameraOptionsSuccess">
              <el-option
                v-for="option in group.options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </template>
          </el-option-group>
        </el-select>
      </div>
      <div class="ai-skill-selector fl mr15">
        <span style="margin-right: 12px; font-size: 13px">选择技能</span>
        <el-select v-model="AISkillID"
                   @change="handleSubmit">
          <el-option-group
            v-for="group in AISkillOptions"
            :key="group.key"
            :label="group['label']">
            <template v-if="AISkillOptionsSuccess">
              <el-option
                v-for="option in group.options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </template>
          </el-option-group>
        </el-select>
      </div>
      <div class="time-range-selector fl">
        <span style="margin-right: 12px; font-size: 13px">选择时间范围</span>
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          @change="handleSubmit"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <!-- selector end -->

    <!-- incident content start -->
    <div class="incident-content">
      <div class="incidents-waterfall"
           ref="incidentsWaterfall">
        <div class="incident-empty-data"
             v-show="emptyDataVisible">
          <empty-data>
            <template v-slot:emptyText>
              暂无数据
            </template>
          </empty-data>
        </div>
        <div class="infinite-container"
             v-show="!emptyDataVisible"
             ref="infiniteContainer">
          <template v-for="(incident, index1) in incidentsCard">
            <incident-card :key="index1"
                           :ref="index1"
                           :incident="incident"
                           @viewIncident="handleViewIncident">
<!--            <incident-card :key="index1"-->
<!--                           :ref="index1"-->
<!--                           :incident="incident"-->
<!--                           @deleteIncident="handleDeleteIncident"-->
<!--                           @viewIncident="handleViewIncident">-->
            </incident-card>
          </template>
        </div>
        <div v-show="isEnd && !emptyDataVisible"
             class="container-footer">
          没有更多数据了...
        </div>
        <div v-show="isLoading"
             class="container-footer">
          <i class="el-icon-loading"></i>&nbsp;加载中...
        </div>
      </div>
    </div>
    <!-- incident content end -->

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {getCameraRequest} from 'api/cameraManagement'
  import {getAISkillRequest} from 'api/AISkillManagement'
  import {
    getIncidentRequest,
    deleteAllIncidentsRequest
  } from 'api/incidentManagement'

  import incidentCard from './incidentCard'
  import emptyData from 'components/common/emptyData'
  import viewIncident from './viewIncident'


  export default {
    name: "incident",

    components: {
      viewIncident,
      incidentCard,
      emptyData
    },

    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        cameraOptionsSuccess: false,
        AISkillOptionsSuccess: false,

        cameraID: null,
        AISkillID: null,
        timeRange: [],
        offset: 0,
        limit: 20,
        allCount: 0,

        incidentsCard: [],
        incidentCounter: 0,

        colNumbers: null,
        colWidth: 272,
        colGap: 31,
        colHeight: [],
        positionRecord: [],
        incidentCardWidth: 250,
        cardFooterHeight: 125,

        isEnd: false,
        emptyDataVisible: false,
        isLoading: false,

        viewIncidentVisible: false,
        currentIncident: {},

        heartBeat: null
      }
    },

    watch: {
      isScrollToBottom: function (val) {
        if (val) {
          this.loadIncidents()
        }
      }
    },

    computed: {
      ...mapState({
        token: state => state.userInfo.token,
        isScrollToBottom: state => state.isScrollToBottom
      }),
      cameraOptions() {
        let cameraOptions = this.$store.state.camera.cameraGroupData
          .map(item => {
            let groupOption = {}
            groupOption.label = '分组：' + item['name']
            groupOption.key = item['camera_group_id']
            this.cameraOptionsSuccess = false
            this.getCameras(item['camera_group_id'])
            .then(data => {
              groupOption.options = data.map(item => ({
                label: item['name'],
                value: item['camera_id']
              }))
              this.cameraOptionsSuccess = true
            })
            return groupOption
          })
        cameraOptions.unshift({
          label: '默认',
          key: '默认',
          options: [
            {
              label: '全部',
              value: null
            }
          ]
        })
        return cameraOptions
      },
      AISkillOptions() {
        let AISkillOptions = this.$store.state.interface.AISkillGroupData
          .map(item => {
            let groupOption = {}
            groupOption.label = '分组：' + item['name']
            groupOption.key = item['ai_skill_group_id']
            this.AISkillOptionsSuccess = false
            this.getAISkills(item['ai_skill_group_id'])
              .then(data => {
                groupOption.options = data.map(item => ({
                  label: item['name'],
                  value: item['ai_skill_id']
                }))
                this.AISkillOptionsSuccess = true
              })
            return groupOption
          })
        AISkillOptions.unshift({
          label: '默认',
          key: '默认',
          options: [
            {
              label: '全部',
              value: null
            }
          ]
        })
        return AISkillOptions
      },
      submitData() {
        let data = {
          offset: this.offset,
          limit: this.limit
        }
        if (this.cameraID) {
          data.camera_id = this.cameraID
        }
        if (this.AISkillID) {
          data.ai_skill_id = this.AISkillID
        }
        if (this.timeRange) {
          if (this.timeRange.length > 0) {
            data.time_range = {}
            data.time_range.start_time = this.timeRange[0]
            data.time_range.end_time = this.timeRange[1]
          }
        }
        return data
      }
    },

    mounted() {
      this.getColNumbers()
      this.handleSubmit()
    },

    beforeDestroy() {
      clearInterval(this.heartBeat)
    },

    methods: {
      getCameras(camera_group_id) {
        return getCameraRequest({camera_group_id}, this.token)
        .then(res => {
          if (!res.code) {
            this.$message.error(res['error_msg'])
            return []
          } else {
            return res['data']
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      },
      getAISkills(ai_skill_group_id) {
        return getAISkillRequest({ai_skill_group_id}, this.token)
        .then(res => {
          if (!res.code) {
            this.$message.error(res['error_msg'])
            return []
          } else {
            return res['data']
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      },
      handleSubmit() {
        this.offset = 0
        this.limit = this.colNumbers

        this.incidentCounter = 0
        clearInterval(this.heartBeat)
        this.heartBeat = null

        this.incidentsCard = []

        if (this.colHeight.length > 0) {
          this.colHeight = []
        }

        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })

        getIncidentRequest(this.submitData, this.token)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            this.allCount = res['all_count']

            if (res['data'].length > 0) {
              this.emptyDataVisible = false
              this.isEnd = res['is_end']
              this.offset = res['next_offset']
              this.incidentPreprocessing(res['data'])
              this.$message({
                type: 'success',
                message: '事件数据获取成功',
                duration: 1500
              })
            } else {
              this.$refs.infiniteContainer.setAttribute(
                'style',
                ""
              )
              this.emptyDataVisible = true
            }
          }
        })
      },
      loadIncidents() {
        if (!this.isEnd) {
          this.isLoading = true
          getIncidentRequest(this.submitData, this.token)
            .then(res => {
              this.isLoading = false
              if (!res.code) {
                this.$message.error(res['error_msg'])
              } else {
                this.isEnd = res['is_end']
                this.allCount = res['all_count']
                this.offset = res['next_offset']
                this.incidentPreprocessing(res['data'])
              }
            })
        }
      },
      getColNumbers() {
        let clientWidth = this.$refs['incidentsWaterfall'].clientWidth
        this.colNumbers = Math.floor(clientWidth / this.colWidth)
      },
      getPosition(item, index, ratio) {
        if (index < this.colNumbers) {
          let colIndex = index % this.colNumbers
          item.left = colIndex * this.colWidth + this.colGap
          item.top = 0
          item.ratio = ratio
          this.$set(
            this.colHeight,
            colIndex,
            ((this.incidentCardWidth / ratio) + this.cardFooterHeight))
        } else {
          let minHeight = Math.min.apply(null, this.colHeight)
          let minIndex = this.colHeight.indexOf(minHeight)
          item.top = minHeight
          item.left = minIndex * this.colWidth + this.colGap
          let tmp = this.colHeight[minIndex] + ((this.incidentCardWidth / ratio) + this.cardFooterHeight)
          this.$set(this.colHeight, minIndex, tmp)
        }
        return item
      },
      incidentPreprocessing(incidents) {
        if (!this.heartBeat) {
          this.heartBeat = setInterval(() => {
            this.isEnd = false
            this.loadIncidents()
          }, 5 * 1000)
        }
        if (incidents.length > 0) {
          incidents.forEach((item, index) => {
            const imageURL = `data:image/png;base64,${item['incident_image']}`
            let img = new Image()
            img.src = imageURL
            img.onload = () => {
              this.incidentsCard.push(this.getPosition(item, this.incidentCounter++, img.width / img.height))
            }
          })
          setTimeout(() => {
            let maxHeight = Math.max.apply(null, this.colHeight)
            this.$refs.infiniteContainer.setAttribute(
              'style',
              `height: ${maxHeight}px`
            )
            if (maxHeight < window.innerHeight - 100) {
              this.loadIncidents()
            }
          }, 0)
        }
      },
      handleViewIncident(incident) {
        this.currentIncident = incident
        this.viewIncidentVisible = true
      },
      // handleDeleteIncident() {
      //   this.handleSubmit()
      // },
      // handleDeleteAllIncidents() {
      //   if (this.allCount === 0) {
      //     return
      //   }
      //   const data = {}
      //   if (this.cameraID) {
      //     data.camera_id = this.cameraID
      //   }
      //   if (this.AISkillID) {
      //     data.ai_skill_id = this.AISkillID
      //   }
      //   if (this.timeRange) {
      //     data.time_range = this.timeRange
      //   }
      //   this.$confirm('将永久删除当前所有事件，是否继续？', '警告', {
      //     cancelButtonText: '取消',
      //     confirmButtonText: '确定',
      //     type: 'warning'
      //   })
      //     .then(() => {
      //       deleteAllIncidentsRequest(data, this.token)
      //         .then(res => {
      //           if (!res.code) {
      //             this.$message.error(res['error_msg'])
      //           } else {
      //             this.handleSubmit()
      //             this.$message({
      //               type: 'success',
      //               message: '删除成功',
      //               duration: 1500
      //             })
      //           }
      //         })
      //         .catch(err => {
      //           this.$message.error('网络异常，请检查网络状况')
      //         })
      //     })
      // }
    },
  }
</script>

<style scoped>
  .fl {
    float: left;
  }

  .mr15 {
    margin-right: 15px;
  }

  .selector {
    margin-bottom: 20px;
    padding: 0 0 15px 0;
    border-bottom: solid 1px #e6e6e6;
  }

  .infinite-container {
    position: relative;
  }

  .incident-empty-data {
    width: 226px;
    margin: 0 auto;
  }

  .container-footer {
    text-align: center;
    font-size: 13px;
    color: #666666;
    user-select: none;
  }

  .all-count {
    font-size: 20px;
    font-weight: 300;
    margin: 10px auto 20px auto;
    text-align: center;
  }

  .selector {
    line-height: 40px;
  }

  .camera-selector {
    margin-left: 19px;
  }
</style>