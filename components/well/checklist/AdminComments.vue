<template>
  <div class="row px-2">
    <div class="col-12">
      <div v-if="partResponse" class="comments-list overflow-y-scroll">
        <!-- eslint-disable-next-line -->
        <div v-for="response in partResponse" :key="response.id">
          <div v-if="response.responses && response.responses.length > 0">
            <div
              v-for="comments in response.responses[0].notes"
              :key="comments.id"
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
                    <div class="font-medium text-base text-tertiary-400 flex">
                      <div>
                        {{ comments.user_name }} (
                        <span class="text-primary-700">{{
                          response.phase
                        }}</span>
                        )
                      </div>
                    </div>
                    <div class="flex text-sm text-gray-400">
                      {{ $dayjs(comments.created_at).format('MMM DD, YYYY') }}
                      <div
                        v-if="
                          comments.user_id ===
                            $store.state.user.currentUser.id ||
                          currentUser.role.includes('well-admin') ||
                          currentUser.role.includes('external-reviewer')
                        "
                        class="flex ml-auto"
                      >
                        <svg
                          class="
                            w-5
                            text-primary-500
                            mr-2
                            hover:text-primary-700
                            cursor-pointer
                          "
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          @click="
                            editScorecardReviewComment(
                              comments,
                              response.responses[0].id
                            )
                          "
                        >
                          <path
                            d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <svg
                          class="
                            w-5
                            text-red-500
                            hover:text-red-700
                            cursor-pointer
                          "
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          @click="
                            deleteScorecardReviewComment(
                              response.id,
                              comments.id,
                              response.responses[0].id
                            )
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
                </div>
              </div>
              <div
                class="mt-3 w-full bg-primary-100 p-4 rounded-lg text-sm"
                v-html="comments.description"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  props: {
    partId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      responseOptions: [
        { text: 'Anticipated', value: 'anticipated' },
        {
          text: 'Achievable with Major Adjustments',
          value: 'achievable_with_major_adjustments',
        },
        {
          text: 'Achievable with Major Adjustments',
          value: 'achievable_with_minor_adjustments',
        },
        { text: 'Not Anticipated', value: 'not_anticipated' },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      adminReviewResponses: (state) => state.checklist.adminReviewResponses,
    }),
    ...mapGetters('review', ['pendingReview']),
    partResponse() {
      let response = JSON.parse(JSON.stringify(this.adminReviewResponses))
      response = response.filter((review) => {
        const data = review
        review.responses = review.responses.filter(
          (a) => a.part_id === this.partId
        )
        return data
      })
      return response
    },
  },
  methods: {
    ...mapActions('checklist', ['submitReviewComment', 'deleteReviewComment']),
    deleteScorecardReviewComment(reviewId, noteId, responseId) {
      const id = responseId
      const nId = noteId
      const data = {
        id: reviewId,
        part_id: this.partId,
        responseId: id,
        noteId: nId,
        model_type: 'Review',
      }
      this.deleteReviewComment(data)
    },
    editScorecardReviewComment(comment, response) {
      const payload = {
        comments: comment,
        res: response,
      }
      this.$emit('update-comment', {
        comment: payload.comments,
        responseId: payload.res,
      })
    },
  },
}
</script>
<style scoped>
.comments-list {
  height: 350px;
}
</style>
