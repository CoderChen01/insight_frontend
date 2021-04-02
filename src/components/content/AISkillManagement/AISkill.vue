<template>
  <div class="ai-skill">
    <create-ai-skill :isVisible.sync="createAISkillVisible"
                     :AISkillGroupID="AISkillGroupID"
                     @create-ai-skill-data="handleAdd"></create-ai-skill>
    <update-ai-skill :isVisible.sync="updateAISkillVisible"
                     @update-ai-skill-data="handleChange"
                     :AISkillDataRow="AISkillDataRow"></update-ai-skill>
    <div class="create-ai-skill-btn">
      <el-button type="primary"
                 size="medium"
                 @click="handleCreate"
                 icon="el-icon-plus">新建接口
      </el-button>
    </div>
    <div class="ai-skill-data-table">
      <el-table :data="AISkillData"
                row-key="ai_skill_id"
                style="width: 100%; user-select: none">
        <template v-slot:empty>
          <empty-data>
            <template v-slot:emptyText>
              <div>还没有创建AI技能接口</div>
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
              class="ai-skill-data-detail">
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
                  <span class="label-color">技能ID</span>
                </template>
                <span> {{ props.row['ai_skill_id'] }} </span>
              </el-form-item>
              <el-form-item>
                <template v-slot:label>
                  <span class="label-color">技能URL</span>
                </template>
                <span> {{ props.row['ai_skill_url'] }} </span>
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
          prop="ai_skill_id"
          label="技能ID">
        </el-table-column>
        <el-table-column
          label="状态">
          <template v-slot="scope">
            <template v-if="scope.row['state'] === '接口正常'">
              <span style="color: #67C23A;">{{ scope.row['state'] }}</span>
            </template>
            <template v-else>
              <span style="color: #F56C6C;">{{ scope.row['state'] }}</span>
            </template>
          </template>
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
              @click="handleRefresh(scope.row['ai_skill_id'])"
              type="text">刷新
            </el-button>
            <el-button
              size="small"
              @click="handleUpdate(scope.row)"
              type="text">修改
            </el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.row['ai_skill_id'])"
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

  import createAISkill from './createAISkill'
  import emptyData from 'components/common/emptyData'
  import {
    deleteAISkillRequest,
    getAISkillRequest,
    refreshAISkillRequest
  } from 'api/AISkillManagement'
  import updateAISkill from './updateAISkill'


  export default {
    name: "AISkill",
    components: {
      'create-ai-skill': createAISkill,
      'update-ai-skill': updateAISkill,
      emptyData
    },
    props: {
      AISkillGroupID: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        createAISkillVisible: false,
        updateAISkillVisible: false,
        AISkillData: [],
        AISkillDataRow: null
      }
    },
    computed: {
      ...mapState({
        token: state => state.userInfo.token
      })
    },
    created() {
      this.getAISkillData()
    },
    methods: {
      getAISkillData() {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        getAISkillRequest({'ai_skill_group_id': this.AISkillGroupID}, this.token)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
            })
          } else {
            this.AISkillData = res.data
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
      deleteAISkill(AISkillID) {
        deleteAISkillRequest({ai_skill_id: AISkillID}, this.token)
        .then(res => {
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
              })
          } else {
            this.AISkillData.forEach((item, index, array) => {
              if (item['ai_skill_id'] === AISkillID) {
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
        this.createAISkillVisible = true
      },
      handleUpdate(AISkillDataRow) {
        this.AISkillDataRow = AISkillDataRow
        this.updateAISkillVisible = true
      },
      handleDelete(AISkillID) {
        this.$confirm('将永久删除该接口，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAISkill(AISkillID)
        })
      },
      handleAdd(AISkillData) {
        this.AISkillData.push(AISkillData)
      },
      handleChange(data) {
        this.AISkillData.forEach((item, index, array) => {
          if (item['ai_skill_id'] === data['ai_skill_id']) {
            array.splice(index, 1, data)
          }
        })
      },
      handleRefresh(AISkillID) {
        refreshAISkillRequest({'ai_skill_id': AISkillID}, this.token)
        .then(res => {
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
            })
          } else {
            this.AISkillData.forEach(item => {
              if (item.ai_skill_id === AISkillID) {
                if (res.data) {
                  item.state = '接口正常'
                } else {
                  item.state = '接口异常'
                }
              }
            })
          }
        })
        .catch(err => {
          this.$message.error('网络异常，请检查网络状况')
        })
      }
    }
  }
</script>

<style scoped>
  .create-ai-skill-btn {
    margin-bottom: 10px;
  }
  .ai-skill-data-detail {
    font-size: 0;
  }
  .ai-skill-data-detail .label-color {
    color: #99a9bf;
  }
  .ai-skill-data-detail .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>