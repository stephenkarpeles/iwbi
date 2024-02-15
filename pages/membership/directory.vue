<template>
  <div class="flex flex-col">
    <div
      v-if="organizationsList"
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
    >
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <WHeadingsHTwo heading="IWBI Organizations" />
        <form
          class="grid grid-cols-5 gap-4 my-5"
          @submit.prevent="
            $store.dispatch('membership/getOragnizationsList', allFilters)
          "
        >
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Organization Name"
          />
          <FormulateInput
            v-model="filters.type"
            :options="{
              Cornerstone: 'Cornerstone',
              Keystone: 'Keystone',
              Portfolio: 'Portfolio',
            }"
            type="select"
            placeholder="Organization Level"
          />
          <FormulateInput
            v-model="filters.country_code"
            :options="country_options"
            type="select"
            placeholder="Country"
          />
          <div class="">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <WButtonsBase
            v-if="
              filters.type !== '' ||
              filters.name !== '' ||
              filters.country_code !== ''
            "
            type="primaryInverted"
            @click.native="clearFilters()"
            >Clear filters</WButtonsBase
          >
        </form>
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 p-5 bg-primary-100"
            >
              <WLinksBase
                v-for="(organization, index) in organizationsList.organizations
                  .data"
                :key="index"
                class="h-full animate__zoomIn animate__animated animate__faster"
                :link="'/membership/profile/' + organization.slug"
              >
                <WCardsBase
                  :heading="organization.name"
                  :sub-heading="organization.type"
                  class="w-full"
                  :description="
                    organization.is_featured === 1 ? 'Early Adopter' : ''
                  "
                >
                  <template v-slot:image>
                    <div class="p-3">
                      <div
                        class="h-48 w-full bg-center bg-contain bg-no-repeat"
                        :style="{
                          backgroundImage:
                            'url(' + organization.profile_pic + ')',
                        }"
                      ></div>
                    </div>
                  </template>
                </WCardsBase>
              </WLinksBase>
            </div>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('membership/getOragnizationsList', allFilters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading directory...</div>
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
      filters: {
        type: '',
        name: '',
        country_code: '',
      },
      error: null,
    }
  },
  computed: {
    ...mapState({
      organizationsList: (state) => state.membership.organizationsList,
    }),
    country_options() {
      if (this.organizationsList) {
        const countryOptions = []
        for (let i = 0; i < this.organizationsList.country_count.length; i++) {
          const countryCode = this.organizationsList.country_count[i]
            .country_code
          const countryName = this.organizationsList.country_count[i].name

          const option = {
            value: countryCode,
            label: countryName,
          }

          countryOptions.push(option)
        }
        return countryOptions
      }

      return null
    },
    paginate() {
      if (this.organizationsList) {
        return {
          total: this.organizationsList.organizations.total,
          per_page: this.organizationsList.organizations.per_page,
          current_page: this.organizationsList.organizations.current_page,
          last_page: this.organizationsList.organizations.last_page,
          from: this.organizationsList.organizations.from,
          to: this.organizationsList.organizations.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (this.filters[key] !== null && this.filters[key] !== '') return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      if (this.hasAppliedFilters) res.page = 1
      else res.page = this.paginate.current_page
      return res
    },
  },
  mounted() {
    this.$store.dispatch('membership/getOragnizationsList')
  },
  methods: {
    clearFilters() {
      this.filters = {
        type: '',
        name: '',
        country_code: '',
      }
      this.$store.dispatch('membership/getOragnizationsList')
    },
  },
  head() {
    return {
      title: `Membership Directory`,
    }
  },
}
</script>
