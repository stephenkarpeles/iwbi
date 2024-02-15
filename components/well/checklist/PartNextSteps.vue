<template>
  <div>
    <WFeedbackModal ref="formModal">
      <ScorecardInnovationView :innovation-data="selectedForm" />
    </WFeedbackModal>
    <WFeedbackModal ref="modal">
      <div v-if="modalMode === 'notes'" class="w-96">
        <WHeadingsHFour heading="Add Comment" />
        <FormulateForm class="mt-5" @submit="addNote">
          <FormulateInput
            v-model="newNote"
            type="textarea"
            validation="required"
          />
          <FormulateInput
            v-model="privateNote"
            type="checkbox"
            label="Private?"
          />
          <div class="flex w-full mt-3">
            <div class="w-36 ml-auto">
              <FormulateInput type="submit" label="Save" />
            </div>
          </div>
        </FormulateForm>
      </div>
      <div
        v-if="modalMode === 'documents'"
        class="docModal flex flex-col justify-between"
      >
        <WHeadingsHFour heading="Add Document" />
        <template
          v-if="
            moduleType === 'project' ||
            moduleType === 'wpr' ||
            moduleType === 'hsrOpt'
          "
        >
          <div class="mb-5">
            <FormulateInput
              v-if="verificationListOption.length > 1"
              v-model="verificationMethod"
              type="select"
              name="legalTypes"
              label="Verification method *"
              placeholder="Select option"
              :options="verificationListOption"
            />
            <div v-else>
              <FormulateInput
                v-model="verificationMethod"
                type="select"
                name="legalTypes"
                label="Verification method *"
                placeholder="Select option"
                :options="verificationListOption"
              />
            </div>
          </div>

          <div
            v-if="!newDocument"
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
          </div>
          <WButtonsBase
            v-if="newDocument"
            class="my-3"
            @click.native="addDocument"
            >Upload
          </WButtonsBase>
        </template>
        <div class="max-h-72 overflow-auto">
          <ScorecardDocumentModal
            v-if="moduleType === 'hsr' || moduleType === 'portfolio'"
            :part="part"
            :module="module"
            :module-type="moduleType"
            @get-documents="toggleDocumentModal"
          />
        </div>
      </div>
    </WFeedbackModal>
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
            :module="module"
            :module-type="moduleType"
            :form-type="formType"
            @getFormSubmissions="getFormSubmissions"
          />
        </div>
      </template>
    </WSlideoversOverlay>
    <WFeedbackModal ref="documentsChangeYes">
      <div class="w-96">
        <div class="text-base text-primary-900 leading-7 font-bold">
          Thank you for the confirmation! However if any changes may needed, you
          can still upload it in the documents section.
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="documentsChangeNo">
      <div class="w-96">
        <div class="text-base text-primary-900 leading-7 font-bold">
          Thank you for the confirmation! Please upload the updated documents
          for the renewal.
        </div>
      </div>
    </WFeedbackModal>

    <div v-if="loading">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
      </div>
    </div>
    <div v-else class="flex space-x-2">
      <div class="w-1/2">
        <div class="text-lg text-primary-700 font-medium flex">
          <div v-if="!showDocumentWarning">Documents</div>
          <div v-else>
            <span
              v-if="
                verificationlist.includes('On-going Data Report') &&
                hasAuditVerification &&
                !part.document_count
              "
              class="text-base text-secondary-700 font-bold"
            >
              Updated on ongoing data report and audit documents are required
              for renewal
            </span>

            <div
              v-else-if="
                verificationlist.includes('On-going Data Report') &&
                !part.document_count
              "
              class="text-base text-secondary-700 font-bold"
            >
              <span> Updated ongoing data report is required for renewal </span>
            </div>
            <div
              v-else-if="hasAuditVerification && !part.document_count"
              class="text-base text-secondary-700 font-bold"
            >
              <div
                v-if="module.no_of_assets === 1 || moduleType === 'project'"
                class="flex justify-between"
              >
                <div class="text-base text-secondary-700 font-bold">
                  Are these documents still current?
                </div>
                <div class="flex ml-10">
                  <div>
                    <WLinksBase @click.native="documentsChangeYes"
                      ><WIconsBase
                        type="neutral"
                        icon="check-circle"
                        class="w-6 h-6 cursor-pointer rounded-full text-secondary-700"
                    /></WLinksBase>
                  </div>
                  <div class="ml-4">
                    <WLinksBase @click.native="documentsChangeNo">
                      <WIconsBase
                        type="neutral"
                        icon="x-circle"
                        class="w-6 h-6 cursor-pointer rounded-full text-secondary-700"
                    /></WLinksBase>
                  </div>
                </div>
              </div>
              <span v-else>
                Updated audit documents are required for renewal
              </span>
            </div>
            <div
              v-if="
                hasOtherDocuments &&
                !part.document_count &&
                !hasAuditVerification &&
                !part.new_document &&
                documents.filter((a) => a.doc_status).length === 0
              "
              class="flex justify-between"
            >
              <div class="text-base text-secondary-700 font-bold">
                Are these documents still current?
              </div>
              <div class="flex ml-10">
                <div>
                  <WLinksBase @click.native="documentsChangeYes"
                    ><WIconsBase
                      type="neutral"
                      icon="check-circle"
                      class="w-6 h-6 cursor-pointer rounded-full text-secondary-700"
                  /></WLinksBase>
                </div>
                <div class="ml-4">
                  <WLinksBase @click.native="documentsChangeNo">
                    <WIconsBase
                      type="neutral"
                      icon="x-circle"
                      class="w-6 h-6 cursor-pointer rounded-full text-secondary-700"
                  /></WLinksBase>
                </div>
              </div>
            </div>
          </div>

          <svg
            v-if="
              (!isReview && isActiveChecklist && shouldShowDocumentUpload) ||
              currentUser.role.includes('well-admin')
            "
            class="w-6 ml-auto cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click=";($refs.modal.isHidden = false), (modalMode = 'documents')"
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
            v-if="hasInnovationVerification || hasBetaVerification"
            class="mt-2"
          >
            <WButtonsBase
              @click.native="
                $refs.innovationSlide.toggleOpen(),
                  hasBetaVerification
                    ? (formType = 'beta')
                    : (formType = 'innovation')
              "
            >
              <span v-if="hasBetaVerification"> Upload Beta Proposal </span>
              <span v-else> Upload Innovation Proposal </span>
            </WButtonsBase>
          </div>
          <div v-if="submittedForms.length > 0">
            <div class="text-primary-700 font-bold mt-4 ml-1 -mb-2">
              {{
                formType === 'beta' ? 'Beta Proposals' : 'Innovation Proposals'
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
          <div v-if="documents.length > 0">
            <div
              v-for="(document, index) in documents"
              :key="index"
              :class="[
                'mt-3',
                'rounded-lg',
                'shadow',
                'p-4',
                'text-sm',
                'text-primary-600',
                'flex',
                'w-full',
                document.doc_status === 'invalid' ? 'bg-gray-200' : 'bg-white',
              ]"
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
                  <div>
                    {{ document.name }}
                  </div>
                  <div
                    v-if="document.part_doc_type"
                    class="bg-primary-100 text-primary-600 rounded-lg text-xs text-center p-1 font-bold inline-block my-1"
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
                  class="w-4 text-primary-500 ml-3 my-auto"
                >
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                  />
                </svg>
              </div>
              <div class="my-auto -ml-3">
                <svg
                  v-if="
                    !certifiedDocument(document) &&
                    (currentUser.id === module.user_id ||
                      currentUser.role.includes('well-admin') ||
                      currentUser.id === document.last_updated_by) &&
                    !isReview &&
                    afterReview(document.created_at)
                  "
                  class="ml-3 w-5 text-red-500 hover:text-red-700 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  @click="removeDocument(document.id)"
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
          <div v-else>
            <div class="text-gray-400 m-4">
              You have not uploaded any documentation for this feature.
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <div class="text-lg text-primary-700 font-medium flex">
          <div>Comments</div>
          <svg
            v-if="isActiveChecklist && !isReview"
            class="w-6 ml-auto cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click=";($refs.modal.isHidden = false), (modalMode = 'notes')"
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
                  <div class="font-medium text-base text-gray-500 flex">
                    <div>
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
                          !isReview &&
                          isActiveChecklist
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
            <div
              class="mt-3 w-full bg-primary-100 p-4 rounded-lg text-sm"
              v-html="comment.note"
            ></div>
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
    // subPart: {
    //   type: Object,
    //   required: true,
    // },
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
      selectedForm: null,
      submittedForms: [],
      formType: 'innovation',
      verificationMethod: '',
      loading: true,
      comments: [],
      documents: [],
      newNote: '',
      privateNote: false,
      newDocument: null,
      modalMode: '',
      componentMounted: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      checklistScorecardId: (state) => state.checklist.scorecard.id,
      verifications: (state) => state.checklist.verifications,
      isActiveChecklist: (state) => state.checklist.isActiveChecklist,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    ...mapGetters('review', ['pendingReview']),
    hasBetaVerification() {
      const verifications = []
      this.part.subParts.forEach((e) => {
        e.options.forEach((option) => {
          if (option.verifications.length) {
            option.verifications.forEach((verification) => {
              verifications.push(verification.id)
            })
          }
        })
      })
      if (verifications.length && verifications.includes(20)) {
        return true
      }
      return false
    },
    hasInnovationVerification() {
      const verifications = []
      this.part.subParts.forEach((e) => {
        e.options.forEach((option) => {
          if (option.verifications.length) {
            option.verifications.forEach((verification) => {
              verifications.push(verification.id)
            })
          }
        })
      })
      if (verifications.length && verifications.includes(21)) {
        return true
      }
      return false
    },
    shouldShowDocumentUpload() {
      if (this.module.no_of_assets > 1) {
        if (
          this.hasAuditVerification ||
          (this.verificationlist.includes('On-going Data Report') &&
            this.showDocumentWarning)
        ) {
          return true
        } else if (this.hasOtherDocuments && this.showDocumentWarning) {
          return false
        }
        return true
      } else {
        if (this.verificationlist.includes('On-going Data Report')) {
          return true
        }
        if (this.showDocumentWarning) {
          return false
        }
        return true
      }
    },
    recertification() {
      if (!this.recertificationList.length) {
        return ''
      } else {
        const recert = JSON.parse(JSON.stringify(this.recertificationList))
        return recert.pop()
      }
    },
    showDocumentWarning() {
      if (this.moduleType !== 'project' && this.module.no_of_assets > 1) {
        if (
          !this.isActiveChecklist ||
          !this.recertificationList.length ||
          !this.documents.length
        )
          return false
        let document = JSON.parse(JSON.stringify(this.documents))
        document = document.pop()
        if (this.part.document_count) {
          return false
        }
        if (
          this.hasAuditVerification ||
          this.verificationlist.includes('On-going Data Report')
        ) {
          return true
        }
        if (
          this.$dayjs(document.created_at).isAfter(
            this.recertification.created_at
          ) ||
          this.documents.filter(
            (a) => a.doc_status === 'valid' || a.doc_status === 'invalid'
          ).length
        )
          return false
      } else {
        if (
          !this.isActiveChecklist ||
          !this.recertificationList.length ||
          !this.documents.length
        )
          return false
        let document = JSON.parse(JSON.stringify(this.documents))
        document = document.pop()
        if (this.part.document_count) {
          return false
        }
        if (this.verificationlist.includes('On-going Data Report')) {
          return true
        }
        if (
          this.$dayjs(document.created_at).isAfter(
            this.recertification.created_at
          ) ||
          this.documents.filter(
            (a) => a.doc_status === 'valid' || a.doc_status === 'invalid'
          ).length
        )
          return false
      }

      return true
    },
    verificationlist() {
      const verification = []
      const verificationname = []
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.map((arr) => verification.push(arr))
        }
      }
      for (let i = 0; i < verification.length; i++) {
        verificationname.push(verification[i].name)
      }
      const isverification = verificationname.filter(
        (n) => n === 'On-going Data Report' || n === 'On-site Photographs'
      )
      return isverification
    },
    hasOtherDocuments() {
      const verification = [
        'Letter of Assurance – Owner',
        'Policy and/or Operations Schedule',
      ]
      let isOther = false
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.forEach((e) => {
            if (verification.includes(e.name) && !isOther) {
              isOther = true
            }
          })
        }
      }

      return isOther
    },
    hasAuditVerification() {
      const verification = [
        'On-site Photographs',
        'On-going Maintenance Report',
        'Professional Narrative',
        'Technical Document',
      ]
      let isAudit = false
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.forEach((e) => {
            if (verification.includes(e.name) && !isAudit) {
              isAudit = true
            }
          })
        }
      }

      return isAudit
    },
    pendingReviewId() {
      return this.module.pending_review_id
    },
    isReview() {
      if (this.moduleType === 'hsr' || this.moduleType === 'wpr') {
        if (this.pendingReview) {
          return true
        } else {
          return false
        }
      }

      if (this.moduleType === 'project' || this.moduleType === 'portfolio') {
        if (!this.pendingReview && this.module.agreement_status) {
          return false
        }
        if (
          this.pendingReview &&
          this.pendingReview.phase.indexOf(
            'Preliminary Health-Safety Review' !== -1
          ) &&
          this.pendingReview.phase.indexOf(
            'Final Health-Safety Review' !== -1
          ) &&
          !this.pendingReview.is_hsr &&
          this.module.agreement_status
        ) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    moduleTypePayload() {
      let moduleType

      // Set moduleType to Project if HSR/WPR Opt-In
      if (
        this.moduleType === 'project' ||
        this.moduleType === 'hsrOpt' ||
        this.moduleType === 'wpr'
      ) {
        moduleType = 'project'
      } else {
        moduleType = 'portfolio'
      }
      return moduleType
    },
    verificationListOption() {
      let options

      if (this.part?.subParts[0]?.options[0]?.verifications) {
        options = this.part.subParts[0].options[0].verifications

        options = options.map((el) => {
          return { label: el.name, value: el.id }
        })
      } else {
        options = []
      }
      return options
    },
  },
  // watch: {
  //   documents: {
  //     handler() {
  //       console.log('docs', this.documents)
  //     },
  //     deep: true,
  //   },
  //   verificationListOption: {
  //     handler() {
  //       console.log('veropt', this.verificationListOption)
  //     },
  //     deep: true,
  //   },
  // },
  async mounted() {
    if (this.partId) {
      await this.$store
        .dispatch('checklist/getPartNotes', {
          id: this.checklistScorecardId,
          partId: this.partId,
        })
        .then((res) => {
          this.comments = res
        })

      await this.$store
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
        })
    }
    if (this.verificationListOption.length === 1) {
      this.verificationMethod = this.verificationListOption[0].value
    }
    await this.getFormSubmissions()
    this.loading = false
    this.componentMounted = true
  },
  methods: {
    showForm(form) {
      this.selectedForm = form
      this.$refs.formModal.isHidden = false
    },
    async getFormSubmissions() {
      await this.$axios
        .get(
          `api/${this.moduleTypePayload}/${this.module.id}/innovationProposal?part_id=${this.part.id}`
        )
        .then((response) => {
          this.submittedForms = response.data.data
        })
    },
    certifiedDocument(document) {
      if (!this.recertificationList.length) return false
      else
        return this.$dayjs(document.created_at).isBefore(
          this.recertification.created_at
        )
    },
    handleFileChange(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'zip' || fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else {
        this.newDocument = event.target.files[0]
      }
    },
    async documentsChangeYes() {
      this.$refs.documentsChangeYes.isHidden = false
      await this.$store.dispatch('checklist/setPartDocStatus', {
        moduleType: this.moduleTypePayload,
        moduleId: this.module.id,
        part_id: this.partId,
        doc_status: 'valid',
        scorecard_type: 'v2-hsr',
      })
      await this.$store
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
        })
      // eslint-disable-next-line
      this.$parent.$parent.part.new_document = this.documents.filter((a) =>
        this.$dayjs(a.created_at).isBefore(this.recertification.created_at)
      ).length
      const self = this
      setTimeout(() => {
        self.$refs.documentsChangeYes.isHidden = true
      }, 1500)
    },
    async documentsChangeNo() {
      this.$refs.documentsChangeNo.isHidden = false
      await this.$store.dispatch('checklist/setPartDocStatus', {
        moduleType: this.moduleTypePayload,
        moduleId: this.module.id,
        part_id: this.partId,
        doc_status: 'invalid',
        scorecard_type: 'v2-hsr',
      })
      await this.$store
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
          // eslint-disable-next-line
          this.part.invalid_document_count = this.documents.filter(
            (a) => a.doc_status === 'invalid'
          ).length
          // eslint-disable-next-line
          this.part.all_document_count = this.documents.filter(
            (a) => a.doc_status !== 'invalid'
          ).length
        })
      const self = this
      setTimeout(() => {
        self.$refs.documentsChangeNo.isHidden = true
      }, 1500)
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
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
          // eslint-disable-next-line
          this.part.document_count = res.length
          // eslint-disable-next-line
          this.part.all_document_count = this.documents.filter(
            (a) => a.doc_status !== 'invalid'
          ).length
        })
    },
    async removeDocument(documentId) {
      await this.$store.dispatch('checklist/removeDocument', {
        id: this.checklistScorecardId,
        docId: documentId,
      })

      await this.$store
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
          // eslint-disable-next-line
          this.part.document_count = res.length
          // eslint-disable-next-line
          this.part.all_document_count = this.documents.filter(
            (a) => a.doc_status !== 'invalid'
          ).length
          // Get updated doc count
          this.$store.dispatch('checklist/getScores')
        })
    },
    async removeNote(noteId) {
      await this.$store.dispatch('checklist/removeNote', noteId)

      await this.$store
        .dispatch('checklist/getPartNotes', {
          id: this.checklistScorecardId,
          partId: this.partId,
        })
        .then((res) => {
          this.comments = res
        })
    },

    async addNote() {
      const data = {
        note: this.newNote,
        part_id: this.partId,
        phase: 'assessment',
        private: this.privateNote,
      }
      await this.$store.dispatch('checklist/addPartNote', {
        id: this.checklistScorecardId,
        data,
      })

      await this.$store
        .dispatch('checklist/getPartNotes', {
          id: this.checklistScorecardId,
          partId: this.partId,
        })
        .then((res) => {
          this.comments = res
          // eslint-disable-next-line
          this.part.note_count = res.length
        })

      this.$refs.modal.isHidden = true
      this.newNote = ''
      this.modalMode = ''
    },

    async addDocument() {
      const data = new FormData()

      const partIds = []
      partIds.push(this.partId)

      data.append('file', this.newDocument)
      data.append(
        'part_doc_type',
        this.verificationListOption.find(
          (a) => parseInt(a.value) === parseInt(this.verificationMethod)
        ).label
      )
      data.append(
        'verifiable_id',
        this.verificationListOption.find(
          (a) => parseInt(a.value) === parseInt(this.verificationMethod)
        ).value
      )
      data.append('part_ids[]', this.partId)
      data.append('stage', 'Implementation')
      data.append('phase', 'Register')
      data.append('type', '')

      // Add Doc with wprScorecardId as Payload Id
      await this.$store.dispatch('checklist/addPartDoc', {
        data,
        id: this.checklistScorecardId,
      })

      // Retrieve Docs
      await this.$store
        .dispatch('checklist/getPartDocs', {
          type: this.moduleTypePayload,
          moduleId: this.module.id,
          part_id: this.partId,
          id: this.checklistScorecardId,
        })
        .then((res) => {
          this.documents = res
          // eslint-disable-next-line
          this.part.document_count = res.length
          // eslint-disable-next-line
          this.part.all_document_count = this.documents.filter(
            (a) => a.doc_status !== 'invalid'
          ).length
          // Get updated doc count
          this.$store.dispatch('checklist/getScores')
        })

      this.$refs.modal.isHidden = true
      this.newDocument = null
      this.modalMode = ''
    },
  },
}
</script>

<style scoped>
.docModal {
  min-width: 550px;
  min-height: 300px;
}
</style>
