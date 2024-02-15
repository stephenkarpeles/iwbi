<template>
  <div class="px-5">
    <p>
      Showcase your leadership with WELL Precertification, an optional interim
      designation. Precertification is available at
      <strong>no additional cost</strong> - this fee will be credited toward
      your overall certification fee. Benefits include:
    </p>
    <ul>
      <li>
        <strong>Early review</strong> - gain confidence that your proposed
        design, policies and initiatives are aligned with WELL’s requirements.
      </li>
      <li>
        <strong>An exclusive Precertification mark</strong> - display your mark
        on-site, online and in promotional materials to show stakeholders that
        you are committed to promoting health and well-being.
      </li>
      <li>
        <strong>Time savings</strong> - identify and resolve issues earlier in
        the process and reuse approved final documents for your final review.
      </li>
    </ul>
    <div
      v-if="estimate.price"
      class="bg-primary-100 text-primary-600 rounded p-3 mb-2"
    >
      Estimated Price:
      <span class="font-bold"
        >${{ estimate.price }} (credited toward overall certification fee)
      </span>
    </div>
    <div class="flex items-center">
      <a
        class="flex-1 mr-2"
        href="https://well.support/4182b6ca-2ac9-42b2-ae94-3a8ded5d98e6"
        target="_blank"
      >
        <WButtonsBase type="primaryInverted"> Learn More </WButtonsBase>
      </a>
      <div
        v-if="project.d_and_o_submitted !== 1 && project.doc_submitted !== 1"
        class="flex flex-1"
      >
        <WButtonsBase
          v-if="project.d_and_o !== 1"
          :disabled="loading"
          type="primary"
          @click.native="setPrecertification(1)"
          >{{ loading ? 'Opting in...' : 'Opt-in' }}
        </WButtonsBase>
        <WButtonsBase
          v-if="project.d_and_o === 1 && project.d_and_o_submitted !== 1"
          :disabled="loading"
          type="dangerInverted"
          @click.native="setPrecertification(0)"
          >{{ loading ? 'Opting out...' : 'Opt-out' }}
        </WButtonsBase>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      estimate: { price: '' },
      loading: false,
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
    }),
  },

  created() {
    this.getEstimate()
  },

  methods: {
    async setPrecertification(value) {
      this.loading = true
      await this.$store.dispatch('project/setPrecertification', value)
      this.loading = false
      if (value) {
        this.$router.push({
          path: `/projects/${this.project.type}/${this.project.project_number}/scorecard`,
          query: { ...this.$route.query },
        })
      }
      this.$parent.isHidden = true
    },
    getEstimate() {
      this.$store
        .dispatch('project/getPrecertification', this.project.type)
        .then((resp) => {
          this.estimate = resp.data
        })
    },
  },
}
</script>
