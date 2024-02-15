<template>
  <div class="flex flex-wrap px-10 py-5">
    <WFeedbackModal ref="precertModal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WHeadingsHThree
          heading="Do you want to apply a credit for the Precertification fees to this invoice?"
        />

        <div class="mx-auto flex w-full space-x-4">
          <WButtonsBase
            type="primary"
            @click.native="
              $store.dispatch('project/createDocReviewInvoice', 'yes')
              $refs.precertModal.isHidden = true
            "
            >Yes</WButtonsBase
          >
          <WButtonsBase
            type="primaryInverted"
            @click.native="
              $store.dispatch('project/createDocReviewInvoice', 'no')
              $refs.precertModal.isHidden = true
            "
            >No</WButtonsBase
          >
        </div>
      </div>
    </WFeedbackModal>
    <div
      v-if="invoices.length && invoices.length === 0"
      class="
        rounded-md
        bg-yellow-50
        p-4
        mb-5
        rounded-lg
        border border-yellow-300
        w-full
      "
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <div class="mt-2 text-sm leading-5 text-yellow-700">
            <p>No invoices can be found!</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="w-full mb-5 lg:w-1/3 lg:pr-16">
      <WHeadingsHThree heading="Billing" />
      <div
        v-if="project.type !== 'v1' && currentUser.role.includes('well-admin')"
      >
        <div
          v-if="project.type === 'v2-pilot'"
          class="text-lg font-medium text-primary-700"
        >
          <svg
            class="w-5 inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Current Subscription:
        </div>
        <div v-if="project.type === 'v2-pilot'" class="text-tertiary-300">
          <div v-if="project.pricing_option === 'single-cycle'">
            Single-Cycle Payment
          </div>
          <div v-if="project.pricing_option === '3-year'">
            3 Year Subscription
          </div>
          <div v-if="project.pricing_option === '5-year'">
            5 Year Subscription
          </div>
        </div>
      </div>
      <div
        v-if="
          currentUser.role.includes('well-admin') && project.type === 'v2-pilot'
        "
        class="mt-5"
      >
        <WButtonsDropdown>
          <WButtonsBase type="primaryInverted" icon="refresh">
            Update Billing Cycle
          </WButtonsBase>
          <template #customButtons>
            <WButtonsBase
              v-if="project.pricing_option !== 'single-cycle'"
              type="neutral"
              @click.native="
                $store.dispatch('project/updatePricingOption', 'single-cycle')
              "
            >
              Single-Cycle Payment
            </WButtonsBase>
            <WButtonsBase
              v-if="project.pricing_option !== '3-year'"
              type="neutral"
              @click.native="
                $store.dispatch('project/updatePricingOption', '3-year')
              "
            >
              3-year Subscription
            </WButtonsBase>
            <WButtonsBase
              v-if="project.pricing_option !== '5-year'"
              type="neutral"
              @click.native="
                $store.dispatch('project/updatePricingOption', '5-year')
              "
            >
              5-year Subscription
            </WButtonsBase>
          </template>
        </WButtonsDropdown>
      </div>
      <div v-if="isChinaProject && project.type !== 'v1'" class="flex my-3">
        <WButtonsBase
          type="primary"
          icon="download"
          @click.native="downloadCoA(0)"
        >
          Confirmation Agreement
        </WButtonsBase>
      </div>
      <div v-if="isChinaProject && project.type === 'v2'" class="flex my-3">
        <WButtonsBase
          type="primary"
          icon="download"
          @click.native="downloadCoA(1)"
        >
          Confirmation Agreement (with precert)
        </WButtonsBase>
      </div>
      <div
        v-if="
          currentUser.role.includes('well-admin') &&
          project.type !== 'v2-pilot-upgraded'
        "
        class="mt-5"
      >
        <WButtonsDropdown>
          <WButtonsBase type="primaryInverted" icon="plus">
            Project Invoice
          </WButtonsBase>
          <template #customButtons>
            <WButtonsBase type="neutral" @click.native="createCustomInvoice()">
              Create New Invoice
            </WButtonsBase>
            <WButtonsBase
              v-if="
                !hasInvoiceofType('documentation-submission') &&
                project.pricing_option === 'single-cycle'
              "
              type="neutral"
              @click.native="
                project.type !== 'v1' &&
                hasInvoiceofType('precertification') &&
                hasInvoiceofTypePaid('precertification')
                  ? ($refs.precertModal.isHidden = false)
                  : $store.dispatch('project/createDocReviewInvoice', 'no')
              "
            >
              Documentation Review
            </WButtonsBase>
            <WButtonsBase
              v-if="
                !hasInvoiceofType('do-submission') &&
                !hasInvoiceofType('precertification')
              "
              type="neutral"
              @click.native="$store.dispatch('project/createPreCertInvoice')"
            >
              Precertification Review
            </WButtonsBase>
            <WButtonsBase
              v-if="!hasInvoiceofType('pv')"
              type="neutral"
              @click.native="
                $store.dispatch(
                  'project/createPerformanceInvoice',
                  includePrecert
                )
              "
            >
              Performance Verification
            </WButtonsBase>
            <WButtonsBase
              type="neutral"
              @click.native="
                $store.dispatch(
                  'project/createReviewInvoice',
                  'curative-action'
                )
              "
            >
              Curative Action
            </WButtonsBase>
            <WButtonsBase
              type="neutral"
              @click.native="
                $store.dispatch('project/createReviewInvoice', 'appeal-review')
              "
            >
              Appeal Review
            </WButtonsBase>
            <WButtonsBase
              v-if="project.pricing_option !== 'single-cycle'"
              type="neutral"
              @click.native="
                $store.dispatch('project/createAnnualSubscriptionInvoice')
              "
            >
              Annual Subscription
            </WButtonsBase>
          </template>
        </WButtonsDropdown>
      </div>
    </div>
    <div class="w-full lg:w-2/3">
      <div class="space-y-4">
        <div v-for="(invoice, index) in invoices" :key="index">
          <InvoiceCard
            :invoice="invoice"
            :redirect="`/projects/${project.type}/${project.project_number}/billing`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    invoices: {
      type: Array,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      estimateData: null,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    isChinaProject() {
      if (this.project.addresses) {
        for (let i = 0; i < this.project.addresses.length; i++) {
          if (
            this.project.addresses[i].country_code === 'CN' ||
            this.project.addresses[i].country_code === 'HK' ||
            this.project.addresses[i].country_code === 'MO'
          ) {
            return true
          }
        }
      }
      return false
    },
  },
  async mounted() {
    if (this.project.estimates && this.project.estimates.length > 0) {
      await this.getEstimate()
    }
  },
  methods: {
    downloadCoA(val) {
      this.$store
        .dispatch('project/downloadCoA', {
          project_id: this.project.id,
          pre_cert_fees: val,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
    parseInt(str) {
      str = str.replace(',', '')
      return parseInt(str)
    },
    async getEstimate() {
      if (this.project.type !== 'v1') {
        await this.$store
          .dispatch('estimate/getEstimate', this.project.estimates[0].id)
          .then((res) => {
            this.estimateData = res
          })
      } else {
        await this.$store
          .dispatch('estimate/getV1Estimate', this.project.estimates[0].id)
          .then((res) => {
            this.estimateData = res
          })
      }
    },
    hasInvoiceofTypePaid(type) {
      const invoice = this.invoices.find((a) => a.invoicable_sub_part === type)
      if (invoice && invoice.status === 'paid') return true
      else return false
    },
    hasInvoiceofType(type) {
      const index = this.invoices.findIndex(
        (a) => a.invoicable_sub_part === type
      )
      if (index !== -1) {
        return true
      } else {
        return false
      }
    },
    createCustomInvoice() {
      const data = {
        country_code: this.project.addresses[0].country_code,
        state: this.project.addresses[0].state,
        city: this.project.addresses[0].city,
        street: this.project.addresses[0].street,
        postal_code: this.project.addresses[0].postal_code,
        name: this.project.owner_name,
        email: this.project.owner_email,
        organization: this.project.owner_org,
        project_id: this.project.id,
      }
      this.$router.push({ path: `/well-admin/invoices/create`, query: data })
    },
  },
}
</script>
