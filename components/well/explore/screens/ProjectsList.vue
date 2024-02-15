<template>
  <div class="overflow-y-scroll h-screen bg-white">
    <div id="projectList-row-1" class="w-11/12 mx-auto mb-5">
      <div class="flex flex-row px-3 py-2 items-center bg-gray-100 rounded-lg">
        <div class="">
          <WIconsBase icon="search-circle" class="w-4 h-4 text-gray-600" />
        </div>
        <div class="relative pl-3 flex-grow">
          <input
            v-model="nameSearchStr"
            type="text"
            class="
              block
              w-full
              p-0
              pr-7
              border-0
              text-gray-600
              bg-gray-100
              focus:border-0 focus:outline-none focus:shadow-none
            "
            @keyup="searchByProjectName($event)"
          />
          <div
            class="absolute top-0 right-0 cursor-pointer"
            @click="clearSearchByProjectName()"
          >
            <WIconsBase icon="x" class="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
    <!-- /#projectList-row-1 -->

    <div
      id="projectList-row-2"
      class="w-11/12 mx-auto mb-6 flex flex-row justify-between items-center"
    >
      <div class="text-sm text-black pt-3">
        <b v-html="projectsArray.length || 0"></b>
        <div class="font-bold color-79a4c7 inline">Health-Safety</div>
        locations
      </div>
      <p class="text-sm">
        <Popover ref="milesSelectPopover">
          <span class="cursor-pointer underline font-bold color-79a4c7">
            {{ milesOptions[radius] }} radius
          </span>
          <template #content>
            <div class="w-64 py-2 bg-white rounded-lg shadow-xl">
              <div
                v-for="(_str, _radius) in milesOptions"
                :key="_radius"
                class="block py-2 px-5 bg-white hover:bg-gray-100"
                @click="setRadius(_radius)"
                v-html="_str"
              />
            </div>
          </template>
        </Popover>
      </p>
    </div>
    <!-- /#projectList-row-2 -->

    <div id="projectList-row-3" class="w-11/12 mx-auto pb-10">
      <div
        v-for="(project, index) in projectsArray"
        :key="index"
        class="mb-8 pb-6 flex flex-col border-b border-gray-300 cursor-pointer"
        @click="goToProjectLanding(project)"
      >
        <div class="w-full h-40 rounded-lg relative overflow-hidden">
          <img
            :src="project.image ? project.image : '/explore/building_main.png'"
            class="block max-w-full h-auto rounded-lg"
            alt=""
          />
          <p
            class="
              absolute
              py-1.5
              px-2.5
              min-w-1/3
              top-2.5
              left-2.5
              rounded-lg
              bg-gray-700
              text-white text-xs text-center
              font-bold
            "
          >
            {{ project.distance }} miles away
          </p>
        </div>
        <h2
          class="pt-4 text-lg text-black font-bold"
          v-html="project.name"
        ></h2>
        <p class="pb-0 mb-0 text-sm text-gray-500" v-html="project.address"></p>
        <p
          class="pb-0 mb-0 mt-1 text-sm text-gray-500"
          v-html="
            `${project.street} ${
              project.state && project.state !== 'null'
                ? ', ' + project.state
                : ''
            }, ${project.country}.`
          "
        ></p>
      </div>
    </div>
    <!-- /#projectList-row-3 -->
  </div>
</template>

<script>
export default {
  props: {
    projects: {
      type: Array,
      default: null,
    },
    defaultCoordinates: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      nameSearchStr: null,
      projectsArray: this.projects,
      radius: 5,
      nameSearch: '',
      search_query: '',
      total_results: 10,
      saved_pins: 5,
      milesOptions: {
        1: '1 Mile',
        5: '5 Miles',
        10: '10 Miles',
        50: '50 Miles',
      },
    }
  },
  async mounted() {
    this.projectsArray = await this.loadNearbyLocations()
    this.$parent.$parent.$parent.nearByLocations = this.projectsArray
  },
  methods: {
    findResults() {},
    goToProjectLanding({ type, number }) {
      this.$router.push(
        {
          path: '/health-safety-explore',
          force: true,
          query: {
            view: 'ProjectLanding',
            projectType: type,
            projectNumber: number,
          },
        },
        () => {}
      )
    },
    setRadiusModalHidden(newStatus) {
      this.$refs.setRadiusModal.isHidden = newStatus
    },
    async searchByProjectName(evt) {
      if (evt.keyCode === 13) {
        this.nameSearch = this.nameSearchStr
        this.projectsArray = await this.loadNearbyLocations()
        this.$parent.$parent.$parent.nearByLocations = this.projectsArray
      }
    },
    async clearSearchByProjectName() {
      this.nameSearch = null
      this.nameSearchStr = ''
      this.projectsArray = await this.loadNearbyLocations()
      this.$parent.$parent.$parent.nearByLocations = this.projectsArray
    },
    async setRadius(newRadius) {
      this.radius = newRadius
      this.projectsArray = await this.loadNearbyLocations()
      this.$parent.$parent.$parent.nearByLocations = this.projectsArray
      this.$refs.milesSelectPopover.isActive = false
    },
    async loadNearbyLocations() {
      return await this.$axios
        .get('api/public/hsr/areaSearch', {
          params: {
            lat: this.defaultCoordinates.lat,
            lng: this.defaultCoordinates.lng,
            radius: this.radius,
            name: this.nameSearch || null,
          },
        })
        .then((response) => {
          if (response.data && response.data.length) {
            return response.data
          } else {
            return []
          }
        })
        .catch(() => {
          return []
        })
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

p {
  margin-bottom: unset !important;
}

.no-number-arrows {
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
