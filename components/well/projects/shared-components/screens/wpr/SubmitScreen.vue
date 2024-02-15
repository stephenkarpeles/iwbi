<template>
  <div>
    <div>
      <div class="">
        <div class="relative bg-white p-5 rounded-lg">
          <WHeadingsHThree
            class="mb-2"
            heading="Confirm your enrollment fees"
          />
          <div
            v-if="userRole === 'project-member'"
            class="bg-primary-100 text-primary-600 border border-primary-600 rounded p-1"
          >
            Only Project Administrators are allowed to opt-in for WELL Health
            Safety. Once the project has opted-in, all the team members can
            contribute to the Health Safety scorecard and documentation. Please
            reach out to your project admin to complete the WELL Health-Safety
            enrollment.
          </div>
          <FormulateForm v-if="pricingDetails" @submit="optWpr('terms')">
            <div class="mb-5">
              <FormulateInput
                v-model="reviewType"
                type="select"
                name="doc-submit-phase"
                label="Will you submit documentation for your rating and WELL Certification together?"
                placeholder="Select option"
                validation="required"
                :options="[
                  {
                    value: 1,
                    label: 'Yes, we will submit both during the same review.',
                  },
                  {
                    value: 0,
                    label: 'No, we will initiate a separate review cycle.',
                  },
                ]"
              />
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-bold">Enrollment fee</span>
              </div>
              <div>
                <span v-if="!reviewType || reviewType === '0'" class="font-bold"
                  >${{ pricingDetails.original_amount | formatNumber
                  }}<sup>*</sup></span
                >

                <span v-else class="font-bold">Included<sup>*</sup></span>
              </div>
            </div>
            <div>
              <p
                v-if="!reviewType || reviewType === '0'"
                class="text-sm font-bold leading-5"
              >
                1 location, $2,500 USD per location.
              </p>
              <div>
                <ul class="list-disc pl-5 text-sm mb-2.5 font-light leading-5">
                  <li>Dynamic digital WELL online dashboard</li>
                  <li>
                    Global team of technical experts through the community forum
                  </li>
                  <li>Curated technical tools and resources</li>
                  <li>Third-party documentation and performance review</li>
                  <li>Promotional awards package</li>
                </ul>
              </div>
              <div class="mt-5 text-sm">
                <p
                  class="mb-5 bg-secondary-100 text-secondary-800 border border-secondary-600 rounded p-2"
                >
                  *Registered projects can choose to submit their WELL
                  Performance Rating documents alongside their full
                  documentation for WELL Certification at no additional fee.
                </p>
                <p class="mb-5">
                  If you wish to achieve the rating prior to that submission,
                  you can elect to initiate an additional review cycle for
                  $2,500 USD per location.
                </p>
                <p class="mb-5">
                  Eligible discounts have already been applied to this fee.
                </p>
              </div>
              <div class="mt-5">
                <div class="mb-5">
                  <FormulateInput
                    v-model="reviewChecked"
                    name="terms"
                    type="checkbox"
                    :label="
                      !reviewType || reviewType === '0'
                        ? 'I would like to enroll for a separate review cycle for my WELL Performance Rating documents.'
                        : 'Yes, we plan to submit our documents under one review and understand that if my project would like to change this decision, we will incur additional fees.'
                    "
                    validation="required"
                    class="px-3 py-5 text-sm font-bold"
                  />
                  <span class="text-sm text-gray-500"
                    >*Onsite performance testing & data collection fees are
                    variable and dependent upon the features and parts a project
                    pursues.</span
                  >
                </div>
              </div>
              <div class="flex justify-end">
                <div class="text-sm font-bold">ENROLLMENT TOTAL</div>
              </div>
              <div class="flex justify-end">
                <div
                  v-if="!reviewType || reviewType === '0'"
                  class="text-primary-600 font-bold"
                >
                  ${{ pricingDetails.amount | formatNumber }}
                </div>

                <div v-else class="text-primary-600 font-bold">$0</div>
              </div>
            </div>
            <div class="flex justify-center mt-10">
              <FormulateInput
                class="mt-3"
                type="submit"
                label="View terms and conditions"
              />
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      reviewChecked: '',
      reviewType: 1,
    }
  },
  computed: {
    ...mapState({
      pricingDetails: (state) => state.project.pricingDetails,
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
    }),
    userRole() {
      return this.project &&
        this.project.members.find(
          (a) => a.pivot.user_id === this.currentUser.id
        )
        ? this.project.members.find(
            (a) => a.pivot.user_id === this.currentUser.id
          ).pivot.role
        : ''
    },
  },
  mounted() {
    if (this.$store.state.project.project.wpr_opt) {
      this.reviewType = this.$store.state.project.project.wpr_review
      this.reviewChecked = 1
    }
  },
  methods: {
    ...mapActions('project', ['detailsForExistingProject']),
    ...mapMutations('shared', ['setWprMode', 'setCurrentStep']),
    optWpr(index) {
      this.detailsForExistingProject({
        wpr_opt: 1,
        wpr_review: this.reviewType,
      })
      this.setWprMode(index)
      this.setCurrentStep('2')
    },
  },
}
</script>
