<template>
  <div>
    <WFeedbackModal ref="formModal">
      <ScorecardInnovationView :innovation-data="selectedForm" />
    </WFeedbackModal>
    <ModalsGeneral ref="deleteDoc">
      <PortfolioScorecardConfirmDeleteScreen
        header="Delete document"
        :selected="selectedDoc"
        :part="part"
      />
    </ModalsGeneral>
    <WFeedbackModal ref="modal">
      <div v-if="modalMode === 'notes'" class="w-96">
        <WHeadingsHFour heading="Add Comment" />
        <FormulateForm
          class="mt-5"
          @submit="previousComment ? updateNote() : addNote()"
        >
          <FormulateInput
            v-model="newNote"
            type="textarea"
            validation="required"
          />
          <FormulateInput
            v-if="module && !module.portfolio_ids.length"
            v-model="privateNote"
            type="checkbox"
            label="Private?"
          />
          <div class="flex w-full mt-3">
            <div class="w-36 ml-auto">
              <FormulateInput
                type="submit"
                :label="previousComment ? 'Update' : 'Save'"
              />
            </div>
          </div>
        </FormulateForm>
      </div>
      <div
        v-if="modalMode === 'documents'"
        :class="moduleType === 'portfolio' ? 'w-full' : 'w-96'"
      >
        <WHeadingsHFour heading="Add Document" />
        <div v-if="moduleType === 'project'">
          <FormulateForm class="mt-5" @submit="addDocument">
            <div class="mb-5">
              <FormulateInput
                v-model="featuredocumentType"
                type="select"
                name="verification"
                label="Verification method*"
                placeholder="Select option"
                :options="verificationListOption"
                validation="required"
              />
            </div>
            <div
              v-if="!newDocument"
              class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div>
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
            </div>
            <div v-else>
              <ul>
                <li
                  class="bg-gray-100 max-w-md mx-auto px-4 py-3 rounded-md shadow-md my-4 relative"
                >
                  <span>
                    {{ newDocument.name }}
                  </span>
                  <button
                    class="right-0 absolute mr-3 text-danger-500"
                    type="button"
                    @click="newDocument = null"
                  >
                    remove
                  </button>
                </li>
              </ul>
              <FormulateInput
                v-if="module.d_and_o && !module.d_and_o_submitted"
                v-model="stage"
                class="mb-5"
                label="This is an intent-based document for WELL Precertification."
                type="checkbox"
              />
              <div v-if="featuredocumentType !== ''" class="flex w-full">
                <div class="w-32 ml-auto">
                  <FormulateInput v-if="!uploadingDoc" type="submit">
                  </FormulateInput>
                  <WButtonsBase v-else>
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </WButtonsBase>
                </div>
              </div>
            </div>
          </FormulateForm>
        </div>
        <div class="max-h-72 overflow-auto">
          <ScorecardDocumentModal
            v-if="moduleType === 'portfolio'"
            :part="part"
            :module="module"
            :module-type="moduleType"
            @get-documents="toggleDocumentModal"
          />
        </div>
      </div>
    </WFeedbackModal>
    <ModalsGeneral
      ref="uploadDocModal"
      header="Upload a Document"
      :header-background="noBakground"
    >
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <ScorecardPortfolioUploadDocumentScreen
          :module-type="moduleType"
          :module="module"
          :part="part"
          :part-id="part.id"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral
      ref="editPortfolioDoc"
      header="Edit Document"
      :header-background="noBakground"
    >
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <ScorecardPortfolioEditDocScreen
          :part="part"
          :selected-doc="selectedDoc"
        />
      </div>
    </ModalsGeneral>

    <div v-if="loading">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
      </div>
    </div>
    <div v-else>
      <div>
        <ScorecardPartStatusScreen
          v-if="
            module.type === 'v2-pilot' && part && part.scorecard_part.length
          "
          :part="part"
          :module="module"
        />
      </div>
      <WSlideoversOverlay
        ref="innovationSlide"
        :title="
          formType === 'beta'
            ? 'Upload Beta Proposal'
            : 'Upload Innovation Proposal'
        "
        class="z-40"
      >
        <template #content>
          <div class="p-4">
            <ScorecardInnovationForm
              :part="part"
              :module-type="moduleType"
              :module="module"
              :form-type="formType"
              @getFormSubmissions="getFormSubmissions"
            />
          </div>
        </template>
      </WSlideoversOverlay>
      <div class="flex space-x-2">
        <div class="w-1/2">
          <div class="text-lg text-primary-700 font-medium flex h-10">
            <div class="my-auto">Documents</div>
            <button
              v-if="showUploadButton()"
              class="w-6 ml-auto cursor-pointer"
              @click="
                project && project.portfolio_ids.length
                  ? ($refs.uploadDocModal.isHidden = false)
                  : ($refs.modal.isHidden = false),
                  (modalMode = 'documents')
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
          <div
            class="h-64 overflow-y-scroll px-2 bg-gray-100 border border-primary-200 rounded"
          >
            <div
              v-if="
                moduleType !== 'portfolio' &&
                moduleType == 'project' &&
                module.type !== 'v1' &&
                (part.feature_name.includes('β') ||
                  part.name.includes('β') ||
                  part.feature_name.includes('ß') ||
                  part.name.includes('ß') ||
                  part.feature_name === 'Innovate WELL')
              "
              class="mt-2"
            >
              <WButtonsBase
                @click.native="
                  $refs.innovationSlide.toggleOpen(),
                    part.feature_name.includes('β') ||
                    part.name.includes('β') ||
                    part.feature_name.includes('ß') ||
                    part.name.includes('ß')
                      ? (formType = 'beta')
                      : (formType = 'innovation')
                "
              >
                <span
                  v-if="
                    part.feature_name.includes('β') ||
                    part.name.includes('β') ||
                    part.feature_name.includes('ß') ||
                    part.name.includes('ß')
                  "
                >
                  Upload Beta Proposal
                </span>
                <span v-else> Upload Innovation Proposal </span>
              </WButtonsBase>
            </div>
            <div v-if="submittedForms.length > 0">
              <div class="text-primary-700 font-bold mt-4 ml-1 -mb-2">
                {{
                  formType === 'beta'
                    ? 'Beta Proposals'
                    : 'Innovation Proposals'
                }}
              </div>
              <div
                v-for="(form, index) in submittedForms"
                :key="index"
                class="mt-3 bg-white rounded-lg shadow p-4 text-sm text-primary-600 flex w-full cursor-pointer"
                @click="showForm(form)"
              >
                <div class="flex w-full items-baseline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 mr-2 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div target="_blank" class="my-auto w-10/12 truncate">
                    <!-- <div
                      v-if="document.part_doc_type"
                      class="
                        bg-primary-100
                        text-primary-600
                        rounded-lg
                        text-xs text-center
                        p-1
                        font-bold
                        inline-block
                      "
                    >
                      {{ document.part_doc_type }}
                    </div> -->
                    <div class="text-xs text-gray-400">
                      Uploaded on
                      {{ $dayjs(form.created_at).format('MMM DD, YYYY') }}
                      by
                      <br />
                      {{ form.user_name }}
                    </div>
                  </div>
                </div>
                <div class="my-auto -ml-3"></div>
              </div>
            </div>
            <div v-if="portfolioDocuments.length > 0">
              <div class="text-primary-700 font-bold mt-4 ml-1 -mb-2">
                Shared Documents
              </div>
              <div
                v-for="(document, index) in portfolioDocuments"
                :key="index"
                class="mt-3 bg-white rounded-lg shadow p-4 text-sm text-primary-600 flex w-full"
              >
                <div class="flex w-full items-baseline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 mr-2 text-primary-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                  <a
                    :href="document.link_s3_private"
                    target="_blank"
                    class="my-auto w-10/12 truncate"
                  >
                    <div class="flex items-center">
                      {{ document.name }}

                      <div
                        v-if="document.stage === 'Intent'"
                        class="p-1 bg-green-50 text-green-600 rounded-lg text-xs text-center ml-1"
                      >
                        Intent
                      </div>
                    </div>
                    <div
                      v-if="document.part_doc_type"
                      class="bg-primary-100 text-primary-600 rounded-lg text-xs text-center p-1 font-bold inline-block"
                    >
                      {{ document.part_doc_type }}
                    </div>
                    <div class="text-xs text-gray-400">
                      Uploaded on
                      {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                      by
                      <br />
                      {{ document.user_name }}
                    </div>
                  </a>
                  <svg
                    v-if="
                      document.project_ids.length ||
                      document.portfolio_subset_ids.length
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 text-primary-500 ml-3"
                  >
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                    />
                  </svg>
                  <svg
                    v-if="
                      (currentUser.role.includes('well-admin') ||
                        currentUser.id === document.last_updated_by) &&
                      afterReview(document.updated_at)
                    "
                    class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    @click="
                      ;(selectedDoc = document),
                        ($refs.deleteDoc.isHidden = false)
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div class="my-auto -ml-3"></div>
              </div>
            </div>
            <div v-if="documents.length > 0">
              <div
                v-for="(document, index) in documents"
                :key="index"
                class="mt-3 bg-white rounded-lg shadow p-4 text-sm text-primary-600 flex w-full"
              >
                <div class="flex w-full items-baseline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 mr-2 text-primary-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                  <a
                    :href="document.link_s3_private"
                    target="_blank"
                    class="my-auto w-10/12 truncate"
                  >
                    <div class="flex items-center">
                      {{ document.name }}

                      <div
                        v-if="document.stage === 'Intent'"
                        class="p-1 bg-green-50 text-green-600 rounded-lg text-xs text-center ml-1"
                      >
                        Intent
                      </div>
                    </div>
                    <div
                      v-if="document.part_doc_type"
                      class="bg-primary-100 text-primary-600 rounded-lg text-xs text-center p-1 font-bold inline-block"
                    >
                      {{ document.part_doc_type }}
                    </div>
                    <div class="text-xs text-gray-400">
                      Uploaded on
                      {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                      by
                      <br />
                      {{ document.user_name }}
                    </div>
                  </a>
                  <svg
                    v-if="project && project.portfolio_ids.length"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer ml-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    @click="
                      ;(selectedDoc = document),
                        ($refs.editPortfolioDoc.isHidden = false)
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>

                  <svg
                    v-if="project && project.portfolio_ids.length"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 text-primary-500"
                  >
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                    />
                  </svg>
                  <svg
                    v-if="
                      (currentUser.id === module.user_id ||
                        currentUser.role.includes('well-admin') ||
                        currentUser.id === document.last_updated_by) &&
                      afterReview(document.updated_at)
                    "
                    class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    @click="
                      ;(selectedDoc = document),
                        ($refs.deleteDoc.isHidden = false)
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <svg
                    v-else-if="
                      (currentUser.role.includes('well-admin') ||
                        currentUser.id === document.last_updated_by) &&
                      afterReview(document.updated_at)
                    "
                    class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    @click="
                      ;(selectedDoc = document),
                        ($refs.deleteDoc.isHidden = false)
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div v-if="sharedDocumemts.length > 0">
              <div
                v-for="(document, index) in sharedDocumemts"
                :key="index"
                class="mt-3 bg-white rounded-lg shadow p-4 text-sm text-primary-600 flex w-full"
              >
                <div class="flex w-full items-baseline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 mr-2 text-primary-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                  <a
                    :href="document.link_s3_private"
                    target="_blank"
                    class="my-auto w-10/12 truncate"
                  >
                    <div class="flex items-center">
                      {{ document.name }}
                    </div>
                    <div
                      v-if="document.part_doc_type"
                      class="bg-primary-100 text-primary-600 rounded-lg text-xs text-center p-1 font-bold inline-block"
                    >
                      {{ document.part_doc_type }}
                    </div>
                    <div class="text-xs text-gray-400">
                      Uploaded on
                      {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                      by
                      <br />
                      {{ document.user_name }}
                    </div>
                  </a>
                  <svg
                    v-if="
                      document.project_ids.length ||
                      document.portfolio_subset_ids.length
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-4 text-primary-500 ml-3"
                  >
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                    />
                  </svg>
                  <svg
                    v-if="
                      (currentUser.role.includes('well-admin') ||
                        currentUser.id === document.last_updated_by) &&
                      afterReview(document.updated_at) &&
                      !isReview
                    "
                    class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    @click="
                      ;(selectedDoc = document),
                        ($refs.deleteDoc.isHidden = false)
                    "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div v-else-if="!documents.length && !sharedDocumemts.length">
              <div class="text-gray-400 m-4">
                You have not uploaded any documentation for this feature.
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-lg text-primary-700 font-medium flex h-10">
            <div class="my-auto">Comments</div>
            <svg
              v-if="!isReview"
              class="w-6 ml-auto cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="
                ;($refs.modal.isHidden = false),
                  (modalMode = 'notes'),
                  (newNote = ''),
                  (previousComment = ''),
                  (privateNote = false)
              "
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div
            class="h-64 overflow-y-scroll px-2 bg-gray-100 border border-primary-200 rounded"
          >
            <div
              v-for="(comment, index) in comments"
              :key="index"
              class="mt-3 bg-white rounded-lg shadow p-4"
            >
              <div>
                <div class="md:flex">
                  <div class="md:flex-shrink-0">
                    <img
                      class="mx-auto h-10 w-10 rounded-full"
                      src="/profile/avatar.jpg"
                      alt=""
                    />
                  </div>
                  <div
                    class="mt-3 md:mt-0 md:ml-4 text-center md:text-left w-full"
                  >
                    <div class="font-medium text-base text-gray-500 flex h-10">
                      <div class="my-auto">
                        {{ comment.user_name }}
                      </div>
                      <div class="ml-auto flex">
                        <svg
                          v-if="comment.private === 1"
                          class="w-5 text-primary-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <svg
                          v-if="
                            (currentUser.role.includes('well-admin') ||
                              currentUser.id === comment.last_updated_by) &&
                            !isReview
                          "
                          class="w-5 text-primary-500 hover:text-primary-700 cursor-pointer"
                          viewBox="0 0 18 19"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          @click="updateComment(comment)"
                        >
                          <path
                            d="M12.2274 3.72747C12.3935 3.55555 12.5921 3.41842 12.8117 3.32408C13.0313 3.22975 13.2675 3.18009 13.5065 3.17802C13.7455 3.17594 13.9825 3.22148 14.2037 3.31199C14.4249 3.40249 14.6259 3.53615 14.7949 3.70516C14.9639 3.87416 15.0976 4.07514 15.1881 4.29635C15.2786 4.51756 15.3241 4.75459 15.3221 4.99359C15.32 5.23259 15.2703 5.46879 15.176 5.6884C15.0817 5.908 14.9445 6.10662 14.7726 6.27267L14.0589 6.98637L11.5137 4.44117L12.2274 3.72747ZM10.2411 5.71377L2.70001 13.2549V15.8001H5.24521L12.7872 8.25897L10.2402 5.71377H10.2411Z"
                          />
                        </svg>
                        <svg
                          v-if="
                            (currentUser.role.includes('well-admin') ||
                              currentUser.id === comment.last_updated_by) &&
                            !isReview
                          "
                          class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          @click="removeNote(comment.id)"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ $dayjs(comment.created_at).format('MMM DD, YYYY') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 w-full bg-primary-100 p-4 rounded-lg text-sm">
                {{ comment.note }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    partId: {
      type: Number,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
    module: {
      type: Object,
      required: false,
      default: () => {},
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      noBakground: true,
      selectedForm: null,
      submittedForms: [],
      formType: 'innovation',
      loading: true,
      comments: [],
      portfolioDocuments: [],
      documents: [],
      sharedDocumemts: [],
      newNote: '',
      privateNote: false,
      newDocument: null,
      modalMode: '',
      uploadingDoc: false,
      assess: 0,
      previousComment: '',
      stage: false,
      featuredocumentType: '',
      verificationListOption: [],
      selectedDoc: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
    }),
    ...mapGetters('review', ['pendingReview']),
    canUploadDocuments() {
      if (this.module.agreement_status) return true
      return false
    },
    pendingReviewId() {
      let resp = null
      if (
        this.$store.state.project.project &&
        this.$store.state.project.project.pending_review_id
      ) {
        resp = this.$store.state.project.project.pending_review_id
      }

      if (
        this.$store.state.shared.sharedworkspace &&
        this.$store.state.shared.sharedworkspace.pending_review_id
      ) {
        resp = this.$store.state.shared.sharedworkspace.pending_review_id
      }
      return resp
    },
    isReview() {
      if (!this.module.agreement_status) {
        return false
      }
      if (!this.pendingReview) {
        return false
      }

      if (
        (this.pendingReview &&
          this.pendingReview.phase === 'Preliminary Health-Safety Review') ||
        this.pendingReview.phase === 'Final Health-Safety Review'
      ) {
        return false
      }

      return true
    },
  },
  watch: {
    verificationListOption() {
      if (this.verificationListOption.length === 1) {
        this.featuredocumentType = this.verificationListOption[0].value
      }
    },
  },
  async mounted() {
    await this.$store
      .dispatch('scorecard/getPartNotes', this.partId)
      .then((res) => {
        this.comments = res
        // this.part.note_count = res.length
      })

    await this.$store
      .dispatch('scorecard/getProjectPartDocs', this.partId)
      .then((res) => {
        this.documents = res
        // this.part.document_count = res.length
      })

    await this.getFormSubmissions()

    if (this.moduleType === 'project' && this.module.portfolio_ids.length) {
      await this.$store
        .dispatch('portfolio/getSharedDocumentList', {
          id: this.module.id,
          part_id: this.partId,
        })
        .then((res) => {
          this.portfolioDocuments = [...res]
        })
    }
    if (this.moduleType === 'project') {
      if (this.module.type === 'v2-pilot') {
        const loa = this.part.letter_of_assurances.map((e) => {
          return {
            ...e,
            name: 'Letter of Assurance - ' + e.name,
            type: 'LetterofAssurance',
          }
        })
        const onSite = this.part.on_sites.map((e) => {
          return { ...e, type: 'OnSite' }
        })
        const annotatedDocuments = this.part.annotated_documents.map((e) => {
          return { ...e, type: 'AnnotatedDocument' }
        })
        const verficiations = [...loa, ...onSite, ...annotatedDocuments]
        if (this.part.photographic_verification) {
          this.verificationListOption.push({
            label: 'Photographic evidence',
            value: 'Photographic evidence',
          })
        }
        verficiations.forEach((verification) => {
          if (
            this.verificationListOption.filter(
              (a) => a.value === verification.id
            ).length === 0
          ) {
            this.verificationListOption.push({
              label: verification.name,
              value: verification.id,
              type: verification.type,
            })
          }
        })
      } else {
        this.part.subParts.forEach((subpart) => {
          subpart.options.forEach((option) => {
            option.verifications.forEach((verification) => {
              if (
                this.verificationListOption.filter(
                  (a) => a.value === verification.id
                ).length === 0
              ) {
                this.verificationListOption.push({
                  label: verification.name,
                  value: verification.id,
                  type: 'Verification',
                })
              }
            })
          })
        })
      }
    }

    this.loading = false
    if (this.verificationListOption.length === 1) {
      this.featuredocumentType = this.verificationListOption[0].value
    }
  },
  methods: {
    showForm(form) {
      this.selectedForm = form
      this.$refs.formModal.isHidden = false
    },
    showUploadButton() {
      // If user is well admin they automatically can see the button no other checks are necessary

      if (this.currentUser.role.includes('well-admin')) return true
      if (this.module.agreement_status !== null) {
        // Check if the user is a member -> Show button if user is a member
        const isMember = this.module.members.some(
          (member) => member.id === this.currentUser.id
        )
        return isMember
      }
    },

    async getDocuments() {
      await this.$store
        .dispatch('scorecard/getProjectPartDocs', this.partId)
        .then((res) => {
          this.documents = res
          // this.part.document_count = res.length
        })
    },
    async getFormSubmissions() {
      await this.$axios
        .get(
          `api/${this.moduleType}/${this.module.id}/innovationProposal?part_id=${this.part.id}`
        )
        .then((response) => {
          this.submittedForms = response.data.data
        })
    },
    handleFileChange(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'zip' || fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else if (fileExtension === 'zip') {
        if (
          this.verificationListOption.find(
            (a) => parseInt(a.value) === parseInt(this.featuredocumentType)
          ).label === 'Performance Test'
        ) {
          this.newDocument = event.target.files[0]
        } else {
          alert('This file type is not allowed.')
        }
      } else {
        this.newDocument = event.target.files[0]
      }
    },
    updateComment(comment) {
      this.previousComment = comment
      this.newNote = comment.note
      this.privateNote = comment.private
      this.$refs.modal.isHidden = false
      this.modalMode = 'notes'
    },
    afterReview(lastUpdatedBy) {
      if (this.module.pending_review_id) {
        return false
      }
      if (!this.module.review_doc_date) {
        return true
      }
      if (this.module.review_doc_date) {
        const documentDate = this.$dayjs(lastUpdatedBy)
        if (documentDate.isAfter(this.module.review_doc_date)) {
          return true
        } else {
          return false
        }
      }
    },

    async toggleDocumentModal() {
      this.$refs.modal.isHidden = true
      await this.$store
        .dispatch('scorecard/getProjectPartDocs', this.partId)
        .then((res) => {
          this.documents = res
          // this.part.document_count = res.length
        })
    },

    async removeNote(noteId) {
      await this.$store.dispatch('scorecard/removeNote', noteId)

      await this.$store
        .dispatch('scorecard/getPartNotes', this.partId)
        .then((res) => {
          this.comments = res
          // this.part.note_count = res.length
        })
    },

    async addNote() {
      const data = {
        note: this.newNote,
        part_id: this.partId,
        phase: 'assessment',
        private: this.privateNote,
      }
      await this.$store.dispatch('scorecard/addPartNote', data)

      await this.$store
        .dispatch('scorecard/getPartNotes', this.partId)
        .then((res) => {
          this.comments = res
          // this.part.note_count = res.length
        })

      this.$refs.modal.isHidden = true
      this.newNote = ''
      this.modalMode = ''
    },
    async updateNote() {
      const data = {
        note: this.newNote,
        part_id: this.partId,
        phase: 'assessment',
        private: this.privateNote,
        id: this.previousComment.id,
      }
      await this.$store.dispatch('scorecard/updatePartNote', data)

      await this.$store
        .dispatch('scorecard/getPartNotes', this.partId)
        .then((res) => {
          this.comments = res
          // this.part.note_count = res.length
        })

      this.$refs.modal.isHidden = true
      this.newNote = ''
      this.previousComment = ''
      this.privateNote = false
      this.modalMode = ''
    },
    async addDocument() {
      this.uploadingDoc = true

      const data = new FormData()

      const partIds = []
      partIds.push(this.partId)

      data.append('file', this.newDocument)
      data.append(
        'part_doc_type',
        this.verificationListOption.find(
          (a) => parseInt(a.value) === parseInt(this.featuredocumentType)
        ).label
      )
      data.append(
        'verifiable_type',
        this.verificationListOption.find(
          (a) => parseInt(a.value) === parseInt(this.featuredocumentType)
        ).type
      )
      data.append(
        'verifiable_id',
        this.verificationListOption.find(
          (a) => parseInt(a.value) === parseInt(this.featuredocumentType)
        ).value
      )
      data.append('part_ids[]', this.partId)
      if (this.stage) data.append('stage', 'Intent')
      else data.append('stage', 'Implementation')
      data.append('phase', 'Register')
      data.append('type', '')

      await this.$store.dispatch('scorecard/addPartDoc', data)

      await this.$store
        .dispatch('scorecard/getProjectPartDocs', this.partId)
        .then((res) => {
          this.documents = res
          // this.part.document_count = res.length
        })

      this.uploadingDoc = false
      this.$refs.modal.isHidden = true
      this.newDocument = null
      this.modalMode = ''
      this.stage = false
    },
  },
}
</script>
