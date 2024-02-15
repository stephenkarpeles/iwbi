<template>
  <div class="bg-white rounded-md border-primary-300 border p-4">
    <ModalsGeneral ref="deleteComment">
      <PortfolioScorecardConfirmDeleteScreen
        header="Delete comment"
        :selected="selectedComment"
        :part="part"
      />
    </ModalsGeneral>
    <ModalsGeneral ref="editComment" header="Update comment">
      <div style="width: 600px">
        <PortfolioScorecardCommentEditScreen
          :selected-comment="selectedComment"
          :part="part"
        />
      </div>
    </ModalsGeneral>

    <FormulateForm
      :key="resetForm"
      class="bg-gray-100 rounded-md border p-4"
      @submit="addComment"
    >
      <FormulateInput
        v-model="comment.note"
        validation="required"
        name="Comment"
        placeholder="Add a Comment"
        type="textarea"
      />
      <div class="flex justify-end">
        <FormulateInput type="submit" label="Post" />
      </div>
    </FormulateForm>

    <div class="max-h-72 overflow-y-auto space-y-4 mt-4">
      <div
        v-for="(com, index) in comments"
        :key="index"
        class="grid grid-cols-6 gap-4"
      >
        <div class="col-span-1 flex space-x-2">
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
          <div class="flex flex-col text-primary-900">
            <span class="text-sm font-medium">{{ com.user_name }}</span>
            <span class="text-sm opacity-80">{{
              $dayjs(com.created_at).format('MMM DD, YYYY')
            }}</span>
          </div>
        </div>

        <div class="col-span-4">
          <span class="opacity-80 text-primary-900">{{ com.note }}</span>
        </div>

        <div
          v-if="
            currentUser.role.includes('well-admin') ||
            currentUser.email === com.user_email
          "
          class="col-span-1 flex space-x-2 justify-center"
        >
          <WIconsBase
            class="text-gray-400 w-6 h-6 hover:text-gray-300 hover:cursor-pointer"
            icon="pencil"
            @click.native="
              ;(selectedComment = com), ($refs.editComment.isHidden = false)
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      resetForm: false,
      comments: [],
      comment: {
        note: '',
        private: false,
      },
      selectedComment: null,
    }
  },
  computed: {
    ...mapState({
      partNotes: (state) => state.scorecard.partNotes,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  watch: {
    partNotes(val) {
      this.comments = val
    },
  },
  async mounted() {
    await this.getComments()
  },
  methods: {
    async addComment() {
      const data = {
        note: this.comment.note,
        part_id: this.part.id,
        phase: 'assessment',
        private: this.comment.private,
      }
      try {
        const res = await this.$store.dispatch('scorecard/addPartNote', data)
        if (res.status === 200) {
          this.resetFormData()
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Comment added successfully!',
          })
          await this.getComments()
          this.$parent.$refs.commentHover.commentCount++
        }
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.message,
          })
        } else {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Something went wrong...',
          })
        }
      }
    },
    imageUrlAlt(event) {
      event.target.src = '/profile/avatar.jpg'
    },
    resetFormData() {
      this.comment = {
        note: '',
        private: false,
      }
      this.resetForm = !this.resetForm
    },

    async getComments() {
      await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
      this.comments = this.partNotes
    },
  },
}
</script>
