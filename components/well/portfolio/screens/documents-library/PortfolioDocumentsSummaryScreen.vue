<template>
  <div>
    <div
      v-if="allProjects && allProjects.data && allProjects.data.length"
      class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
    >
      <div class="overflow-auto">
        <table
          class="w-full divide-y divide-gray-200 ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <thead>
            <tr class="border-b-2 text-xs font-semibold">
              <th
                class="px-6 py-3 bg-primary-700 text-white text-left leading-4 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 bg-primary-700 text-white text-left leading-4 uppercase tracking-wider"
              >
                General
              </th>
              <th
                class="px-6 py-3 bg-primary-700 text-white text-left leading-4 uppercase tracking-wider"
              >
                Scorecard
              </th>
              <th
                class="px-6 py-3 bg-primary-700 text-white text-left leading-4 uppercase tracking-wider"
              >
                Shared
              </th>
              <th
                class="px-6 py-3 bg-primary-700 text-white text-left leading-4 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(document, index) in allProjects.data"
              :key="index"
              class="align-top"
            >
              <td class="p-4 font-medium border-b-2 text-primary-700">
                <div class="leading-4">
                  <span class="font-semibold">{{ document.name }}</span>
                </div>
                <span class="text-gray-400 text-xs italic">{{
                  document.project_number
                }}</span>
              </td>
              <td
                class="p-4 font-medium border-b-2 text-center text-primary-700"
              >
                {{ document.document_count }}
              </td>
              <td
                class="p-4 font-medium border-b-2 text-center text-primary-700"
              >
                {{ document.scorecard_document_count }}
              </td>
              <td
                class="p-4 font-medium border-b-2 text-center text-primary-700"
              >
                {{ document.scorecard_shared_document_count }}
              </td>
              <td
                class="p-4 font-medium border-b-2 text-center text-primary-700"
              >
                <WIconsBase
                  class="text-primary-600 hover:cursor-pointer hover:text-primary-800"
                  icon="pencil-alt"
                  @click.native="
                    $refs.summarySlide.toggleOpen(), (activeProject = document)
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
        <FormInputsPagination
          :pagination="allProjects"
          :offset="3"
          @paginate="getDocuments()"
        />
      </div>
    </div>
    <div v-else-if="loading" class="mx-auto mt-10 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">
        Loading list of location summary...
      </div>
    </div>
    <div v-else class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto">
      <div
        class="p-4 my-5 w-full rounded font-semibold text-sm bg-primary-100 text-primary-700"
      >
        <p class="text-base">No documents uploaded into the scorecard yet.</p>
      </div>
    </div>

    <!-- Slide overs -->
    <WSlideoversOverlay ref="summarySlide" title="Documents" class="z-50">
      <template #content>
        <PortfolioDocumentsSummaryListScreen
          v-if="activeProject !== null"
          :project-info="activeProject"
        />
      </template>
    </WSlideoversOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      loading: true,
      activeProject: null,
    }
  },
  computed: {
    ...mapState({
      allProjects: (state) =>
        JSON.parse(JSON.stringify(state.portfolio.allLocations)),
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  async mounted() {
    await this.getDocuments()
  },
  methods: {
    async getDocuments() {
      await this.$store
        .dispatch('portfolio/getFilterProjects', {
          id: this.portfolio.id,
          page: this.allProjects ? this.allProjects.current_page : 1,
          paginate: 'yes',
          projectSummary: true,
        })
        .then((response) => {
          this.loading = false
        })
    },
  },
}
</script>
