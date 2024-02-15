<template>
  <div class="flex flex-col">
    <div v-if="adminUsersList">
      <NavBreadcrumbs
        :actions="[
          {
            title: 'Merge Accounts',
            link: '/well-admin/user-merge',
            type: 'primary',
            icon: 'pencil',
          },
        ]"
      >
        <WHeadingsHTwo class="text-primary-900" heading="Users" />
      </NavBreadcrumbs>
      <!-- mobile filters start here -->
      <LazyAccordiansBase
        ref="mobFilters"
        label="filters"
        class="sm:hidden mb-8 capitalize"
      >
        <template #content>
          <FormulateForm
            @submit="
              () => {
                allFilters.page = 1
                getAdminUsersList(allFilters)
                $refs.mobFilters.isExpanded = false
              }
            "
          >
            <FormulateInput
              v-model="filters.name"
              class="mt-auto"
              name="First name"
              label="First name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.last_name"
              class="mt-auto"
              name="Last name"
              label="Last name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.email"
              class="mt-auto"
              name="Email"
              label="Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.organization"
              class="mt-auto"
              name="Organization"
              label="Organization"
              type="text"
              :error="error"
            />
            <FormulateInput class="mt-6" type="submit" label="Apply" />
            <div
              v-if="
                filters.email !== '' ||
                filters.name !== '' ||
                filters.last_name !== '' ||
                filters.organization !== ''
              "
              class="mt-4"
            >
              <WButtonsBase
                class="mt-auto"
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </FormulateForm>
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <!-- desktop filters start here -->
      <FormulateForm
        class="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-5"
        @submit="
          () => {
            allFilters.page = 1
            getAdminUsersList(allFilters)
          }
        "
      >
        <FormulateInput
          v-model="filters.name"
          class="mt-auto"
          name="First name"
          label="First name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.last_name"
          class="mt-auto"
          name="Last name"
          label="Last name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.email"
          class="mt-auto"
          name="Email"
          label="Email"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.organization"
          class="mt-auto"
          name="Organization"
          label="Organization"
          type="text"
          :error="error"
        />
        <FormulateInput class="mt-6" type="submit" label="Apply" />
        <div
          v-if="
            filters.email !== '' ||
            filters.name !== '' ||
            filters.last_name !== '' ||
            filters.organization !== ''
          "
          class="mt-6"
        >
          <WButtonsBase
            class="mt-auto"
            type="primaryInverted"
            @click.native="clearFilters()"
          >
            Clear filters
          </WButtonsBase>
        </div>
      </FormulateForm>
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div class="overflow-x-scroll">
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-white bg-primary-700">
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Title/Organization
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Designation(s)
                </th>
                <th
                  class="px-6 py-3 text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in adminUsersList.data" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ user.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 relative">
                      <div
                        class="bg-primary-400 h-10 w-10 rounded-full bg-center bg-cover absolute z-0"
                        :style="{
                          backgroundImage: 'url(/profile/avatar.jpg)',
                        }"
                      ></div>
                      <div
                        class="h-10 w-10 rounded-full bg-center bg-cover z-10 relative"
                        :style="[
                          user.profile_pic != null
                            ? {
                                backgroundImage:
                                  'url(' + user.profile_pic + ')',
                              }
                            : { backgroundImage: 'url(/profile/avatar.jpg)' },
                        ]"
                      ></div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm leading-5 font-medium text-gray-900">
                        {{ user.name }} {{ user.last_name }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-html="
                      checkValue(
                        user.job_title,
                        'Job title not set',
                        'text-sm leading-5 text-gray-900'
                      )
                    "
                  ></div>
                  <div
                    v-html="
                      checkValue(
                        user.organization,
                        'Organization not set',
                        'text-sm leading-5 text-gray-500'
                      )
                    "
                  ></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="user.well_ap === 1"
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white"
                  >
                    WELL AP
                  </span>
                  <span
                    v-if="user.well_faculty === 1"
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white"
                  >
                    WELL Faculty
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                >
                  <a
                    v-if="currentUser.role.includes('super-admin')"
                    href="#"
                    class="text-primary-600 hover:text-primary-900 mr-4"
                    @click="switchUser(user.id)"
                  >
                    Switch
                  </a>

                  <a
                    href="#"
                    class="text-primary-600 hover:text-primary-900"
                    @click="viewUser(user.id)"
                  >
                    View
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FormInputsPagination
          :pagination="paginate"
          :offset="3"
          @paginate="getAdminUsersList(allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading User Profiles...</div>
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
import { createNamespacedHelpers } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

const { mapState, mapActions } = createNamespacedHelpers('user')

export default {
  mixins: [tableMixin],
  data() {
    return {
      filters: {
        name: '',
        last_name: '',
        email: '',
        organization: '',
        orderBy: 'id',
        order: 'desc',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Users`,
    }
  },
  computed: {
    ...mapState(['currentUser', 'adminUsersList', 'adminFilters']),
    paginate() {
      if (this.adminUsersList) {
        return {
          total: this.adminUsersList.total,
          per_page: this.adminUsersList.per_page,
          current_page: this.adminUsersList.current_page,
          last_page: this.adminUsersList.last_page,
          from: this.adminUsersList.from,
          to: this.adminUsersList.to,
        }
      }
      return {}
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  async created() {
    return await this.getAdminUsersList().catch((error) => (this.error = error))
  },

  methods: {
    ...mapActions(['fetchUser', 'getAdminUsersList', 'switchUser']),
    async viewUser(userId) {
      await this.$store.dispatch('user/getUserSlugById', userId).then((res) => {
        this.$router.push('/user/profile/' + res)
      })
    },
    clearFilters() {
      this.filters = {
        name: '',
        last_name: '',
        email: '',
        organization: '',
        orderBy: 'id',
        order: 'desc',
      }

      this.getAdminUsersList()
    },
  },
}
</script>
