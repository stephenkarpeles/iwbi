<template>
  <div
    id="projectLanding-container"
    class="h-screen overflow-y-scroll bg-white pb-32"
  >
    <div id="projectLanding-row-1" class="relative overflow-visible">
      <div
        id="projectLanding-slides"
        :style="{ backgroundImage: `url(${getProjectImageUrl()})` }"
        class="w-full h-64 mt-0"
      />

      <div
        class="
          w-10
          h-10
          absolute
          top-2
          left-2
          flex
          items-center
          justify-center
          bg-black
          rounded-full
          opacity-50
          cursor-pointer
        "
        @click="backToMapView()"
      >
        <WIconsBase
          id="projectLanding-backBtn"
          icon="arrow-narrow-left"
          class="w-6 h-6 text-white text-2xl font-black"
        />
      </div>
      <div
        class="
          absolute
          -bottom-10
          right-6
          w-24
          h-24
          rounded-full
          border-4 border-white
          z-30
          bg-79a4c7
        "
      >
        <div class="w-full h-full rounded-full border-4 border-79a4c7">
          <img src="/explore/hsr.png" alt="" />
        </div>
      </div>
    </div>
    <!-- /#projectLanding-row-1 -->

    <div id="projectLanding-row-2" class="flex flex-col">
      <div id="projectLanding-row-2-inner" class="w-11/12 mx-auto mt-3">
        <p
          v-if="projectObject.certified_date"
          class="w-1/2 text-sm font-bold color-79a4c7"
        >
          WELL Health-Safety
          <br />
          Rated on:
          <br />
          {{ $dayjs(projectObject.certified_date).format('MMM DD, YYYY') }}
        </p>

        <h1
          class="mt-4 text-xl color-black font-bold"
          v-html="projectObject.name"
        />

        <div class="mt-1 flex flex-row items-center">
          <WIconsBase icon="pin" class="text-secondary-700 w-3 h-3" />
          <span v-if="projectObject.address" class="text-sm text-gray-500">
            <span
              v-if="projectObject.address.street"
              v-html="projectObject.address.street + ', '"
            />
            <span
              v-if="projectObject.address.city"
              v-html="projectObject.address.city + ', '"
            />
            <span
              v-if="projectObject.address.state"
              v-html="projectObject.address.state + ', '"
            />
            <span
              v-if="projectObject.address.country_name"
              v-html="projectObject.address.country_name"
            />
          </span>
        </div>

        <div class="mt-1 flex flex-row items-center">
          <WIconsBase icon="category" class="text-secondary-700 w-3 h-3" />
          <span class="text-sm text-gray-500"> Commercial office </span>
        </div>

        <div class="pt-6 mt-6 mb-3 border-t border-gray-300">
          <h2 class="mb-2 text-l color-black font-bold">
            This location is WELL Health-Safety Rated
          </h2>

          <p class="text-sm leading-5 text-gray-500 projectLanding-p">
            From handwashing support and cleaning practices to health services
            and air and water quality monitoring protocols, this facility has
            been comprehensively reviewed and rated to help support the health
            and safety of everyone who walks through the door. View all
            locations in this portfolio
          </p>
        </div>
      </div>
    </div>
    <!-- /#projectLanding-row-2 -->

    <div id="projectLanding-row-3" class="mt-4 py-7 flex flex-col">
      <div class="w-72 h-72 mx-auto rounded-full overflow-hidden">
        <img src="/explore/seal-photo.png" alt="" />
      </div>

      <div
        class="w-80 mx-auto mt-2 text-center text-green-800 text-3xl font-bold"
        style="color: #1e4d5c"
      >
        Feeling safe is universal. But it means something different to each of
        us.
      </div>

      <div class="w-11/12 mx-auto">
        <WLinksBase
          link="https://www.wellcertified.com/health-safety/"
          target="_blank"
        >
          <WButtonsBase class="mt-4">
            Learn more about the WELL Health-Safety Rating
          </WButtonsBase>
        </WLinksBase>
      </div>
    </div>
    <!-- /#projectLanding-row-3 -->

    <div id="projectLanding-row-4" class="w-11/12 mx-auto mt-5 flex flex-col">
      <h2 class="mb-2 text-xl color-black font-bold">How we achieved it.</h2>
      <p class="text-sm leading-5 text-gray-500 projectLanding-p">
        From handwashing support and cleaning practices to health services and
        air and water quality monitoring protocols, this space has been
        comprehensively reviewed and rated to help support the health and safety
        of everyone who walks through the door.
      </p>

      <p class="mt-2 max-w-sm text-sm font-bold color-79a4c7">
        WELL Health-Safety concepts
      </p>

      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-1" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Cleaning and Sanitization Procedures
        </a>
      </div>

      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-2" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Emergency Preparedness Programs
        </a>
      </div>
      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-3" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Health Service Resources
        </a>
      </div>
      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-4" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Air & Water Quality Management
        </a>
      </div>
      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-5" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Stakeholder Engagement & Communication
        </a>
      </div>
      <div class="flex flex-row items-center mb-2.5">
        <div class="flex items-start justify-start w-12 h-12">
          <WIconsBase icon="project-details-6" class="text-white w-12 h-12" />
        </div>
        <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
          Innovation
        </a>
      </div>
    </div>
    <!-- /#projectLanding-row-4 -->

    <div
      id="projectLanding-row-5"
      class="w-11/12 mx-auto mt-5 pt-7 flex flex-col border-t border-gray-300"
    >
      <div class="flex flex-col">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-1" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">
          Cleaning and Sanitization Procedures
        </h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          COVID-19 and many other diseases are spread primary through close
          contact with an infected person via respiratory droplets. Low-hazard
          cleaning products and cleaning practices reduce impacts in indoor air
          quality and in health of those performing these duties, while
          protecting occupants as well.
        </p>

        <!--
        <h5 class="mt-2.5 text-sm font-bold color-79a4c7">Features achieved</h5>
        <div class="flex flex-col mt-2.5">
          <div class="flex flex-row items-center">
            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
            <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
              Cleaning and Sanitization Procedure
            </a>
          </div>
        </div>

        <div class="flex flex-col mt-2.5">
          <div class="flex flex-row items-center">
            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
            <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
              Cleaning and Sanitization Procedure
            </a>
          </div>
        </div>
        <div class="flex flex-col mt-2.5">
          <div class="flex flex-row items-center">
            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
            <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
              Cleaning and Sanitization Procedure
            </a>
          </div>
        </div>
        <div class="flex flex-col mt-2.5">
          <div class="flex flex-row items-center">
            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
            <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
              Cleaning and Sanitization Procedure
            </a>
          </div>
        </div>
        <div class="flex flex-col mt-2.5">
          <div class="flex flex-row items-center">
            <div class="w-4 h-4 rounded-full bg-blue-700"></div>
            <a href="#" class="ml-2.5 text-sm font-bold underline color-79a4c7">
              Cleaning and Sanitization Procedure
            </a>
          </div>
        </div>
        -->
      </div>

      <!-- repeated... -->
      <div class="flex flex-col mt-9">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-2" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">
          Emergency Preparedness Programs
        </h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          Infectious disease epidemics have increased in the 21st century,
          involving fast global spread due to travel, trade and urbanization.2
          Robust emergency preparedness and response measures can minimize
          occupant confusion, improve coordination and safety during emergency
          situations, and slow the spread of infectious disease and minimize
          secondary mortality.
        </p>
      </div>
      <div class="flex flex-col mt-9">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-3" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">
          Health Service Resources
        </h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          The COVID-19 pandemic has illustrated how the behaviors of one person
          can negatively impact others in severy ways. These strategies focus on
          ways to foster individual actions that support health and safety for
          all in a space.
        </p>
      </div>
      <div class="flex flex-col mt-9">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-4" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">
          Air & Water Quality Management
        </h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          Without proper maintenance and filtration, heating, ventilation and
          air conditioning systems can build up mold and particulates that can
          propagate respiratory diseases, especially after periods of
          inactivity.5 Exposure to a range of contaminants in water can also
          result in negative health impacts, including the spread of infectious
          disease.
        </p>
      </div>
      <div class="flex flex-col mt-9">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-5" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">
          Stakeholder Engagement & Communication
        </h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          Based on the effects of previous SARS outbreaks, COVID-19 is predicted
          to have lasting physical and mental health impacts.7 Multi-modal
          health promotion programming, educational materials and communications
          can help promote health literacy and increase positive health
          outcomes.
        </p>
      </div>
      <div class="flex flex-col mt-9">
        <div class="flex items-center justify-center w-20 h-20">
          <WIconsBase icon="project-details-6" class="text-white w-20 h-20" />
        </div>
        <h3 class="mt-2.5 text-lg text-black font-bold">Innovation</h3>
        <p class="mt-2 text-sm leading-5 text-gray-500 projectLanding-p">
          Today, many organizations are facing unprecedented challenges in
          addressing health and well-being. It is a critical time for
          innovation; new alternatives and ever-evolving research are pivotal in
          preparing for a post-COVID-19 environment and for addressing broader
          health and safety-related issues in the future.
        </p>
      </div>
    </div>
    <!-- /#projectLanding-row-5 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectObject: {},
    }
  },
  async fetch() {
    const { projectType, projectNumber } = this.$route.query
    if (projectType && projectNumber) {
      this.projectObject = await this.$axios
        .get(`api/public/hsr/${projectType}/${projectNumber}`)
        .then((response) => response.data)
        .catch(() => {
          this.backToMapView()
          return {}
        })
    } else {
      this.backToMapView()
    }
  },
  watch: {
    $route: {
      handler(newValue) {
        if (
          newValue.query &&
          Object.keys(newValue.query).length === 0 &&
          newValue.query.constructor === Object
        ) {
          this.$parent.currentTab = 'MapView'
        }
      },
      deep: true,
    },
  },
  methods: {
    getProjectImageUrl() {
      return this.projectObject.image || '/explore/building_main.png'
    },
    backToMapView() {
      this.$router.push('/health-safety-explore')
    },
  },
}
</script>

<style scoped lang="scss">
.color-79a4c7 {
  color: #79a4c7;
}

.bg-79a4c7 {
  background-color: #79a4c7;
}

.border-79a4c7 {
  border-color: #79a4c7;
}

.projectLanding-p {
  a {
    color: #4498b4;
    text-decoration: underline;
  }
}

#projectLanding-slides {
  background-repeat: no-repeat;
  background-size: cover;
}

#projectLanding-row-3 {
  background-repeat: repeat;
  background-image: url('/explore/gradient-11.jpg');
}
</style>
