<template>
  <div>
    <section>
      <div class="container">
        <div
          class="
            mb-4
            sm:mb-3
            md:mb-4
            leading-9
            text-3xl
            font-bold
            sm:text-left
            text-primary-900 text-center
          "
        >
          WELL Health-Safety Roadmap Tool
        </div>
        <div class="mb-8">
          <p
            class="
              text-base
              leading-6
              text-900
              opacity-70
              text-primary-900 text-center
              sm:text-left
            "
          >
            Please indicate your project's ability to meet the requirement
            described.
          </p>
        </div>
      </div>
    </section>
    <div v-if="!showProgramSpecific && !showReport">
      <transition-group
        enter-active-class="transition-all duration-700"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <WellAssessmentQuestions
          v-if="questions.length > 0"
          :key="questions[index].id"
          :question="questions[index]"
          :project-name="projectName"
          @answer="sendAnswer"
        ></WellAssessmentQuestions>
      </transition-group>
      <WellAssessmentStepsControl
        :can-click-back="index > 0"
        :next="index < questions.length - 1"
        :hide-next="questions.length && questions[index].answer ? false : true"
        @back="onClickedBack"
        @next="onClickedNext"
      ></WellAssessmentStepsControl>
    </div>
    <section v-else-if="showProgramSpecific && !showReport">
      <WellAssessmentProgramSpecific
        :errors="errors"
        @submitted="onProgramSpecific"
      ></WellAssessmentProgramSpecific>
      <WellAssessmentStepsControl :hide-next="true" @back="onClickedBack" />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  auth: false,
  asyncData({ params }) {
    const slug = params.assessmentCode
    return { slug }
  },
  data() {
    return {
      errors: [],
      index: 0,
      showProgramSpecific: false,
    }
  },
  computed: {
    ...mapState({
      showReport: (state) => state.assessment.completed,
      questions: (state) => state.assessment.questions,
      projectName: (state) => state.assessment.projectName,
    }),
  },
  async mounted() {
    await this.$store.dispatch('assessment/getForm', this.slug)

    if (this.showReport) {
      this.$router.push(`/shared-workspaces/roadmap/report/${this.slug}`)
    } else {
      let allAnswered = true
      for (const [i, q] of this.questions.entries()) {
        if (!q.answer) {
          this.index = i
          allAnswered = false
          break
        }
      }

      if (allAnswered) {
        this.showProgramSpecific = true
        this.index = this.questions.length - 1
      }
    }
  },
  methods: {
    async sendAnswer(value) {
      const id = this.questions[this.index].id
      await this.$store.dispatch('assessment/sendAnswer', {
        question_id: id,
        answer: value,
      })

      this.onClickedNext()
    },
    onClickedBack() {
      this.errors = []
      if (this.showProgramSpecific) {
        this.showProgramSpecific = false
        this.index = this.questions.length - 1
      } else if (this.index > 0) {
        this.index--
      }
    },
    async onProgramSpecific(v) {
      try {
        this.errors = []
        await this.$store.dispatch('assessment/finishSurvey', v)
        this.$router.push(`/shared-workspaces/roadmap/report/${this.slug}`)
      } catch (e) {
        this.errors = [e.response.data.message]
      }
    },
    onClickedNext() {
      const next = this.index + 1
      if (next === this.questions.length) {
        this.showProgramSpecific = true
      } else {
        this.index++
      }
    },
  },
}
</script>
