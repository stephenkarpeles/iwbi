<template>
  <div class="w-full py-5 lg:px-10">
    <WFeedbackAlert ref="alert" />
    <WFeedbackModal ref="projectDocument">
      <div class="md:mx-10 my-5">
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
          This action cannot be undone. This will permanently delete this
          document.
        </div>
        <div
          class="md:flex justify-between md:space-x-5 space-y-4 md:space-y-0"
        >
          <div class="md:w-24">
            <WButtonsBase
              type="primaryInverted"
              @click.native="$refs.projectDocument.isHidden = true"
            >
              Cancel
            </WButtonsBase>
          </div>
          <WButtonsBase type="danger" @click.native="removeProjectDocument()">
            I understand the consequences, delete this document!
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="documentModal">
      <div class="text-center">
        We will notify you by email once we are ready with your file.
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="modal">
      <div class="max-w-2xl md:mx-10 my-5">
        <div class="text-lg font-bold mb-5">Upload Document</div>
        <FormulateForm
          class="space-y-2"
          name="documentUpload"
          @submit="uploadFile"
        >
          <FormulateInput
            v-model="formData.type"
            :options="typeOptions"
            type="select"
            label="Type"
            validation="required"
          />
          <div v-if="formData.type === 'feature'" class="mb-5">
            <label
              for="featuredocumentType"
              class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
              >Verification Method</label
            >
            <multiselect
              v-if="project.type === 'v2-pilot'"
              v-model="featuredocumentType"
              open-direction="bottom"
              :multiple="false"
              :searchable="true"
              :hide-selected="false"
              :allow-empty="true"
              :show-labels="false"
              label="label"
              placeholder="Please Select"
              track-by="value"
              name="featuredocumentType"
              :options="documentTypeArrayOption"
            >
            </multiselect>
            <multiselect
              v-if="project.type === 'v2'"
              v-model="featuredocumentType"
              open-direction="bottom"
              :multiple="false"
              :searchable="true"
              :hide-selected="false"
              :allow-empty="true"
              :show-labels="false"
              label="label"
              placeholder="Please Select"
              track-by="value"
              name="featuredocumentType"
              :options="verificationListOption"
            >
            </multiselect>
          </div>
          <div v-if="formData.type === 'feature'" class="mb-5">
            <label
              for="featuredocumentType"
              class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
              >Part</label
            >
            <multiselect
              v-model="formData.partSelected"
              open-direction="bottom"
              label="name"
              :multiple="true"
              :searchable="true"
              :hide-selected="false"
              :allow-empty="true"
              track-by="id"
              :show-labels="false"
              placeholder="Please Select Parts"
              group-values="parts"
              group-label="feature"
              validation="required"
              name="part"
              :options="featureandParts"
            >
            </multiselect>
            <p
              v-if="!featureandParts.length && featuredocumentType"
              class="mt-2 text-sm text-red-600"
            >
              No parts available for the selected verification
            </p>
          </div>
          <FormulateInput
            v-if="formData.type === 'report' || formData.type === 'performance'"
            v-model="formData.part_id"
            :options="partOptions"
            type="multi"
            :multiple="true"
            :searchable="true"
            label="Part"
            validation="required"
          />
          <FormulateInput
            v-if="formData.type === 'report'"
            v-model="formData.period"
            :options="[
              { label: 'Year 1 reporting', value: 'Year 1 reporting' },
              { label: 'Year 2 reporting', value: 'Year 2 reporting' },
              { label: 'Year 3 reporting', value: 'Year 3 reporting' },
            ]"
            type="select"
            :multiple="false"
            :searchable="false"
            label="Period"
            validation="required"
          />

          <FormulateInput
            v-if="
              formData.type !== 'feature' &&
              formData.type !== 'report' &&
              formData.type !== 'performance'
            "
            :key="forceReMount"
            v-model="formData.document"
            label="Attach Document"
            :value="formData.document"
            type="fileupload"
            :upload-path="'project/' + project_number + '/documents/'"
            mime-types=""
          />

          <div v-else>
            <div>
              <label
                class="text-sm font-medium leading-5 text-primary-800 sm:mt-px sm:pt-2"
              >
                Attach Document
              </label>
            </div>
            <div
              v-if="!newPartDocument"
              class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="text-center w-full">
                <div class="mt-1 text-sm text-gray-600">
                  <ul></ul>
                  <div class="overflow-hidden relative w-full mt-4 mb-4">
                    <div class="text-center w-full">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        class="mx-auto h-12 w-12 text-gray-400"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <div class="mt-1 text-sm text-gray-600">
                        <div
                          class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                        >
                          Upload a file
                        </div>
                        or drag and drop
                      </div>
                      <p class="mt-1 text-xs text-gray-500"></p>
                    </div>
                    <input
                      type="file"
                      accept=""
                      class="cursor-pointer absolute block py-2 px-4 w-full h-full opacity-0 top-0"
                      @change="handleFileChange($event)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <ul>
                <li
                  class="bg-gray-100 max-w-md mx-auto px-4 py-3 rounded-md shadow-md my-4 relative"
                >
                  <span>
                    {{ newPartDocument.name }}
                  </span>
                  <button
                    class="right-0 absolute mr-3 text-danger-500"
                    type="button"
                    @click="newPartDocument = null"
                  >
                    remove
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <FormulateInput
            v-if="
              (project.d_and_o &&
                !project.d_and_o_submitted &&
                formData.type === 'feature') ||
              formData.type === 'report' ||
              formData.type === 'performance'
            "
            v-model="formData.stage"
            label="This is an intent-based document for WELL Precertification."
            type="checkbox"
          />
          <div class="sm:flex justify-between w-full space-y-2 sm:space-y-0">
            <div class="sm:w-32">
              <WButtonsBase @click.native="reset">Reset</WButtonsBase>
            </div>
            <div class="sm:w-32">
              <FormulateInput
                v-if="!uploadingDoc"
                type="submit"
                label="Upload"
              />
              <WButtonsBase v-else>
                <WLoadingSpinner type="button" class="mx-auto" />
              </WButtonsBase>
            </div>
          </div>
        </FormulateForm>
      </div>
    </WFeedbackModal>
    <ModalsGeneral
      ref="uploadDocModal"
      header="Upload a Document"
      :header-background="noBakground"
    >
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <ProjectPortfolioDocUploadScreen module-type="project" />
      </div>
    </ModalsGeneral>
    <ModalsGeneral
      ref="editPortfolioDoc"
      header="Edit Document"
      :header-background="noBakground"
    >
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <ProjectPortfolioEditScorecardDocScreen :selected-doc="selectedDoc" />
      </div>
    </ModalsGeneral>

    <div class="w-full flex flex-wrap">
      <div class="mb-3 lg:flex lg:space-x-2 w-full">
        <WHeadingsHThree heading="Documents" />
        <div class="sm:flex sm:space-x-2 space-y-2 sm:space-y-0">
          <div
            v-if="
              (!pendingReview &&
                project.pending_review_id == null &&
                project.type !== 'v2-pilot-upgraded') ||
              currentUser.role.includes('well-admin')
            "
          >
            <WButtonsBase
              icon="plus"
              @click.native="
                project && project.portfolio_ids.length
                  ? ($refs.uploadDocModal.isHidden = false)
                  : ($refs.modal.isHidden = false)
              "
            >
              Upload Document
            </WButtonsBase>
          </div>
          <div
            v-if="
              !pendingReview &&
              project.pending_review_id == null &&
              project.type === 'v1'
            "
          >
            <WButtonsBase
              icon="plus"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/reviews`,
                  query: { ...$route.query },
                })
              "
            >
              Submit for Review
            </WButtonsBase>
          </div>

          <div class="mt-5">
            <WButtonsDropdown>
              <WButtonsBase
                v-if="currentUser.role.includes('well-admin')"
                type="primaryInverted"
                >Download</WButtonsBase
              >
              <template #customButtons>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    (hasAccess &&
                      project.reviewers &&
                      project.reviewers.filter((a) => a.id === currentUser.id)
                        .length) ||
                    (hasAccess &&
                      project.members &&
                      project.members.filter((a) => a.id === currentUser.id)
                        .length &&
                      project.members.find((a) => a.id === currentUser.id).pivot
                        .role === 'project-admin')
                  "
                >
                  <WButtonsBase
                    type="neutral"
                    @click.native="downloadDocuments({ include: 'project' })"
                  >
                    Project Documents
                  </WButtonsBase>
                </div>
                <div v-if="project.hsr_opt">
                  <WButtonsBase
                    v-if="
                      (hasAccess &&
                        project.reviewers &&
                        project.reviewers.filter((a) => a.id === currentUser.id)
                          .length) ||
                      currentUser.role.includes('well-admin') ||
                      (currentUser.role.includes('external-reviewer') &&
                        project.reviewers &&
                        project.reviewers.filter((a) => a.id === currentUser.id)
                          .length)
                    "
                    type="neutral"
                    @click.native="downloadDocuments({ include: 'hsr' })"
                  >
                    HSR Documents
                  </WButtonsBase>
                </div>
                <div v-if="project.hsr_opt">
                  <WButtonsBase
                    v-if="
                      (hasAccess &&
                        project.reviewers &&
                        project.reviewers.filter((a) => a.id === currentUser.id)
                          .length) ||
                      currentUser.role.includes('well-admin') ||
                      (currentUser.role.includes('external-reviewer') &&
                        project.reviewers &&
                        project.reviewers.filter((a) => a.id === currentUser.id)
                          .length)
                    "
                    type="neutral"
                    @click.native="downloadDocuments({ include: 'all' })"
                  >
                    All Documents
                  </WButtonsBase>
                </div>
              </template>
            </WButtonsDropdown>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div
          class="bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300"
        >
          <div class="flex">
            <div class="ml-3">
              <div class="text-primary-600">
                <div class="block">
                  <h4 class="mt-2 text-xl leading-7 font-semibold">
                    Along with your scorecard documentation, please upload the
                    following documents.
                  </h4>
                </div>
                <div class="mt-3"></div>
              </div>
              <div class="mt-2 text-sm leading-5 text-primary-700">
                <ul class="list-disc pl-4">
                  <li>
                    A completed copy of the
                    <a
                      class="font-bold"
                      href="https://resources.wellcertified.com/tools/well-project-information-form/"
                      target="_blank"
                      >Project Information Form</a
                    >
                  </li>
                  <li>Representative floor plans for the entire building</li>
                  <li>Photos, renderings, or drawings</li>
                  <li>Sections/elevations</li>
                  <li>Mechanical schedules, plans and/or drawings</li>
                  <li>
                    A completed project checklist or other document confirming
                    which WELL Features are being attempted
                  </li>
                  <li>Any approved AAPs being utilized by the project</li>
                  <li>
                    When the project has uploaded all relevant documentation,
                    use the
                    <i>Submit for review</i>
                    button to engage in a formal review process
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <WTabsHorizontal
            ref="tabs"
            v-model="currentTable"
            class="lg:max-w-max -mb-px"
            alignment="justify-around"
            :tabs="tabs"
          />
        </div>
        <div class="md:flex w-full items-start mt-5 mb-4 md:mb-0">
          <div class="md:w-4/6 lg:w-3/4">
            <FormulateInput
              v-model="documentSearch"
              type="text"
              placeholder="Search document..."
            />
          </div>
          <div class="md:w-2/6 lg:w-1/4 md:ml-5 sm:flex space-y-2 sm:space-y-0">
            <WButtonsBase icon="search-circle" @click.native="getDocuments"
              >Search</WButtonsBase
            >
            <WButtonsBase
              class="sm:ml-2"
              type="danger"
              icon="refresh"
              @click.native=";(documentSearch = ''), getDocuments()"
            >
              Reset
            </WButtonsBase>
          </div>
        </div>

        <!-- General -->
        <div
          v-if="currentTable === 'General'"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(document, index) in documents" :key="index">
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-sm leading-5 text-gray-900 uppercase">
                    {{
                      document.type === 'report'
                        ? 'Ongoing data reports'
                        : document.type
                    }}
                  </div>
                  <div
                    v-if="document.stage === 'Intent'"
                    class="p-1 bg-green-50 text-green-600 rounded-lg text-xs text-center"
                  >
                    Precertification
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <WButtonsBase
                      v-if="
                        (currentUser.role.includes('well-admin') ||
                          currentUser.id === document.user_id) &&
                        afterReview(document.updated_at)
                      "
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Shared Documents -->
        <div
          v-if="currentTable === 'Shared Documents'"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Part
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(document, index) in portfolioDocuments.data"
                :key="index"
              >
                <td class="px-6 py-4 w-64 whitespace-normal space-y-2">
                  <div
                    v-for="(part, part_index) in document.parts"
                    :key="part_index"
                    class="text-center badge-info uppercase p-1 bg-primary-400 text-white rounded-lg px-2 text-xs font-semibold"
                  >
                    {{ part.part_prefix }} {{ part.feature_name }}
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Scorecard -->
        <div
          v-if="currentTable === 'Scorecard'"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Parts
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
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
                  Period
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(document, index) in scorecard_documents" :key="index">
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-bold text-sm leading-5 uppercase space-y-2">
                    <div
                      v-for="(part, part_index) in document.parts"
                      :key="part_index"
                      class="text-center badge-info uppercase p-1 bg-primary-400 text-white rounded-lg px-2 text-xs font-semibold"
                    >
                      {{ part.part_prefix }} {{ part.feature_name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="
                      document.part_doc_type &&
                      document.part_doc_type !== 'null'
                    "
                    class="text-sm leading-5 text-gray-900 uppercase"
                  >
                    {{
                      document.part_doc_type === 'report'
                        ? 'Ongoing data reports'
                        : document.part_doc_type
                    }}
                  </div>
                  <div v-else>
                    <div class="text-sm leading-5 text-gray-900 uppercase">
                      {{ document.verifiable.name }}
                    </div>
                  </div>
                  <div
                    v-if="document.stage === 'Intent'"
                    class="p-1 bg-green-50 text-green-600 rounded-lg text-xs text-center"
                  >
                    Precertification
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.period }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900 flex space-x-2">
                    <WButtonsBase
                      v-if="
                        project &&
                        project.portfolio_ids.length &&
                        document.verifiable_id
                      "
                      icon="pencil-alt"
                      @click.native="
                        ;(selectedDoc = document),
                          ($refs.editPortfolioDoc.isHidden = false)
                      "
                    />

                    <WButtonsBase
                      v-if="hasAccess && afterReview(document.updated_at)"
                      type="danger"
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Performance -->
        <div
          v-if="currentTable === 'Performance'"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Parts
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
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
                  Period
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(document, index) in performance_documents"
                :key="index"
              >
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-bold text-sm leading-5 uppercase space-y-2">
                    <div
                      v-for="(part, part_index) in document.parts"
                      :key="part_index"
                      class="text-center badge-info uppercase p-1 bg-primary-400 text-white rounded-lg px-2 text-xs font-semibold"
                    >
                      {{ part.part_prefix }} {{ part.feature_name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="
                      document.part_doc_type &&
                      document.part_doc_type !== 'null'
                    "
                    class="text-sm leading-5 text-gray-900 uppercase"
                  >
                    {{
                      document.part_doc_type === 'report'
                        ? 'Ongoing data reports'
                        : document.part_doc_type
                    }}
                  </div>
                  <div
                    v-if="document.stage === 'Intent'"
                    class="p-1 bg-green-50 text-green-600 rounded-lg text-xs text-center"
                  >
                    Precertification
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.period }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <WButtonsBase
                      v-if="hasAccess && afterReview(document.updated_at)"
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Health-Safety -->
        <div
          v-if="currentTable === 'Health-Safety' && project.hsr_opt === 1"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Parts
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(document, index) in shared_documents" :key="index">
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-bold text-sm leading-5 uppercase space-y-2">
                    <div
                      v-for="(part, part_index) in document.parts"
                      :key="part_index"
                      class="text-center badge-info uppercase p-1 bg-primary-400 text-white rounded-lg px-2 text-xs font-semibold"
                    >
                      {{ part.part_prefix }} {{ part.feature_name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <WButtonsBase
                      v-if="
                        (currentUser.role.includes('well-admin') ||
                          currentUser.id === document.last_updated_by) &&
                        afterReview(document.updated_at)
                      "
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Performance Rating -->
        <div
          v-if="currentTable === 'Performance Rating' && project.wpr_opt === 1"
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Parts
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded On
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(document, index) in wprDocuments" :key="index">
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-bold text-sm leading-5 uppercase space-y-2">
                    <div
                      v-for="(part, part_index) in document.parts"
                      :key="part_index"
                      class="text-center badge-info uppercase p-1 bg-primary-400 text-white rounded-lg px-2 text-xs font-semibold"
                    >
                      {{ part.part_prefix }} {{ part.feature_name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <WButtonsBase
                      v-if="
                        (currentUser.role.includes('well-admin') ||
                          currentUser.id === document.last_updated_by) &&
                        afterReview(document.updated_at)
                      "
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
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
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentTable: 'General',
      selectedDoc: '',
      noBakground: true,
      newPartDocument: null,
      formData: {
        type: null,
        partSelected: [],
        document: [],
      },
      featuredocumentType: '',
      verificationList: [],
      documentTypeArray: {
        'Letter Of Assurance': [
          {
            label: 'Letter Of Assurance - Architect',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 1,
          },
          {
            label: 'Letter Of Assurance - MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 2,
          },
          {
            label: 'Letter Of Assurance - Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 3,
          },
          {
            label: 'Letter Of Assurance - Owner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 4,
          },
          {
            label: 'Letter Of Assurance - Architect & Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 5,
          },
          {
            label: 'Letter Of Assurance - Architect & Owner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 6,
          },
          {
            label: 'Letter Of Assurance - Architect & MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 7,
          },
          {
            label: 'Letter Of Assurance - Leak Test Report and Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 8,
          },
          {
            label: 'Letter Of Assurance - MEP & Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 9,
          },
          {
            label: 'Letter Of Assurance - Owner & MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 10,
          },
          {
            label: 'Letter Of Assurance - Planner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 11,
          },
        ],
        'Annotated Documents': [
          {
            label: 'Operations Schedule',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 1,
          },
          {
            label: 'Policy Document',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 2,
          },
          {
            label: 'Architectural Drawing',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 3,
          },
          {
            label: 'Innovation Proposal',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 4,
          },
          {
            label: 'Remediation Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 5,
          },
          {
            label: 'Commissioning Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 6,
          },
          {
            label: 'Professional Narrative',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 7,
          },
          {
            label: 'Architectural Drawing or Operations Schedule',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 8,
          },
          {
            label: 'Annotated Map',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 9,
          },
          {
            label: 'Mechanical Drawing',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 10,
          },
          {
            label: 'Architect & Contractor',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 11,
          },
          {
            label: 'Architect',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 12,
          },
          {
            label: 'Remediation Report and Policy Document',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 13,
          },
          {
            label: 'Leak Test Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 14,
          },
          {
            label: 'Mechanical & Architectural Drawings',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 15,
          },
          {
            label: 'Signage and Communication Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 16,
          },
          {
            label: 'Daylight Simulation Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 17,
          },
          {
            label: 'On-going Data Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 18,
          },
          {
            label: 'Educational Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 19,
          },
          {
            label: 'Modeling Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 20,
          },
          {
            label: 'Design Specifications',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 21,
          },
          {
            label: 'Survey Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 22,
          },
          {
            label: 'On-going Maintenance Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 23,
          },
          {
            label: 'Beta feedback feature form',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 24,
          },
          {
            label: 'Innovation Form',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 25,
          },
        ],
        'On-Site Assessment': [
          {
            label: 'On-going Data Report',
            parent: 'individual-scale',
            type: 'annotated_documents',
            value: 18,
          },
          {
            label: 'Performance Test',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 3,
          },
          {
            label: 'Spot Check',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 1,
          },
          {
            label: 'Visual Inspection',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 2,
          },
          {
            label: 'Spot Measurement',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 4,
          },
        ],
      },
      apiResponse: '',
      forceReMount: 0,
      documentSearch: '',
      selectedDocument: null,
      uploadingDoc: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project_number: (state) => state.project.project.project_number,
      documents: (state) => state.project.projectDocuments,
      portfolioDocuments: (state) => state.portfolio.sharedDocument,
      scorecard_documents: (state) => state.scorecard.documents,
      featureandParts: (state) => state.shared.featureandParts,
      performance_documents: (state) => state.scorecard.performanceDocuments,
      shared_documents: (state) => state.shared.documents,
      wprDocuments: (state) => state.shared.wprDocuments,
      features: (state) => state.features.features,
      project: (state) => state.project.project,
      standardVersion: (state) => state.project.standards,
      accessLevel: (state) => state.project.accessLevel,
      pendingReview() {
        return (
          this.$store.state.review.allReviews.filter(
            (a) => a.status === 'pending' || a.status === 'mid-review'
          ).length > 0
        )
      },
    }),
    tabs() {
      const tabs = [
        { name: 'General', icon: 'document' },
        { name: 'Scorecard', icon: 'chart-bar' },
      ]
      if (
        !this.project.type.includes('v1') &&
        this.project.project_type !== 'cs'
      ) {
        tabs.push({ name: 'Performance', icon: 'chart-square-bar' })
      }

      if (this.project.portfolio_ids.length > 0) {
        tabs.push({ name: 'Shared Documents', icon: 'view-grid' })
      }

      if (this.project.hsr_opt === 1) {
        tabs.push({ name: 'Health-Safety', icon: 'view-grid' })
      }
      if (this.project.wpr_opt === 1) {
        tabs.push({ name: 'Performance Rating', icon: 'view-grid' })
      }

      return tabs
    },
    verificationListOption() {
      const options = []

      for (let i = 0; i < this.verificationList.length; i++) {
        const option = {
          value: this.verificationList[i].id,
          label: this.verificationList[i].name,
        }
        options.push(option)
      }

      return options
    },

    typeOptions() {
      const options = [
        { label: 'General', value: 'general' },
        { label: 'Legal', value: 'legal' },
        { label: 'Ongoing data reports', value: 'report' },
        { label: 'Feature', value: 'feature' },
      ]
      if (
        !this.project.type.includes('v1') &&
        this.project.project_type !== 'cs'
      ) {
        options.push({
          label: 'Performance Test',
          value: 'performance',
        })
      }
      if (this.project.hsr_opt)
        options.push(
          {
            label: 'WELL Health-Safety - Ongoing maintenance report',
            value: 'hsr-maintenance-report',
          },
          {
            label: 'WELL Health-Safety - Ongoing data report',
            value: 'hsr-data-report',
          }
        )

      return options
    },
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel === 'project-admin' ||
        this.accessLevel === 'project-manager'
      ) {
        return true
      }
      return false
    },
    documentTypeArrayOption() {
      const options = []
      for (const key in this.documentTypeArray) {
        this.documentTypeArray[key].map((x) => {
          options.push({
            label: x.label,
            value: x.value,
            type: x.type,
          })
          return options
        })
      }
      return options
    },
    partOptions() {
      const options = []
      if (this.features) {
        for (let b = 0; b < this.features.length; b++) {
          if (this.project.type === 'v1') {
            const option = {
              label: this.features[b].name,
              value: this.features[b].id.toString(),
            }
            options.push(option)
          } else {
            for (let i = 0; i < this.features[b].parts.length; i++) {
              const option = {
                label:
                  this.features[b].parts[i].part_prefix +
                  ' ' +
                  this.features[b].parts[i].name,
                value: this.features[b].parts[i].id.toString(),
              }
              options.push(option)
            }
          }
        }

        if (this.project.type !== 'v1') {
          options.sort(function (a, b) {
            if (a.label < b.label) {
              return -1
            }
            if (a.label > b.label) {
              return 1
            }
            return 0
          })
        }
        return options
      }
      return null
    },
    hasDocumentFilter() {
      for (const key in this.filters) {
        if (this.formData[key] !== null && this.formData[key] !== '')
          return true
      }
      return false
    },
  },
  watch: {
    currentTable() {
      this.documentSearch = ''
    },
    'formData.type'(value) {
      if (value === 'report') {
        const verification =
          this.project.type === 'v2'
            ? { verifications: [17, 18] }
            : { annotated_documents: [18, 23] }

        this.$store.dispatch('features/getAllFeaturesByVersionIdFilter', {
          version_id: this.project.applicable_version_id,
          ...verification,
          parts_list: 'all',
        })
      } else if (value === 'performance') {
        const verification =
          this.project.type === 'v2'
            ? { verifications: [15] }
            : { on_sites: [3] }

        this.$store.dispatch('features/getAllFeaturesByVersionIdFilter', {
          version_id: this.project.applicable_version_id,
          ...verification,
          parts_list: 'all',
        })
      } else {
        this.$store.dispatch('features/getAllFeaturesByVersionIdFilter', {
          version_id: this.project.applicable_version_id,

          parts_list: 'all',
        })
      }
    },
    featuredocumentType(value) {
      this.selectVersion(this.project.type)
    },
  },
  mounted() {
    if (this.project.type === 'v1') {
      const communityFlag =
        this.project.v1_project_standard === 'community' ? 1 : 0
      this.$store.dispatch('features/getAllV1Features', communityFlag)
    } else {
      this.$store.dispatch('features/getAllFeaturesByVersionIdFilter', {
        version_id: this.project.applicable_version_id,
        parts_list: 'all',
      })
    }

    this.$store.dispatch('project/getProjectDocuments', this.documentSearch)
    if (this.project.scorecard_id) {
      this.$store.dispatch('scorecard/getDocuments', {
        id: this.project.scorecard_id,
        name: this.documentSearch,
      })
      if (
        !this.project.type.includes('v1') &&
        this.project.project_type !== 'cs'
      ) {
        this.$store.dispatch('scorecard/getPerformanceDocuments', {
          id: this.project.scorecard_id,
          name: this.documentSearch,
        })
      }
    }
    if (this.project.hsr_scorecard_id) {
      this.$store.dispatch('shared/getDocuments', {
        id: this.project.hsr_scorecard_id,
        name: this.documentSearch,
      })
    }
    if (this.project.wpr_scorecard_id) {
      this.$store.dispatch('shared/getWprDocuments', {
        id: this.project.wpr_scorecard_id,
        name: this.documentSearch,
      })
    }
    this.$store.dispatch('portfolio/getSharedDocumentList', {
      id: this.project.id,
      name: this.documentSearch,
    })
    this.$store.dispatch('project/getStandards')
    this.getVerificationList()
  },
  methods: {
    getVerificationList() {
      this.$axios.get('api/verifications').then((response) => {
        this.verificationList = response.data
      })
    },

    removeProjectDocument() {
      if (this.currentTable === 'General') {
        this.$store
          .dispatch('project/removeProjectDocument', this.selectedDocument.id)
          .then(() => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.projectDocument.isHidden = true
      } else if (this.currentTable === 'Scorecard') {
        this.$store
          .dispatch('scorecard/removeScorecardDocument', {
            scorecard_id: this.project.scorecard_id,
            doc_id: this.selectedDocument.id,
          })
          .then(() => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.projectDocument.isHidden = true
      } else if (this.currentTable === 'Performance') {
        this.$store
          .dispatch('scorecard/removeScorecardDocument', {
            scorecard_id: this.project.scorecard_id,
            doc_id: this.selectedDocument.id,
          })
          .then(() => {
            this.$store.dispatch('scorecard/getPerformanceDocuments', {
              id: this.project.wpr_scorecard_id,
            })
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.projectDocument.isHidden = true
      } else if (this.currentTable === 'Health-Safety') {
        this.$store
          .dispatch('shared/deleteScorecardDocuments', {
            scorecardId: this.selectedDocument.scorecard_id,
            id: this.selectedDocument.id,
          })
          .then(() => {
            this.$store.dispatch('shared/getDocuments', {
              id: this.project.hsr_scorecard_id,
            })
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.projectDocument.isHidden = true
      } else if (this.currentTable === 'Performance Rating') {
        this.$store
          .dispatch('shared/deleteScorecardDocuments', {
            scorecardId: this.selectedDocument.scorecard_id,
            id: this.selectedDocument.id,
          })
          .then(() => {
            this.$store.dispatch('shared/getWprDocuments', {
              id: this.project.wpr_scorecard_id,
            })
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted',
            })
          })
        this.$refs.projectDocument.isHidden = true
      }
    },
    getDocuments() {
      if (this.currentTable === 'General') {
        this.$store.dispatch('project/getProjectDocuments', this.documentSearch)
      } else if (this.currentTable === 'Scorecard') {
        if (this.project.scorecard_id) {
          this.$store.dispatch('scorecard/getDocuments', {
            id: this.project.scorecard_id,
            name: this.documentSearch,
          })
        }
      } else if (this.currentTable === 'Health-Safety') {
        if (this.project.hsr_scorecard_id) {
          this.$store.dispatch('shared/getDocuments', {
            id: this.project.hsr_scorecard_id,
            name: this.documentSearch,
          })
        }
      } else if (this.currentTable === 'Shared Documents') {
        this.$store.dispatch('portfolio/getSharedDocumentList', {
          id: this.project.id,
          name: this.documentSearch,
        })
      } else if (this.currentTable === 'Performance Rating') {
        this.$store.dispatch('shared/getWprDocuments', {
          id: this.project.wpr_scorecard_id,
          name: this.documentSearch,
        })
      }
    },
    handleFileChange(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else if (fileExtension === 'zip') {
        if (this.formData.type === 'performance') {
          this.newPartDocument = event.target.files[0]
        } else {
          alert('This file type is not allowed.')
        }
      } else {
        this.newPartDocument = event.target.files[0]
      }
    },
    afterReview(lastUpdatedBy) {
      // dont allow document to delete if pending review
      if (this.project.pending_review_id) {
        return false
      }
      if (!this.project.review_doc_date) {
        return true
      }
      if (this.project.review_doc_date) {
        const documentDate = this.$dayjs(lastUpdatedBy)
        if (documentDate.isAfter(this.project.review_doc_date)) {
          return true
        } else {
          return false
        }
      }
    },
    downloadDocuments(payload) {
      this.$store
        .dispatch('project/downloadAllDocuments', payload)
        .then((response) => {
          this.$refs.documentModal.isHidden = false
        })
        .catch((err) => {
          this.apiResponse = err.data.message
        })
    },
    reset() {
      this.newPartDocument = null
      this.formData = { document: [], type: null }
      this.$formulate.reset('documentUpload')
      this.forceReMount++
    },
    selectVersion(selectedOption) {
      const payload = {
        on_sites: [],
        annotated_documents: [],
        letter_of_assurances: [],
        verifications: [],
      }
      if (
        this.featuredocumentType &&
        Object.prototype.hasOwnProperty.call(this.featuredocumentType, 'value')
      ) {
        if (this.featuredocumentType.type === 'letter_of_assurance') {
          payload.letter_of_assurances = [this.featuredocumentType.value]
        }
        if (this.featuredocumentType.type === 'annotated_documents') {
          if (this.featuredocumentType.value) {
            payload.annotated_documents = [this.featuredocumentType.value]
          }
        }
        if (this.featuredocumentType.type === 'on_sites') {
          payload.on_sites = [this.featuredocumentType.value]
        }
      }
      if (this.featuredocumentType && this.project.type === 'v2') {
        payload.verifications = [this.featuredocumentType.value]
      }
      if (selectedOption) {
        let portfolioVerisonType = this.standardVersion.filter(
          (a) => a.id === this.project.applicable_version_id
        )
        if (portfolioVerisonType.length) {
          portfolioVerisonType = portfolioVerisonType[0].type
        }
        if (portfolioVerisonType === this.project.type) {
          this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
            filters: payload,
            id: this.project.applicable_version_id,
          })
        } else {
          let getFeaturesOfVersion = this.standardVersion.filter(
            (a) => a.type === selectedOption && a.language[0].code === 'en'
          )
          getFeaturesOfVersion =
            getFeaturesOfVersion[getFeaturesOfVersion.length - 1]
          this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
            filters: payload,
            id: getFeaturesOfVersion.id,
          })
        }
      }
    },

    async uploadFile() {
      this.uploadingDoc = true

      if (
        this.formData.type === 'feature' ||
        this.formData.type === 'report' ||
        this.formData.type === 'performance'
      ) {
        if (!this.project.scorecard_id) {
          this.$refs.modal.isHidden = true
          this.forceReMount++
          this.$refs.alert.showAlert('error', 'Please create scorecard first')
        } else {
          const data = new FormData()
          if (
            this.formData.type === 'report' ||
            this.formData.type === 'performance'
          ) {
            const partIds = []
            this.formData.part_id.map((id) => partIds.push(parseInt(id.value)))
            if (partIds.length) {
              for (let index = 0; index < partIds.length; index++) {
                data.append('part_ids[]', partIds[index])
              }
            }
          }

          data.append(
            'period',
            this.formData.period ? this.formData.period : ''
          )
          data.append('file', this.newPartDocument)

          if (this.formData.stage) data.append('stage', 'Intent')
          else data.append('stage', 'Implementation')

          data.append('phase', 'Register')
          if (this.formData.type === 'feature') {
            if (this.featuredocumentType && this.project.type === 'v2-pilot') {
              data.append(
                'part_doc_type',
                this.featuredocumentType ? this.featuredocumentType.label : ''
              )
              data.append('verifiable_id', this.featuredocumentType.value)
              data.append(
                'verifiable_type',
                this.featuredocumentType
                  ? this.featuredocumentType.type !== 'letter_of_assurance'
                    ? this.featuredocumentType.type
                        .toLowerCase()
                        .split('_')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.substring(1)
                        )
                        .join('')
                        .slice(0, -1)
                    : 'LetterofAssurance'
                  : ''
              )
            } else if (this.featuredocumentType && this.project.type === 'v2') {
              data.append(
                'part_doc_type',
                this.featuredocumentType
                  ? this.verificationListOption.filter(
                      (a) =>
                        a.value === parseInt(this.featuredocumentType.value)
                    )[0].label
                  : ''
              )
              data.append('verifiable_type', 'Verification')
              data.append(
                'verifiable_id',
                this.featuredocumentType ? this.featuredocumentType.value : ''
              )
            }

            if (this.formData.partSelected.length) {
              this.formData.partSelected.forEach((e) => {
                data.append('part_ids[]', e.id)
              })
            } else {
              data.append('part_ids[]', [])
            }
          }
          if (this.formData.type !== 'feature') {
            data.append(
              'part_doc_type',
              this.formData.type === 'performance'
                ? 'Performance Test'
                : this.formData.type
            )
          }
          data.append('type', '')
          data.append('document_type', 'feature')

          await this.$store.dispatch('scorecard/addPartDocByProject', data)

          await this.$store.dispatch('scorecard/getDocuments', {
            id: this.project.scorecard_id,
            name: this.documentSearch,
          })
          await this.$store
            .dispatch('scorecard/getPerformanceDocuments', {
              id: this.project.scorecard_id,
              name: this.documentSearch,
            })
            .then((res) => {
              this.$refs.modal.isHidden = true
              this.uploadingDoc = false
              this.forceReMount++
              this.reset()
            })

          await this.$store
            .dispatch('project/getProjectDocuments', this.documentSearch)
            .then((res) => {
              this.$refs.modal.isHidden = true
              this.uploadingDoc = false
              this.forceReMount++
              this.reset()
            })
        }
      } else {
        const data = {
          ...JSON.parse(JSON.stringify(this.formData)),
          link_s3: this.formData.document[0].url,
        }

        data.stage = this.formData.stage ? 'Intent' : 'Implementation'

        await this.$store
          .dispatch('project/uploadProjectDocument', data)
          .then((res) => {
            this.$refs.modal.isHidden = true
            this.forceReMount++
            this.reset()
          })
        await this.$store
          .dispatch('project/getProjectDocuments', this.documentSearch)
          .then((res) => {
            this.$refs.modal.isHidden = true
            this.forceReMount++
            this.reset()
          })
      }
    },
  },
}
</script>
