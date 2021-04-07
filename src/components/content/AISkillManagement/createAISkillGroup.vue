<template>
  <div class="create-ai-skill-group">
    <el-dialog title="创建AI技能接口分组"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               :close-on-click-modal="false"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.name.focus()">
      <el-form :model="createAISkillGroupForm"
               :rules="rules"
               ref="createAISkillGroupForm"
               class="create-ai-skill-group-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="createAISkillGroupForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入分组名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组描述"
                        prop="description">
            <el-input v-model="createAISkillGroupForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      placeholder="请输入分组描述"
                      show-word-limit
                      :autosize="{minRows: 3}"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="分组ID"
                        prop="ai_skill_group_id">
            <el-input v-model="createAISkillGroupForm.ai_skill_group_id"
                      id="ai_skill_group_id"
                      ref="AISkillGroupID"
                      placeholder="请输入分组唯一标识ID"
                      @keyup.enter.native="handleSubmit"
                      clearable></el-input>
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
  import {mapState} from 'vuex'

  import {
    createAISkillGroupRequest,
    hasAISkillGroupID
  } from 'api/AISkillManagement'
  import {CREATE_AISKILLGROUP_DATA} from 'store/mutationTypes'
  import {isID} from 'utils/isID'


  export default {
    name: "createAISkillGroup",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      let IDValidator = (rule, value, callback) => {
        if (value) {
          if (isID(value)) {
            hasAISkillGroupID({ai_skill_group_id: value}, this.token)
            .then(res => {
              if (res.code) {
                if (res.data) {
                  callback(new Error('该技能接口分组ID已存在'))
                } else {
                  callback()
                }
              }
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '网络异常，请检查网络状况'
              })
            })
          }else {
            callback(new Error('ID格式不合法，为6-20位字母、数字或下划线'))
          }
        }
      }
      return {
        createAISkillGroupForm: {
          name: '',
          description: '',
          ai_skill_group_id: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'},
            {max: 30, message: '分组名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '分组描述不能超过300个字符', trigger: 'blur'}
          ],
          ai_skill_group_id: [
            {required: true, message: '请输入分组ID', trigger: 'blur'},
            {validator: IDValidator, trigger: 'blur'}
          ]
        }
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
      createAISkillGroup() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        createAISkillGroupRequest(this.createAISkillGroupForm, this.token)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
            })
          } else {
            this.$store.commit(CREATE_AISKILLGROUP_DATA, res.data)
            this.$emit('update:isVisible', false)
            this.$message({
              type: 'success',
              message: '创建成功',
              duration: 1500
            })
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
      handleSubmit() {
        this.$refs.createAISkillGroupForm.validate(valid => {
          if (valid) {
            this.createAISkillGroup()
          }
        })
      },
      handleClose() {
        for (let key of Object.keys(this.createAISkillGroupForm)) {
          this.createAISkillGroupForm[key] = ''
        }
      },
    }
  }
</script>

<style scoped>
  .create-ai-skill-group-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>