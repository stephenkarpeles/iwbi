<template>
  <div>
    <div class="">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="Membership" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'SUBSCRIBE',
              status: 'current',
            },
            {
              name: 'CONFIRMATION',
              status: '',
            },
            {
              name: 'PAYMENT',
              status: '',
            },
          ]"
        />
      </NavBreadcrumbs>

      <div class="relative bg-white rounded-lg shadow-md">
        <div class="hidden lg:block lg:absolute lg:inset-0">
          <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              class="h-56 w-full object-cover lg:absolute lg:h-full rounded-r-lg"
              :src="'/membership/register/' + currentStep + '.jpg'"
              alt=""
            />
          </div>
        </div>
        <div
          class="border rounded-lg relative py-6 px-4 xl:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
        >
          <div class="lg:pr-8">
            <div
              :class="{ hidden: currentStep !== 0 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Organization Details"
                sub-heading="Sharing your organization's email domain(s) allows IWBI to more easily identify your fellow colleagues and in turn give them access to your firm's IWBI membership. (ex: @wellcertified.com)"
              >
              </WHeadingsHTwo>

              <FormulateForm class="space-y-4 mt-4" @submit="validateStep">
                <FormulateInput
                  v-model="formData.name"
                  type="text"
                  label="Organization name*"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.membership_id"
                  :options="membershipLevels"
                  label="Membership Level*"
                  type="select"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.profile_pic"
                  label="Organization Logo*"
                  :value="formData.profile_pic"
                  type="fileupload"
                  upload-path="membership/"
                  mime-types="image/png,image/jpeg,image/jpg"
                  validation="required|max: 1"
                />
                <FormulateInput
                  v-model="formData.no_of_years"
                  :options="{
                    1: '1 year',
                    2: '2 years',
                    3: '3 years',
                    4: '4 years',
                    5: '5 years',
                  }"
                  type="radio"
                  label="Number of years*"
                  validation="required"
                />

                <FormulateInput
                  v-model="formData.domains"
                  type="group"
                  name="domains"
                  :repeatable="true"
                  add-label="+ Add Domain"
                  remove-label="x"
                >
                  <!-- Replaces label / contains tool tip -->
                  <template slot="label">
                    <label
                      class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >Organization Domains
                      <Flyout
                        ref="domainFlyout"
                        y="bottom"
                        x="right"
                        class="h-full"
                      >
                        <WButtonsBase
                          type="tooltip"
                          icon="information-circle-small"
                        />
                        <template #content>
                          <div class="p-3 w-60">
                            Enter the email domain(s) used by your organization
                            (the part of your email address that comes after the
                            @ symbol)
                          </div>
                        </template>
                      </Flyout>
                    </label>
                  </template>

                  <FormulateInput
                    type="text"
                    name="domain"
                    label="Domain"
                    placeholder="@"
                  >
                  </FormulateInput>
                </FormulateInput>
                <FormulateInput
                  v-model="formData.website"
                  type="url"
                  name="A website"
                  label="Organization website"
                  placeholder="http://"
                />

                <div v-if="!discountApplied">
                  <div class="mt-8 flex space-x-4 mx-auto">
                    <FormulateInput
                      v-model="formData.discount_code"
                      class="w-full"
                      type="text"
                      label="Discount Code"
                      validation="optional"
                    />
                    <div class="w-24 mt-6 -ml-5">
                      <WButtonsBase @click.native="applyDiscount">
                        Apply
                      </WButtonsBase>
                    </div>
                  </div>
                  <div v-if="discountError" class="mt-2 text-sm text-red-600">
                    {{ discountError }}
                  </div>
                </div>
                <!-- Discount code controls -->
                <div v-else class="rounded-md bg-green-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <!-- Heroicon name: solid/check-circle -->
                      <svg
                        class="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-800">
                        Successfully applied: {{ formData.discount_code }}
                      </p>
                    </div>
                    <div class="ml-auto pl-3">
                      <div class="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                          @click="
                            () => {
                              formData.discount_code = null
                              discountApplied = false
                              discountError = null
                            }
                          "
                        >
                          <span class="sr-only">Dismiss</span>
                          <!-- Heroicon name: solid/x -->
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <FormulateInput class="mt-5" type="submit" label="Continue" />
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 1 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Point of Contact"
                sub-heading="The individual completing this registration will be automatically assigned as the IWBI membership point of contact for the organization. The point of contact will be included on all communication related to IWBI membership and has the ability to add colleagues to the membership in WELL Online."
              />

              <FormulateForm class="space-y-4 mt-4" @submit="validateStep">
                <FormulateInput
                  v-model="formData.poc_name"
                  type="text"
                  name="Name"
                  label="Name*"
                  validation="required"
                />

                <FormulateInput
                  v-model="formData.poc_email"
                  type="text"
                  name="Email Address"
                  label="Email Address*"
                  validation="required"
                />

                <FormulateInput
                  v-model="formData.poc_job_title"
                  type="text"
                  name="Job Title"
                  label="Job Title"
                />

                <FormulateInput
                  v-model="formData.poc_phone"
                  type="tel"
                  name="phone"
                  label="Phone Number"
                />

                <FormulateInput
                  v-model="formData.poc_public"
                  type="checkbox"
                  label="I agree to share my point of contact details on the membership profile directory."
                />

                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        ;(currentStep = 0),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>

            <div
              :class="{ hidden: currentStep !== 2 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Owner Details"
                sub-heading="The IWBI membership owner is the individual who holds the authority to make decisions related to the organization’s membership."
              >
              </WHeadingsHTwo>

              <FormulateForm class="space-y-4 mt-4" @submit="validateStep">
                <FormulateInput
                  v-model="formData.owner_name"
                  type="text"
                  name="Owner Name"
                  label="Owner Name*"
                  validation="required"
                />

                <FormulateInput
                  v-model="formData.owner_email"
                  type="text"
                  name="Owner Email Address"
                  label="Owner Email Address*"
                  validation="required"
                />

                <FormulateInput
                  v-model="formData.owner_job_title"
                  type="text"
                  name="Owner Job Title"
                  label="Owner Job Title"
                />

                <FormulateInput
                  v-model="formData.owner_phone"
                  type="tel"
                  name="phone"
                  label="Owner Phone Number"
                />

                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        ;(currentStep = 1),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>

            <div
              :class="{ hidden: currentStep !== 3 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo heading="Office Address"> </WHeadingsHTwo>

              <FormulateForm class="space-y-4 mt-4" @submit="validateStep">
                <FormInputsAddressFormulate
                  :address="officeAddress"
                  :target="officeAddress"
                  :required="true"
                />

                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        ;(currentStep = 2),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>

            <div
              :class="{ hidden: currentStep !== 4 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo heading="Terms"> </WHeadingsHTwo>

              <FormulateForm class="space-y-4 mt-4" @submit="validateStep">
                <label
                  for="countrymailing"
                  class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Terms and Conditions
                </label>

                <div
                  class="border border-primary-200 h-48 overflow-auto p-3 rounded-md"
                >
                  <LegalGenericAgreement />
                </div>
                <FormulateInput
                  type="checkbox"
                  label="I accept the terms and conditions"
                  validation="required"
                />

                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        ;(currentStep = 3),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <WButtonsBase v-if="submitting" :type="'primaryInverted'">
                      <span>
                        <WLoadingSpinner type="button" class="mx-auto" />
                      </span>
                    </WButtonsBase>
                    <FormulateInput
                      v-else
                      type="submit"
                      :label="
                        Object.keys(membership).length === 0
                          ? 'Proceed to Payment'
                          : 'Update'
                      "
                    />
                  </span>
                </div>
              </FormulateForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  async asyncData({ store, redirect, params }) {
    await Promise.all([
      store.dispatch('membership/getMembershipList'),
      store.dispatch('membership/getMembership'),
    ])

    let formData

    if (params.planId || store.state.membership.membership.length !== 0) {
      formData = {
        membership_id: params.planId,
        profile_pic: [],
        website: null,
        country_code: null,
        state: null,
        city: null,
        postal_code: null,
        street: null,
        poc_name: null,
        poc_email: null,
        poc_job_title: null,
        poc_phone: null,
        poc_public: null,
        owner_name: null,
        owner_email: null,
        owner_phone: null,
        owner_job_title: null,
        no_of_years: null,
        discount_code: null,
        domains: null,
        name: null,
      }

      const membershipState = store.state.membership.membership

      if (Object.keys(membershipState).length !== 0) {
        formData = {
          id: membershipState.id,
          membership_id: membershipState.subscriptions[0].membership_id,
          profile_pic: [{ url: membershipState.profile_pic }],
          website: membershipState.website,
          country_code: membershipState.addresses[0].country_code,
          state: membershipState.addresses[0].state,
          city: membershipState.addresses[0].city,
          postal_code: membershipState.addresses[0].postal_code,
          street: membershipState.addresses[0].street,
          poc_name: membershipState.poc_name,
          poc_email: membershipState.poc_email,
          poc_job_title: membershipState.poc_job_title,
          poc_phone: membershipState.poc_phone,
          poc_public: membershipState.poc_public,
          owner_name: membershipState.owner_name,
          owner_email: membershipState.owner_email,
          owner_phone: membershipState.owner_phone,
          owner_job_title: membershipState.owner_job_title,
          no_of_years: membershipState.no_of_years,
          discount_code: null,
          domains: [],
          name: membershipState.name,
        }

        for (let i = 0; i < membershipState.domain.length; i++) {
          formData.domains.push({ domain: membershipState.domain[i] })
        }
      }
    } else {
      redirect('/membership/pricing')
    }

    return {
      currentUser: store.state.user.currentUser,
      membershipList: store.state.membership.membershipList,
      formData,
    }
  },
  data() {
    return {
      discountApplied: false,
      discountError: null,
      currentStep: 0,
      submitting: false,
      officeAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
    }
  },
  head() {
    return {
      title: `Membership Registration`,
    }
  },
  computed: {
    ...mapState({
      membership: (state) => state.membership.membership,
    }),
    membershipLevels() {
      const levels = []

      for (let i = 0; i < this.membershipList.memberships.length; i++) {
        const level = {
          value: String(this.membershipList.memberships[i].id),
          label:
            this.membershipList.memberships[i].name +
            ' ($' +
            this.membershipList.memberships[i].fee +
            ')',
        }
        if (this.membershipList.memberships[i].name !== 'Portfolio')
          levels.push(level)
      }

      return levels
    },
  },
  mounted() {
    this.officeAddress.city = this.formData.city
    this.officeAddress.country_code = this.formData.country_code
    this.officeAddress.street = this.formData.street
    this.officeAddress.state = this.formData.state
    this.officeAddress.postal_code = this.formData.postal_code
  },
  methods: {
    applyDiscount() {
      if (
        this.$route.params.planId === 2 ||
        this.$route.params.planId === '2'
      ) {
        this.$axios
          .get(
            this.$axios.defaults.baseURL +
              'api/coupon/validate/' +
              this.formData.discount_code +
              '?for=membership&type=Keystone'
          )
          .then((response) => {
            this.discountApplied = true
          })
          .catch((err) => {
            this.discountError = 'Invalid discount code!'
            throw new Error(err)
          })
      } else {
        this.$axios
          .get(
            this.$axios.defaults.baseURL +
              'api/coupon/validate/' +
              this.formData.discount_code +
              '?for=membership&type=Cornerstone'
          )
          .then((response) => {
            this.discountApplied = true
          })
          .catch((err) => {
            this.discountError = 'Invalid discount code!'
            throw new Error(err)
          })
      }
    },
    async validateStep() {
      this.$parent.$parent.$refs.content.scrollTop = 0
      if (this.currentStep === 4) {
        this.submitting = true
        this.formData.city = this.officeAddress.city
        this.formData.country_code = this.officeAddress.country_code
        this.formData.street = this.officeAddress.street
        this.formData.state = this.officeAddress.state
        this.formData.postal_code = this.officeAddress.postal_code

        this.formData.profile_pic = this.formData.profile_pic[0].url

        const domains = []
        if (this.formData.domains != null) {
          for (let i = 0; i < this.formData.domains.length; i++) {
            domains.push(this.formData.domains[i].domain)
          }
        }

        this.formData.domain = domains

        if (Object.keys(this.membership).length !== 0) {
          await this.$store.dispatch('membership/update', this.formData)
          this.$router.push('/membership/confirmation')
        } else {
          await this.$store.dispatch('membership/create', this.formData)
          this.$router.push('/membership/confirmation')
        }
      } else {
        this.currentStep++
      }
    },
  },
}
</script>
