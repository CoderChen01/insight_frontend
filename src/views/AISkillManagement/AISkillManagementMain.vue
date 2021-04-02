<template>
  <management-style>
    <template v-slot:manamgeMain>
      <div class="header">
        <el-page-header @back="handleBack"
                        :content="currentPage">
        </el-page-header>
      </div>
      <div class="ai-skill-management-main">
        <ai-skill-group v-show="AISkillGroupVisible"
                        @retrieve-group="toAISkill"></ai-skill-group>
        <ai-skil v-if="AISkillGroupID && isAISkill"
                 :AISkillGroupID="AISkillGroupID"></ai-skil>
      </div>
    </template>
  </management-style>
</template>

<script>
  import managementStyle from 'components/common/managementStyle'
  import AISkill from 'components/content/AISkillManagement/AISkill'
  import AISkillGroup from 'components/content/AISkillManagement/AISkillGroup'


  export default {
    name: "AISkillManagementMain",
    components: {
      managementStyle,
      aiSkillGroup: AISkillGroup,
      aiSkil: AISkill
    },
    data() {
      return {
        AISkillGroupVisible: true,
        isAISkill: false,
        AISkillGroupID: '',
        currentPage: 'AI技能接口分组'
      }
    },
    methods: {
      handleBack() {
        this.AISkillGroupID = ''
        this.isAISkill = false
        this.AISkillGroupVisible = true
        this.currentPage = 'AI技能接口分组'
      },
      toAISkill(AISkillGroupID) {
        this.AISkillGroupVisible = false
        this.AISkillGroupID = AISkillGroupID
        this.isAISkill = true
        this.currentPage = 'AI技能接口'
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