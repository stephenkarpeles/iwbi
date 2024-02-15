<template>
  <div>
    <span class="uppercase text-primary-800 text-2xl">Totals by concept</span>

    <div class="flex flex-wrap">
      <div
        v-for="(concept, index) in surveyConceptNames"
        :key="index"
        class="mr-4 p-4 relative"
      >
        <img
          class="rounded-full w-8 mx-auto absolute"
          style="top: 40px; left: 50px"
          :src="`/scorecard/icons/${concept
            .replace(/\s+/g, '-')
            .toLowerCase()}.png`"
        />

        <DoughnutChart
          :styles="myStyles"
          :options="{
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            animation: {
              animateRotate: true,
            },
          }"
          :chart-data="{
            labels: [
              'Supportive',
              'Explore Further',
              'Not interested',
              'Undecided',
            ],
            datasets: [
              {
                backgroundColor: ['#255565', '#4094B0', '#306F63', '#D5D6D7'],
                data: [
                  conceptScore[concept].yes,
                  conceptScore[concept].maybe,
                  conceptScore[concept].no,
                  conceptScore[concept].question_count -
                    conceptScore[concept].yes -
                    conceptScore[concept].maybe -
                    conceptScore[concept].no,
                ],
              },
            ],
          }"
        />
        <div class="text-center font-semibold text-xs pt-2 leading-4">
          {{ concept.toUpperCase() }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('survey', ['conceptScore']),
    myStyles() {
      return {
        height: `80px`,
        width: `100px`,
        position: 'relative',
      }
    },
    surveyConceptNames() {
      if (this.conceptScore) {
        return Object.keys(this.conceptScore).map((concept) => concept)
      }
      return {}
    },
  },
  mounted() {
    this.loadSurvey()
  },
  methods: {
    ...mapActions('survey', ['loadSurvey']),
  },
}
</script>
