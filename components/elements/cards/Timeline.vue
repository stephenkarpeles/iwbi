<template>
  <div class="rounded-md border border-primary-300 p-6 bg-primary-100 shadow">
    <span class="uppercase text-primary-600 text-sm font-bold"
      >YOUR WELL JOURNEY</span
    >
    <div class="border-b border-primary-200 flex flex-col space-y-2 pb-8">
      <span class="text-primary-900 text-lg">{{ header.title }}</span>
      <span class="text-primary-900 text-sm opacity-50">{{
        header.subTitle
      }}</span>
    </div>

    <div class="flex flex-col space-y-4 mt-4">
      <div class="w-full">
        <StepVertical
          :steps="[
            {
              label: `${$dayjs(module.date_certified).format(
                'MMM DD, YYYY'
              )}\nWELL CERTIFIED`,
              value: 'current',
            },
            {
              label: `${$dayjs(module.date_certified)
                .add(15, 'month')
                .format('MMM DD, YYYY')}\nYEAR 1 REPORTING`,
              value: 'current',
            },
            {
              label: `${$dayjs(module.date_certified)
                .add(27, 'month')
                .format('MMM DD, YYYY')}\nYEAR 2 REPORTING`,
              value: 'current',
            },
            {
              label: `${$dayjs(module.date_certified)
                .add(3, 'year')
                .format(
                  'MMM DD, YYYY'
                )}\nYEAR 3 REPORTING & ENROLL FOR RECERTIFICATION`,
              value: 'current',
            },
            {
              label: `${$dayjs(module.date_certified)
                .add(4, 'year')
                .format('MMM DD, YYYY')}\nCOMPLETE RECERTIFICATION PROCESS`,
              value: 'current',
            },
          ]"
        />
      </div>
      <div class="grid grid-cols-5 grid-rows-1 gap-x-2 lg:pt-6 md:pt-4">
        <div class="flex flex-col justify-between col-span-1">
          <span class="text-sm textprimary-900 opacity-50"
            >Access the Marketing and PR Guidelines to tell your WELL building's
            story.</span
          >
          <button
            class="text-primary-500 bg-white rounded-md py-2 px-3 text-sm border border-primary-300 font-semibold hover:text-primary-400"
            @click="
              openLink(
                'https://resources.wellcertified.com/articles/marketing-and-pr-guidelines-for-well-projects/'
              )
            "
          >
            Marketing and PR Guideline
          </button>
        </div>
        <div class="flex flex-col justify-between col-span-2">
          <div class="flex flex-col space-y-2">
            <span class="textprimary-900 opacity-50">ONGOING REPORTING</span>
            <span class="text-sm textprimary-900 opacity-50">
              From regular cleaning logs to surveys of employee satisfaction,
              consistent data tracking and annual reporting help organizations
              stay on gather insights about each location and stay on
              track.</span
            >
          </div>
          <div class="flex flex-col space-y-2 mt-12">
            <button
              class="text-primary-500 bg-white rounded-md py-2 px-3 text-sm border border-primary-300 font-semibold hover:text-primary-400"
              @click="
                $router.push(
                  `/projects/${module.type}/${module.project_number}/documents`
                )
              "
            >
              Upload Ongoing Data
            </button>
            <button
              class="text-primary-500 bg-white rounded-md py-2 px-3 text-sm border border-primary-300 font-semibold hover:text-primary-400"
              @click="
                openLink(
                  'https://well.support/9b79fdc8-6146-49b6-906f-5af3d0f8eb0d'
                )
              "
            >
              Ongoing reporting guidance
            </button>
          </div>
        </div>
        <div class="flex flex-col justify-between col-span-2">
          <div class="flex flex-col space-y-2">
            <span class="textprimary-900 opacity-50">RECERTIFICATION</span>
            <span class="text-sm textprimary-900 opacity-50">
              Recertification, which is required every three years following
              initial certification, helps ensure that the project is continuing
              to operate at a high standard for people's health and well-being.
              Learn more about the process using the guidance below.</span
            >
          </div>
          <div class="flex flex-col space-y-2 mt-4">
            <button
              class="text-primary-500 bg-white rounded-md py-2 px-3 text-sm border border-primary-300 font-semibold hover:text-primary-400"
              @click="
                openLink(
                  'https://well.support/bb85a069-e332-4020-b8b7-d7bdb7953c82'
                )
              "
            >
              Recertification guidance
            </button>
            <button
              v-if="project.type !== 'v2'"
              class="text-primary-500 bg-white rounded-md py-2 px-3 text-sm border border-primary-300 font-semibold hover:text-primary-400"
              @click="
                openLink(
                  project.type === 'v1'
                    ? 'https://resources.wellcertified.com/tools/recertification-well-v1/'
                    : 'https://resources.wellcertified.com/tools/recertification-well-v2-pilot/'
                )
              "
            >
              Assessment tool for upgrading to v2
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    header() {
      if (
        this.recertificationList &&
        this.recertificationList.filter((a) => a.type !== 'v2-hsr').length
      ) {
        return {
          title: 'Complete your recertification',
          subTitle:
            'Ongoing reporting and recertification are the heart of what makes the WELL system an impactful tool over the lifespan of a project.',
        }
      }
      const temp = { title: '', subTitle: '' }
      const dateCertified = this.module.date_certified
      if (
        this.calculateDiff(dateCertified, this.calculateNewDate(3, 'month'))
      ) {
        temp.title = 'Celebrate your achievement'
        temp.subTitle = `Learn how to tell your building's WELL story and celebrate your achievement using the resources below.`
      } else {
        temp.title = 'Ongoing reporting and recertification'
        temp.subTitle =
          'Ongoing reporting and recertification are the heart of what makes the WELL system an impactful tool over the lifespan of a project.'
      }
      return temp
    },
  },
  methods: {
    openLink(url) {
      window.open(url, '_blank')
    },
    calculateNewDate(delta, type) {
      return this.$dayjs(this.module.date_certified).add(delta, type)
    },
    calculateDiff(start, end) {
      const currentDate = this.$dayjs(new Date())
      return this.isBetween(currentDate, start, end, true, true)
    },
    isBetween(
      date,
      dateStart,
      dateEnd,
      includeStart = false,
      includeEnd = false
    ) {
      let result = date.isAfter(dateStart) && date.isBefore(dateEnd)
      if (!result && includeStart) result = date.isSame(dateStart)
      if (!result && includeEnd) result = date.isSame(dateEnd)
      return result
    },
  },
}
</script>
