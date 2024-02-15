<template>
  <div>
    <!-- Header card -->
    <div class="relative">
      <div class="px-4 sm:px-6 md:px-8">
        <NavBreadcrumbs>
          <div class="flex">
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
                  {{ $dayjs(membership.starts_at).format('MMM DD, YYYY') }}
                  -
                  {{ $dayjs(membership.ends_at).format('MMM DD, YYYY') }}
                </span>
              </div>
            </div>
          </div>
          <template #actions>
            <div class="grid grid-cols-2 gap-2">
              <div class="w-48">
                <WButtonsBase
                  v-if="currentUser.role.includes('well-admin') || isUserOwner"
                  icon="user"
                  type="primaryInverted"
                  @click.native="
                    $router.push(`/portfolio/${$route.params.id}/profile`)
                  "
                >
                  Profile
                </WButtonsBase>
              </div>
              <div
                v-if="
                  currentUser.role.includes('well-admin') ||
                  currentUser.id === membership.user_id
                "
                class="w-48"
              >
                <WButtonsBase
                  icon="download"
                  type="primaryInverted"
                  @click.native="
                    $store.dispatch('membership/downloadAgreement')
                  "
                >
                  Agreement
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>
      </div>
    </div>
    <!-- Tabs -->
    <WTabsHorizontal
      v-model="currentTab"
      alignment="justify-start"
      class="w-full -mb-px"
      :tabs="
        currentUser.role.includes('well-admin') || isUserOwner
          ? tabs
          : publicTabs
      "
    />
    <div v-if="currentTab === 'Promotion'">
      <PortfolioMembershipPromotion />
    </div>
    <div v-if="currentTab === 'Education'">
      <PortfolioMembershipEducation />
    </div>
    <div
      v-if="currentTab === 'Billing'"
      class="space-y-4 mt-5 max-w-2xl mx-auto"
    >
      <div
        v-for="(subscription, index) in membership.subscriptions"
        :key="index"
      >
        <InvoiceCard :invoice="subscription.invoices[0]" />
      </div>
    </div>
    <div v-if="currentTab === 'Benifits'" class="mt-5">
      <MembershipBenefitsScreen
        :current-user="currentUser"
        :benefits="membershipList.benefits"
      />
    </div>
    <div v-if="currentTab === 'Team'" class="mt-5">
      <MembershipTeamScreen />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: 'Promotion',
      tabs: [
        { name: 'Promotion' },
        { name: 'Education' },
        { name: 'Benifits' },
        { name: 'Billing' },
        { name: 'Team' },
      ],
      publicTabs: [
        { name: 'Promotion' },
        { name: 'Education' },
        { name: 'Benifits' },
        { name: 'Billing' },
      ],
    }
  },
  computed: {
    ...mapState({
      membership: (state) => state.membership.membership,
      currentUser: (state) => state.user.currentUser,
      membershipList: (state) => state.membership.membershipList,
      portfolio: (state) => state.portfolio.portfolio,
    }),

    isUserOwner() {
      if (this.currentUser.email === this.portfolio.owner_email) {
        return true
      }
      return false
    },
  },
  async mounted() {
    await this.$store.dispatch('membership/getMembershipList')
  },
  methods: {
    canRenew() {
      const endDate = this.membership.subscriptions[0].ends_at

      if (endDate === null) {
        return false
      }

      // grab the current date
      const d1 = new Date()
      // grab the end date
      const d2 = new Date(endDate)

      // check the difference in months between the two dates
      let months
      months = (d2.getFullYear() - d1.getFullYear()) * 12
      months -= d1.getMonth()
      months += d2.getMonth()

      // if there's a negative difference lets just make it 0
      if (months <= 0) {
        months = 0
      }

      // computation to see if the membership can be renewed of not
      // less or equal to 6 months remaning in memebership
      if (months <= 6 && this.accessLevel === 'owner') {
        return true
      }

      // default to false
      return false
    },
  },
}
</script>
