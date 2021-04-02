<template>
  <div class="update-ai-skill">
    <el-dialog title="修改AI技能接口"
               width="450px"
               :center="true"
               :show-close="false"
               :visible.sync="$_isVisible"
               @close="$emit('update:isVisible', false)"
               @closed="handleClose(updated)"
               @open="updated = false"
               @opened="$refs.name.focus()">
      <el-form :model="updateAISkillForm"
               :rules="rules"
               ref="updateAISkillForm"
               @submit.native.prevent
               class="update-ai-skill-form">
        <div class="wrapper">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="updateAISkillForm.name"
                      id="name"
                      ref="name"
                      @keyup.enter.native="$refs.description.focus()"
                      placeholder="请输入接口名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="接口描述"
                        prop="description">
            <el-input v-model="updateAISkillForm.description"
                      id="description"
                      ref="description"
                      type="textarea"
                      maxlength="300"
                      show-word-limit
                      placeholder="请输入接口描述"
                      :autosize="{minRows: 3}"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="接口URL"
                        prop="ai_skill_url">
            <el-input v-model="updateAISkillForm.ai_skill_url"
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

  import {isURL} from 'utils/isURL'
  import {updateAISkillRequest} from 'api/AISkillManagement'


  export default {
    name: "updateAISkill",
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      AISkillDataRow: {
        type: Object,
        default: {}
      }
    },
    data() {
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
        updateAISkillForm: {
          name: '',
          description: '',
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
          ai_skill_url: [
            {required: true, message: '请输入接口URL', trigger: 'blur'},
            {validator: URLValidator, trigger: 'blur'}
          ]
        },
        updated: false
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
    watch: {
      AISkillDataRow: function (val) {
        this.updateAISkillForm.name = val.name
        this.updateAISkillForm.description = val.description
        this.updateAISkillForm.ai_skill_url = val.ai_skill_url
      }
    },
    methods: {
      updateAISkill() {
        let requestData = {}

        for (let key of Object.keys(this.updateAISkillForm)) {
          if (this.updateAISkillForm[key] !== this.AISkillDataRow[key]) {
            requestData[key] = this.updateAISkillForm[key]
          }
        }

        requestData['ai_skill_id'] = this.AISkillDataRow.ai_skill_id
        if (Object.keys(requestData).length > 1) {
          const loading = this.$loading({
            lock: true,
            text: '修改中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.8)'
          })
          updateAISkillRequest(requestData, this.token)
            .then(res => {
              loading.close()
              if (!res.code) {
                this.$message({
                  type: 'error',
                  message: res['error_msg']
                })
              } else {
                this.$emit('update-ai-skill-data', res.data)
                this.updated = true
                this.$emit('update:isVisible', false)
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  duration: 1500
                })
              }
            })
            .catch(err => {
              loading.close()
              console.log(err);
              this.$message({
                type: 'error',
                message: '网络异常，请检查网络状况'
              })
            })
        } else {
          this.$emit('update:isVisible', false)
        }
      },
      handleSubmit() {
        this.$refs.updateAISkillForm.validate(valid => {
          if (valid) {
            this.updateAISkill()
          }
        })
      },
      handleClose(updated) {
        if (!updated) {
          this.updateAISkillForm.name = this.AISkillDataRow.name
          this.updateAISkillForm.description = this.AISkillDataRow.description
          this.updateAISkillForm.ai_skill_url = this.AISkillDataRow.ai_skill_url
        }
      }
    }
  }
</script>

<style scoped>
  .update-ai-skill-form {
    margin: 0 auto;
    width: 85%;
  }
  .submit-btn {
    margin-right: 15px;
  }
</style>