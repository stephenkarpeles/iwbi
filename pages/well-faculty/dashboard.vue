<template>
  <div>
    <!-- Modal Start -->

    <WFeedbackModal ref="modal" :can-manually-close="true">
      <FormulateForm @submit="renewFaculty">
        <div class="max-w-lg m-2">
          <WHeadingsHFour heading="Annual Renewal Process" />
          <hr />
          <p class="font-light mt-2">
            To complete the annual renewal process, please follow these steps:
          </p>
          <ul class="list-outside list-decimal ml-5 font-light">
            <li>
              Read and sign the 2022 WELL Faculty Agreement + remit annual fee
              (both through WELL Online).
              <ul class="list-outside list-disc ml-5">
                <li>
                  If you are a 2022 WELL advisor, your annual fee is waived. You
                  will still need to go through the prompts to accept and pay
                  your invoice.
                </li>
                <li>
                  If you are part of an IWBI member organization, your annual
                  fee is discounted by 15% (Cornerstone) or 30% (Keystone).
                </li>
              </ul>
            </li>
            <li>
              Report education events and submit AIA attendee lists by
              navigating to the Reporting tab on the left side of your
              dashboard.
            </li>
            <li>
              If your personal information has changed, please
              <a
                class="text-primary-700 underline"
                href="mailto:faculty@wellcertified.com"
                target="_blank"
                >email us</a
              >
              your most up-to-date information.
            </li>
          </ul>
          <div class="bg-gray-50 rounded-md my-2">
            <WHeadingsHFour
              class="max-w-3xl mx-2"
              heading="WELL FACULTY™ AGREEMENT - Terms &amp; Conditions"
            />
            <div class="h-48">
              <LegalFacultyAgreement />
            </div>
          </div>
          <FormulateInput
            type="checkbox"
            label="Yes, I have read and agree to abide by the terms and conditions."
            validation="required"
          />
          <FormulateInput type="submit" label="Renew Now" class="mt-2" />
        </div>
      </FormulateForm>
    </WFeedbackModal>

    <!-- Modal Ends -->

    <div class="relative">
      <div class="px-4 sm:px-6 md:px-8">
        <NavBreadcrumbs>
          <div class="flex flex-row space-x-4">
            <WHeadingsHTwo class="mb-2" heading="Dashboard" />
            <!-- Removes v-if="showRenewButton" from span below for testing renewal flow -->
            <span v-if="showRenewButton" class="mt-1">
              <WButtonsBase
                type="primaryInverted"
                @click.native="$refs.modal.isHidden = false"
              >
                Renew
              </WButtonsBase>
            </span>
          </div>
        </NavBreadcrumbs>
      </div>
    </div>

    <div v-if="currentTab" class="flex flex-wrap lg:mt-10 px-4 sm:px-6 md:px-8">
      <FacultyResources v-if="currentTab === 'Resources'" />
      <FacultyOrientation v-if="currentTab === 'Orientation'" />
      <FacultyKeepLearning v-if="currentTab === 'Keep Learning'" />
      <FacultySocialMediaToolkit v-if="currentTab === 'Marketing Toolkit'" />
      <FacultyReporting v-if="currentTab === 'Reporting'" />
      <FacultyBilling v-if="currentTab === 'Billing'" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  layout: 'sidebar',
  async asyncData({ store, redirect }) {
    await Promise.all([store.dispatch('faculty/getFaculty')])

    return {
      faculty: store.state.faculty.faculty,
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Faculty Dashboard`,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
    }),
    showRenewButton() {
      let flag = false
      if (this.faculty) {
        const expirationDate = new Date(this.faculty.expiration_date)
        const expirationDateYear = new Date(expirationDate).getFullYear()
        const currentYear = new Date().getFullYear()
        const expirationNextYear = expirationDateYear + 1
        if (currentYear >= expirationDateYear) {
          if (
            new Date().getMonth() === 11 ||
            (currentYear === expirationNextYear &&
              new Date().getMonth() <= 3 &&
              new Date().getDate() <= 31) ||
            this.$dayjs(expirationDate).unix() < this.$dayjs().unix()
          ) {
            flag = true
          }
        }
      }
      return flag
    },
  },
  mounted() {
    this.$store.commit('settings/setSidebarTab', 'Orientation')
  },
  methods: {
    renewFaculty() {
      const data = {
        country_code: this.faculty.addresses[0].country_code,
        state: this.faculty.addresses[0].state,
        city: this.faculty.addresses[0].city,
        postal_code: this.faculty.addresses[0].postal_code,
        street: this.faculty.addresses[0].street,
      }
      this.$store
        .dispatch('faculty/renewFaculty', {
          id: this.faculty.id,
          data,
        })
        .then((data) => {
          this.$router.push(
            '/invoice/' +
              data.invoice_number +
              '?redirect=' +
              '/well-faculty/dashboard'
          )
        })
    },
  },
}
</script>
