<template>
  <div>
    <div class="flex w-full border-b justify-between mb-4">
      <WHeadingsHThree
        class="text-primary-900"
        :heading="selectedComment ? 'Update Comment' : 'Add a Comment'"
      />
      <WIconsBase
        class="text-primary-900 text-lg cursor-pointer"
        icon="x"
        @click.native="$parent.isHidden = true"
      />
    </div>

    <FormulateForm
      class="rounded-md border border-primary-300"
      @submit="submitComment()"
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
              v-if="user.profile_pic"
              class="h-10 w-10 rounded-full"
              :src="user.profile_pic"
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
            {{ user.name }}
          </span>
        </div>

        <span>{{
          selectedComment
            ? $dayjs(selectedComment.created_at).format('MMM DD, YYYY')
            : $dayjs(new Date()).format('MMM DD, YYYY')
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
        <span
          v-if="spaceType"
          class="text-white rounded-full bg-primary-600 px-2 py-1"
          >{{ spaceType }}</span
        >
        <div class="flex justify-between items-center mt-2">
          <FormulateInput
            v-model="isPrivate"
            type="checkbox"
            label="Is comment private?"
          />
          <FormulateInput
            class="w-24"
            type="submit"
            :label="selectedComment ? 'Update' : 'Post'"
          />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    subPart: {
      type: Object,
      required: false,
      default: null,
    },
    part: {
      type: Object,
      required: true,
    },
    selectedComment: {
      type: Object,
      required: false,
      default: null,
    },
    spaceType: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      comment: '',
      isPrivate: false,
      user: {
        profile_pic: null,
        name: null,
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    if (this.selectedComment) {
      this.user.profile_pic = this.selectedComment.user_profile_pic
      this.user.name = this.selectedComment.user_name
      this.comment = this.selectedComment.note
      this.isPrivate = this.selectedComment.private
    } else {
      this.user.profile_pic = this.currentUser.profile_pic
      this.user.name = this.currentUser.full_name
    }
  },
  methods: {
    async submitComment() {
      const data = {
        note: this.comment,
        part_id: this.part.id,
        sub_part_id: this.subPart
          ? this.subPart.id
          : this.selectedComment.sub_part_id,
        phase: 'assessment',
        private: this.isPrivate,
      }
      try {
        let res
        if (this.selectedComment) {
          data.id = this.selectedComment.id
          res = await this.$store.dispatch('scorecard/updatePartNote', data)
        } else {
          res = await this.$store.dispatch('scorecard/addPartNote', data)
        }
        if (res.status === 200) {
          if (this.subPart) {
            await this.$store.dispatch('scorecard/getOptionComments', {
              part_id: this.part.id,
              sub_part_id: this.subPart.id,
            })
          } else {
            await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
          }
          this.$parent.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: this.selectedComment
              ? 'Comment updated successfully! '
              : 'Comment added successfully!',
          })
        }
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.msg,
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
  },
}
</script>
