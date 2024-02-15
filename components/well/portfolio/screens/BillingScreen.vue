<template>
  <div class="flex flex-wrap px-10 py-5">
    <div
      v-if="invoices.length === 0"
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
      <WHeadingsHThree class="text-primary-800" heading="Billing" />
      <div v-if="invoices && invoices.length > 0" class="mt-5 w-full">
        <WButtonsBase
          v-if="currentUser.role.includes('well-admin')"
          class="mb-3"
          icon="refresh"
          @click.native="
            $store.dispatch('portfolio/updatePropertiesArea', {
              id: portfolio.id,
            })
          "
        >
          Update locations area
        </WButtonsBase>
        <WButtonsBase
          v-if="currentUser.role.includes('well-admin')"
          icon="plus"
          @click.native="
            $store.dispatch('portfolio/getSubscription', {
              type: 'firstYearSubInvoice',
              id: portfolio.id,
            })
          "
        >
          Create annual subscription
        </WButtonsBase>
      </div>
      <WButtonsBase
        class="mt-3"
        type="primaryInverted"
        icon="document"
        @click.native="
          $router.push('/portfolio/' + $route.params.id + '/pricing')
        "
      >
        See custom pricing quote
      </WButtonsBase>
    </div>
    <div class="w-full lg:w-2/3">
      <div class="space-y-4">
        <div v-for="(invoice, index) in invoices" :key="index">
          <InvoiceCard
            :invoice="invoice"
            :redirect="`/portfolio/${portfolio.project_number}/billing`"
          />
        </div>
      </div>
    </div>
    <div v-if="invoices && invoices.length === 0" class="text-sm">
      <WHeadingsHThree heading="Begin today" class="my-5" />
      <p>
        The first step of the WELL Portfolio program is enrollment.
        Organizations will use this period to define their portfolio prior to
        activating their 5-year subscription.
      </p>
      <p>
        The enrollment fee<sup>*</sup> for participation is USD $25,000 and
        enables you to:
      </p>
      <ul class="list-disc pl-5 space-y-1 my-5 text-sm">
        <li>
          Conduct a brief analysis of how your organization aligns with the
          healthy building alternatives found in WELL, enabling you to populate
          a customized scorecard for future enhancements.
        </li>
        <li>
          Collaborate with IWBI to define key goals and approaches for applying
          these alternatives across your portfolio, identifying techniques to
          maximize your efforts.
        </li>
        <li>
          Define your portfolio and track your locations inside our performance
          dashboard, streamlining your approach and creating maximum visibility
          into key health and well-being metrics.
        </li>
        <li>
          Receive a complimentary year of WELL Portfolio membership benefits,
          unlocking key leadership recognition, professional education and
          promotional opportunities for your organization.
        </li>
      </ul>
      <div class="w-40 my-5">
        <WButtonsBase
          @click.native="
            $router.push('/portfolio/' + $route.params.id + '/register')
          "
        >
          Enroll Now
        </WButtonsBase>
      </div>

      <p class="flex">
        *For additional details about enrollment and subscription terms, please
        see the &#160;
        <WLinksBase
          link="http://resources.wellcertified.com/resources/tools/well-portfolio-guidebook"
          target="_blank"
        >
          WELL Portfolio Guidebook
        </WLinksBase>
        .
      </p>
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
    portfolio: {
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
  },
  methods: {
    createCustomInvoice() {
      const data = {
        country_code: this.portfolio.addresses[0].country_code,
        state: this.portfolio.addresses[0].state,
        city: this.portfolio.addresses[0].city,
        street: this.portfolio.addresses[0].street,
        postal_code: this.portfolio.addresses[0].postal_code,
        name: this.portfolio.owner_name,
        email: this.portfolio.owner_email,
        organization: this.portfolio.owner_org,
        project_id: this.portfolio.id,
      }
      this.$router.push({ path: `/well-admin/invoices/create`, query: data })
    },
  },
}
</script>
