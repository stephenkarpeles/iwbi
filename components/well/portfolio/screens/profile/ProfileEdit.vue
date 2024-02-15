<template>
  <div class="">
    <WFeedbackAlert ref="alert" class="z-50" />
    <div class="relative">
      <div class="px-4 sm:px-6 md:px-8">
        <NavBreadcrumbs>
          <div class="flex flex-col md:flex-row items-center md:items-start">
            <img
              v-if="membership.type === 'Cornerstone'"
              class="h-full mr-5 my-auto w-20"
              :src="$config.assetsURL + 'membership/cornerstone-logo.png'"
            />
            <img
              v-else
              class="h-full mr-5 my-auto w-24"
              :src="$config.assetsURL + 'membership/member-logo.png'"
            />

            <div class="">
              <div class="flex">
                <WHeadingsHTwo :heading="membership.name" />
              </div>
              <div class="uppercase text-primary-500 font-bold text-sm">
                {{ membership.type }} Membership
              </div>
              <div class="flex text-base leading-6 text-gray-500 font-bold">
                Membership duration:
                <span class="pl-1 font-normal">
                  {{
                    $dayjs(
                      membership.subscriptions[
                        membership.subscriptions.length - 1
                      ].starts_at
                    ).format('MMM DD, YYYY')
                  }}
                  -
                  {{
                    $dayjs(
                      membership.subscriptions[
                        membership.subscriptions.length - 1
                      ].ends_at
                    ).format('MMM DD, YYYY')
                  }}
                </span>
              </div>
            </div>
          </div>
        </NavBreadcrumbs>
      </div>
    </div>
    <FormulateForm @submit="updateForm">
      <div class="shadow-md rounded-md p-6 border-primary-100 border">
        <WHeadingsHThree
          heading="Organization"
          sub-heading="Organization details and domain."
        />
        <WHeadingsHFour class="mt-8" heading="Organization Name*" />
        <FormulateInput
          v-model="formData.name"
          name="Organization name"
          type="text"
          :disabled="true"
          class="opacity-60"
          help="As it should appear publicly in the IWBI member directory and other promotional opportunities."
        />

        <WHeadingsHFour class="mt-8" heading="Organization Logo*" />
        <FormulateInput
          :key="forceReMount"
          v-model="formData.profile_pic"
          :multiple="false"
          label="Logo"
          name="Organization logo"
          :value="formData.profile_pic"
          type="fileupload"
          :clickable-links="true"
          upload-type="image"
          upload-path="membership/"
          upload-url="/api/upload/image"
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
          v-model="formData.website"
          type="text"
          label="Organization website"
          class="w-full mt-4"
        />

        <ClientOnly>
          <div class="flex flex-col space-y-4">
            <FormulateInput
              v-model="formData.tell_us_about"
              type="richtext"
              label="Tell us about your organization and what you do."
              help="As it should appear publicly in the IWBI member directory."
            />
            <FormulateInput
              v-model="formData.why_well"
              type="richtext"
              label="Why did your organization decide to participate in WELL Portfolio?"
            />
            <FormulateInput
              v-model="formData.achievements"
              type="richtext"
              label="Which of your organization’s health and wellness achievements have been the most impactful, or make you feel pride?"
              help="As it should appear publicly in the IWBI member directory."
            />
            <FormulateInput
              v-model="formData.goals"
              type="richtext"
              label="What are your goals for your participation in the WELL Portfolio program? What initiatives are you currently advancing, and what’s your approach to achieving success?"
            />
            <!-- <FormulateInput
              v-model="formData.why_well_member"
              type="richtext"
              label="Why is your organization an IWBI member? How does your work support efforts to advance buildings and communities globally that help people thrive?"
              help="As it should appear publicly in the IWBI member directory."
            />

            <FormulateInput
              v-model="formData.wellness_values"
              type="richtext"
              label="How does your team live their wellness values?"
              help="As it should appear publicly in the IWBI member directory."
            /> -->
          </div>
        </ClientOnly>
      </div>

      <div
        class="
          shadow-md
          rounded-md
          p-6
          mt-5
          border-primary-100 border
          space-y-4
        "
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

      <div class="shadow-md rounded-md p-6 mt-5 border-primary-100 border">
        <WHeadingsHThree
          heading="Office Address"
          sub-heading="Your personal details"
        />
        <FormInputsAddressFormulate :target="address" :required="true" />
      </div>

      <div class="mt-5">
        <FormulateInput type="submit" label="Update" />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      formData: {
        domain: null,
      },
      address: {
        city: '',
        state: '',
        postal_code: '',
        street: '',
        country_code: '',
      },

      forceReMount: 0,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      membership: (state) => state.membership.membership,
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  mounted() {
    this.systemDataInput()
  },

  methods: {
    updateForm() {
      const data = { ...this.formData }
      if (this.formData.domain) {
        data.domain = this.formData.domain.map((el) => el.domain)
      }
      data.profile_pic = data.profile_pic[0].url
      data.city = this.address.city
      data.state = this.address.state
      data.postal_code = this.address.postal_code
      data.street = this.address.street
      data.country_code = this.address.country_code
      data.membership_id = this.formData.id
      this.$store.dispatch('membership/update', data).then((res) => {
        this.$refs.alert.showAlert('success', 'Membership changes saved!')
        this.$router.push(
          `/portfolio/${this.portfolio.portfolio_number}/dashboard`
        )
      })
    },
    systemDataInput() {
      this.formData = JSON.parse(JSON.stringify(this.membership))
      if (this.membership.domain) {
        this.formData.domain = []
        this.membership.domain.map((el) => {
          return this.formData.domain.push({ domain: el })
        })
      }
      this.formData.profile_pic = [{ url: this.membership.profile_pic }]
      this.forceReMount++

      this.address.city = this.membership.addresses[0].city
      this.address.country_code = this.membership.addresses[0].country_code
      this.address.postal_code = this.membership.addresses[0].postal_code
      this.address.state = this.membership.addresses[0].state
      this.address.street = this.membership.addresses[0].street
    },
  },
}
</script>
