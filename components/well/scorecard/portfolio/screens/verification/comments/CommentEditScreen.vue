<template>
  <div>
    <FormulateForm
      class="rounded-md border border-primary-300"
      @submit="updateComment()"
    >
      <div
        class="
          flex
          justify-between
          items-center
          border-b border-primary-300
          p-4
          text-primary-800
        "
      >
        <div class="flex space-x-2 items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img
              v-if="selectedComment.user_profile_pic"
              class="h-10 w-10 rounded-full"
              :src="selectedComment.user_profile_pic"
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
          <span>
            {{ selectedComment.user_name }}
          </span>
        </div>

        <span>{{
          $dayjs(selectedComment.created_at).format('MMM DD, YYYY')
        }}</span>
      </div>
      <div class="p-4">
        <FormulateInput
          v-model="comment"
          name="Comment"
          type="textarea"
          validation="required"
          placeholder="Type comment here..."
          input-class="h-44 border-primary-300 rounded-lg text-primary-700 block w-full mb-4 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        />
        <div class="flex justify-end items-center mt-2">
          <FormulateInput class="w-24" type="submit" label="Update" />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>

<script>
export default {
  props: {
    selectedComment: {
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
      comment: '',
      isPrivate: false,
    }
  },
  mounted() {
    this.comment = this.selectedComment.note
    this.isPrivate = this.selectedComment.private
  },
  methods: {
    imageUrlAlt(event) {
      event.target.src = '/profile/avatar.jpg'
    },
    async updateComment() {
      const data = {
        note: this.comment,
        id: this.selectedComment.id,
        part_id: this.part.id,
        sub_part_id: this.selectedComment.sub_part_id,
        phase: 'assessment',
        private: this.isPrivate,
      }

      try {
        const res = await this.$store.dispatch('scorecard/updatePartNote', data)
        if (res.status === 200) {
          await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
          this.$parent.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Comment updated successfully! ',
          })
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong...',
        })
      }
    },
  },
}
</script>
