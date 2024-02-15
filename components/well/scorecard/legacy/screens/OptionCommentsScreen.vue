<template>
  <div class="divide-y max-h-96 overflow-y-auto">
    <ModalsGeneral ref="commentModal">
      <div style="width: 600px">
        <PortfolioScorecardAddCommentScreen
          :selected-comment="selectedComment"
          :part="part"
          :sub-part="subPart"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="deleteComment">
      <div class="flex w-56">
        <div
          class="
            mx-auto
            flex-shrink-0 flex
            items-center
            justify-center
            h-12
            w-12
            rounded-full
            bg-red-100
            sm:mx-0 sm:h-10 sm:w-10
          "
        >
          <WIconsBase class="h-6 w-6 text-red-600" icon="exclamation" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3
            id="modal-title"
            class="text-lg leading-6 font-medium text-gray-900"
          >
            Delete Comment
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Are you sure?</p>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="
                w-full
                inline-flex
                justify-center
                rounded-md
                border border-transparent
                shadow-sm
                px-4
                py-2
                bg-red-600
                text-base
                font-medium
                text-white
                hover:bg-red-700
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-red-500
                sm:ml-3 sm:w-auto sm:text-sm
              "
              @click="deleteComment(selectedComment)"
            >
              Yes
            </button>
            <button
              type="button"
              class="
                mt-3
                w-full
                inline-flex
                justify-center
                rounded-md
                border border-gray-300
                shadow-sm
                px-4
                py-2
                bg-white
                text-base
                font-medium
                text-gray-700
                hover:bg-gray-50
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-primary-500
                sm:mt-0 sm:w-auto sm:text-sm
              "
              @click="$refs.deleteComment.isHidden = true"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </ModalsGeneral>
    <div
      v-for="(com, index) in comments"
      :key="index"
      class="flex space-x-10 items-start py-2 mr-4"
    >
      <div class="flex space-x-3 items-center w-3/12">
        <div class="flex-shrink-0 h-10 w-10">
          <img
            v-if="com.user_profile_pic"
            class="h-10 w-10 rounded-full"
            :src="com.user_profile_pic"
            alt="member profile picture"
            @error="imageUrlAlt"
          />
          <img
            v-else
            class="h-10 w-10 rounded-full"
            src="/profile/avatar.jpg"
            alt="member profile picture"
          />
        </div>
        <div class="flex flex-col text-sm text-gray-600">
          <span>{{ com.user_name }}</span>
          <span>{{ $dayjs(com.updated_at).format('MMM DD, YYYY') }}</span>
        </div>
      </div>

      <div class="text-sm text-gray-600 w-3/4">
        {{ com.note }}
      </div>
      <div
        v-if="
          currentUser.role.includes('well-admin') ||
          currentUser.email === com.user_email
        "
        class="flex space-x-4 items-center"
      >
        <WIconsBase
          class="text-gray-400 w-6 h-6 hover:text-gray-300 hover:cursor-pointer"
          icon="pencil"
          @click.native="
            ;(selectedComment = com), ($refs.commentModal.isHidden = false)
          "
        />
        <WIconsBase
          class="text-gray-400 w-6 h-6 hover:text-gray-300 hover:cursor-pointer"
          icon="trash"
          @click.native="
            ;($refs.deleteComment.isHidden = false), (selectedComment = com)
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    subPart: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedComment: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      currentUser: (state) => state.user.currentUser,
      comments: (state) => state.scorecard.optionComments,
    }),
  },
  methods: {
    imageUrlAlt(event) {
      event.target.src = '/profile/avatar.jpg'
    },
    async deleteComment(com) {
      const res = await this.$store.dispatch('scorecard/removeNote', com.id)
      if (res.status === 200) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Comment deleted!',
        })
        await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
      }
      await this.$store.dispatch('scorecard/getOptionComments', {
        part_id: this.part.id,
        sub_part_id: this.subPart.id,
      })
      this.$refs.deleteComment.isHidden = true
    },
  },
}
</script>
