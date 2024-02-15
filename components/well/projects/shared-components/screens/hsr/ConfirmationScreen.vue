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
          src="https://cdn.wellcertified.com/static/images/hsr/health-safety-logo.png"
          alt="WELL Health-Safety"
          width="75px"
          height="75px"
        />
        <WHeadingsHThree heading="Enrollment complete!" />
      </div>
    </div>
    <div class="text-sm p-5">
      <p>
        Congratulations on your commitment to supporting people’s health, safety
        and well-being through facility management and operations. The COVID-19
        epidemic has highlighted the critical role that buildings play in virus
        transmission. The WELL Health-Safety Rating can help guide you in
        preparing your spaces for re-entry as they respond to COVID-19,
        instilling confidence in those who frequent your locations, including
        staff, visitors and stakeholders alike.
      </p>
      <p>
        Your next step is choosing the WELL Health-Safety features that best
        meet your organization’s goals and needs. While developed in response to
        the COVID-19 pandemic, the WELL Health-Safety Rating also includes
        alternatives for far-reaching applicability in supporting the ongoing
        health and safety needs of people in a given space, during both normal
        operating periods and in times of emergencies. Learn more about the
        <a
          class="text-primary-600"
          href="https://v2.wellcertified.com/health-safety/en/overview"
          target="_blank"
          >WELL Health-Safety Rating features</a
        >
        and how they can support your organization.
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
    ...mapMutations('shared', ['setMode', 'setCurrentStep']),
    goToLobby(index) {
      this.setMode(index)
      this.setCurrentStep('0')
    },
  },
}
</script>
