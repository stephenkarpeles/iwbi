<template>
  <div>
    <div v-if="!addDocument">
      <!-- deleteReviewModal modal start here -->
      <WFeedbackModal ref="deleteReviewModal">
        <div class="max-w-lg mx-10 my-5">
          <div class="flex justify-center mb-4">
            <div
              class="bg-red-100 flex flex-shrink-0 h-16 items-center justify-center mx-auto rounded-full sm:mx-0 w-16"
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
            Are you sure you want to delete this document? This action can not
            be undone
          </div>
          <div class="flex justify-between space-x-5">
            <div class="w-24">
              <WButtonsBase
                type="primaryInverted"
                @click.native="$refs.deleteReviewModal.isHidden = true"
              >
                Cancel
              </WButtonsBase>
            </div>
            <WButtonsBase type="danger" @click.native="deleteDocument()">
              <span>
                I understand the consequences, delete this document.
              </span>
            </WButtonsBase>
          </div>
        </div>
      </WFeedbackModal>

      <div class="flex">
        <WHeadingsHTwo
          :class="[
            currentUser.role.includes('well-admin') ||
            currentUser.role.includes('external-reviewer')
              ? 'w-1/2'
              : 'w-3/4',
          ]"
          heading="Documentation"
        ></WHeadingsHTwo>
        <div :class="'flex w-1/2'">
          <WButtonsBase
            v-if="showAddButton"
            class="w-1/2"
            icon="plus"
            type="primary"
            @click.native="addDocument = !addDocument"
            >Add</WButtonsBase
          >
          <div class="min-w-[16rem] ml-2 flex">
            <WButtonsBase
              v-if="downloadAccess"
              type="primaryInverted"
              icon="download"
              @click.native="downloadAll"
            >
              Download All Documents
            </WButtonsBase>
          </div>
        </div>
      </div>
      <p class="text-scondary-700 text-sm mt-4 leading-6">
        To get more details on the documentation requirements, please refer to
        the&nbsp;
        <a
          class="text-primary-600 inline"
          href="https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf"
          target="_blank"
        >
          [ WELL Performance Rating Guidebook ] </a
        >&nbsp;page 4.
      </p>
      <p
        v-if="checkMissingDocumentLocation"
        class="text-scondary-700 text-sm mt-4 leading-6 text-red-400"
      >
        {{ documentWarning }}
      </p>
      <p
        v-if="checkSingleLocation"
        class="text-scondary-700 text-sm mt-4 leading-6 text-red-400"
      >
        {{ multipleDocumentsWarning }}
      </p>
      <div class="mt-14">
        <WTabsHorizontal
          v-model="currentTab"
          class="w-full -mb-px"
          :tabs="[
            { name: 'Library', icon: '' },
            { name: 'Audit', icon: '' },
            { name: 'General', icon: '' },
            { name: 'Summary', icon: '' },
          ]"
        />
        <div v-if="currentTab !== 'Summary'" class="flex w-full items-end mt-5">
          <div class="w-3/4">
            <FormulateInput
              v-model="documentSearch"
              type="text"
              placeholder="Search document..."
            />
          </div>
          <div class="w-38 ml-5 flex">
            <WButtonsBase icon="search-circle" @click.native="getDocuments"
              >Search</WButtonsBase
            >
            <WButtonsBase
              class="ml-5"
              type="danger"
              icon="refresh"
              @click.native="documentSearch = ''"
            >
              Reset</WButtonsBase
            >
          </div>
        </div>
        <!-- Library -->
        <div :class="{ flex: true, hidden: currentTab !== 'Library' }">
          <div
            v-if="!loadingLibrary"
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
          >
            <div
              v-if="scorecardDocuments.data && scorecardDocuments.data.length"
            >
              <div
                class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
              >
                <table
                  class="table-auto w-full border-separate"
                  style="border-spacing: 0 5px"
                >
                  <thead class="whitespace-nowrap">
                    <tr class="uppercase bg-gray-100 px-2 text-xs">
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Parts
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Document
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Verification Method
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Audit Number
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location#
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody v-if="scorecardDocuments.data" class="text-left">
                    <tr
                      v-for="(document, index) in scorecardDocuments.data"
                      :key="index"
                      :class="
                        document.doc_status === 'invalid'
                          ? 'bg-gray-200 opacity-50'
                          : 'bg-white'
                      "
                    >
                      <td
                        class="p-4 font-light text-sm"
                        v-html="getpartsList(document)"
                      ></td>
                      <td class="p-4 font-light text-sm">
                        <WLinksBase
                          :link="document.link_s3_private"
                          target="_blank"
                        >
                          {{ document.name }}
                        </WLinksBase>
                        <div class="text-sm">
                          By {{ document.user_name }} on
                          {{
                            $dayjs(document.created_at).format(' DD-MM-YYYY')
                          }}
                        </div>
                      </td>
                      <td class="p-4 font-light text-center text-sm">
                        <div>
                          {{
                            document.type !== '' && document.type !== null
                              ? getDocumentType(
                                  document.type.split('-').join(' ')
                                )
                              : '-'
                          }}
                        </div>
                        <div
                          v-if="document.stage === 'Intent'"
                          class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-green-100 text-green-800"
                        >
                          {{ document.stage }}
                        </div>
                      </td>
                      <td class="p-4 font-light text-center text-sm">
                        {{
                          document.part_doc_type &&
                          document.part_doc_type !== 'null'
                            ? document.part_doc_type
                            : '-'
                        }}
                      </td>
                      <td class="p-4 font-light text-sm text-center">
                        {{
                          document.type === 'Guideline'
                            ? document.project_ids.length
                              ? getSquareRoot(document.project_ids.length)
                              : '-'
                            : '-'
                        }}
                      </td>
                      <td class="p-4 font-light text-sm text-center">
                        {{ document.project_ids.length }}
                      </td>
                      <td
                        v-if="document.doc_status !== 'invalid'"
                        class="p-4 font-light text-sm flex justify-center text-center"
                      >
                        <WButtonsBase
                          v-if="afterRecert(document.created_at)"
                          icon="pencil"
                          class="mr-2"
                          type="primaryInverted"
                          @click.native="
                            $refs.documentSlide.toggleOpen(),
                              showProjects(document)
                          "
                        />
                        <WButtonsBase
                          v-if="!afterRecert(document.created_at)"
                          icon="archive"
                          class="mr-2"
                          type="primaryInverted"
                          @click.native="setDocumentStatus(document)"
                        >
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            afterReview(document.created_at) &&
                            afterRecert(document.created_at)
                          "
                          icon="trash"
                          type="dangerInverted"
                          @click.native="
                            ;($refs.deleteReviewModal.isHidden = false),
                              (selectedDocId = document.id)
                          "
                        />
                      </td>
                      <td
                        v-else
                        class="p-4 font-light text-sm flex justify-center text-center"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <FormInputsPagination
                v-if="scorecardDocuments && scorecardDocuments.data.length"
                :pagination="paginateLibrary"
                :offset="3"
                @paginate="getDocuments()"
              />
            </div>
            <div
              v-else
              class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
            >
              <div
                class="p-4 my-5 w-full rounded font-semibold text-sm bg-primary-100 text-primary-700"
              >
                <p class="text-base">
                  No documents uploaded into the scorecard yet.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Audit -->
        <div :class="{ flex: true, hidden: currentTab !== 'Audit' }">
          <div
            v-if="!loadingAudit"
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
          >
            <div
              v-if="
                scorecardAuditDocuments.data &&
                scorecardAuditDocuments.data.length
              "
            >
              <div
                class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
              >
                <table
                  v-if="
                    scorecardAuditDocuments.data &&
                    scorecardAuditDocuments.data.length
                  "
                  class="table-auto w-full border-separate"
                  style="border-spacing: 0 5px"
                >
                  <thead class="whitespace-nowrap">
                    <tr class="uppercase bg-gray-100 px-2 text-xs">
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Parts
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Document
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Verification Method
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    v-for="(project, index) in scorecardAuditDocuments.data"
                    :key="index"
                    class="text-left"
                  >
                    <tr class="bg-primary-100">
                      <td
                        class="p-4 font-bold text-sm text-primary-700"
                        colspan="5"
                        v-html="getProjectDetails(project)"
                      ></td>
                    </tr>
                    <tr
                      v-for="(document, pindex) in project.documents"
                      :key="pindex"
                      :class="
                        document.doc_status === 'invalid'
                          ? 'bg-gray-200 opacity-50'
                          : 'bg-white'
                      "
                    >
                      <td
                        class="p-4 text-sm"
                        v-html="getpartsList(document)"
                      ></td>
                      <td class="p-4 font-light text-sm">
                        <WLinksBase
                          :link="document.link_s3_private"
                          target="_blank"
                        >
                          {{ document.name }}
                        </WLinksBase>
                        <div class="text-sm">
                          By {{ document.user_name }} on
                          {{
                            $dayjs(document.created_at).format(' DD-MM-YYYY')
                          }}
                        </div>
                      </td>
                      <td class="p-4 font-light text-sm">
                        <div>
                          {{
                            document.type !== '' &&
                            document.type !== null &&
                            document.part_doc_type !== 'null'
                              ? getDocumentType(
                                  document.type.split('-').join(' ')
                                )
                              : '-'
                          }}
                        </div>

                        <div
                          v-if="document.stage === 'Intent'"
                          class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-green-100 text-green-800"
                        >
                          {{ document.stage }}
                        </div>
                      </td>
                      <td class="p-4 font-light text-sm">
                        {{
                          document.part_doc_type &&
                          document.part_doc_type !== 'null'
                            ? document.part_doc_type
                            : '-'
                        }}
                      </td>
                      <td
                        class="p-4 font-light text-sm flex justify-center text-center"
                      >
                        <WButtonsBase
                          v-if="afterRecert(document.created_at)"
                          icon="pencil"
                          class="mr-2"
                          type="primaryInverted"
                          @click.native="
                            $refs.documentSlide.toggleOpen(),
                              showProjects(document)
                          "
                        />
                        <WButtonsBase
                          v-if="
                            afterReview(document.created_at) &&
                            afterRecert(document.created_at)
                          "
                          icon="trash"
                          type="dangerInverted"
                          @click.native="
                            ;($refs.deleteReviewModal.isHidden = false),
                              (selectedDocId = document.id)
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <FormInputsPagination
                v-if="
                  scorecardAuditDocuments && scorecardAuditDocuments.data.length
                "
                :pagination="paginateAudit"
                :offset="3"
                @paginate="getDocuments()"
              />
            </div>
            <div
              v-else
              class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
            >
              <div
                class="p-4 my-5 w-full rounded font-semibold text-sm bg-primary-100 text-primary-700"
              >
                <p class="text-base">
                  No documents uploaded into the scorecard yet.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- General -->
        <div :class="{ flex: true, hidden: currentTab !== 'General' }">
          <div
            v-if="!loadingGeneral"
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
          >
            <div v-if="documentsList.data && documentsList.data.length">
              <div
                class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
              >
                <table class="table-auto w-full">
                  <thead class="whitespace-nowrap">
                    <tr class="uppercase bg-gray-100 px-2 text-xs">
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Document
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Remarks
                      </th>
                      <th
                        class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    v-if="documentsList.data && documentsList.data.length"
                    class="text-left"
                  >
                    <tr
                      v-for="(document, index) in documentsList.data"
                      :key="index"
                    >
                      <td class="p-4 font-light text-sm uppercase">
                        {{ document.type }}
                      </td>
                      <td class="p-4 font-light text-sm">
                        <WLinksBase
                          :link="document.link_s3_private"
                          target="_blank"
                        >
                          {{ document.name }}
                        </WLinksBase>
                        <div class="text-sm">
                          By {{ document.user_name }} on
                          {{
                            $dayjs(document.created_at).format(' DD-MM-YYYY')
                          }}
                        </div>
                      </td>
                      <td class="p-4 font-light text-sm">
                        <small
                          v-if="document.remark"
                          v-html="document.remark"
                        ></small>
                        <div v-else class="tx-center"><span> - </span></div>
                      </td>
                      <td class="w-1">
                        <WButtonsBase
                          v-if="afterReview(document.created_at)"
                          icon="trash"
                          type="dangerInverted"
                          @click.native="
                            ;($refs.deleteReviewModal.isHidden = false),
                              (selectedDocId = document.id)
                          "
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <FormInputsPagination
                v-if="documentsList.data && documentsList.data.length"
                :pagination="paginateGeneral"
                :offset="3"
                @paginate="getDocuments()"
              />
            </div>
            <div
              v-else
              class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
            >
              <div
                class="p-4 my-5 w-full rounded font-semibold text-sm bg-primary-100 text-primary-700"
              >
                <p class="text-base">
                  You have not uploaded any documents yet.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Summary -->
        <div :class="{ flex: true, hidden: currentTab !== 'Summary' }">
          <div
            v-if="!loadingAudit"
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
          >
            <div
              v-if="projectSummaryLocations.length && projectSummaryParts"
              class="overflow-x-scroll"
            >
              <table
                class="w-full divide-y divide-gray-200 ring-1 rounded-lg shadow-lg ring-gray-200"
              >
                <!-- Summary table head -->
                <thead>
                  <tr class="text-center">
                    <th :colspan="getTotalColumns" class="border-2">
                      Location Details
                    </th>
                  </tr>
                  <tr class="tx-center text-xs">
                    <th
                      class="px-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase font-bold tracking-wider border-2"
                    >
                      Location Name
                    </th>
                    <th
                      v-for="feature in featureandParts"
                      :key="feature.feature"
                      class="px-1 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider font-semibold border-2"
                    >
                      <div class="transform -rotate-45">
                        {{ feature.parts[0].part_prefix }}
                      </div>
                    </th>
                    <th
                      class="px-1 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider font-bold border-2"
                    >
                      <div class="transform -rotate-45">Total</div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(project, index) in projectSummaryLocations"
                    :key="index"
                  >
                    <td
                      class="px-1 py-1 border-2"
                      v-html="getSummaryProjectDetails(project)"
                    ></td>
                    <td
                      v-for="feature in featureandParts"
                      :key="feature.feature"
                      class="px-0 py-1 text-center border-2"
                    >
                      {{ getProjectDocumentCount(project, feature) }}
                    </td>
                    <td
                      :class="[
                        'font-bold px-0 py-1 border-2 text-center',
                        getTotalFeatureDocumentsCount(project) < 15
                          ? 'text-danger-300'
                          : '',
                      ]"
                    >
                      {{ getTotalFeatureDocumentsCount(project) }}
                    </td>
                  </tr>
                  <!-- Totals row -->
                  <tr>
                    <td class="px-1 py-4 border-2 text-sm font-bold">
                      Locations # pursuing this feature
                    </td>
                    <td
                      v-for="feature in featureandParts"
                      :key="feature.feature"
                      class="px-0 py-1 text-center border-2"
                    >
                      {{ getLocationPartSummary(feature) }}
                    </td>
                    <td class="border-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
            >
              <div
                class="p-4 my-5 w-full rounded font-semibold text-sm bg-primary-100 text-primary-700"
              >
                <p class="text-base">
                  No documents uploaded into the scorecard yet.
                </p>
              </div>
            </div>
          </div>
        </div>
        <WLoadingSpinner
          v-if="loadingAudit || loadingGeneral || loadingLibrary"
          class="mx-auto my-5"
        />
      </div>
    </div>
    <div v-else>
      <SharedDocumentsAddScreen />
    </div>
    <WSlideoversOverlay
      ref="documentSlide"
      title="Shared Documents"
      class="z-50"
    >
      <template #content>
        <div>
          <div class="p-5 flex justify-end">
            <div class="w-max flex">
              <WButtonsBase
                v-if="
                  (afterRecert(activeDocument.created_at) &&
                    !showEditDocumentModal &&
                    currentUser.role.includes('well-admin')) ||
                  (!showEditDocumentModal &&
                    activeDocument.type !== 'Audit-Document' &&
                    afterRecert(activeDocument.created_at))
                "
                icon="pencil"
                class="mr-2"
                type="primary"
                @click.native="editScorecardDocument(activeDocument)"
                >Edit</WButtonsBase
              >
              <WButtonsBase
                v-if="showEditDocumentModal"
                icon="pencil"
                class="mr-2"
                type="primary"
                @click.native="updateDocument"
                >Update</WButtonsBase
              >
              <WButtonsBase
                v-if="showEditDocumentModal"
                icon="x-circle"
                type="danger"
                @click.native="showEditDocumentModal = false"
                >Cancel</WButtonsBase
              >
            </div>
          </div>
          <div v-if="!showEditDocumentModal">
            <table class="table-auto w-full">
              <thead class="whitespace-nowrap">
                <tr class="uppercase bg-gray-100 px-2 text-xs">
                  <th class="text-left p-4">Location #</th>
                  <th class="text-left p-4">Location Name</th>
                  <th class="text-left p-4">Subset</th>
                </tr>
              </thead>

              <tbody class="text-left">
                <tr
                  v-for="project in filteredProjects.data"
                  :key="'document-' + project.id"
                >
                  <td class="p-4 font-light text-sm">
                    <span>{{ project.project_number }}</span>
                  </td>
                  <td class="p-4 font-light text-sm">
                    {{ project.name }}
                  </td>
                  <td
                    class="p-4 font-light text-sm"
                    v-html="getAllSubsetnames(project.id)"
                  ></td>
                </tr>
              </tbody>
            </table>
            <FormInputsPagination
              v-if="filteredProjects"
              :pagination="paginateFilter"
              :offset="3"
              @paginate="showProjects(activeDocument)"
            />
          </div>
          <div v-else class="p-5">
            <div
              v-if="activeDocument.type !== 'Audit-Document'"
              class="space-y-6 mx-auto mb-5 border rounded-md p-5"
            >
              <div>
                <div class="mb-5">
                  <WHeadingsHThree heading="Assign to subsets" />
                </div>
                <FormulateInput
                  v-if="subsetList.length"
                  v-model="allSelectedSubset"
                  type="checkbox"
                  :label="allSelectedSubset ? 'Un-select All' : 'Select All'"
                />
                <div style="columns: 3">
                  <FormulateInput
                    v-if="showSubsetList.length"
                    v-model="subsets"
                    :options="showSubsetList"
                    type="checkbox"
                  />
                </div>
                <FormInputsPagination
                  v-if="showSubsetList.length"
                  :pagination="paginateSubset"
                  :offset="3"
                  @paginate="setPaginateSubset"
                />
                <div
                  v-if="!subsetList.length"
                  class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
                >
                  No subset available for this shared workspace.
                </div>
              </div>
              <div>
                <div class="mb-5">
                  <WHeadingsHThree heading="Assign to locations" />
                </div>
                <FormulateInput
                  v-if="showProjectList.length"
                  v-model="allSelectedProjects"
                  type="checkbox"
                  :label="allSelectedProjects ? 'Un-select All' : 'Select All'"
                />
                <div style="columns: 3">
                  <FormulateInput
                    v-model="projects"
                    :options="showProjectList"
                    type="checkbox"
                  />
                </div>
                <FormInputsPagination
                  v-if="showProjectList.length"
                  :pagination="paginateProject"
                  :offset="3"
                  @paginate="setPaginateProject"
                />
                <div
                  v-if="!showProjectList.length"
                  class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
                >
                  No locations available for this shared workspace.
                </div>
              </div>
            </div>
            <div
              v-if="currentUser.role.includes('well-admin')"
              class="space-y-6 mx-auto mb-5 border rounded-md p-5"
            >
              <div class="mb-5">
                <FormulateInput
                  v-model="editDocument.is_verified"
                  :options="[
                    { label: 'No', value: 0 },
                    { label: 'Yes', value: 1 },
                  ]"
                  label="Verified"
                  type="radio"
                  validation="required"
                />
              </div>
              <div class="mb-5">
                <FormulateInput
                  v-model="editDocument.exp_date"
                  type="datetimepicker"
                  label="Expiration Date"
                />
              </div>
              <div class="mb-5">
                <FormulateInput
                  v-model="editDocument.comment"
                  type="textarea"
                  label="Comment"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </WSlideoversOverlay>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    sharedWorkspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      projectSummaryLocations: [],
      projectSummaryParts: [],
      selectedDocId: null,
      currentTab: 'Library',
      documentSearch: '',
      missingDocumentLocation: false,
      singleDocumentLocation: false,
      multipleDocumentsWarning:
        '*Please complete/update the "Multiple Locations Document Sharing Form" which can be downloaded from the Support tab >> Technical Tools. This completed form should be uploaded under the General tab.',
      documentWarning:
        'One or more audit or verification documents are not tagged to locations. Please tag the uploaded documents to the applicable location.',
      addDocument: false,
      showSharedDocuments: false,
      selectedLocation: '',
      filterScorecardList: false,
      activeDocument: '',
      editDocument: '',
      projectPage: 1,
      filteredProjects: { data: [] },
      filteredSubset: { data: [] },
      allSelectedProjects: false,
      allSelectedSubset: false,
      showEditDocumentModal: false,
      projects: [],
      subsets: [],
      loadingAudit: false,
      loadingGeneral: false,
      loadingLibrary: false,
      paginateProject: {
        total: 1,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 1,
      },
      paginateSubset: {
        total: 1,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 1,
      },
    }
  },
  computed: {
    ...mapState({
      allLocations: (state) => state.shared.paginatedLocations,
      subsetProjects: (state) => state.shared.subsetProjects,
      loading: (state) => state.shared.loading,
      portfolio: (state) => state.shared.sharedWorkspace,
      sharedworkspace: (state) => state.shared.sharedWorkspace,
      scorecardDocuments: (state) => state.shared.scorecardDocuments,
      scorecardAuditDocuments: (state) => state.shared.scorecardAuditDocuments,
      projectSummary: (state) => state.shared.projectSummary,
      documentsList: (state) => state.shared.documentsList,
      featureandParts: (state) => state.shared.featureandParts,
      currentUser: (state) => state.user.currentUser,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    showAddButton() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      }
      if (this.pendingReview) {
        return false
      } else if (
        this.sharedWorkspace.hsr_status === 'achieved' &&
        !this.recertificationList.length
      ) {
        return false
      } else if (
        this.recertificationList.length &&
        this.recertificationList[this.recertificationList.length - 1]
          .date_certified
      ) {
        return false
      }
      return true
    },
    ...mapGetters('review', ['pendingReview']),
    showProjectList() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      return this.subsetProjects.slice(start, end)
    },

    downloadAccess() {
      if (this.sharedworkspace.members && this.sharedworkspace.reviewers) {
        const isTeamMember = this.sharedworkspace.members.find(
          (el) => el.id === this.currentUser.id
        )

        const isReviewer = this.sharedworkspace.reviewers.find(
          (el) => el.id === this.currentUser.id
        )
        if (this.currentUser.role.includes('well-admin')) {
          return true
        }

        if (
          this.sharedworkspace.members &&
          this.sharedworkspace.members.filter(
            (a) => a.id === this.currentUser.id
          ).length &&
          this.sharedworkspace.members.find((a) => a.id === this.currentUser.id)
            .pivot.role === 'portfolio-admin'
        ) {
          return true
        }

        if (isTeamMember && this.currentUser.role.includes('external-reviewer'))
          return false
        if (isReviewer) return true
      }
      return false
    },
    showSubsetList() {
      const value = this.paginateSubset.current_page
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetList.length
          ? start + 20
          : this.subsetList.length
      return this.subsetList.slice(start, end)
    },
    subsetList() {
      return this.$store.state.shared.subsetList.map((element) => {
        return {
          label: element.name,
          value: element.id,
          project_ids: element.project_ids,
        }
      })
    },
    paginateFilter() {
      if (this.filteredProjects) {
        return {
          total: this.filteredProjects.total,
          per_page: this.filteredProjects.per_page,
          current_page: this.filteredProjects
            ? this.filteredProjects.current_page
            : 1,
          last_page: this.filteredProjects.last_page,
          from: this.filteredProjects.from,
          to: this.filteredProjects.to,
        }
      }
      return {}
    },
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
    getTotalColumns() {
      return this.featureandParts.length + 2
    },
    paginateGeneral() {
      if (this.documentsList) {
        return {
          total: this.documentsList.total,
          per_page: this.documentsList.per_page,
          current_page: this.documentsList
            ? this.documentsList.current_page
            : 1,
          last_page: this.documentsList.last_page,
          from: this.documentsList.from,
          to: this.documentsList.to,
        }
      }
      return {}
    },
    paginateLibrary() {
      if (this.scorecardDocuments) {
        return {
          total: this.scorecardDocuments.total,
          per_page: this.scorecardDocuments.per_page,
          current_page: this.scorecardDocuments
            ? this.scorecardDocuments.current_page
            : 1,
          last_page: this.scorecardDocuments.last_page,
          from: this.scorecardDocuments.from,
          to: this.scorecardDocuments.to,
        }
      }
      return {}
    },
    checkMissingDocumentLocation() {
      // console.log('scorecard documents', this.scorecardDocuments)
      // Check for Missing Location for Scorecard Documents
      this.scorecardDocuments?.data?.forEach((el) => {
        if (el.project_ids?.length === 0) {
          this.missingDocumentLocation = true
          return this.missingDocumentLocation
        }
      })
      // Check for Missing Location for Scorecard Audit Documents
      this.scorecardAuditDocuments?.data?.forEach((el) => {
        el.documents?.forEach((doc) => {
          if (doc.project_ids?.length === 0) {
            this.missingDocumentLocation = true
            return this.missingDocumentLocation
          }
        })
      })
      return this.missingDocumentLocation
    },
    checkSingleLocation() {
      // console.log('scorecard documents', this.scorecardDocuments)
      // Check for Single Location for Scorecard Documents
      this.scorecardDocuments?.data?.forEach((el) => {
        if (el.project_ids?.length === 1) {
          this.singleDocumentLocation = true
          return this.singleDocumentLocation
        }
      })
      // Check for Single Location for Scorecard Audit Documents
      this.scorecardAuditDocuments?.data?.forEach((el) => {
        el.documents?.forEach((doc) => {
          if (doc.project_ids?.length === 1) {
            this.singleDocumentLocation = true
            return this.singleDocumentLocation
          }
        })
      })
      return this.singleDocumentLocation
    },
  },
  watch: {
    allSelectedSubset(value) {
      if (value) {
        this.subsets = this.showSubsetList.map((element) => {
          return element.value
        })
      } else {
        this.subsets = []
      }
    },
    allSelectedProjects(value) {
      if (value) {
        this.projects = this.subsetProjects.map((element) => {
          return element.value
        })
      } else {
        this.projects = []
      }
    },
    currentTab(value) {
      this.documentSearch = ''
      if (value === 'Library') {
        this.getScorcard()
      }
      if (value === 'Audit') {
        this.getScorcardAudit()
      }
      if (value === 'General') {
        this.getDocuments()
      }
      if (value === 'Summary') {
        this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
          filters: [],
          id: this.sharedworkspace.hsr_scorecard_version_id,
        })
        // this.getScorcardAudit()
        this.getProjectSummary()
      }
    },
    subsets(newValue, oldValue) {
      let newSubset = []
      if (newValue.length) {
        if (!oldValue.length) {
          newSubset = newValue
        } else {
          newValue.forEach((element) => {
            const value = oldValue.filter((a) => a === element)
            if (!value.length) {
              newSubset.push(element)
            }
          })
        }
      }
      const oldSubset = []
      if (oldValue.length) {
        if (oldValue.length) {
          oldValue.forEach((element) => {
            const value = newValue.filter((a) => a === element)
            if (!value.length) {
              oldSubset.push(element)
            }
          })
        }
      }
      if (newSubset.length) {
        newSubset.forEach((element) => {
          const subset = this.subsetList.filter((a) => a.value === element)[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length === 0) {
              this.projects.push(project)
            }
          })
        })
      }
      if (oldSubset.length) {
        oldSubset.forEach((element) => {
          const subset = this.subsetList.filter((a) => a.value === element)[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length !== 0) {
              const index = this.projects.indexOf(project)
              this.projects.splice(index, 1)
            }
          })
        })
      }
    },
  },
  async mounted() {
    // console.log('portfolio assets', this.portfolio.no_of_assets)
    // console.log('scorecard documents', this.scorecardDocuments)
    console.log('sharedWorkspace', this.sharedWorkspace)

    await this.$store.dispatch('recertification/getHSRRecertification')
    if (this.sharedworkspace) {
      this.loadingGeneral = true
      await this.$store.dispatch('shared/getDocumentList', {
        id: this.sharedWorkspace.id,
        page: 1,
      })
      this.loadingGeneral = false
      await this.$store.dispatch('shared/getSharedSubsetProjects', {})
      await this.$store.dispatch('shared/getSubsetList')
      this.setPaginateSubset()
      this.setPaginateProject()

      this.getScorcard()
      this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
        filters: [],
        id: this.sharedworkspace.hsr_scorecard_version_id,
      })
      await this.getProjectSummary()
    }
  },
  methods: {
    deleteDocument(num) {
      if (this.currentTab === 'Library') {
        this.$store
          .dispatch('shared/deleteScorecardDocuments', {
            id: this.selectedDocId,
            scorecardId: this.sharedWorkspace.hsr_scorecard_id,
          })
          .then(() => {
            this.getScorcard()
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.deleteReviewModal.isHidden = true
      } else if (this.currentTab === 'Audit') {
        this.$store
          .dispatch('shared/deleteScorecardDocuments', {
            id: this.selectedDocId,
            scorecardId: this.sharedWorkspace.hsr_scorecard_id,
          })
          .then(() => {
            this.getScorcardAudit()
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.deleteReviewModal.isHidden = true
      } else if (this.currentTab === 'General') {
        this.$store
          .dispatch('shared/deleteDocument', {
            id: this.selectedDocId,
            page: this.paginateGeneral.current_page,
            name: '',
          })
          .then(() => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.deleteReviewModal.isHidden = true
      }
    },
    getDocuments() {
      if (this.currentTab === 'General') {
        this.$store.dispatch('shared/getDocumentList', {
          id: this.sharedWorkspace.id,
          page: this.paginateGeneral.current_page,
          name: this.documentSearch,
        })
      } else if (this.currentTab === 'Audit') {
        this.getScorcardAudit()
      } else if (this.currentTab === 'Library') {
        this.getScorcard()
      }
    },
    afterReview(lastUpdatedBy) {
      if (this.sharedWorkspace.pending_review_id) {
        return false
      }
      if (!this.sharedWorkspace.review_doc_date) {
        return true
      }
      if (this.sharedWorkspace.review_doc_date) {
        const documentDate = this.$dayjs(lastUpdatedBy)
        if (documentDate.isAfter(this.sharedWorkspace.review_doc_date)) {
          return true
        } else {
          return false
        }
      }
    },
    afterRecert(lastUpdatedBy) {
      if (!this.recertificationList.length) {
        return true
      } else {
        const documentDate = this.$dayjs(lastUpdatedBy)
        if (
          documentDate.isAfter(
            this.recertificationList[this.recertificationList.length - 1]
              .created_at
          )
        ) {
          return true
        } else {
          return false
        }
      }
    },
    updateDocument() {
      const data = JSON.parse(JSON.stringify(this.editDocument))
      if (
        this.editDocument.exp_date !== null &&
        this.$dayjs(this.editDocument.exp_date).isValid()
      ) {
        data.exp_date = this.$dayjs(this.editDocument.exp_date).format(
          'YYYY-MM-DD'
        )
      }
      if (
        this.editDocument.is_verified &&
        (!data.exp_date || data.exp_date === null)
      ) {
        data.exp_date = this.$dayjs().add('3', 'years')
        data.exp_date = this.$dayjs(data.exp_date).format('YYYY-MM-DD')
      }
      data.project_ids = this.projects
      data.portfolio_subset_ids = this.subsets
      data.part_ids = data.parts.map((element) => {
        return element.id
      })
      this.$axios
        .put(
          `api/scorecard/${this.sharedworkspace.hsr_scorecard_id}/document/${this.editDocument.id}`,
          data
        )
        .then((response) => {
          this.showEditDocumentModal = false
          this.$refs.documentSlide.toggleOpen()
          this.activeDocument = ''
          this.editDocument = ''
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document updated successfully!',
          })
          this.getScorcard()
        })
    },
    getpartsList(param) {
      if (param) {
        let part = ''
        param.parts.map((e) => {
          part +=
            '<div class="rounded-full bg-secondary-700 text-white text-center py-1 px-2 mb-2"  data-toggle="tooltip" data-placement="top" title="' +
            e.name +
            '">' +
            e.part_prefix +
            '</div>'
          return part
        })
        return part
      }
    },
    getSquareRoot(projectCount) {
      return Math.floor(Math.sqrt(projectCount))
    },
    getDocumentType(type) {
      return type === 'Portfolio Scale' ? 'Shared' : type
    },
    getProjectDetails(document) {
      const project = this.subsetProjects.filter((a) => a.value === document.id)
      if (project.length) {
        return project[0].label
      } else {
        return '-'
      }
    },
    getSummaryProjectDetails(project) {
      return project.name
    },
    getProjectDocumentCount(project, feature) {
      // Guard clause against empty params
      if (project === undefined || !project) return 0

      let docCount = 0
      // Filter projectSummaryParts to see if the the current "part" has a document that matches the features.part.id
      this.projectSummaryParts.forEach((part) => {
        if (part.id === feature.parts[0].id) {
          // Check if the part has the passed in project id
          const hasDocument = part.locations.some((l) => l.id === project.id)
          // // If the part locations has the passed in project id in it return 1
          if (hasDocument) docCount = 1
        }
      })
      return docCount
    },
    getTotalFeatureDocumentsCount(project) {
      let docTotal = 0
      // Check each "part" and check if the the project has a document uploaded for it
      this.projectSummaryParts.forEach((part) => {
        part.locations.forEach((location) => {
          if (location.id === project.id) docTotal++
        })
      })
      return docTotal
    },
    getLocationPartSummary(feature) {
      // console.log('getLocationPartSummary >>', feature)
      const location = this.projectSummaryParts.filter(
        (part) => part.id === feature.parts[0].id
      )
      // If the location parts length is > 0 then it means it has documents
      return location.length > 0 ? location[0].doc_count : 0
    },
    getAllSubsetnames(projectId) {
      let renderHTML = ''
      if (this.filteredSubset && this.filteredSubset.length) {
        this.filteredSubset.map((subset) => {
          if (subset.project_ids.filter((a) => a === projectId).length) {
            renderHTML +=
              '<span class="rounded px-2 py-1 bg-primary-100 border border-primary-600 text-primary-600 mr-2">' +
              subset.name +
              '</span>'
          }
          return renderHTML
        })
        return renderHTML
      } else {
        return renderHTML
      }
    },
    showProjects(document) {
      this.activeDocument = document
      this.projects = document.project_ids.length
        ? document.project_ids.map((e) => {
            return e.id
          })
        : []
      this.subsets = document.portfolio_subset_ids
      this.$store
        .dispatch('shared/getProjects', {
          id: this.activeDocument.id,
          page: this.paginateFilter.current_page,
        })
        .then((response) => {
          this.filteredProjects = response.data
        })
      this.$store
        .dispatch('shared/getSubsets', this.activeDocument.id)
        .then((response) => {
          this.filteredSubset = response.data
        })
      this.showSharedDocuments = true
      this.showEditDocumentModal = false
    },
    async getScorcard() {
      this.loadingLibrary = true
      const type = ['Guideline', 'Portfolio-Scale']
      if (
        this.sharedWorkspace &&
        this.sharedWorkspace.wpr_scorecard_id !== null
      ) {
        await this.$store.dispatch('shared/getScorecardDocuments', {
          scorecardId: this.sharedWorkspace.wpr_scorecard_id,
          page: this.paginateLibrary.current_page,
          filterShared: this.filterScorecardList,
          name: this.documentSearch,
          type,
        })
        this.loadingLibrary = false
      }
    },
    async getScorcardAudit() {
      this.loadingAudit = true
      const type = ['Individual-Scale', 'Audit-Document']
      if (
        this.sharedWorkspace &&
        this.sharedWorkspace.wpr_scorecard_id !== null
      ) {
        await this.$store.dispatch('shared/getScorecardAuditDocuments', {
          scorecardId: this.sharedWorkspace.wpr_scorecard_id,
          page: this.paginateAudit.current_page
            ? this.paginateAudit.current_page
            : 1,
          name: this.documentSearch,
          paginate: this.currentTab !== 'Summary' ? 'yes' : 'no',
          filterShared:
            this.currentTab !== 'Summary' ? this.filterScorecardList : [],
          type: this.currentTab !== 'Summary' ? type : [],
        })
        this.loadingAudit = false
      }
    },
    editScorecardDocument(document) {
      this.editDocument = document
      this.showEditDocumentModal = true
    },
    getProjectSummary() {
      this.loadingAudit = true
      this.$axios
        .get(`api/portfolio/${this.sharedWorkspace.id}/auditDocumentNew`)
        .then((res) => {
          this.projectSummaryLocations = res.data.location_count
          this.projectSummaryParts = res.data.parts
          this.loadingAudit = false
        })
    },
    downloadAll() {
      this.$store.dispatch('shared/downloadAllDocuments')
      this.$store.dispatch('notifications/toastMessage', {
        message:
          'We will notify you by email once we are ready with your file.',
      })
    },
    deleteScorecardDocument(id) {
      this.$store
        .dispatch('shared/deleteScorecardDocuments', {
          id,
          scorecardId: this.sharedWorkspace.hsr_scorecard_id,
        })
        .then(() => {
          this.getScorcard()
        })
    },
    deleteAuditDocument(id) {
      this.$store
        .dispatch('shared/deleteScorecardDocuments', {
          id,
          scorecardId: this.sharedWorkspace.hsr_scorecard_id,
        })
        .then(() => {
          this.getScorcardAudit()
        })
    },
    setPaginateSubset() {
      const value = this.paginateSubset.current_page
      const start = (value - 1) * 20 === 0 ? 1 : (value - 1) * 20
      const end =
        start + 20 <= this.subsetList.length
          ? start + 20
          : this.subsetList.length
      const lastPage =
        this.subsetList.length % 20 === 0
          ? this.subsetList.length / 20
          : this.subsetList.length / 20 + 1

      this.paginateSubset = {
        total: this.subsetList.length,
        per_page: 20,
        current_page: value,
        last_page: parseInt(lastPage),
        from: start,
        to: end,
      }
    },
    setPaginateProject() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 20 === 0 ? 1 : (value - 1) * 20 + 1
      const lastPage =
        this.subsetProjects.length % 20 === 0
          ? this.subsetProjects.length / 20
          : this.subsetProjects.length / 20 + 1
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      this.paginateProject = {
        total: this.subsetProjects.length,
        per_page: 20,
        current_page: value,
        last_page: parseInt(lastPage),
        from: start,
        to: end,
      }
    },
    async setDocumentStatus(document) {
      const payload = {
        moduleType: 'portfolio',
        moduleId: this.sharedWorkspace.id,
        part_id: document.parts[0].id,
        doc_status: 'invalid',
        scorecard_type: 'v2-hsr',
        document_id: document.id,
      }
      await this.$store.dispatch('checklist/setPartDocStatus', payload)
      await this.getScorcard()
    },
  },
}
</script>
