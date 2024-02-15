<template>
  <div class="flex">
    <div>
      <WHeadingsHTwo heading="Membership Registration" />
      <div class="flex">
        <div class="w-3/4">
          <FormulateForm @submit="submitForm">
            <div class="shadow-md rounded-md p-6 border-primary-100 border">
              <WHeadingsHThree
                heading="Organization"
                sub-heading="Organization details and domain."
              />
              <WHeadingsHFour class="mt-8" heading="Organization Name*" />

              <FormulateInput
                v-model="company"
                type="companymultisearch"
                name="organization"
                label="Organization name*"
                validation="required"
                help="As it should appear publicly in the IWBI member directory and other promotional opportunities."
                :searchable="true"
                :clearonselect="false"
                :closeonselect="true"
                :optionslimit="10"
              />

              <WHeadingsHFour class="mt-8" heading="Organization Logo*" />
              <div
                v-if="formData.profile_pic && formData.profile_pic.length > 0"
              >
                <img
                  :src="`${formData.profile_pic[0].url}`"
                  class="w-44 rounded-lg shadow-lg mb-3 mx-auto"
                />
              </div>
              <FormulateInput
                v-model="formData.profile_pic"
                :multiple="false"
                label="Logo"
                :value="formData.profile_pic"
                type="fileupload"
                upload-type="image"
                upload-path="membership/"
                upload-url="/api/upload/image"
                validation="required"
                name="Organization logo"
                mime-types="image/png,image/jpeg,image/jpg"
              />

              <WHeadingsHFour class="mt-8" heading="Domain(s)" />
              <FormulateInput
                v-model="formData.domain"
                type="group"
                help="Sharing your organization's email domain(s) allows IWBI to more easily identify your fellow colleagues and in turn give them access to your firm's IWBI membership. (ex: @wellcertified.com)"
                :repeatable="true"
                remove-label="x"
                add-label="+ Add Domain"
              >
                <FormulateInput
                  type="text"
                  name="domain"
                  label="Domain"
                  placeholder="@"
                />
              </FormulateInput>

              <FormulateInput
                v-model="formData.org_website"
                type="text"
                label="Organization website"
                class="w-full mt-4"
              />
            </div>

            <div
              class="shadow-md rounded-md p-6 mt-5 border-primary-100 border space-y-4"
            >
              <WHeadingsHThree
                heading="Point of Contact"
                sub-heading="Your personal details"
              />
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
            </div>

            <div
              class="shadow-md rounded-md p-6 mt-5 border-primary-100 border"
            >
              <WHeadingsHThree
                heading="Office Address"
                sub-heading="Your personal details"
              />
              <FormInputsAddressFormulate
                :target="formData.address"
                :required="true"
              />
            </div>

            <div class="mx-auto w-full mt-5">
              <WButtonsBase v-if="submitting" :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
              <FormulateInput
                v-else
                type="submit"
                label="Activate Membership"
              />
            </div>
          </FormulateForm>
        </div>
        <div
          class="w-1/4 ml-2 shadow-md rounded-md p-6 px-8 border-primary-100 border space-y-4"
        >
          <WHeadingsHFour class="text-center" heading="Membership Benefits" />
          <img
            src="/membership/member-logo.png"
            class="text-center mx-auto"
            alt="membership-logo"
          />
          <ul
            v-if="membershipList && membershipList.benefits"
            class="mt-5 text-sm font-light"
            style="list-style: disc !important"
          >
            <!-- eslint-disable -->
            <li
              v-for="benefit in membershipList.benefits"
              :key="'membership-id-' + benefit.id"
              v-if="isBenefitApplicable(benefit, 3)"
              v-html="getTextforBenefit(benefit, 3)"
            ></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      submitting: false,
      company: null,
      formData: {
        domain: null,
        poc_public: true,
        address: {},
      },
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      membership: (state) => state.membership.membership,
      membershipList: (state) => state.membership.membershipList,
    }),
  },
  async mounted() {
    await this.$store.dispatch('membership/getMembershipList').then((res) => {
      this.systemDataInput()
    })
  },
  methods: {
    async submitForm() {
      this.submitting = true
      const data = { ...this.formData }
      // clean the data
      if (this.company.name && this.company.id && this.company.name !== '') {
        data.name = this.company.name
        data.company_id = this.company.id
      }
      if (this.formData.domain && this.formData.domain.length > 0) {
        data.domain = this.formData.domain.map((el) => el.domain)
      }
      if (data.profile_pic.length > 0) {
        data.profile_pic = data.profile_pic[0].url
      }
      data.city = data.address.city
      data.country_code = data.address.country_code
      data.postal_code = data.address.postal_code
      data.street = data.address.street
      if (data.address.state) data.state = data.address.state
      await this.$store
        .dispatch('membership/create', data)
        .then((res) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Membership registered successfully',
          })
        })
        .catch((err) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: err,
          })
        })
      this.submitting = false
    },
    getTextforBenefit(benefit, membershipId) {
      const applicableBenefits = benefit.membership_benefits.filter(function (
        e
      ) {
        return e.membership_id === membershipId
      })[0]
      if (
        applicableBenefits.discount_percentage !== null ||
        applicableBenefits.discount_percentage > 0
      ) {
        return applicableBenefits.discount_percentage + '% ' + benefit.desc
      } else if (applicableBenefits.is_available) {
        let responseStr = benefit.desc
        if (applicableBenefits.available_text !== null) {
          responseStr += ' (' + applicableBenefits.available_text + ')'
        }
        return responseStr
      }
      return ''
    },
    isBenefitApplicable(benefit, membershipId) {
      const applicableBenefits = benefit.membership_benefits.filter(function (
        e
      ) {
        return e.membership_id === membershipId
      })[0]
      if (
        applicableBenefits.discount_percentage !== null ||
        applicableBenefits.discount_percentage > 0
      ) {
        return true
      } else if (applicableBenefits.is_available) {
        return true
      }
      return false
    },
    systemDataInput() {
      const membershipType = this.membershipList.memberships.find(
        (member) => member.name === 'Portfolio'
      )
      this.formData.membership_id = membershipType.id

      this.formData.no_of_years = 1
      this.formData.portfolio_id = this.portfolio.id
    },
  },
}
</script>
