<template>
  <div>
    <div
      class="flex justify-center bg-cover text-white"
      :style="{
        backgroundImage: `url('https://cdn.wellcertified.com/static/images/hsr/confirmation-bg.png')`,
      }"
    >
      <div class="text-center">
        <img
          class="m-auto pt-5"
          :src="$config.assetsURL + 'wpr/wpr-seal-hd.png'"
          alt="WELL Health-Safety"
          width="75px"
          height="75px"
        />
        <WHeadingsHThree heading="Enrollment complete!" />
      </div>
    </div>
    <div class="text-sm p-5">
      <p>
        Congratulations on your commitment to advancing health through smarter
        buildings. The WELL Performance Rating is a roadmap for organizations to
        establish best practices for continuously monitoring and measuring
        building performance across key indoor environmental quality (IEQ)
        indicators related to air quality, water quality, thermal comfort,
        acoustics, lighting and occupant experience. By integrating the rating
        into your existing offerings, you can help your clients compare their
        building’s performance to global benchmarks for health and well-being
        and shift the way they do business for the better.
      </p>
      <p>
        Your next step is choosing the WELL Performance features that best meet
        your organization's goals and needs. The WELL Performance Rating focuses
        on measurable building performance strategies within WELL that are
        verified through onsite testing and sensor technology. Learn more about
        the WELL Performance Rating features
        <a
          class="text-primary-600"
          href="https://v2.wellcertified.com/en/performance-rating/overview"
          target="_blank"
          >here.</a
        >
      </p>
    </div>
    <div class="my-5 p-5">
      <WButtonsBase @click.native="goToLobby('checklist')">
        Go to account
      </WButtonsBase>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations('shared', ['setWprMode', 'setCurrentStep']),
    goToLobby(index) {
      this.setWprMode(index)
      this.setCurrentStep('0')
    },
  },
}
</script>
