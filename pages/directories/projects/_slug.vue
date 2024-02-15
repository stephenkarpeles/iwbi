<template>
  <div class="flex flex-wrap">
    <div v-if="viewedProject" class="w-full">
      <div class="bg-white px-4 py-5 sm:px-6">
        <WLinksBase
          class="mb-4"
          link="/directories/projects/"
          icon="arrow-narrow-left"
        >
          Back to Project Directory
        </WLinksBase>
        <div
          class="-ml-4 -mt-4 mb-5 flex justify-between items-center flex-wrap sm:flex-nowrap"
        >
          <div class="ml-4 mt-4">
            <div class="text-4xl leading-7 font-semibold text-gray-900">
              {{ viewedProject.name }}
            </div>
            <p class="mt-2 text-2xl text-gray-500">
              <span v-if="viewedProject.state">{{ viewedProject.state }},</span>
              {{ projectCountry }}
            </p>
          </div>
          <div class="ml-4 mt-4 flex-shrink-0">
            <img
              v-if="viewedProject.cert_status"
              class="w-100 h-100 float-right"
              width="100"
              :src="certLogoUrl"
            />
          </div>
        </div>
        <div v-if="viewedProject.images.length" class="w-full">
          <img
            v-if="viewedProject.images.length === 1"
            class="my-5 w-100"
            :src="viewedProject.images[0].link_s3"
          />
          <SharedSlider
            v-else
            :slides="projectImages"
            bg-style="bg-contain bg-no-repeat bg-primary-700 bg-center bg-primary-800"
          />
        </div>
        <div class="border-t border-gray-200 mt-6 pt-6">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <dl
              v-if="viewedProject.profile"
              class="grid grid-cols-1 gap-y-8 sm:col-span-2 col-span-1"
            >
              <div>
                <dt class="text-sm font-bold text-primary-600 uppercase">
                  WELL Project Description
                </dt>
                <dd
                  class="mt-1 text-md text-gray-900"
                  v-html="replaceNextLine(viewedProject.profile.bio)"
                ></dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-primary-600 uppercase">
                  WELL Certification Process
                </dt>
                <dd
                  class="mt-1 text-md text-gray-900"
                  v-html="replaceNextLine(viewedProject.profile.approach)"
                ></dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-primary-600 uppercase">
                  Innovation
                </dt>
                <dd
                  class="mt-1 text-md text-gray-900"
                  v-html="replaceNextLine(viewedProject.profile.aspects)"
                ></dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-primary-600 uppercase">
                  Challenges
                </dt>
                <dd
                  class="mt-1 text-md text-gray-900"
                  v-html="replaceNextLine(viewedProject.profile.challenges)"
                ></dd>
              </div>
              <div>
                <dt class="text-sm font-bold text-primary-600 uppercase">
                  Results
                </dt>
                <dd
                  class="mt-1 text-md text-gray-900"
                  v-html="replaceNextLine(viewedProject.profile.impacts)"
                ></dd>
              </div>
            </dl>
            <dl class="col-span-1 p-5 rounded bg-primary-700 text-white">
              <div v-if="viewedProject.area" class="mb-5">
                <dt class="text-sm font-bold uppercase">Project Area</dt>
                <dd class="mt-1 text-lg" v-html="projectArea"></dd>
              </div>
              <div v-if="viewedProject.industry" class="mb-5">
                <dt class="text-sm font-bold uppercase">Industry</dt>
                <dd class="mt-1 text-lg">
                  {{ viewedProject.industry }}
                </dd>
              </div>
              <div v-if="viewedProject.cert_status" class="mb-5">
                <dt class="text-sm font-bold uppercase">
                  Certification Level Achieved
                </dt>
                <dd class="mt-1 text-lg">
                  {{ viewedProject.cert_status }}
                </dd>
              </div>
              <div
                v-if="
                  viewedProject.cert_status === null &&
                  viewedProject.pre_cert_date !== null
                "
                class="mb-5"
              >
                <dt class="text-sm font-bold uppercase">Project Status</dt>
                <dd class="mt-1 text-lg">Precertified</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Project Profile...</div>
      </div>
      <div v-else class="mx-auto text-center">
        <div class="mt-3 text-primary-400 font-medium">
          Cannot find project.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  auth: false,
  data() {
    return {
      error: null,
      currentTab: 'about',
      viewedProject: null,
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
    }),
    projectName() {
      if (this.viewedProject) {
        return this.viewedProject.name
      }
      return 'Project Profile'
    },
    certLogoUrl() {
      if (this.viewedProject.v1_project_standard === 'community') {
        return (
          'https://cdn.wellcertified.com/static/images/well-community-' +
          this.viewedProject.cert_status.toLowerCase() +
          '-solid.png'
        )
      } else {
        return (
          'https://cdn.wellcertified.com/static/images/well-' +
          this.viewedProject.cert_status.toLowerCase() +
          '-solid-new.png'
        )
      }
    },
    projectCountry() {
      if (this.viewedProject.country_code) {
        const ctry = this.countries.filter(
          (a) => a.code === this.viewedProject.country_code
        )
        if (ctry.length) return ctry[0].name
      }
      return ''
    },
    projectArea() {
      if (this.viewedProject.v1_project_standard === 'community') {
        return parseFloat(this.viewedProject.area).toLocaleString() + ' acres'
      } else {
        return parseFloat(this.viewedProject.area).toLocaleString() + ' sq ft'
      }
    },
    projectImages() {
      if (this.viewedProject.images.length) {
        const imagesArr = this.viewedProject.images.map((a) => {
          return { bgImg: a.link_s3 }
        })
        return imagesArr
      }
      return null
    },
  },
  async mounted() {
    return await this.$store
      .dispatch('project/getProjectProfileInfoBySlug', this.$route.params.slug)
      .then((res) => (this.viewedProject = res.data))
  },
  methods: {
    replaceNextLine(str) {
      if (str) {
        return str.replace(/\n/g, '<br/>')
      }
      return null
    },
  },
  head() {
    return {
      title: `${this.projectName}`,
    }
  },
}
</script>
