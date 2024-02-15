<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <!-- finalReview modal start here -->
    <WFeedbackModal ref="finalReview">
      <div class="max-w-2xl">
        <div class="flex justify-between bg-primary-800 text-white">
          <div class="p-4">
            <p class="text-xl font-bold">
              {{
                finalReviewType === 'Initiate'
                  ? 'Initiate Final Review'
                  : 'Accept as Final Response'
              }}
            </p>
            <span v-if="finalReviewType === 'Accept'">
              You confirm to skip final review and accept preliminary results as
              final.
            </span>
          </div>
          <div class="p-4">
            <WButtonsBase
              icon="x-circle"
              type="blank"
              @click.native="$refs.finalReview.isHidden = true"
            />
          </div>
        </div>
        <div>
          <FormulateForm
            class="space-y-6 max-w-4xl mx-auto my-5 border rounded-md p-5"
            @submit="updateFinalReview"
          >
            <div class="mb-5">
              <FormulateInput
                v-model="formData.docSubComments"
                type="textarea"
                label="Please provide your comments below to notify the IWBI team"
                validation="required"
              />
            </div>

            <div class="flex justify-between">
              <div>
                <FormulateInput
                  v-if="!isSubmitting"
                  type="submit"
                  label="Submit"
                />
                <WButtonsBase v-else :type="'primaryInverted'">
                  <span>
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                </WButtonsBase>
              </div>
            </div>
          </FormulateForm>
        </div>
      </div>
    </WFeedbackModal>
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
          Are you sure you want to delete this review? This action can not be
          undone
        </div>
        <div
          class="md:flex justify-between space-x-0 md:space-x-5 space-y-3 md:space-y-0"
        >
          <div class="md:w-24">
            <WButtonsBase
              type="primaryInverted"
              @click.native="$refs.deleteReviewModal.isHidden = true"
            >
              Cancel
            </WButtonsBase>
          </div>
          <WButtonsBase
            type="danger"
            @click.native="deleteReview(selectedReview.id)"
          >
            <WLoadingSpinner
              v-if="deleteInProgress"
              type="button"
              class="mx-auto"
            />
            <span v-else>
              I understand the consequences, delete this review.
            </span>
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <div v-if="review">
      <div class="max-w-3xl mx-auto mt-4 lg:max-w-7xl lg:grid lg:grid-cols-3">
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
                <div v-if="review.status === 'pre-reviewed'">
                  <WButtonsBase
                    type="primary"
                    @click.native="
                      finalReviewType = 'Initiate'
                      $refs.finalReview.isHidden = false
                    "
                  >
                    Initiate Final Review
                  </WButtonsBase>
                </div>
                <div v-if="review.status === 'pending' && hasAccess">
                  <WButtonsBase @click.native="$refs.reviewSlide.toggleOpen()">
                    {{
                      `Return ${
                        review.pre_status ? 'Final' : 'Preliminary'
                      } Response`
                    }}
                  </WButtonsBase>
                </div>
                <div v-if="review.status === 'mid-review'">
                  <WButtonsBase
                    @click.native="$refs.resubmitModal.isHidden = false"
                  >
                    Re-Submit Review
                  </WButtonsBase>
                </div>
                <div v-if="hasAccess">
                  <WButtonsBase
                    icon="trash"
                    type="danger"
                    @click.native="
                      () => {
                        $refs.deleteReviewModal.isHidden = false
                        selectedReview = { ...review }
                      }
                    "
                  >
                    Delete
                  </WButtonsBase>
                </div>
                <div v-if="currentUser.role.includes('well-admin')">
                  <WButtonsBase
                    icon="download"
                    type="primaryInverted"
                    @click.native="downloadReviewFile"
                  >
                    Download Review File
                  </WButtonsBase>
                </div>
              </div>
            </div>
            <aside class="mt-8 lg:hidden">
              <div
                class="md:flex space-x-0 space-y-4 md:space-y-0 md:space-x-2"
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
                <div v-if="review.status !== 'reviewed'">
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
              <div class="max-w-none">
                <div class="bg-primary-200 p-4 rounded">
                  <!-- Preliminary section start here -->
                  <h2 class="text-sm font-bold text-gray-500">
                    Project Team Preliminary Review Comments:
                  </h2>
                  <p
                    class="text-sm font-medium text-gray-900"
                    v-html="review.comment"
                  ></p>
                  <div v-if="review.review_comment">
                    <h2 class="text-sm font-bold text-gray-500">
                      Preliminary Reviewer Comments:
                    </h2>
                    <p
                      class="text-sm font-medium text-gray-900"
                      v-html="review.review_comment"
                    ></p>
                    <div
                      v-if="
                        review.documents.filter((a) => a.type === 'pre').length
                      "
                    >
                      <h2 class="text-sm font-bold text-gray-500">
                        Preliminary Reviewer Documents:
                      </h2>
                      <ul class="list-disc ml-6">
                        <li
                          v-for="document in review.documents.filter(
                            (a) => a.type === 'pre'
                          )"
                          :key="document.id"
                          class="flex"
                        >
                          <WIconsBase icon="paper-clip" type="primary" />
                          <WLinksBase
                            class="underline text-sm"
                            :link="document.link_s3_private"
                            target="_blank"
                          >
                            {{ document.name }}
                          </WLinksBase>
                        </li>
                      </ul>
                    </div>
                    <div v-if="review.review_date" class="mt-4">
                      <h2 class="text-sm font-bold text-gray-500">
                        Preliminary Reviewed On:
                      </h2>
                      <div class="text-sm font-medium text-gray-900">
                        {{ $dayjs(review.review_date).format('MMM DD, YYYY') }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="review.status === 'pre-reviewed'"
                    class="w-36 my-4"
                  >
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        finalReviewType = 'Accept'
                        $refs.finalReview.isHidden = false
                      "
                    >
                      Accept as Final
                    </WButtonsBase>
                  </div>
                </div>
                <div
                  v-if="review.final_comment"
                  class="bg-primary-200 p-4 mt-5 rounded"
                >
                  <!-- final section start here-->
                  <div v-if="review.final_comment">
                    <h2 class="text-sm font-bold text-gray-500">
                      Project Team Final Review Comments:
                    </h2>
                    <p
                      class="text-sm font-medium text-gray-900"
                      v-html="review.final_comment"
                    ></p>
                    <div v-if="review.final_review_comment">
                      <h2 class="text-sm font-bold text-gray-500">
                        Final Reviewer Comments:
                      </h2>
                      <p
                        class="text-sm font-medium text-gray-900"
                        v-html="review.final_review_comment"
                      ></p>
                    </div>
                    <div
                      v-if="
                        review.documents.filter((a) => a.type === 'final')
                          .length
                      "
                    >
                      <h2 class="text-sm font-bold text-gray-500">
                        Final Reviewer Documents:
                      </h2>
                      <ul class="list-disc ml-6">
                        <li
                          v-for="document in review.documents.filter(
                            (a) => a.type === 'final'
                          )"
                          :key="document.id"
                          class="flex"
                        >
                          <WIconsBase icon="paper-clip" type="primary" />
                          <WLinksBase
                            class="underline text-sm"
                            :link="document.link_s3_private"
                            target="_blank"
                          >
                            {{ document.name }}
                          </WLinksBase>
                        </li>
                      </ul>
                    </div>
                    <div v-if="review.final_review_date" class="mt-4">
                      <h2 class="text-sm font-bold text-gray-500">
                        Final Reviewed On:
                      </h2>
                      <div class="text-sm font-medium text-gray-900">
                        {{
                          $dayjs(review.final_review_date).format(
                            'MMM DD, YYYY'
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section v-if="review.notes.length" class="mt-8 lg:mt-10">
            <div class="divide-y divide-gray-200">
              <div class="pb-4">
                <h2 class="text-lg font-bold text-gray-800">Comments</h2>
              </div>
              <div class="pt-6">
                <div class="flow-root">
                  <ul role="list" class="-mb-8">
                    <li v-for="(note, index) in review.notes" :key="index">
                      <div class="relative pb-8">
                        <span
                          v-if="index !== review.notes.length - 1"
                          class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                        <div class="relative flex items-start space-x-3">
                          <div class="relative">
                            <img
                              class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                              :src="
                                note.user_profile_pic
                                  ? note.user_profile_pic
                                  : '/profile/avatar.jpg'
                              "
                              :alt="
                                note.user_profile_pic
                                  ? note.user_profile_pic
                                  : 'avatar.jpg'
                              "
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
                                <div>
                                  <WIconsBase
                                    v-if="
                                      currentUser.role.includes('well-admin')
                                    "
                                    icon="trash"
                                    class="ml-auto flex text-red-500 hover:text-red-700 cursor-pointer"
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
                              <p v-html="note.description"></p>
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
                                  class="flex"
                                >
                                  <WIconsBase
                                    icon="paper-clip"
                                    type="primary"
                                  />
                                  <WLinksBase
                                    :link="note_document.link_s3_private"
                                    target="_blank"
                                    class="underline text-sm"
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
                      v-model="noteData.description"
                      type="richtext"
                      class="text-primary-900 mb-4"
                      validation="required"
                    />
                    <FormulateInput
                      :key="forceReMount + 1"
                      v-model="noteData.documents"
                      label="Documents"
                      :value="[]"
                      type="fileupload"
                      :upload-path="`portfolio/${portfolio.portfolio_number}/review/`"
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
          <div class="xl:flex xl:space-x-2 space-y-4 xl:space-y-0">
            <div
              :class="[
                'text-xs font-medium text-white uppercase p-2 rounded text-center',
                getStatusColor(),
              ]"
            >
              {{ getStatusName() }}
            </div>
            <div
              v-if="review.is_hsr"
              class="text-white text-xs font-medium bg-primary-500 rounded uppercase p-2 text-center"
            >
              WELL Health-safety
            </div>
          </div>
          <div class="mt-6 border-t border-gray-200 py-6 space-y-3">
            <div>
              <h2 class="text-sm font-bold text-gray-500">Submitted On:</h2>
              <div class="text-sm font-medium text-gray-900">
                {{ $dayjs(review.created_at).format('MMM DD, YYYY') }}
              </div>
            </div>
            <div v-if="review.status !== 'reviewed'">
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
    </div>
    <div v-else class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading a review...Please wait.</div>
    </div>
    <!-- resubmitModal modal start here -->
    <WFeedbackModal ref="resubmitModal">
      <div class="md:w-96">
        <WHeadingsHThree
          class="text-primary-700"
          :heading="
            review.pre_status
              ? 'Final Re-Submit Review'
              : 'Preliminary Re-Submit Review'
          "
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
    <!-- editSlide modal start here -->
    <WSlideoversOverlay ref="editSlide" title="Edit Review" class="z-50">
      <template #content>
        <div>
          <PortfolioReviewEditScreen :review="review" />
        </div>
      </template>
    </WSlideoversOverlay>
    <!-- reviewSlide modal start here -->
    <WSlideoversOverlay
      ref="reviewSlide"
      :title="
        review.pre_status ? 'Final Return Review' : 'Preliminary Return Review'
      "
      class="z-50"
    >
      <template #content>
        <div>
          <PortfolioReviewReturnScreen :review="review" />
        </div>
      </template>
    </WSlideoversOverlay>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      forceReMount: 0,
      selectedReview: null,
      formData: {
        docSubComments: '',
      },
      isSubmitting: false,
      finalReviewType: '',
      review: '',
      hsrAchievedDate: '',
      generalObservations: '',
      showEdit: false,
      paymentStatus: '',
      deleteInProgress: false,
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
      portfolio: (state) => state.portfolio.portfolio,
    }),
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel !== 'portfolio-admin' &&
        this.accessLevel !== 'portfolio-manager' &&
        (this.currentUser.role.includes('external-reviewer') ||
          this.currentUser.role.includes('well-accessor'))
      ) {
        return true
      }
      return false
    },
    accessLevel() {
      let level = false

      if (this.portfolio) {
        level = this.portfolio.members.find(
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
    if (this.portfolio && this.portfolio.id) {
      this.getReviewDetails()
    }
  },
  methods: {
    commentedDate(cDate) {
      if (cDate) {
        const utc = require('dayjs/plugin/utc')
        this.$dayjs.extend(utc)
        const oldDate = this.$dayjs(cDate).utc(true)
        oldDate.format()
        oldDate.local().format()
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
      const formData = JSON.parse(JSON.stringify(this.review))
      formData.status = 'pending'
      formData.portfolio_id = this.portfolio.id
      formData.notes = []
      formData.notes.push({
        communication_type: 'other',
        description: this.resubmitData.note,
      })
      await this.$store.dispatch('review/updatePortfolioReview', formData)
      await this.getReviewDetails()
      this.$refs.resubmitModal.isHidden = true
    },
    async deleteNote(note) {
      await this.$store.dispatch('review/deleteSharedNote', {
        project_id: this.portfolio.id,
        review_id: this.review.id,
        note_id: note.id,
      })
      await this.getReviewDetails()
    },
    downloadDocuments(payload) {},

    downloadReviewFile() {
      this.$store
        .dispatch('portfolio/downloadReview', this.portfolio.id)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: response.data.msg,
          })
        })
        .catch((err) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: err.response.data.msg,
          })
        })
    },

    async addNote() {
      const data = { ...this.noteData, communication_type: 'other' }

      if (!this.noteData.description && this.resubmitData.note) {
        data.description = this.resubmitData.note
      }
      // format documents object for laravel controller
      data.documents = data.documents.map(function (file) {
        const fileInfo = { link_s3: file.url }
        return fileInfo
      })
      data.project_id = this.portfolio.id
      data.review_id = this.review.id
      try {
        const res = await this.$store.dispatch('review/addSharedNote', data)
        if (res.status === 200) {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Added new comment!',
          })
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.msg,
        })
      }

      await this.getReviewDetails()
      this.noteData = {
        documents: [],
        description: '',
      }
      this.forceReMount++
      this.forceReMount++
    },
    getReviewDetails() {
      this.$axios
        .get('api/portfolio/' + this.portfolio.id + '/review/' + this.id)
        .then((response) => {
          this.review = response.data
          this.generalObservations = response.data.general_observation
          this.review.hsr_status = this.portfolio.hsr_status
          this.paymentStatus = response.data.payment_status
        })
    },
    hasDateOrNull(val) {
      return this.$dayjs(val).isValid()
        ? this.$dayjs(val).format('YYYY-MM-DD')
        : null
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
      } else if (
        this.review.status === 'reviewed' ||
        this.review.status === 'pre-reviewed'
      ) {
        return 'bg-green-500'
      } else {
        return 'bg-red-600'
      }
    },
    getStatusName() {
      if (this.review.status === 'pending') {
        return this.review.pre_status
          ? 'Final Review In Progress'
          : 'Preliminary Review In Progress'
      } else if (this.review.status === 'mid-review') {
        return 'Require Clarification'
      } else if (this.review.status === 'reviewed') {
        return 'Final Review Completed'
      } else if (this.review.status === 'pre-reviewed') {
        return 'Preliminary Review Completed'
      } else {
        return 'Payment Pending'
      }
    },
    deleteComment(commentId) {
      this.$axios
        .delete(
          'api/portfolio-review/' +
            this.portfolio.id +
            '/' +
            this.review.id +
            '/note/' +
            commentId
        )
        .then((response) => {
          this.getReviewDetails()
          this.$refs.alert.showAlert(
            'success',
            'Review comment deleted successfully.'
          )
        })
    },
    downloadReport(type, reviewId) {
      const payload = {
        type: 'portfolio',
        doctype: type,
        rId: reviewId,
        pId: this.portfolio.id,
      }
      this.$store.dispatch('review/downloadReport', payload)
    },
    downloadReviewDocuments(reviewId) {
      const payload = {
        type: 'portfolio',
        rId: reviewId,
        pId: this.portfolio.id,
        phase: null,
      }
      this.$store.dispatch('review/downloadReviewDocument', payload)
      this.$refs.alert.showAlert(
        'success',
        'You will receive download link via email.'
      )
    },
    updateFinalReview() {
      this.isSubmitting = true
      const data = { ...this.review }
      data.documents = this.review.documents
        ? this.review.documents.map((e) => {
            return { link_s3: e.link_s3, type: e.type }
          })
        : []
      data.general_observation = this.review.general_observation
      data.hsr_achieved_date = this.review.hsr_achieved_date
      data.hsr_status = this.review.hsr_status
      data.phase = this.review.phase
      data.status = 'pending'
      data.final_comment = this.formData.docSubComments
      if (this.finalReviewType === 'Initiate') {
        data.pre_as_final = 0
      } else {
        data.pre_as_final = 1
      }
      data.notes = []
      data.id = this.review.id
      data.portfolio_id = this.portfolio.id
      this.$store
        .dispatch('review/updatePortfolioReview', data)
        .then((response) => {
          this.isSubmitting = false
          this.formData.docSubComments = ''
          this.finalReviewType = ''
          this.$refs.finalReview.isHidden = true
          this.$store.dispatch('portfolio/getPortfolio', {
            id: this.$route.params.id,
          })
          this.getReviewDetails()
        })
    },
    deleteReview(id) {
      this.deleteInProgress = true
      this.$axios
        .delete(`api/portfolio/${this.portfolio.id}/review/${id}`)
        .then((response) => {
          this.$store.dispatch('review/getReviewList', this.portfolio.id)
          this.$router.push(
            `/portfolio/${this.portfolio.portfolio_number}/reviews`
          )
          this.deleteInProgress = false
        })
    },
  },
}
</script>
