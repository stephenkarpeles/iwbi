<template>
  <div>
    <div v-if="mode === 'action'">
      <WLinksBase
        link="#"
        icon="arrow-narrow-left"
        @click.native="mode = 'list'"
      >
        Back to alternatives
      </WLinksBase>
      <A2EpForm />
    </div>
    <div v-else>
      <div class="flex md:justify-between flex-col md:flex-row">
        <WHeadingsHThree
          class="text-primary-600 mb-4"
          heading="My Alternatives"
        />
        <div class="flex">
          <WButtonsBase
            icon="plus"
            @click.native="
              () => {
                mode = 'action'
              }
            "
          >
            Submit an Equivalency
          </WButtonsBase>
        </div>
      </div>
      <LazyAccordiansBase
        ref="filters"
        label="Filters"
        class="my-4 block md:hidden text-sm font-medium"
      >
        <template #content>
          <div>
            <form
              class="grid grid-col-1 gap-2 mt-5"
              @submit.prevent="
                $store.dispatch('alternative/getAlternatives', allFilters),
                  ($refs.filters.isExpanded = false)
              "
            >
              <FormulateInput
                v-model="currentTab"
                type="select"
                label="Version"
                class="mr-3 mt-auto"
                :options="[
                  { value: 'v2', label: 'WELL v2' },
                  { value: 'v1', label: 'WELL v1' },
                  { value: 'hsr', label: 'WELL Health-Safety' },
                ]"
              />
              <FormulateInput
                v-model="filters.type"
                type="select"
                label="Type"
                class="mr-3 mt-auto"
                :options="[
                  { value: 'aap', label: 'AAPs' },
                  { value: 'ep', label: 'EPs' },
                ]"
              />
              <FormulateInput
                v-model="filters.status"
                type="select"
                label="Status"
                class="mr-3 mt-auto"
                :options="[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'altered', label: 'Approved with Altered' },
                  {
                    value: 'inforequested',
                    label: 'Additional Info Requested',
                  },
                ]"
              />
              <FormulateInput
                v-model="filters.project_number"
                type="text"
                label="Project ID"
                placeholder="Project ID"
                class="mr-5 mt-auto"
              />
              <div>
                <FormulateInput
                  v-if="
                    filters.type_internal !== '' ||
                    filters.v1_aap !== '1' ||
                    filters.orderBy !== 'id' ||
                    filters.order !== 'desc' ||
                    filters.project_number !== '' ||
                    filters.type !== '' ||
                    filters.status !== ''
                  "
                  class="mr-3"
                  type="submit"
                  label="Apply"
                />
              </div>
              <div class="mr-3">
                <WButtonsBase
                  v-if="
                    filters.type_internal !== '' ||
                    filters.v1_aap !== '1' ||
                    filters.orderBy !== 'id' ||
                    filters.order !== 'desc' ||
                    filters.project_number !== '' ||
                    filters.type !== '' ||
                    filters.status !== ''
                  "
                  type="primaryInverted"
                  class="mt-auto mr-3"
                  @click.native="clearFilters()"
                >
                  Clear filters
                </WButtonsBase>
              </div>
            </form>
          </div>
        </template>
      </LazyAccordiansBase>
      <form
        class="md:grid grid-cols-4 gap-4 mb-5 hidden"
        @submit.prevent="
          $store.dispatch('alternative/getAlternatives', allFilters)
        "
      >
        <FormulateInput
          v-model="currentTab"
          type="select"
          label="Version"
          class="mr-3 mt-auto"
          :options="[
            { value: 'v2', label: 'WELL v2' },
            { value: 'v1', label: 'WELL v1' },
            { value: 'hsr', label: 'WELL Health-Safety' },
          ]"
        />
        <FormulateInput
          v-model="filters.type"
          type="select"
          label="Type"
          class="mr-3 mt-auto"
          :options="[
            { value: 'aap', label: 'AAPs' },
            { value: 'ep', label: 'EPs' },
          ]"
        />
        <FormulateInput
          v-model="filters.status"
          type="select"
          label="Status"
          class="mr-3 mt-auto"
          :options="[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'altered', label: 'Approved with Altered' },
            { value: 'inforequested', label: 'Additional Info Requested' },
          ]"
        />
        <FormulateInput
          v-model="filters.project_number"
          type="text"
          label="Project ID"
          placeholder="Project ID"
          class="mr-5 mt-auto"
        />
        <div>
          <FormulateInput
            v-if="
              filters.type_internal !== '' ||
              filters.v1_aap !== '1' ||
              filters.orderBy !== 'id' ||
              filters.order !== 'desc' ||
              filters.project_number !== '' ||
              filters.type !== '' ||
              filters.status !== ''
            "
            class="mr-3"
            type="submit"
            label="Apply"
          />
        </div>
        <div class="mr-3">
          <WButtonsBase
            v-if="
              filters.type_internal !== '' ||
              filters.v1_aap !== '1' ||
              filters.orderBy !== 'id' ||
              filters.order !== 'desc' ||
              filters.project_number !== '' ||
              filters.type !== '' ||
              filters.status !== ''
            "
            type="primaryInverted"
            class="mt-auto mr-3"
            @click.native="clearFilters()"
          >
            Clear filters
          </WButtonsBase>
        </div>
      </form>

      <div v-if="loading" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading the results...</div>
      </div>
      <div v-else>
        <div v-if="alternatives !== 'error' && alternatives">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
              w-full
              mt-3
            "
          >
            <div class="flex flex-col">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  class="
                    py-2
                    align-middle
                    inline-block
                    min-w-full
                    sm:px-6
                    lg:px-8
                  "
                >
                  <div
                    class="
                      shadow
                      overflow-hidden
                      border-b border-gray-200
                      sm:rounded-lg
                    "
                  >
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-primary-700 text-white">
                        <tr>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Alternative #
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Project ID
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Features
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Request
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Submission Date
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Submitted by
                          </th>
                          <th
                            scope="col"
                            class="
                              px-6
                              py-3
                              text-left text-xs
                              font-semibold
                              uppercase
                              tracking-wider
                            "
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="(alternative, index) in alternatives.data"
                          :key="index"
                        >
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <WLinksBase
                                v-if="alternative.feature"
                                :link="`/alternatives/${alternative.id}`"
                              >
                                {{ alternative.type }}-0{{ alternative.id }}
                              </WLinksBase>
                              <WLinksBase
                                v-else
                                :link="`/alternatives/${alternative.id}`"
                              >
                                {{ alternative.type }}-{{ alternative.id }}
                              </WLinksBase>
                              <a
                                :href="`/alternatives/${alternative.id}?redirect=${$route.fullPath}`"
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
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div
                              v-if="alternative.portfolio"
                              class="flex items-center"
                            >
                              <WLinksBase
                                v-if="alternative.feature"
                                :link="`/shared-workspaces/${alternative.portfolio_number}/dashboard`"
                              >
                                {{ alternative.portfolio.portfolio_number }}
                              </WLinksBase>
                              <a
                                :href="`/shared-workspaces/${alternative.portfolio_number}/dashboard`"
                                target="_blank"
                              >
                                <WIconsBase
                                  icon="external-link"
                                  type="blank"
                                  class="text-gray-400 hover:text-gray-500"
                                />
                              </a>
                            </div>
                            <div
                              v-else-if="alternative.project_number"
                              class="flex items-center"
                            >
                              <WLinksBase
                                :link="`/projects/${alternative.type_internal}/${alternative.project_number}/dashboard`"
                              >
                                {{ alternative.project_number }}
                              </WLinksBase>
                              <a
                                :href="`/projects/${alternative.type_internal}/${alternative.project_number}/dashboard`"
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
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div
                              v-if="alternative.feature"
                              class="flex items-center text-primary-700"
                            >
                              {{ alternative.feature.resource_count
                              }}{{ alternative.feature.feature_order }}
                              {{ alternative.feature.name }}
                            </div>
                            <div
                              v-else
                              class="flex items-center text-primary-700"
                            >
                              {{ alternative.v1feature.name }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-primary-700">
                              {{ alternative.type }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-primary-700">
                              {{
                                $dayjs(alternative.created_at).format(
                                  ' DD-MM-YYYY'
                                )
                              }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-primary-700">
                              {{ alternative.user.full_name }}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center text-xs">
                              <span
                                v-if="alternative.status === 'pending'"
                                class="
                                  text-center
                                  badge-info
                                  uppercase
                                  p-1
                                  bg-primary-500
                                  text-white
                                  rounded
                                  font-semibold
                                "
                                >{{ alternative.status }}</span
                              >
                              <span
                                v-else-if="alternative.status === 'approved'"
                                class="
                                  text-center
                                  badge-info
                                  uppercase
                                  p-1
                                  bg-green-500
                                  text-white
                                  rounded
                                  font-semibold
                                "
                                >{{ alternative.status }}</span
                              >
                              <span
                                v-else-if="alternative.status === 'denied'"
                                class="
                                  text-center
                                  badge-info
                                  uppercase
                                  p-1
                                  bg-danger-300
                                  text-white
                                  rounded
                                  font-semibold
                                "
                                >Not Approved</span
                              >
                              <span
                                v-else
                                class="
                                  text-center
                                  badge-info
                                  uppercase
                                  p-1
                                  bg-gray-500
                                  text-white
                                  rounded
                                  font-semibold
                                "
                                >{{ alternative.status }}</span
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormInputsPagination
            class="mt-3"
            :pagination="alternatives"
            :offset="3"
            @paginate="
              $store.dispatch('alternative/getAlternatives', allFilters)
            "
          />
        </div>
        <div v-else-if="alternatives && alternatives === 'error'">
          <div
            class="
              rounded-md
              bg-yellow-50
              p-4
              mb-5
              rounded-lg
              border border-yellow-300
              mt-4
            "
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  x-description="Heroicon name: exclamation"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="mt-3 h-5 w-5 text-yellow-400"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <div class="text-yellow-600">
                  <div class="block">
                    <h4 class="mt-2 text-xl leading-7 font-semibold">Opps!</h4>
                  </div>
                  <div class="mt-3"></div>
                </div>
                <div class="mt-2 text-sm leading-5 text-yellow-700">
                  <p>No alternatives can be found under this version</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mx-auto text-center">
            <WLoadingSpinner class="mx-auto" />
            <div class="mt-3 text-primary-600">Loading Alternatives...</div>
          </div>
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
      mode: 'list',
      currentTab: 'v2',
      loading: false,
      filters: {
        type_internal: 'v2-pilot',
        v1_aap: '',
        orderBy: 'id',
        order: 'desc',
        page: 1,
        project_number: '',
        type: '',
        status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `My Alternatives`,
    }
  },
  computed: {
    ...mapState({
      alternatives: (state) =>
        JSON.parse(JSON.stringify(state.alternative.concepts)),
    }),
    paginate() {
      if (this.alternatives) {
        return {
          total: this.alternatives.total,
          per_page: this.alternatives.per_page,
          current_page: this.alternatives.current_page,
          last_page: this.alternatives.last_page,
          from: this.alternatives.from,
          to: this.alternatives.to,
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
  watch: {
    currentTab(newValue) {
      switch (newValue) {
        case 'v1':
          this.filters = {
            type_internal: '',
            v1_aap: '1',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'v2':
          this.filters = {
            type_internal: 'v2-pilot',
            v1_aap: '',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'hsr':
          this.filters = {
            type_internal: 'v2-hsr',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
      }
      this.loading = true
      this.$store
        .dispatch('alternative/getAlternatives', this.filters)
        .then((res) => {
          this.loading = false
        })
    },
  },
  async mounted() {
    await this.getAlternatives()
  },
  methods: {
    async getAlternatives() {
      await this.$store.dispatch('alternative/getAlternatives', this.allFilters)
    },
    clearFilters() {
      this.currentTab = 'v2'
      this.filters = {
        type_internal: 'v2-pilot',
        v1_aap: '',
        orderBy: 'id',
        order: 'desc',
        page: 1,
        project_number: '',
        type: '',
        status: '',
      }
      this.$store.dispatch('alternative/getAlternatives', this.filters)
    },
  },
}
</script>
