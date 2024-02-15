<template>
  <div>
    <NavBreadcrumbs>
      <WHeadingsHTwo class="mb-2" heading="Membership" />
      <WStepsHorizontal
        :steps="[
          {
            name: 'SUBSCRIBE',
            status: 'complete',
          },
          {
            name: 'CONFIRMATION',
            status: 'current',
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
            :src="'/membership/register/5.jpg'"
            alt=""
          />
        </div>
      </div>
      <div
        class="
          border
          rounded-lg
          relative
          py-6
          px-4
          xl:pt-16
          sm:px-6
          lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
        "
      >
        <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
          <WHeadingsHTwo
            heading="Review details"
            sub-heading="Thank you for taking the first step towards becoming a member of IWBI. Please review the information below and click on the 'Pay Now' button to proceed."
          >
          </WHeadingsHTwo>

          <div class="my-8">
            <label
              for="countrymailing"
              class="
                block
                text-sm
                font-medium
                leading-5
                text-gray-700
                sm:mt-px sm:pt-2
              "
            >
              Organization Name
            </label>
            <div class="font-bold text-xl">
              {{ membership.name }}
            </div>
            <label
              for="countrymailing"
              class="
                block
                text-sm
                font-medium
                leading-5
                text-gray-700
                sm:mt-px sm:pt-2
              "
            >
              Point of Contact
            </label>
            <div class="font-bold text-xl">
              {{ membership.poc_name }} ({{ membership.poc_email }})
            </div>
            <label
              for="countrymailing"
              class="
                block
                text-sm
                font-medium
                leading-5
                text-gray-700
                sm:mt-px sm:pt-2
              "
            >
              Membership Type
            </label>
            <div class="font-bold text-xl">
              {{ membership.subscriptions[0].name }} (${{
                membership.subscriptions[0].membership.fee | formatNumber
              }}/year)
            </div>
            <label
              for="countrymailing"
              class="
                block
                text-sm
                font-medium
                leading-5
                text-gray-700
                sm:mt-px sm:pt-2
              "
            >
              No. of years
            </label>
            <div class="font-bold text-xl">
              {{ membership.no_of_years }}
            </div>
          </div>

          <div class="flex mt-5">
            <span class="h-10 w-1/2 mr-1">
              <WButtonsBase
                icon="download"
                type="primaryInverted"
                @click.native="
                  $store.dispatch(
                    'invoice/download',
                    membership.subscriptions[0].invoices[0]
                  )
                "
              >
                Download Invoice
              </WButtonsBase>
            </span>
            <span class="h-10 w-1/2 ml-1">
              <WButtonsBase
                icon="download"
                type="primary"
                @click.native="$router.push('/membership/invoice')"
              >
                Pay ${{
                  (membership.subscriptions[0].membership.fee *
                    membership.no_of_years)
                    | formatNumber
                }}
              </WButtonsBase>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect, params }) {
    await Promise.all([
      store.dispatch('membership/getMembershipList'),
      store.dispatch('membership/getMembership'),
    ])

    return {
      currentUser: store.state.user.currentUser,
      membershipList: store.state.membership.membershipList,
      membership: store.state.membership.membership,
    }
  },
  head() {
    return {
      title: `Membership Confirmation`,
    }
  },
}
</script>
