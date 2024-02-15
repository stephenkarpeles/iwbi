<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <div v-if="review">
      <div class="w-1/2">
        <WFeedbackModal ref="actionModal" class="z-50" modal-width="lg:w-1/2">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div class="mt-2">
                <div v-if="actionType === 'appeal'">
                  <p class="text-sm text-gray-500">
                    Project teams may (for a fee) challenge any findings in the
                    <span
                      v-if="
                        project.project_phase &&
                        project.project_phase.toLowerCase() ===
                          'precertification decision'
                      "
                      >Final Precertification</span
                    >
                    <span v-else>Documentation Review or Performance</span>
                    Review or submit new features for review by submitting an
                    appeal application. The appeal application allows for the
                    submission of supplementary information and for an
                    additional round of review. Each appeal is applicable to one
                    feature; a separate appeal must be submitted for each
                    feature being challenged. All appeals must be submitted
                    within 180 calendar days after the date of issuance of the
                    WELL report. If the project team is challenging the results
                    from the final Documentation Review or the WELL report, an
                    appeal must provide an explanation of the basis of the
                    appeal and identify any suspected errors. Please confirm
                    that you would like to initiate an appeal.
                  </p>
                  <div class="w-52 ml-auto">
                    <WButtonsBase @click.native="updateReview('appeal')"
                      >Yes, initiate appeal</WButtonsBase
                    >
                  </div>
                </div>
                <div v-if="actionType === 'curative'">
                  <p class="text-sm text-gray-500">
                    Curative action is available to project teams that wish to
                    undertake corrective measures to address unmet performance
                    testing criteria and schedule follow-up performance testing.
                    To pursue a curative action path for any features with unmet
                    requirements, a curative action plan must be submitted
                    within 180 calendar days after issuance of the WELL report.
                    The plan must outline steps for addressing unmet features.
                    Please confirm that you would like to initiate curative
                    action.
                  </p>
                  <div class="w-52 ml-auto">
                    <WButtonsBase @click.native="updateReview('curative')"
                      >Yes, initiate curative action</WButtonsBase
                    >
                  </div>
                </div>
              </div>
            </div>
          </div></WFeedbackModal
        >
      </div>
      <WFeedbackModal ref="deleteModal">
        <div v-if="selectedReview" class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg
              class="h-6 w-6 text-red-600"
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

          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              id="modal-headline"
              class="text-lg leading-6 font-medium text-gray-900"
            >
              Delete Review
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                This action <b>cannot</b> be undone. This will permanently
                delete the <b>{{ selectedReview.phase }}</b
                >.
              </p>
            </div>
          </div>
        </div>
        <div
          class="mt-8 sm:mt-4 space-y-3 md:space-y-0 sm:flex sm:flex-row-reverse justify-between"
        >
          <div>
            <WButtonsBase
              type="danger"
              @click.native="deleteReview(selectedReview.id)"
            >
              I understand the consequences, delete this review!
            </WButtonsBase>
          </div>
          <div>
            <WButtonsBase
              type="primaryInverted"
              @click.native="$refs.deleteModal.isHidden = true"
            >
              Cancel
            </WButtonsBase>
          </div>
        </div>
      </WFeedbackModal>
      <div class="max-w-3xl mx-auto lg:max-w-7xl lg:grid lg:grid-cols-3 mt-4">
        <div class="lg:col-span-2 lg:pr-8 lg:border-r lg:border-gray-200">
          <div>
            <div class="lg:border-b lg:pb-6">
              <div>
                <h1
                  class="text-2xl font-extrabold text-gray-900"
                  v-html="getPhaseName(review.phase)"
                ></h1>
              </div>
              <div
                class="mt-2 md:flex space-x-0 md:space-x-3 space-y-3 md:space-y-0"
              >
                <div v-if="hasAccess">
                  <WButtonsBase
                    icon="pencil"
                    type="primaryInverted"
                    @click.native="$refs.editSlide.toggleOpen()"
                  >
                    Edit
                  </WButtonsBase>
                </div>
                <div v-if="review.status === 'pending' && hasAccess">
                  <WButtonsBase @click.native="$refs.reviewSlide.toggleOpen()">
                    Return Review
                  </WButtonsBase>
                </div>
                <div v-if="review.status === 'mid-review'">
                  <WButtonsBase
                    @click.native="$refs.resubmitModal.isHidden = false"
                  >
                    Re-Submit Review
                  </WButtonsBase>
                </div>
                <div v-if="review.status === 'pending' && hasAccess">
                  <WButtonsBase
                    icon="trash"
                    type="danger"
                    @click.native="promptDelete(review)"
                  >
                    Delete
                  </WButtonsBase>
                </div>
                <div v-if="project.type !== 'v1' && hasAccess">
                  <WButtonsBase
                    icon="download"
                    type="primaryInverted"
                    @click.native="downloadReviewDocuments(review.id)"
                  >
                    Documents
                  </WButtonsBase>
                </div>
                <div
                  v-if="
                    ((project.type === 'v1' &&
                      (review.is_hsr === 1 ||
                        review.phase.indexOf('Health-Safety Review' !== -1))) ||
                      project.type !== 'v1') &&
                    hasAccess
                  "
                  class="-mt-3 sm:-mt-0"
                >
                  <Popover
                    v-if="
                      ((project.type === 'v1' &&
                        (review.is_hsr === 1 ||
                          review.phase.indexOf(
                            'Health-Safety Review' !== -1
                          ))) ||
                        project.type !== 'v1') &&
                      hasAccess
                    "
                    ref="conceptPopover"
                    y="bottom"
                    x="right"
                  >
                    <WButtonsBase type="primaryInverted" icon="download">
                      Report
                    </WButtonsBase>
                    <template #content>
                      <div class="w-40 p-2 space-y-2">
                        <WButtonsBase
                          v-if="
                            project.type !== 'v1' &&
                            review.phase !==
                              'Preliminary Health-Safety Review' &&
                            review.phase !== 'Final Health-Safety Review' &&
                            review.phase !==
                              'Curative Action Health-Safety Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('excel', review.id)"
                        >
                          Excel
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            project.type !== 'v1' &&
                            review.phase !==
                              'Preliminary Health-Safety Review' &&
                            review.phase !== 'Final Health-Safety Review' &&
                            review.phase !==
                              'Curative Action Health-Safety Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('pdf', review.id)"
                        >
                          PDF
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            review.is_hsr ||
                            review.phase.indexOf(
                              'Health-Safety Review' !== -1
                            ) ||
                            review.phase === 'Curative Action Plan Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('hsr-pdf', review.id)"
                        >
                          HSR PDF
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            review.is_hsr ||
                            review.phase.indexOf(
                              'Health-Safety Review' !== -1
                            ) ||
                            review.phase === 'Curative Action Plan Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('hsr-excel', review.id)"
                        >
                          HSR Excel
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            (review.is_hsr === 1 &&
                              review.phase === 'Final Documentation Review') ||
                            review.phase.indexOf(
                              'Health-Safety Review' !== -1
                            ) ||
                            review.phase === 'Curative Action Plan Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="
                            downloadReport('hsr-final-pdf', review.id)
                          "
                        >
                          HSR Final PDF
                        </WButtonsBase>
                      </div>
                    </template>
                  </Popover>
                </div>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') &&
                    (review.phase.includes('Final Precertification') ||
                      review.phase.includes('Performance')) &&
                    project.project_phase &&
                    (project.project_phase.toLowerCase() ===
                      'certification decision' ||
                      project.project_phase.toLowerCase() ===
                        'precertification decision' ||
                      project.project_phase.toLowerCase() ===
                        'curative action plan application' ||
                      project.project_phase.toLowerCase() ===
                        'documentation appeal application' ||
                      project.project_phase.toLowerCase() ===
                        'performance verification appeal application')
                  "
                  class="w-48 mt-2"
                >
                  <WButtonsDropdown
                    ><WButtonsBase
                      :disabled="
                        (project.project_phase &&
                          project.project_phase.toLowerCase() ===
                            'curative action plan application') ||
                        (project.project_phase &&
                          project.project_phase.toLowerCase() ===
                            'documentation appeal application') ||
                        (project.project_phase &&
                          project.project_phase.toLowerCase() ===
                            'performance verification appeal application')
                      "
                      class="h-full"
                      type="primaryInverted"
                    >
                      {{
                        project.project_phase &&
                        (project.project_phase.toLowerCase() ===
                        'curative action plan application'
                          ? 'curative action initiated'
                          : project.project_phase.toLowerCase() ===
                              'documentation appeal application' ||
                            project.project_phase.toLowerCase() ===
                              'performance verification appeal application'
                          ? 'Appeal Initiated'
                          : 'Initiate Action')
                      }}
                    </WButtonsBase>
                    <template #customButtons>
                      <WButtonsBase
                        v-if="
                          project.project_phase &&
                          project.project_phase.toLowerCase() ===
                            'certification decision'
                        "
                        class="leading-3"
                        type="neutral"
                        @click.native="openActionModal('curative')"
                      >
                        Curative action
                      </WButtonsBase>
                      <WButtonsBase
                        class="leading-3"
                        type="neutral"
                        @click.native="openActionModal('appeal')"
                      >
                        Appeal
                      </WButtonsBase>
                    </template>
                  </WButtonsDropdown>
                  <span
                    v-if="
                      (project.project_phase &&
                        project.project_phase.toLowerCase() ===
                          'certification decision') ||
                      (project.project_phase &&
                        project.project_phase.toLowerCase() ===
                          'precertification decision')
                    "
                    class="text-xs text-primary-600 italic"
                    >Action valid before
                    {{
                      $dayjs(review.review_date)
                        .add('180', 'days')
                        .format('MMM DD, YYYY')
                    }}</span
                  >
                </div>
              </div>
            </div>
            <aside class="mt-8 lg:hidden">
              <div
                class="md:flex space-x-0 md:space-x-2 space-y-4 md:space-y-0"
              >
                <div>
                  <span
                    :class="[
                      'text-xs font-medium text-white uppercase p-2 rounded',
                      getStatusColor(),
                    ]"
                    >{{ getStatusName() }}</span
                  >
                </div>
                <div>
                  <span
                    :class="[
                      'text-xs font-medium text-white uppercase p-2 rounded',
                      getPaymentStatus,
                    ]"
                    >{{ review.payment_status }}
                  </span>
                </div>
                <div v-if="review.is_hsr">
                  <span
                    class="text-white text-xs font-medium bg-primary-500 rounded uppercase p-2"
                  >
                    WELL Health-safety</span
                  >
                </div>
              </div>
              <div
                class="mt-6 border-t border-b border-gray-200 py-6 space-y-3"
              >
                <div>
                  <h2 class="text-sm font-bold text-gray-500">Submitted On:</h2>
                  <div class="text-sm font-medium text-gray-900">
                    {{ $dayjs(review.created_at).format('MMM DD, YYYY') }}
                  </div>
                </div>
                <div>
                  <h2 class="text-sm font-bold text-gray-500">
                    Estimated Review Completion Date:
                  </h2>
                  <div class="text-sm font-medium text-gray-900">
                    {{
                      review.est_date
                        ? $dayjs(review.est_date).format('MMM DD, YYYY')
                        : '-'
                    }}
                  </div>
                </div>
              </div>
            </aside>
            <div class="py-3 lg:pt-6 lg:pb-0">
              <div class="max-w-none bg-primary-200 p-4 rounded">
                <h2 class="text-sm font-bold text-gray-500">
                  Project Team Comments:
                </h2>
                <p
                  class="text-sm font-medium text-gray-900"
                  v-html="review.comment"
                ></p>
                <div
                  v-if="
                    review.review_date && review.payment_status !== 'unpaid'
                  "
                >
                  <h2
                    v-if="review.review_comment"
                    class="text-sm font-bold text-gray-500"
                  >
                    Reviewer Comments:
                  </h2>
                  <p
                    v-if="
                      project.project_phase &&
                      project.project_phase.toLowerCase() ===
                        'curative action plan application'
                    "
                    class="text-sm font-medium text-gray-900 mt-3"
                  >
                    To guide you through the next steps, please complete the
                    following form within 180 days after the issuance of the
                    WELL Final Report once the curative actions are planned or
                    completed:
                    <a
                      class="underline text-primary-600"
                      target="_blank"
                      href="https://fs11.formsite.com/qOUDrr/CurativeAction/index.html"
                      >https://fs11.formsite.com/qOUDrr/CurativeAction/index.html</a
                    >. If retesting is required, the project team has the option
                    to elect GBCI to conduct the performance testing or contract
                    with an approved performance testing organization.
                    Additional information regarding the curative action process
                    is available in the WELL Certification Guidebook.
                  </p>
                  <p
                    class="text-sm font-medium text-gray-900"
                    v-html="review.review_comment"
                  ></p>
                  <div
                    v-if="
                      review.project_documents &&
                      review.project_documents.length > 0
                    "
                    class="text-sm mt-3"
                  >
                    <h2 class="text-sm font-bold text-gray-500">
                      Reviewer Documents:
                    </h2>
                    <ul
                      v-if="
                        review.project_documents.filter((a) => a.type !== 'hsr')
                          .length
                      "
                      class="list-disc ml-6"
                    >
                      <li
                        v-for="(
                          review_document, review_index
                        ) in review.project_documents.filter(
                          (a) => a.type !== 'hsr'
                        )"
                        :key="review_index"
                      >
                        <WLinksBase
                          v-if="review_document.type !== 'hsr'"
                          :link="review_document.link_s3_private"
                          target="_blank"
                        >
                          {{ review_document.name }}
                        </WLinksBase>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  v-if="
                    review.is_hsr &&
                    review.hsr_review_comment &&
                    review.status === 'reviewed' &&
                    review.payment_status !== 'unpaid'
                  "
                  class="w-full mt-5 bg-primary-200 rounded-lg p-2"
                >
                  <h2 class="text-sm font-bold text-gray-500">
                    HSR Reviewer Comments:
                  </h2>
                  <p
                    class="text-sm font-medium text-gray-900"
                    v-html="review.hsr_review_comment"
                  ></p>
                  <div
                    v-if="
                      review.project_documents &&
                      review.project_documents.length > 0
                    "
                    class="text-sm mt-3"
                  >
                    <h2 class="text-sm font-bold text-gray-500">
                      HSR Reviewer Documents:
                    </h2>
                    <ul
                      v-if="
                        review.project_documents.filter((a) => a.type === 'hsr')
                          .length
                      "
                      class="list-disc ml-6"
                    >
                      <div
                        v-for="(
                          review_document, review_index
                        ) in review.project_documents.filter(
                          (a) => a.type === 'hsr'
                        )"
                        :key="review_index"
                      >
                        <li>
                          <WLinksBase
                            :link="review_document.link_s3_private"
                            target="_blank"
                          >
                            {{ review_document.name }}
                          </WLinksBase>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
                <div
                  v-if="
                    review.review_date && review.payment_status !== 'unpaid'
                  "
                  class="mt-4"
                >
                  <h2 class="text-sm font-bold text-gray-500">Reviewed On:</h2>
                  <div class="text-sm font-medium text-gray-900">
                    {{ $dayjs(review.review_date).format('MMM DD, YYYY') }}
                  </div>
                </div>
                <div
                  v-if="review.is_hsr && review.hsr_review_date"
                  class="mt-4"
                >
                  <h2 class="text-sm font-bold text-gray-500">
                    HSR Reviewed On:
                  </h2>
                  <div class="text-sm font-medium text-gray-900">
                    {{ $dayjs(review.hsr_review_date).format('MMM DD, YYYY') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section
            v-if="review.project_review_notes.length"
            class="mt-8 lg:mt-10"
          >
            <div class="divide-y divide-gray-200">
              <div class="pb-4">
                <h2 class="text-lg font-bold text-gray-800">Comments</h2>
              </div>
              <div class="pt-6">
                <div class="flow-root">
                  <ul role="list" class="-mb-8">
                    <li
                      v-for="(note, index) in review.project_review_notes"
                      :key="index"
                    >
                      <div class="relative pb-8">
                        <span
                          v-if="
                            index !== review.project_review_notes.length - 1
                          "
                          class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                        <div class="relative flex items-start space-x-3">
                          <div class="relative">
                            <img
                              class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                              src="/profile/avatar.jpg"
                              alt=""
                            />

                            <span
                              class="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px"
                            >
                              <WIconsBase
                                icon="chat-alt"
                                class="text-gray-500"
                              />
                            </span>
                          </div>
                          <div class="min-w-0 flex-1">
                            <div>
                              <div class="text-sm flex justify-between">
                                <h4 class="text-sm font-bold text-gray-900">
                                  {{ note.user_name }}
                                </h4>
                                <div
                                  v-if="currentUser.role.includes('well-admin')"
                                  class="ml-auto flex"
                                >
                                  <WIconsBase
                                    icon="trash"
                                    class="text-red-500 hover:text-red-700 cursor-pointer"
                                    @click.native="deleteNote(note)"
                                  />
                                </div>
                              </div>
                              <p
                                class="mt-0.5 text-sm font-light text-gray-500"
                              >
                                Commented
                                {{ commentedDate(note.created_at) }}
                                ago
                              </p>
                            </div>
                            <div class="mt-2 text-sm text-gray-600 leading-6">
                              <p v-html="note.note"></p>
                            </div>
                            <div
                              v-if="note.documents && note.documents.length > 0"
                              class="mt-2 text-sm"
                            >
                              <h6 class="font-medium text-gray-900">
                                Documents:
                              </h6>
                              <ul class="list-disc ml-6">
                                <li
                                  v-for="(
                                    note_document, note_index
                                  ) in note.documents"
                                  :key="note_index"
                                >
                                  <WLinksBase
                                    :link="note_document.link_s3_private"
                                    target="_blank"
                                  >
                                    {{ note_document.name }}
                                  </WLinksBase>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <div v-if="review.status === 'mid-review'" class="mt-6">
            <div class="flex space-x-3">
              <div class="flex-shrink-0">
                <div class="relative">
                  <img
                    class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                    :src="
                      $store.state.user.currentUser.profile_pic !== null
                        ? $store.state.user.currentUser.profile_pic
                        : '/profile/avatar.jpg'
                    "
                    :alt="
                      $store.state.user.currentUser.profile_pic !== null
                        ? $store.state.user.currentUser.profile_pic
                        : 'avatar.jpg'
                    "
                  />
                  <span
                    class="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px"
                  >
                    <WIconsBase icon="chat-alt" class="text-gray-500" />
                  </span>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <FormulateForm @submit="addNote()">
                  <ClientOnly>
                    <FormulateInput
                      :key="forceReMount"
                      v-model="noteData.note"
                      type="richtext"
                      validation="required"
                      class="mb-4"
                    />
                    <FormulateInput
                      :key="forceReMount + 1"
                      v-model="noteData.documents"
                      label="Documents"
                      :value="[]"
                      type="fileupload"
                      :upload-path="`project/${project.project_number}/review/`"
                      mime-types=""
                    />
                  </ClientOnly>
                  <div class="flex justify-end mt-2">
                    <FormulateInput label="Add Comment" type="submit" />
                  </div>
                </FormulateForm>
              </div>
            </div>
          </div>
        </div>
        <aside class="hidden lg:block lg:pl-8">
          <div class="flex space-x-2">
            <div>
              <span
                :class="[
                  'text-xs font-medium text-white uppercase p-2 rounded',
                  getStatusColor(),
                ]"
                >{{ getStatusName() }}</span
              >
            </div>
            <div v-if="!review.phase.includes('Performance Review')">
              <span
                :class="[
                  'text-xs font-medium text-white uppercase p-2 rounded',
                  getPaymentStatus,
                ]"
                >{{ review.payment_status }}
              </span>
            </div>
            <div v-if="review.is_hsr">
              <span
                class="text-white text-xs font-medium bg-primary-500 rounded uppercase p-2"
              >
                WELL Health-safety</span
              >
            </div>
          </div>
          <div class="mt-6 border-t border-gray-200 py-6 space-y-3">
            <div>
              <h2 class="text-sm font-bold text-gray-500">Submitted On:</h2>
              <div class="text-sm font-medium text-gray-900">
                {{ $dayjs(review.created_at).format('MMM DD, YYYY') }}
              </div>
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-500">
                Estimated Review Completion Date:
              </h2>
              <div class="text-sm font-medium text-gray-900">
                {{
                  review.est_date
                    ? $dayjs(review.est_date).format('MMM DD, YYYY')
                    : '-'
                }}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <!-- resubmitModal modal start here -->
      <WFeedbackModal ref="resubmitModal">
        <div class="md:w-96">
          <WHeadingsHThree
            class="text-primary-700"
            heading="Re-Submit Review"
          />
          <div>
            <FormulateForm @submit="resubmitReview()">
              <FormulateInput
                v-model="resubmitData.note"
                type="textarea"
                name="Note"
                label="Please provide your comments below to notify the IWBI team"
                validation="required"
              />
              <div class="flex justify-end mt-2">
                <FormulateInput label="Submit" type="submit" />
              </div>
            </FormulateForm>
          </div>
        </div>
      </WFeedbackModal>
      <!-- editSlide modal satrt here -->
      <WSlideoversOverlay ref="editSlide" title="Edit Review" class="z-50">
        <template #content>
          <div>
            <ProjectReviewEditScreen :review="review" />
          </div>
        </template>
      </WSlideoversOverlay>
      <!-- reviewSlide modal start here -->
      <WSlideoversOverlay ref="reviewSlide" title="Return Review" class="z-50">
        <template #content>
          <div>
            <ProjectReviewReturnScreen :review="review" />
          </div>
        </template>
      </WSlideoversOverlay>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    allReviews: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      forceReMount: 0,
      actionType: '',
      review: '',
      expanded: false,
      selectedReview: null,
      noteData: {
        documents: [],
        note: '',
      },
      resubmitData: {
        note: '',
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
    }),
    getPaymentStatus() {
      if (this.review.payment_status === 'paid') {
        return 'bg-green-500'
      } else {
        return 'bg-red-500'
      }
    },
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel !== 'project-admin' &&
        this.accessLevel !== 'project-manager' &&
        (this.currentUser.role.includes('external-reviewer') ||
          this.currentUser.role.includes('well-accessor'))
      ) {
        return true
      }
      return false
    },
    accessLevel() {
      let level = false

      if (this.project) {
        level = this.project.members.find(
          (member) => member.id === this.currentUser.id
        )
      }

      if (level) {
        return level.pivot.role
      }
      return false
    },
  },
  mounted() {
    this.getReviewDetails()
  },
  methods: {
    updateReview(type) {
      const projectPhase = this.review.phase.includes('Final Precertification')
        ? 'Documentation Appeal Application'
        : type === 'appeal'
        ? 'Performance Verification Appeal Application'
        : 'Curative Action Plan Application'
      const data = {
        comment: this.review.comment,
        est_date: this.review.est_date,
        general_observation: this.review.general_observation,
        general_observation_concepts: this.review.general_observation_concepts,
        status: this.review.status,
        review_comment: this.review.review_comment,
        review_date: this.review.review_date,
        recert_id: this.review.recert_id,
        phase: this.review.phase,
        hsr_review_date: this.review.hsr_review_date,
        hsr_review_comment: this.review.hsr_review_comment,
        hsr_phase: this.review.hsr_phase,
        project_phase: projectPhase,
        project_id: this.project.id,
        id: this.review.id,
        payment_status: this.review.payment_status,
      }
      this.$store.dispatch('review/updateReview', data).then((res) => {
        this.$store.dispatch('review/getReviewList', this.project.id)
        this.$store.dispatch(
          'project/getProjectByNumber',
          this.project.project_number
        )
      })
      this.actionType = ''
      this.$refs.actionModal.isHidden = true
    },
    openActionModal(type) {
      this.actionType = type
      this.$refs.actionModal.isHidden = false
    },
    commentedDate(cDate) {
      if (cDate) {
        const oldDate = this.$dayjs(cDate)
        const currentDate = this.$dayjs()

        if (
          currentDate.diff(oldDate, 'ms') >= 0 &&
          currentDate.diff(oldDate, 'ms') <= 999
        ) {
          return currentDate.diff(oldDate, 'ms')
        } else if (
          currentDate.diff(oldDate, 's') >= 0 &&
          currentDate.diff(oldDate, 's') <= 59
        ) {
          return currentDate.diff(oldDate, 's') <= 9
            ? currentDate.diff(oldDate, 's') + ' second'
            : currentDate.diff(oldDate, 's') + ' seconds'
        } else if (
          currentDate.diff(oldDate, 'm') > 0 &&
          currentDate.diff(oldDate, 'm') <= 59
        ) {
          return currentDate.diff(oldDate, 'm') <= 9
            ? currentDate.diff(oldDate, 'm') + ' minute'
            : currentDate.diff(oldDate, 'm') + ' minutes'
        } else if (
          currentDate.diff(oldDate, 'h') >= 0 &&
          currentDate.diff(oldDate, 'h') <= 23
        ) {
          return currentDate.diff(oldDate, 'h') <= 1
            ? currentDate.diff(oldDate, 'h') + ' hour'
            : currentDate.diff(oldDate, 'h') + ' hours'
        } else if (currentDate.diff(oldDate, 'y') === 0) {
          return currentDate.diff(oldDate, 'd') <= 1
            ? currentDate.diff(oldDate, 'd') + ' day'
            : currentDate.diff(oldDate, 'd') + ' days'
        } else {
          return currentDate.diff(oldDate, 'y') <= 1
            ? currentDate.diff(oldDate, 'y') + ' year'
            : currentDate.diff(oldDate, 'y') + ' years'
        }
      }
    },
    async resubmitReview() {
      await this.$store.dispatch('review/resubmitReview', {
        project_id: this.project.id,
        review_id: this.review.id,
        note: this.resubmitData.note,
      })
      await this.getReviewDetails()
      this.$refs.resubmitModal.isHidden = true
    },
    async deleteNote(note) {
      await this.$store.dispatch('review/deleteNote', {
        project_id: this.project.id,
        review_id: this.review.id,
        note_id: note.id,
      })
      await this.getReviewDetails()
    },
    async addNote() {
      const data = { ...this.noteData }
      // format documents object for laravel controller
      data.documents = data.documents.map(function (file) {
        const fileInfo = { link_s3: file.url }
        return fileInfo
      })
      data.project_id = this.project.id
      data.review_id = this.review.id
      await this.$store.dispatch('review/addNote', data)
      await this.getReviewDetails()
      this.noteData = {
        documents: [],
        note: '',
      }
      this.forceReMount++
      this.forceReMount++
    },
    getReviewDetails() {
      this.$axios
        .get('api/project-review/' + this.project.id + '/' + this.id)
        .then((response) => {
          this.review = response.data
        })
    },
    getPhaseName(value) {
      let val = ''
      if (value === 'pre') {
        val = 'Preliminary Review'
      } else if (value === 'd&o') {
        val = 'D&O Review'
      } else if (value === 'd&o-pre') {
        val = 'Preliminary Design and Operations Review'
      } else if (value === 'd&o-final') {
        val = 'Final Design and Operations Review'
      } else if (value === 'final') {
        val = 'Final Review'
      } else if (value === 'pv') {
        val = 'Performance Verification'
      } else if (value === 'HSR Review') {
        val = 'WELL Health-Safety Review'
      } else {
        val = value
      }
      return val
    },
    getStatusColor() {
      if (this.review.status === 'pending') {
        return 'bg-yellow-400'
      } else if (this.review.status === 'mid-review') {
        return 'bg-primary-500'
      } else if (this.review.status === 'reviewed') {
        return 'bg-green-500'
      } else {
        return 'bg-red-600'
      }
    },
    getStatusName() {
      if (this.review.status === 'pending') {
        return 'In Progress'
      } else if (this.review.status === 'mid-review') {
        return 'Require Clarification'
      } else if (this.review.status === 'reviewed') {
        return 'Reviewed'
      } else {
        return 'Payment Pending'
      }
    },
    downloadReport(type, reviewId) {
      const payload = {
        type: 'project',
        doctype: type,
        rId: reviewId,
        pId: this.project.id,
      }
      this.$store.dispatch('review/downloadReport', payload)
    },
    downloadReviewDocuments(reviewId) {
      const payload = {
        type: 'project',
        rId: reviewId,
        pId: this.project.id,
        phase: null,
      }
      this.$store.dispatch('review/downloadReviewDocument', payload)
      this.$refs.alert.showAlert(
        'success',
        'You will receive download link via email.'
      )
    },
    promptDelete(review) {
      this.selectedReview = { ...review }
      this.$refs.deleteModal.isHidden = false
    },
    deleteReview(id) {
      this.$axios
        .delete(`api/admin/project-review/${this.project.id}/${id}/delete`)
        .then((response) => {
          this.$store.dispatch('review/getReviewList', this.project.id)
          this.$parent.showreviewdetails = true
        })
    },
    async acceptCertification() {
      await this.$axios.post(
        `api/project/${this.project.id}/review/${this.review.id}/accept`
      )
      await this.getReviewDetails()
    },
  },
}
</script>
