<template>
  <div class="card card-w-shadow bg-white overflow-x-scroll md:overflow-hidden">
    <div class="row">
      <div class="col-md-10 offset-md-2 m-auto col-12 pd-y-40">
        <table
          class="benefits-table table table-responsive mg-y-15 shadow-base"
        >
          <thead>
            <tr>
              <th
                class="
                  px-6
                  py-3
                  bg-primary-700
                  text-left text-xs
                  leading-4
                  font-medium
                  text-white
                  uppercase
                  tracking-wider
                "
              >
                Benefit
              </th>
              <th
                class="
                  px-6
                  py-3
                  bg-primary-700
                  text-left text-xs
                  leading-4
                  font-medium
                  text-white
                  uppercase
                  tracking-wider
                "
              >
                How to access
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(benefit, index) in benefits" :key="index">
              <td
                v-if="getTextforBenefit(benefit) !== ''"
                :class="{ 'bg-primary-100': index % 2 }"
                class="px-6 py-4 text-sm leading-5 font-medium text-gray-900"
                v-html="benefit.desc"
              ></td>
              <td
                v-if="getTextforBenefit(benefit) !== ''"
                :class="{ 'bg-primary-100': index % 2 }"
                class="px-6 py-4 text-sm leading-5 font-medium text-gray-900"
                v-html="getTextforBenefit(benefit)"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    benefits: {
      type: Array,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      membership: (state) => state.membership.membership,
    }),
  },
  methods: {
    getTextforBenefit(benefit) {
      let applicablebenefit = null

      if (this.membership.type === 'Cornerstone') {
        applicablebenefit = benefit.membership_benefits.filter(
          (a) => a.membership_id === 1
        )[0]
      } else if (this.membership.type === 'Keystone') {
        applicablebenefit = benefit.membership_benefits.filter(
          (a) => a.membership_id === 2
        )[0]
      } else {
        applicablebenefit = benefit.membership_benefits.filter(
          (a) => a.membership_id === 3
        )[0]
      }

      if (
        (applicablebenefit && applicablebenefit.discount_percentage !== null) ||
        (applicablebenefit && applicablebenefit.discount_percentage > 0)
      ) {
        return (
          applicablebenefit.discount_percentage +
          '% ' +
          applicablebenefit.access_instruction
        )
      } else if (applicablebenefit && applicablebenefit.is_available) {
        if (applicablebenefit.access_instruction !== null) {
          const responseStr = applicablebenefit.access_instruction
          return responseStr
        }
      }
      return ''
    },
    getTextforBenefitChinese(benefit) {
      const applicablebenefit = benefit.membership_benefits.filter(
        (a) => a.membership_id === this.currentUser.membership_id
      )[0]
      if (applicablebenefit.access_instruction_ch !== null) {
        const responseStr = applicablebenefit.access_instruction_ch
        return responseStr
      }
      return ''
    },
  },
}
</script>
<style>
a {
  @apply text-primary-500 cursor-pointer;
}
</style>
