<template>
  <div>
    <WFeedbackAlert ref="alert" />
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
              <div class="mt-2 flex space-x-3">
                <!-- Edit button start here -->
                <!-- <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('well-assessor') ||
                    currentUser.role.includes('external-reviewer')
                  "
                >
                  <WButtonsBase
                    icon="pencil"
                    type="primaryInverted"
                    @click.native="$refs.editSlide.toggleOpen()"
                  >
                    Edit
                  </WButtonsBase>
                </div> -->

                <!-- Documents button start here -->
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('external-reviewer') ||
                    currentUser.role.includes('well-assessor')
                  "
                >
                  <WButtonsBase
                    icon="download"
                    type="primaryInverted"
                    @click.native="downloadReviewDocuments(review.id)"
                  >
                    Documents
                  </WButtonsBase>
                </div>
                <!-- Report button start here -->
                <div>
                  <Popover
                    v-if="
                      project.v1_project_standard !== 'community' &&
                      (currentUser.role.includes('well-admin') ||
                        currentUser.role.includes('external-reviewer') ||
                        currentUser.role.includes('well-assessor'))
                    "
                    ref="conceptPopover"
                    y="bottom"
                    x="right"
                  >
                    <WButtonsBase type="primaryInverted" icon="download">
                      Report
                    </WButtonsBase>
                    <template #content>
                      <div class="w-64 p-2 space-y-2">
                        <WButtonsBase
                          v-if="project.type !== 'v2-hsr'"
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('excel', review.id)"
                        >
                          Excel
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="project.type !== 'v2-hsr'"
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('pdf', review.id)"
                        >
                          PDF
                        </WButtonsBase>
                        <WButtonsBase
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('hsr-pdf', review.id)"
                        >
                          HSR Appendix PDF
                        </WButtonsBase>
                        <WButtonsBase
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('hsr-excel', review.id)"
                        >
                          HSR Appendix Excel
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            review.phase.indexOf(
                              'Final Health-Safety Review' !== -1
                            ) ||
                            review.phase === 'Curative Action Plan Review' ||
                            review.phase === 'Preliminary Health-Safety Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="
                            downloadReport('hsr-final-pdf', review.id)
                          "
                        >
                          Final HSR PDF (SQFT)
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            review.phase.indexOf(
                              'Final Health-Safety Review' !== -1
                            ) ||
                            review.phase === 'Curative Action Plan Review' ||
                            review.phase === 'Preliminary Health-Safety Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="
                            downloadReport('hsr-final-pdf', review.id, sqm)
                          "
                        >
                          Final HSR PDF (SQM)
                        </WButtonsBase>
                        <WButtonsBase
                          v-if="
                            (project.type !== 'v2-hsr' &&
                              review.phase === 'Final Documentation Review') ||
                            review.phase === 'Curative Action Plan Review' ||
                            review.phase ===
                              'Curative Action Health-Safety Review' ||
                            review.phase === 'Preliminary Health-Safety Review'
                          "
                          type="subNav"
                          class="bg-white text-black"
                          @click.native="downloadReport('final-pdf', review.id)"
                        >
                          HSR Final PDF
                        </WButtonsBase>
                      </div>
                    </template>
                  </Popover>
                </div>
              </div>
            </div>
            <aside class="mt-8 lg:hidden">
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
                <div>
                  <span
                    :class="[
                      'text-xs font-medium text-white uppercase p-2 rounded',
                      getPaymentStatus,
                    ]"
                  >
                    <strong class="uppercase">{{
                      review.payment_status
                    }}</strong>
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
                <div v-if="review.review_comment">
                  <h2 class="text-sm font-bold text-gray-500">
                    Reviewer Comments:
                  </h2>
                  <div
                    class="mb-5 text-sm font-medium text-gray-900"
                    v-html="review.review_comment"
                  ></div>
                  <div
                    v-if="review.documents && review.documents.length > 0"
                    class="text-sm mt-3"
                  >
                    <h2 class="text-sm font-bold text-gray-500">
                      Reviewer Documents:
                    </h2>
                    <ul class="list-disc ml-6">
                      <li
                        v-for="(
                          review_document, review_index
                        ) in review.documents"
                        :key="review_index"
                      >
                        <WLinksBase
                          :link="review_document.link_s3_private"
                          target="_blank"
                        >
                          {{ review_document.name }}
                        </WLinksBase>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="review.review_date" class="mt-4">
                  <h2 class="text-sm font-bold text-gray-500">Reviewed On:</h2>
                  <div class="text-sm font-medium text-gray-900">
                    {{ $dayjs(review.review_date).format('MMM DD, YYYY') }}
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
                              <p v-html="note.description"></p>
                            </div>
                            <div
                              v-if="note.documents && note.documents.length > 0"
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
                      v-model="noteData.description"
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
                      :upload-path="`portfolio/${project.portfolio_number}/review/`"
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
            <div>
              <span
                :class="[
                  'text-xs font-medium text-white uppercase p-2 rounded',
                  getPaymentStatus,
                ]"
              >
                <strong class="uppercase">{{ review.payment_status }}</strong>
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
        <div class="w-96">
          <WHeadingsHThree
            class="text-primary-700"
            heading="Re-Submit Review"
          />
          <div>
            <FormulateForm @submit="resubmitReview()">
              <FormulateInput
                v-model="resubmitData.note"
                type="richtext"
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
            <SharedReviewEditScreen :review="review" />
          </div>
        </template>
      </WSlideoversOverlay>
      <!-- reviewSlide modal start here -->
      <WSlideoversOverlay ref="reviewSlide" title="Return Review" class="z-50">
        <template #content>
          <div>
            <SharedReviewReturnScreen :review="review" />
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
      review: '',
      expanded: false,
      selectedReview: null,
      noteData: {
        documents: [],
        description: '',
      },
      resubmitData: {
        note: '',
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.portfolio.portfolio,
    }),
    getPaymentStatus() {
      if (this.review.payment_status === 'paid') {
        return 'bg-green-500'
      } else {
        return 'bg-red-500'
      }
    },
  },
  mounted() {
    this.getReviewDetails()
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
      await this.addNote()
      const formData = JSON.parse(JSON.stringify(this.review))
      formData.status = 'pending'
      formData.portfolio_id = this.project.id
      formData.notes = []
      await this.$store.dispatch('review/updatePortfolioReview', formData)
      await this.getReviewDetails()
      this.$refs.resubmitModal.isHidden = true
    },
    async deleteNote(note) {
      await this.$store.dispatch('review/deleteSharedNote', {
        project_id: this.project.id,
        review_id: this.review.id,
        note_id: note.id,
      })
      await this.getReviewDetails()
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
      data.project_id = this.project.id
      data.review_id = this.review.id
      await this.$store.dispatch('review/addSharedNote', data)
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
        .get('api/portfolio/' + this.project.id + '/review/' + this.id)
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
    downloadReport(type, reviewId, areaType) {
      const payload = {
        type: 'portfolio',
        doctype: type,
        rId: reviewId,
        pId: this.project.id,
        area_type: areaType || 'sqft',
      }
      this.$store.dispatch('review/downloadReport', payload)
    },
    downloadReviewDocuments(reviewId) {
      const payload = {
        type: 'portfolio',
        rId: reviewId,
        pId: this.project.id,
        phase: 'hsr',
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
        .delete(`api/portfolio/${this.project.id}/review/${id}`)
        .then((response) => {
          this.$store.dispatch('review/getSharedReviewList', this.project.id)
          this.$parent.showreviewdetails = true
        })
    },
  },
}
</script>
