<template>
  <div v-if="ticketInfo" class="xl:max-w-5xl xl:grid xl:grid-cols-3 mt-4">
    <div class="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
      <div>
        <div
          class="
            md:flex md:items-center md:justify-between md:space-x-4
            xl:border-b xl:pb-6
          "
        >
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 capitalize">
              {{ ticketInfo.subject }}
            </h1>
            <p class="mt-2 text-sm text-gray-500">
              #{{ ticketInfo.id }} opened by
              <span class="font-medium text-gray-900">{{
                ticketInfo.submitted_by
              }}</span>
            </p>
          </div>
        </div>
        <aside class="mt-8 xl:hidden">
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <WIconsBase
                v-if="
                  ticketInfo.status === 'closed' ||
                  ticketInfo.status === 'solved'
                "
                icon="lock-closed-small"
                class="text-gray-700"
              />
              <WIconsBase
                v-else
                icon="lock-open-small"
                :class="[
                  ticket.status === 'new' && 'text-yellow-500',
                  ticket.status === 'open' && 'text-red-400',
                  ticket.status === 'pending' && 'text-blue-400',
                ]"
              />
              <span
                :class="[
                  ticket.status === 'solved' && 'text-gray-700',
                  ticket.status === 'new' && 'text-yellow-500',
                  ticket.status === 'closed' && 'text-gray-700',
                  ticket.status === 'open' && 'text-red-400',
                  ticket.status === 'pending' && 'text-blue-400',
                  'text-sm font-bold capitalize',
                ]"
                >{{ ticketInfo.status }}</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <WIconsBase icon="chat-alt" class="text-gray-500" />
              <span class="text-gray-900 text-sm font-medium"
                >{{ ticketInfo.comments.length }} comments</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <WIconsBase icon="calendar" class="text-gray-500" />
              <span class="text-gray-900 text-sm font-medium"
                >Created on
                {{ $dayjs(ticketInfo.created_at).format('MMM DD, YYYY') }}</span
              >
            </div>
            <div
              v-if="ticketInfo.status === 'solved'"
              class="flex items-center space-x-2"
            >
              <WButtonsBase
                icon="lock-open-small"
                type="primaryInverted"
                @click.native="reopenTicket"
                >Re-open issue</WButtonsBase
              >
            </div>
          </div>
          <div class="mt-6 border-t border-b border-gray-200 py-6 space-y-3">
            <div
              v-if="
                ticketInfo.custom_fields &&
                ticketInfo.custom_fields.length &&
                (ticketInfo.custom_fields[0].value === 'well-v2-feature' ||
                  ticketInfo.custom_fields[0] === 'well-v1-feature' ||
                  ticketInfo.custom_fields[0] ===
                    'well-community-standard-feature')
              "
            >
              <h2 class="text-sm font-medium text-gray-500">Feature</h2>
              <div class="text-sm font-medium text-gray-900">
                {{ ticketFeature }}
              </div>
            </div>
            <div
              v-if="
                ticketInfo.custom_fields &&
                ticketInfo.custom_fields.length &&
                ticketInfo.custom_fields[0].value === 'well-v2-feature'
              "
            >
              <h2 class="text-sm font-medium text-gray-500">Part</h2>
              <div class="text-sm font-medium text-gray-900">
                {{ ticketPart }}
              </div>
            </div>
            <div>
              <h2
                v-if="ticketInfo.attachments.length"
                class="text-sm font-medium text-gray-500"
              >
                Attachments
              </h2>
              <div
                v-if="ticketInfo.attachments.length"
                class="text-sm font-medium text-gray-900"
              >
                <ul class="list-disc pl-5">
                  <li
                    v-for="(attachment, index) in ticketInfo.attachments"
                    :key="index"
                  >
                    <WLinksBase target="_blank" :link="attachment.content_url">
                      {{ attachment.file_name }}
                    </WLinksBase>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div class="py-3 xl:pt-6 xl:pb-0">
          <!-- eslint-disable-next-line prettier/prettier vue/no-v-html -->
          <p class="text-gray-500 leading-7" v-html="ticketInfo.description"></p>
        </div>
      </div>
      <section class="mt-8 xl:mt-10">
        <div>
          <div class="divide-y divide-gray-200">
            <div class="pb-4">
              <h2 id="activity-title" class="text-lg font-bold text-gray-800">
                Comments
              </h2>
            </div>
            <div class="pt-6">
              <div class="flow-root">
                <ul v-if="ticketInfo.comments.length" role="list" class="-mb-8">
                  <li
                    v-for="(ticket_comment, index) in ticketInfo.comments"
                    :key="index"
                  >
                    <div class="relative pb-8">
                      <span
                        v-if="index !== ticketInfo.comments.length - 1"
                        class="
                          absolute
                          top-5
                          left-5
                          -ml-px
                          h-full
                          w-0.5
                          bg-gray-200
                        "
                        aria-hidden="true"
                      ></span>
                      <div class="relative flex items-start space-x-3">
                        <div class="relative">
                          <img
                            class="
                              h-10
                              w-10
                              rounded-full
                              bg-gray-400
                              flex
                              items-center
                              justify-center
                              ring-8 ring-white
                            "
                            src="/profile/avatar.jpg"
                            alt="/profile/avatar.jpg"
                          />

                          <span
                            class="
                              absolute
                              -bottom-0.5
                              -right-1
                              bg-white
                              rounded-tl
                              px-0.5
                              py-px
                            "
                          >
                            <WIconsBase icon="chat-alt" class="text-gray-500" />
                          </span>
                        </div>
                        <div class="min-w-0 flex-1">
                          <div class="text-sm font-bold text-gray-900">
                            {{
                              ticketInfo.comment_authors.find(
                                (author) =>
                                  author.id === ticket_comment.author_id
                              ).name
                            }}
                          </div>
                          <p class="mt-0.5 text-sm font-light text-gray-500">
                            Commented
                            {{ commentedDate(ticket_comment.created_at) }}
                            ago
                          </p>
                          <div class="mt-2 text-sm text-gray-600 leading-6">
                            <p v-html="ticket_comment.html_body"></p>
                          </div>
                          <div class="mt-2 text-sm">
                            <p v-if="ticket_comment.attachments.length > 0">
                              Attachments:
                            </p>
                            <ul class="list-disc pl-5">
                              <li
                                v-for="(
                                  attachment, commentIndex
                                ) in ticket_comment.attachments"
                                :key="commentIndex"
                              >
                                <a
                                  :href="attachment.content_url"
                                  target="_blank"
                                  class="
                                    active:text-primary-700
                                    duration-150
                                    ease-in-out
                                    font-medium
                                    hover:text-primary-800
                                    text-primary-600
                                    transition
                                  "
                                  >{{ attachment.file_name }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-else class="rounded-md bg-yellow-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <!-- Heroicon name: solid/exclamation -->
                      <svg
                        class="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-bold text-yellow-800">
                        No comments found.
                      </h3>
                      <div
                        v-if="
                          ticketInfo.status !== 'closed' &&
                          ticketInfo.status !== 'solved'
                        "
                        class="mt-2 text-sm text-yellow-700"
                      >
                        <p>Be the first one to comment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  ticketInfo.status !== 'closed' &&
                  ticketInfo.status !== 'solved'
                "
                class="mt-6"
              >
                <div class="flex space-x-3">
                  <div class="flex-shrink-0">
                    <div class="relative">
                      <img
                        v-if="
                          $store.state.user.currentUser.profile_pic === null
                        "
                        class="
                          h-10
                          w-10
                          rounded-full
                          bg-gray-400
                          flex
                          items-center
                          justify-center
                          ring-8 ring-white
                        "
                        src="/profile/avatar.jpg"
                        alt="profile pic"
                      />
                      <img
                        v-else
                        class="
                          h-10
                          w-10
                          rounded-full
                          bg-gray-400
                          flex
                          items-center
                          justify-center
                          ring-8 ring-white
                        "
                        :src="$store.state.user.currentUser.profile_pic"
                        alt="profile pic"
                      />

                      <span
                        class="
                          absolute
                          -bottom-0.5
                          -right-1
                          bg-white
                          rounded-tl
                          px-0.5
                          py-px
                        "
                      >
                        <WIconsBase icon="chat-alt" class="text-gray-500" />
                      </span>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <FormulateForm name="commentForm" @submit="addComment">
                      <FormulateInput
                        v-model="comment.comment_body"
                        type="textarea"
                        validation-name="A comment"
                        placeholder="Add a new comment"
                        validation="required"
                        :disabled="postingComment"
                      />
                      <FormulateInput
                        :key="uploadComponetKey"
                        v-model="comment.uploads"
                        label="Attach File(s)"
                        :value="comment.uploads"
                        type="fileupload"
                        upload-path="Aap/"
                        mime-types=""
                        :is-zendesk-upload="true"
                      />
                      <div class="mt-2">
                        <div class="w-36">
                          <WButtonsBase
                            v-if="postingComment"
                            type="primaryInverted"
                          >
                            <WLoadingSpinner type="button" class="mx-auto" />
                          </WButtonsBase>
                          <FormulateInput v-else type="submit">
                            Comment
                          </FormulateInput>
                        </div>
                      </div>
                    </FormulateForm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <aside class="hidden xl:block xl:pl-8">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <WIconsBase
            v-if="
              ticketInfo.status === 'closed' || ticketInfo.status === 'solved'
            "
            icon="lock-closed-small"
            class="text-gray-700"
          />
          <WIconsBase
            v-else
            icon="lock-open-small"
            :class="[
              ticket.status === 'new' && 'text-yellow-500',
              ticket.status === 'open' && 'text-red-400',
              ticket.status === 'pending' && 'text-blue-400',
            ]"
          />
          <span
            :class="[
              ticket.status === 'solved' && 'text-gray-700',
              ticket.status === 'new' && 'text-yellow-500',
              ticket.status === 'closed' && 'text-gray-700',
              ticket.status === 'open' && 'text-red-400',
              ticket.status === 'pending' && 'text-blue-400',
              'text-sm font-bold capitalize',
            ]"
            >{{ ticketInfo.status }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <WIconsBase icon="chat-alt" class="text-gray-500" />
          <span class="text-gray-900 text-sm font-medium"
            >{{ ticketInfo.comments.length }} comments</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <WIconsBase icon="calendar" class="text-gray-500" />
          <span class="text-gray-900 text-sm font-medium"
            >Created on
            {{ $dayjs(ticketInfo.created_at).format('MMM DD, YYYY') }}</span
          >
        </div>
        <div
          v-if="ticketInfo.status === 'solved'"
          class="flex items-center space-x-2"
        >
          <WButtonsBase
            icon="lock-open-small"
            type="primaryInverted"
            @click.native="reopenTicket"
            >Re-open issue</WButtonsBase
          >
        </div>
      </div>
      <div class="mt-6 border-t border-gray-200 py-6 space-y-3">
        <div
          v-if="
            ticketInfo.custom_fields &&
            ticketInfo.custom_fields.length &&
            (ticketInfo.custom_fields[0].value === 'well-v2-feature' ||
              ticketInfo.custom_fields[0] === 'well-v1-feature' ||
              ticketInfo.custom_fields[0] === 'well-community-standard-feature')
          "
          class="pb-4 space-y-1"
        >
          <h2 class="text-sm font-bold text-gray-500">Feature</h2>
          <div class="text-sm font-medium text-gray-900">
            {{ ticketFeature }}
          </div>
        </div>
        <div
          v-if="
            ticketInfo.custom_fields &&
            ticketInfo.custom_fields.length &&
            ticketInfo.custom_fields[0].value === 'well-v2-feature'
          "
          class="pb-4 space-y-1"
        >
          <h2 class="text-sm font-bold text-gray-500">Part</h2>
          <div class="text-sm font-medium text-gray-900">
            {{ ticketPart }}
          </div>
        </div>
        <div class="pb-4 space-y-1">
          <h2
            v-if="ticketInfo.attachments.length"
            class="text-sm font-bold text-gray-500"
          >
            Attachments
          </h2>
          <div
            v-if="ticketInfo.attachments.length"
            class="text-sm font-medium text-gray-900"
          >
            <ul class="list-disc pl-5">
              <li
                v-for="(attachment, index) in ticketInfo.attachments"
                :key="index"
              >
                <WLinksBase target="_blank" :link="attachment.content_url">
                  {{ attachment.file_name }}
                </WLinksBase>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  </div>
  <div v-else>
    <div class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">
        Loading Ticket: {{ ticket.id }} Info...
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ticket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comment: {
        comment_body: null,
        ticket_id: null,
        uploads: [],
        user_email: null,
      },
      ticketInfo: null,
      postingComment: false,
      uploadComponetKey: 0,
    }
  },
  computed: {
    ticketFeature() {
      const res = this.ticketInfo.custom_fields.length
        ? this.ticketInfo.custom_fields.find(
            (a) => a.id === 360007748113 || a.id === 360007684613
          )
        : null
      return res ? res.value : ''
    },
    ticketPart() {
      const res = this.ticketInfo.custom_fields.length
        ? this.ticketInfo.custom_fields.find(
            (a) => a.id === 360007706353 || a.id === 360007684633
          )
        : null
      return res ? res.value : ''
    },
  },
  mounted() {
    this.$store
      .dispatch('support/getTicketInfo', {
        user_email: this.$store.state.user.currentUser.email,
        ticket_id: this.ticket.id,
      })
      .then((res) => (this.ticketInfo = res))
  },
  methods: {
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
    async addComment() {
      this.postingComment = true

      this.comment.user_email = this.$store.state.user.currentUser.email
      this.comment.ticket_id = this.ticket.id
      this.comment.uploads = this.comment.uploads.map((item) => item.token)

      await this.$store
        .dispatch('support/addComment', this.comment)
        .then((res) => {
          this.ticketInfo = res
          this.$formulate.reset('commentForm')
          this.uploadComponetKey++
        })

      this.postingComment = false

      this.comment = {
        comment_body: null,
        ticket_id: null,
        uploads: [],
        user_email: null,
      }
    },
    async reopenTicket() {
      this.postingComment = true
      await this.$store.dispatch('support/reopenTicket', this.ticket.id)
      await this.$store
        .dispatch('support/getTicketInfo', {
          user_email: this.$store.state.user.currentUser.email,
          ticket_id: this.ticket.id,
        })
        .then((res) => {
          this.ticketInfo = res
          this.postingComment = false
        })
      await this.$store.dispatch('support/getTickets')
      this.$parent.filteredTicketList = this.$store.state.support.tickets
    },
  },
}
</script>
