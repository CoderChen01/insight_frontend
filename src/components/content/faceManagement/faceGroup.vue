<template>
  <div class="face-group">
    <create-face-group :isVisible.sync="createFaceGroupVisible"></create-face-group>
    <update-face-group :isVisible.sync="updateFaceGroupVisible"
                           :faceGroupDataRow="faceGroupDataRow"></update-face-group>
    <div class="create-group-btn">
      <el-button type="primary"
                 size="medium"
                 @click="handleCreate"
                 icon="el-icon-plus">新建组
      </el-button>
    </div>
    <div class="group-data-table">
      <el-table :data="faceGroupData"
                row-key="face_group_id"
                style="width: 100%; user-select: none">
        <template v-slot:empty>
          <empty-data>
            <template v-slot:emptyText>
              <div>还没有创建分组</div>
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
              class="face-group-data-detail">
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
                  <span class="label-color">分组ID</span>
                </template>
                <span> {{ props.row['face_group_id'] }} </span>
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
          prop="face_group_id"
          label="组ID">
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
              @click="handleRetrieve(scope.row['face_group_id'])"
              type="text">查看
            </el-button>
            <el-button
              size="small"
              @click="handleUpdate(scope.row)"
              type="text">修改
            </el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.row['face_group_id'])"
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

  import {deleteFaceGroupRequest} from 'api/faceManagement'
  import {DELETE_FACEGROUP_DATA} from 'store/mutationTypes'
  import emptyData from 'components/common/emptyData'
  import createFaceGroup from './createFaceGroup'
  import updateFaceGroup from './updateFaceGroup'
  
  
  export default {
    name: "faceGroup",
    components: {
      emptyData,
      'create-face-group': createFaceGroup,
      'update-face-group': updateFaceGroup
    },
    data() {
      return {
        createFaceGroupVisible: false,
        updateFaceGroupVisible: false,
        faceGroupDataRow: null
      }
    },
    computed: {
      ...mapState({
        token: state => state.userInfo.token,
        faceGroupData: state => state.face.faceGroupData
      })
    },
    methods: {
      deleteFaceGroup(faceGroupID) {
        deleteFaceGroupRequest({face_group_id: faceGroupID}, this.token)
          .then(res => {
            if (!res.code) {
              this.$message({
                type: 'error',
                message: res['error_msg']
              })
            } else {
              this.$store.commit(DELETE_FACEGROUP_DATA, faceGroupID)
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
        this.createFaceGroupVisible = true
      },
      handleRetrieve(faceGroupID) {
        this.$emit('retrieve-group', faceGroupID)
      },
      handleUpdate(faceGroupDataRow) {
        this.faceGroupDataRow = faceGroupDataRow
        this.updateFaceGroupVisible = true
      },
      handleDelete(faceGroupID) {
        this.$confirm('删除后所属该人脸库的人脸将全部被删除，是否继续？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFaceGroup(faceGroupID)
        })
      }
    }
  }
</script>

<style scoped>
  .create-group-btn {
    margin-bottom: 10px;
  }
  .face-group-data-detail {
    font-size: 0;
  }
  .face-group-data-detail .label-color {
    color: #99a9bf;
  }
  .face-group-data-detail .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>