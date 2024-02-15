<template>
  <div>
    <div
      class="
        flex
        relative
        rounded-lg
        shadow-lg
        h-48
        bg-bottom bg-cover bg-no-repeat bg-primary-800
      "
    >
      <img
        class="absolute top-0 left-0 w-full h-full rounded-lg"
        :src="`/scorecard/banners/${concept}.png`"
      />
      <div
        class="
          h-5
          text-white
          hover:text-primary-300
          flex
          space-x-1
          absolute
          top-0
          left-0
          ml-2
          mt-2
          cursor-pointer
        "
        @click="showTitle = !showTitle"
      >
        <svg
          class="w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>about</div>
      </div>
      <div
        v-if="showTitle"
        class="relative mx-auto my-auto font-black text-5xl text-white"
      >
        {{ conceptCopy[concept].title }}
      </div>
      <div
        v-else
        class="relative mx-auto my-auto text-white px-10 max-w-4xl text-lg"
      >
        {{ conceptCopy[concept].body }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    concept: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTitle: true,
      conceptCopy: {
        All: {
          title: 'WELL Building Standard',
          body: 'WELL advances human health by outlining the most impactful performance standards, design interventions, maintenance protocols and organizational policies, all backed by the latest science and public health research. ',
        },
        Air: {
          title: 'AIR',
          body: 'Achieve high levels of indoor air quality across a building’s lifetime through pollution source elimination or reduction, active and passive building design and operation alternatives and human behavior interventions.',
        },
        Water: {
          title: 'Water',
          body: 'Increase the rate of adequate hydration, reduce health risks due to contaminated water and excessive moisture within buildings and provide adequate sanitation through better infrastructure design and operations.',
        },
        Nourishment: {
          title: 'Nourishment',
          body: 'Support healthy and sustainable eating patterns by increasing access to fruits and vegetables, limiting the availability of highly processed foods and designing environments that nudge individuals toward healthier choices.',
        },
        Light: {
          title: 'Light',
          body: 'Provide a lighting environment that reduces circadian phase disruption, improves sleep quality and positively impacts mood and productivity.',
        },
        Movement: {
          title: 'Movement',
          body: 'Promote movement, foster physical activity and discourage sedentary behavior by creating and enhancing opportunities through integrated design, policies and programs.',
        },
        'Thermal Comfort': {
          title: 'Thermal Comfort',
          body: 'Foster productivity and provide a maximum level of thermal comfort among all building users through improved HVAC system design and control and by meeting individual thermal preferences.',
        },
        Sound: {
          title: 'Sound',
          body: 'Address the concerns of acoustical comfort through research-based design considerations that buildings can accommodate for the purposes of improving occupant health and well-being.',
        },
        Materials: {
          title: 'Materials',
          body: 'Reduce human exposure, whether direct or through environmental contamination, to chemicals that may impact health during the construction, remodeling, furnishing and operation of buildings.',
        },
        Mind: {
          title: 'Mind',
          body: 'Promote mental health through policy, program and design alternatives that seek to address the diverse factors that influence cognitive and emotional well-being.',
        },
        Community: {
          title: 'Community',
          body: 'Support access to essential healthcare, build a culture of health that accommodates diverse population needs and establish an inclusive, engaged occupant community.',
        },
        Innovation: {
          title: 'Innovation',
          body: 'Develop unique alternatives for creating healthier environments.',
        },
        Innovations: {
          title: 'Innovations',
          body: 'Develop unique alternatives for creating healthier environments.',
        },
      },
    }
  },
}
</script>
