<template>
  <div class="create-ai-skill">
    <el-dialog title="创建AI技能接口"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose"
               @opened="$refs.name.focus()">
      <el-form :model="createAISkillForm"
               :rules="rules"
               ref="createAISkillForm"
               class="create-ai-skill-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="createAISkillForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入AI接口名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="接口描述"
                        prop="description">
            <el-input v-model="createAISkillForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      placeholder="请输入接口描述"
                      show-word-limit
                      :autosize="{minRows: 3}"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="接口ID"
                        prop="ai_skill_id">
            <el-input v-model="createAISkillForm.ai_skill_id"
                      id="ai_skill_id"
                      ref="AISkillID"
                      placeholder="请输入接口唯一标识ID"
                      @keyup.enter.native="$refs.AISkillURL.focus()"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="接口URL"
                        prop="ai_skill_url">
            <el-input v-model="createAISkillForm.ai_skill_url"
                      id="ai_skill_url"
                      ref="AISkillURL"
                      placeholder="请输入接口URL"
                      type="url"
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

  import {isID} from 'utils/isID'
  import {isURL} from 'utils/isURL'
  import {
    createAISkillRequest,
    hasAISkillID
  } from 'api/AISkillManagement'


  export default {
    name: "createAISkill",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      AISkillGroupID: {
        type: String,
        required: true
      }
    },
    data() {
      let IDValidator = (rule, value, callback) => {
        if (value) {
          if (isID(value)) {
            hasAISkillID({ai_skill_id: value}, this.token)
              .then(res => {
                if (res.code) {
                  if (res.data) {
                    callback(new Error('该技能接口ID已存在'))
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
      let URLValidator = (rule, value, callback) => {
        if (value) {
          if (isURL(value)) {
            callback()
          } else {
            callback(new Error('URL格式不合法'))
          }
        }
      }
      return {
        createAISkillForm: {
          name: '',
          description: '',
          ai_skill_id: '',
          ai_skill_url: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入接口名称', trigger: 'blur'},
            {max: 30, message: '接口名称不能超过30个字符', trigger: 'blur'}
          ],
          description: [
            {max: 300, message: '接口描述不能超过300个字符', trigger: 'blur'}
          ],
          ai_skill_id: [
            {required: true, message: '请输入接口ID', trigger: 'blur'},
            {validator: IDValidator, trigger: 'blur'}
          ],
          ai_skill_url: [
            {required: true, message: '请输入接口URL', trigger: 'blur'},
            {validator: URLValidator, trigger: 'blur'}
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
      createAISkill() {
        const loading = this.$loading({
          lock: true,
          text: '创建中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        this.createAISkillForm.ai_skill_group_id = this.AISkillGroupID
        createAISkillRequest(this.createAISkillForm, this.token)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message({
              type: 'error',
              message: res['error_msg']
            })
          } else {
            this.$emit('create-ai-skill-data', res.data)
            this.$message({
              type: 'success',
              message: '创建成功',
              duration: 1500
            })
            this.$emit('update:isVisible', false)
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
        this.$refs.createAISkillForm.validate(valid => {
          if (valid) {
            this.createAISkill()
          }
        })
      },
      handleClose() {
        for (let key of Object.keys(this.createAISkillForm)) {
          this.createAISkillForm[key] = ''
        }
      }
    }
  }
</script>

<style scoped>
  .create-ai-skill-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>