<template>
  <div class="flex flex-col">
    <WFeedbackModal ref="modal">
      <div class="max-w-lg mx-10 my-5">
        <div class="flex justify-center mb-4">
          <div
            class="
              bg-red-100
              flex flex-shrink-0
              h-16
              items-center
              justify-center
              mx-auto
              rounded-full
              sm:mx-0
              w-16
            "
          >
            <svg
              class="h-8 w-8 text-red-600"
              x-description="Heroicon name: outline/exclamation"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="mb-5 text-primary-800 text-center py-4">
          This action cannot be undone. This will permanently delete the
          <span v-if="selectedPortfolio" class="font-bold">
            #{{ selectedPortfolio.portfolio_number }} -
            {{ selectedPortfolio.name }}
          </span>
          portfolio, documents, scorecard, and remove all team associations.
        </div>
        <div class="flex justify-between space-x-5">
          <div class="w-24">
            <WButtonsBase
              type="primaryInverted"
              @click.native="$refs.modal.isHidden = true"
            >
              Cancel
            </WButtonsBase>
          </div>
          <WButtonsBase type="danger" @click.native="deletePortfolio()">
            I understand the consequences, delete this portfolio!
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <div v-if="portfolioList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo class="text-primary-900" heading="WELL Portfolio" />
          <p class="text-gray-500 text-sm">
            By applying wellness principles at scale, WELL Portfolio members can
            accelerate the health, happiness and mindfulness of more people, and
            make a powerful statement to the world about their commitment to
            support human health.
          </p>
          <template #actions>
            <div class="md:flex gap-x-2 gap-y-2 grid grid-cols-1">
              <div class="w-full md:w-56">
                <WButtonsBase
                  type="primary"
                  icon="plus"
                  @click.native="$router.push('/portfolio/create/')"
                >
                  Start a Portfolio
                </WButtonsBase>
              </div>
              <div
                v-if="currentUser.role.includes('project-coach')"
                class="w-full md:w-56"
              >
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="
                    ;(mode = 'coach'),
                      $store.dispatch('portfolio/getCoachPortfolio')
                  "
                >
                  Show Coaching Projects
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>
        <WLinksBase
          v-if="mode === 'coach'"
          icon="arrow-narrow-left"
          @click.native="
            ;(mode = 'user'),
              $store.dispatch('portfolio/getPortfolioList', allFilters)
          "
        >
          Back to list
        </WLinksBase>
        <FormulateForm
          v-if="mode === 'user'"
          class="md:grid grid-cols-6 gap-4 mb-5 hidden"
          @submit="applyFilters()"
        >
          <FormulateInput
            v-model="filters.portfolio_number"
            type="text"
            placeholder="ID"
            label="Portfolio ID"
          />
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Name"
            label="Name"
          />
          <FormulateInput type="submit" label="Apply" class="my-auto pt-1" />
          <div class="my-auto pt-1">
            <WButtonsBase
              v-if="
                filters.portfolio_number ||
                filters.name ||
                filters.type !== 'v2-pilot'
              "
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
        <FormulateForm
          v-else
          class="md:grid grid-cols-6 gap-4 mb-5 hidden"
          @submit="applyFilters()"
        >
          <FormulateInput
            v-model="coachFilters.portfolio_number"
            type="text"
            placeholder="ID"
            label="Portfolio ID"
          />
          <FormulateInput
            v-model="coachFilters.name"
            type="text"
            placeholder="Name"
            label="Name"
          />
          <FormulateInput type="submit" label="Apply" class="my-auto pt-1" />
          <div class="my-auto pt-1">
            <WButtonsBase
              v-if="
                coachFilters.portfolio_number ||
                coachFilters.name ||
                coachFilters.type !== 'v2-pilot'
              "
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>

        <LazyAccordiansBase
          ref="filters"
          label="Filters"
          class="mb-4 block md:hidden text-sm font-medium"
        >
          <template #content>
            <div>
              <FormulateForm
                class="grid grid-cols-1 mb-5"
                @submit="applyFilters()"
              >
                <FormulateInput
                  v-model="filters.portfolio_number"
                  type="text"
                  placeholder="ID"
                  label="Portfolio ID"
                />
                <FormulateInput
                  v-model="filters.name"
                  type="text"
                  placeholder="Name"
                  label="Name"
                />
                <FormulateInput
                  type="submit"
                  label="Apply"
                  class="my-auto pt-1"
                />
                <div class="my-auto pt-1">
                  <WButtonsBase
                    v-if="
                      filters.portfolio_number ||
                      filters.name ||
                      filters.type !== 'v2-pilot'
                    "
                    type="primaryInverted"
                    @click.native="clearFilters()"
                  >
                    Clear filters
                  </WButtonsBase>
                </div>
              </FormulateForm>
            </div>
          </template>
        </LazyAccordiansBase>

        <div
          class="
            relative
            shadow
            overflow-hidden
            border-b border-gray-200
            sm:rounded-lg
          "
        >
          <div class="overflow-x-scroll">
            <table class="w-full divide-x divide-y divide-gray-200">
              <thead>
                <tr class="bg-primary-700 text-white">
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    ID
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Name
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Area
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Status
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Admin
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Created
                  </th>
                  <th
                    class="
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    <div class="w-28"></div>
                  </th>
                  <th
                    class="
                      w-28
                      right-0
                      transform
                      absolute
                      px-3
                      md:px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                      bg-primary-700
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="portfolio in portfolioList.data" :key="portfolio.id">
                  <td class="h-20 px-3 md:px-6 py-4 whitespace-nowrap">
                    <div
                      class="
                        text-sm
                        leading-5
                        text-primary-500
                        cursor-pointer
                        flex
                        space-x-2
                      "
                    >
                      <div
                        @click="
                          $router.push(
                            `/portfolio/${portfolio.portfolio_number}/dashboard`
                          )
                        "
                      >
                        {{ portfolio.portfolio_number }}
                      </div>
                      <a
                        :href="`/portfolio/${portfolio.portfolio_number}/dashboard`"
                        target="_blank"
                      >
                        <WIconsBase
                          icon="external-link"
                          type="blank"
                          class="text-gray-400 hover:text-gray-500"
                        />
                      </a>
                    </div>
                  </td>
                  <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div
                      class="
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                        max-w-sm
                        truncate
                      "
                    >
                      {{ portfolio.name }}
                    </div>
                  </td>
                  <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ portfolio.area | formatNumber }} sq ft
                    </div>
                    <div class="text-sm leading-5 font-medium text-gray-500">
                      {{ portfolio.no_of_assets }} locations
                    </div>
                  </td>
                  <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      <span
                        v-if="regStatus(portfolio)"
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-primary-600
                          text-white
                          uppercase
                        "
                        >Registered</span
                      >
                      <span
                        v-else
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-secondary-600
                          text-white
                          uppercase
                        "
                        >Not Registered</span
                      >
                    </div>
                  </td>
                  <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ portfolio.user_email }}
                    </div>
                    <div class="text-sm leading-5 font-medium text-gray-500">
                      {{ portfolio.user_name }}
                    </div>
                  </td>
                  <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ $dayjs(portfolio.created_at).format('MMM DD, YYYY') }}
                    </div>
                  </td>
                  <td class="w-28"></td>
                  <td
                    class="
                      h-20
                      border-b
                      flex
                      justify-around
                      w-28
                      right-0
                      transform
                      absolute
                      px-3
                      md:px-6
                      py-4
                      whitespace-nowrap
                      white-gradient
                    "
                  >
                    <WIconsBase
                      v-if="
                        (currentUser.role.includes('well-admin') ||
                          currentUser.role.includes('admin') ||
                          portfolio.user_id === currentUser.id) &&
                        portfolio.reg_payment_status !== 'paid'
                      "
                      class="cursor-pointer"
                      icon="trash"
                      type="danger"
                      @click.native="
                        ;($refs.modal.isHidden = false),
                          (selectedPortfolio = portfolio)
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('portfolio/getPortfolioList', allFilters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading portfolios list...</div>
      </div>
      <div v-else class="mx-auto text-center">
        <div class="mt-3 text-danger-400 font-medium">
          Something went wrong. Please check that you have correct permissions
          to view this.
          <br />
          Error: {{ error }}
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
      mode: 'user',
      filters: {
        user_type: null,
        type: 'v2-pilot',
        portfolio_number: '',
        name: '',
      },
      coachFilters: {
        portfolio_number: '',
        name: '',
      },
      selectedPortfolio: null,
      error: null,
    }
  },
  head() {
    return {
      title: `Portfolios`,
    }
  },
  computed: {
    ...mapState({
      portfolioList: (state) => state.portfolio.portfolioList,
      currentUser: (state) => state.user.currentUser,
    }),
    paginate() {
      if (this.portfolioList) {
        return {
          total: this.portfolioList.total,
          per_page: this.portfolioList.per_page,
          current_page: this.portfolioList.current_page,
          last_page: this.portfolioList.last_page,
          from: this.portfolioList.from,
          to: this.portfolioList.to,
        }
      }
      return {}
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
    allCoachFilters() {
      const res = JSON.parse(JSON.stringify(this.coachFilters))
      res.page = this.paginate.current_page
      return res
    },
  },
  async created() {
    return await this.$store
      .dispatch('portfolio/getPortfolioList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    applyFilters() {
      this.allFilters.page = 1
      if (this.mode === 'user') {
        this.$store.dispatch('portfolio/getPortfolioList', this.allFilters)
      } else {
        this.$store.dispatch(
          'portfolio/getCoachPortfolio',
          this.allCoachFilters
        )
      }
      this.$refs.filters.isExpanded = false
    },
    deletePortfolio() {
      this.$store
        .dispatch(`portfolio/deletePortfolioById`, this.selectedPortfolio.id)
        .then((response) => {
          this.$refs.modal.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Portfolio Deleted Successfully!',
          })
          if (this.mode === 'user') {
            this.$store.dispatch('portfolio/getPortfolioList', this.allFilters)
          } else {
            this.$store.dispatch(
              'portfolio/getCoachPortfolio',
              this.allCoachFilters
            )
          }
        })
    },
    clearFilters() {
      this.coachFilters.portfolio_number = ''
      this.coachFilters.name = ''
      this.filters.portfolio_number = ''
      this.filters.name = ''
      this.filters.user_type = null
      if (this.mode === 'user') {
        this.$store.dispatch('portfolio/getPortfolioList', this.allFilters)
      } else {
        this.$store.dispatch(
          'portfolio/getCoachPortfolio',
          this.allCoachFilters
        )
      }
    },
    regStatus(portfolio) {
      if (
        (portfolio.reg_status === 1 &&
          portfolio.reg_payment_status === 'paid') ||
        portfolio.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
