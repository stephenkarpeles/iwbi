<template>
  <div>
    <div
      v-if="
        scorecardAuditDocuments.data && scorecardAuditDocuments.data.length > 0
      "
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
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
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
                      Name
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
                      Parts
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
                      Documents
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
                      Type
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
                      Verification Method
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(document, index) in scorecardAuditDocuments.data"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span
                          class="font-medium text-primary-900 opacity-80"
                          v-html="getProjectDetails(document)"
                        ></span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          v-for="(part, i) in document.parts"
                          :key="i"
                          class="
                            text-sm
                            font-medium
                            rounded-full
                            bg-primary-800
                            text-white
                            px-3
                            py-1
                          "
                        >
                          {{ part.part_prefix }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-col">
                        <WLinksBase
                          :link="document.link_s3_private"
                          target="_blank"
                        >
                          <span class="font-medium text-primary-700">
                            {{ document.name }}
                          </span>
                        </WLinksBase>
                        <div class="text-primary-900 opacity-50 text-sm">
                          By {{ document.user_name }} on
                        </div>
                        <div class="text-primary-900 opacity-50 text-sm">
                          {{
                            $dayjs(document.created_at).format('MMM DD, YYYY')
                          }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div
                        class="flex items-center text-primary-900 opacity-80"
                      >
                        {{
                          document.type !== '' && document.type !== null
                            ? getDocumentType(
                                document.type.split('-').join(' ')
                              )
                            : '-'
                        }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div
                        class="flex items-center text-primary-900 opacity-80"
                      >
                        {{
                          document.part_doc_type &&
                          document.part_doc_type !== 'null'
                            ? document.part_doc_type
                            : '-'
                        }}
                      </div>
                    </td>
                    <td class="p-4 px-6 whitespace-nowrap">
                      <div class="flex items-center">
                        <WButtonsBase
                          icon="pencil"
                          class="mr-2"
                          type="primaryInverted"
                          @click.native="editProperty(document)"
                        />
                        <WButtonsBase
                          icon="trash"
                          type="dangerInverted"
                          @click.native="deleteScorecardDocument(document.id)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <FormInputsPagination
        v-if="scorecardAuditDocuments"
        :pagination="paginateAudit"
        :offset="3"
        @paginate="getScorcard()"
      />
    </div>
    <div v-else class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto">
      <div class="p-4 my-5 w-full rounded font-semibold text-sm">
        <p class="text-base">There are no documents.</p>
      </div>
    </div>

    <!-- Slideovers -->
    <WSlideoversOverlay
      ref="documentSlide"
      title="Shared Documents"
      class="z-50"
    >
      <template #content>
        <PortfolioPropertyEditScreen
          v-if="selectedDocument !== null"
          :selected-document="selectedDocument"
          :is-hsr-doc="true"
      /></template>
    </WSlideoversOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      filterScorecardList: false,
      selectedDocument: null,
    }
  },
  computed: {
    ...mapState({
      scorecardAuditDocuments: (state) =>
        state.portfolio.scorecardAuditDocuments,
      portfolio: (state) => state.portfolio.portfolio,
    }),
    paginateAudit() {
      if (this.scorecardAuditDocuments) {
        return {
          total: this.scorecardAuditDocuments.total,
          per_page: this.scorecardAuditDocuments.per_page,
          current_page: this.scorecardAuditDocuments
            ? this.scorecardAuditDocuments.current_page
            : 1,
          last_page: this.scorecardAuditDocuments.last_page,
          from: this.scorecardAuditDocuments.from,
          to: this.scorecardAuditDocuments.to,
        }
      }
      return {}
    },
  },
  async mounted() {
    await this.getScorcard()
  },
  methods: {
    async getScorcard() {
      const type = ['Individual-Scale', 'Audit-Document']
      if (this.portfolio && this.portfolio.hsr_scorecard_id !== null) {
        await this.$store.dispatch('portfolio/getScorecardAuditDocuments', {
          scorecardId: this.portfolio.hsr_scorecard_id,
          page: this.paginateAudit.current_page,
          paginate: 'yes',
          filterShared: this.filterScorecardList,
          type,
        })
      }
    },
    getProjectDetails(document) {
      const target = document.project_ids.filter(
        (el) => el.id === document.project_id
      )
      if (target.length > 0) {
        return target[0].name
      } else {
        return '-'
      }
    },
    getDocumentType(type) {
      return type === 'Portfolio Scale' ? 'Shared' : type
    },

    editProperty(document) {
      this.selectedDocument = document
      this.$refs.documentSlide.toggleOpen()
    },
    deleteScorecardDocument(id) {
      this.$store
        .dispatch('portfolio/deleteScorecardDocuments', {
          id,
          scorecardId: this.portfolio.hsr_scorecard_id,
        })
        .then(() => {
          this.getScorcard()
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document Deleted',
          })
        })
    },
  },
}
</script>
