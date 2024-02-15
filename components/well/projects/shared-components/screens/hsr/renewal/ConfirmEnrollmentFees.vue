<template>
  <div>
    <div>
      <div class="">
        <div class="relative bg-white p-5 rounded-lg">
          <WHeadingsHThree
            class="mb-2"
            heading="Confirm your enrollment fees"
          />
          <FormulateForm @submit="optHsr('invoice')">
            <div class="mb-5">
              <FormulateInput
                v-model="reviewType"
                type="select"
                :disabled="project.date_certified"
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
                  <li>Support from our technical experts</li>
                  <li>
                    Resources to inform your health-focused strategies and
                    actions
                  </li>
                  <li>Third-party documentation review</li>
                </ul>
              </div>
              <div class="mt-5 text-sm">
                <p
                  class="
                    mb-5
                    bg-secondary-100
                    text-secondary-800
                    border border-secondary-600
                    rounded
                    p-2
                  "
                >
                  *Registered projects can choose to submit their WELL
                  Health-Safety Rating documents alongside their full
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
                        ? 'I would like to enroll for a separate review cycle for my WELL Health-Safety Rating documents.'
                        : 'Yes, we plan to submit our documents under one review and understand that if my project would like to change this decision, we will incur additional fees.'
                    "
                    validation="required"
                    class="px-3 py-5 text-sm font-bold"
                  />
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
                v-if="!isSubmitting"
                class="mt-3"
                type="submit"
                label="Proceed"
              />
              <WButtonsBase v-else disabled
                ><WLoadingSpinner type="button" class="mx-auto"
              /></WButtonsBase>
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      reviewChecked: '',
      reviewType: 1,
      isSubmitting: false,
    }
  },
  computed: {
    ...mapState({
      pricingDetails: (state) => state.recertification.pricingDetails,
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    recertificationPaymentStatus() {
      if (this.recertification) {
        return this.recertification.payment_status
      }
      return ''
    },
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
  watch: {
    project() {
      if (this.project.date_certified) {
        this.reviewType = 0
      }
    },
  },
  mounted() {
    this.reviewType = this.recertification ? this.recertification.hsr_review : 1

    if (this.project.date_certified) {
      this.reviewType = 0
    } else {
      this.reviewChecked = 1
    }
  },
  methods: {
    ...mapMutations('shared', ['setMode', 'setCurrentStep']),
    async optHsr(index) {
      this.isSubmitting = true
      const payload = {
        id: this.project.id,
        type: 'v2-hsr',
        hsr_review: this.reviewType,
      }
      await this.$store.dispatch(
        'recertification/createProjectRecertificationList',
        payload
      )
      localStorage.setItem('renewalChecklistModal', true)
      this.isSubmitting = false
      if (this.reviewType !== 0 && this.reviewType !== '0') {
        this.$router.push(
          `/projects/${this.project.type}/${this.project.project_number}/hsr`
        )
      } else {
        await this.$store.dispatch('recertification/getrecertificationList')
        await this.$store.dispatch(
          'project/getProjectInvoices',
          this.project.id
        )
        this.setMode(index)
        this.setCurrentStep('3')
      }
    },
  },
}
</script>
