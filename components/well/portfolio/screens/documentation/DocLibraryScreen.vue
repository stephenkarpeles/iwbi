<template>
  <div>
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
          This action cannot be undone. This will permanently delete this
          document.
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
          <WButtonsBase type="danger" @click.native="deleteScorecardDocument()">
            I understand the consequences, delete this document!
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <div
      v-if="scorecardDocuments.data && scorecardDocuments.data.length > 0"
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
                      Document
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
                      Scales
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
                      <div class="w-32">Audit #</div>
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
                      Location #
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
                    v-for="(document, index) in scorecardDocuments.data"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="gap-2 grid grid-cols-2 w-40">
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
                            text-center
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
                      <div class="flex items-center text-secondary-800">
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
                      <div class="flex items-center text-primary-700">
                        {{
                          document.part_doc_type &&
                          document.part_doc_type !== 'null'
                            ? document.part_doc_type
                            : '-'
                        }}
                      </div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center text-primary-700">
                        {{
                          document.type === 'Guideline'
                            ? document.project_ids.length
                              ? getSquareRoot(document.project_ids.length)
                              : '-'
                            : '-'
                        }}
                      </div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center text-primary-700">
                        {{ document.project_ids.length }}
                      </div>
                    </td>

                    <td class="p-4 px-6 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <div class="w-18">
                          <WButtonsBase
                            icon="pencil"
                            class="mr-2"
                            type="primaryInverted"
                            @click.native="editProperty(document)"
                          />
                        </div>
                        <div class="w-18">
                          <WButtonsBase
                            v-if="
                              currentUser.role.includes('well-admin') ||
                              currentUser.id === document.last_updated_by
                            "
                            icon="trash"
                            type="dangerInverted"
                            @click.native="
                              ;($refs.modal.isHidden = false),
                                (selectedDocument = document)
                            "
                          />
                        </div>
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
        :pagination="scorecardDocuments"
        :offset="3"
        @paginate="getScorecard()"
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
      selectedDocument: null,
    }
  },
  computed: {
    ...mapState({
      scorecardDocuments: (state) => state.portfolio.libraryScorecardDocuments,
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async getScorecard() {
      if (this.portfolio && this.portfolio.scorecard_id !== null) {
        await this.$store.dispatch('portfolio/getScorecardDocuments', {
          scorecardId: this.portfolio.scorecard_id,
          page: this.scorecardDocuments.current_page,
          filterShared: this.filterScorecardList,
          type: ['Guideline', 'Portfolio-Scale'],
        })
      }
    },
    getDocumentType(type) {
      return type === 'Portfolio Scale' ? 'Shared' : type
    },
    getSquareRoot(projectCount) {
      return Math.floor(Math.sqrt(projectCount))
    },
    editProperty(document) {
      this.selectedDocument = document
      this.$refs.documentSlide.toggleOpen()
    },
    deleteScorecardDocument() {
      this.$store
        .dispatch('portfolio/deleteScorecardDocuments', {
          id: this.selectedDocument.id,
          scorecardId: this.selectedDocument.scorecard_id,
        })
        .then(() => {
          this.getScorecard()
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document deleted',
          })
        })
      this.$refs.modal.isHidden = true
    },
  },
}
</script>
