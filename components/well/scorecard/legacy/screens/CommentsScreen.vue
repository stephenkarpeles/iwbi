<template>
  <div>
    <ModalsGeneral ref="commentModal">
      <div style="width: 600px">
        <PortLegacyAddCommentScreen
          v-if="selectedComment"
          :selected-comment="selectedComment"
          :part="part"
          :space-type="selectedComment.spaceType"
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
    <div class="rounded-md bg-white border border-primary-300 py-8 px-10">
      <FormulateForm
        :key="resetForm"
        class="bg-gray-100 p-4 border border-gray-300 rounded-sm"
        @submit="submit"
      >
        <FormulateInput
          v-model="comment"
          placeholder="Add a Comment"
          type="text"
          name="Comment"
          validation="required"
        />
        <div class="flex justify-between items-center">
          <FormulateInput
            v-model="isPrivate"
            type="checkbox"
            label="Is comment private?"
          />
          <FormulateInput class="w-24" type="submit" label="Post" />
        </div>
      </FormulateForm>

      <div class="mt-8">
        <div class="flex justify-between border-b">
          <span class="font-medium text-lg text-primary-900"
            >{{ filteredComments.length }} Comments</span
          >
          <FormulateInput
            v-model="type"
            :options="getParts"
            type="select"
            placeholder="Select an option"
            @change.native="applyFilter()"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-4 mt-4 max-h-72 overflow-y-auto">
        <div
          v-for="(com, index) in filteredComments"
          :key="index"
          class="flex space-x-2"
        >
          <div class="flex space-x-4 w-1/5">
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

          <div class="flex flex-col space-y-1 w-full">
            <span class="text-sm text-primary-700 font-semibold"
              >In {{ parseSubpart(com.sub_part_id) }}</span
            >
            <span class="opacity-80 text-primary-900">{{ com.note }}</span>
          </div>
          <div
            v-if="
              currentUser.role.includes('well-admin') ||
              currentUser.email === com.user_email
            "
            class="flex space-x-4 items-center pr-5"
          >
            <WIconsBase
              class="
                text-gray-400
                w-6
                h-6
                hover:text-gray-300 hover:cursor-pointer
              "
              icon="pencil"
              @click.native="
                ;((selectedComment = com),
                (selectedComment.spaceType = parseSubpart(com.sub_part_id))),
                  ($refs.commentModal.isHidden = false)
              "
            />
            <WIconsBase
              class="
                text-gray-400
                w-6
                h-6
                hover:text-gray-300 hover:cursor-pointer
              "
              icon="trash"
              @click.native="
                ;($refs.deleteComment.isHidden = false), (selectedComment = com)
              "
            />
          </div>
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
      comments: [],
      selectedComment: null,
      comment: '',
      type: '',
      isPrivate: false,
      resetForm: false,
    }
  },
  computed: {
    ...mapState({
      partNotes: (state) => state.scorecard.partNotes,
      currentUser: (state) => state.user.currentUser,
    }),
    getParts() {
      const parts = JSON.parse(JSON.stringify(this.part.subParts))
      const results = parts.map((el) => {
        return {
          label: this.getSubPartTitle(el),
          value: el.id,
        }
      })
      results.unshift({
        label: 'None',
        value: 'none',
      })
      return results
    },
    filteredComments: {
      get() {
        return this.comments
      },
      set(val) {
        this.comments = val
      },
    },
  },
  watch: {
    partNotes(val) {
      this.comments = val
    },
  },
  mounted() {
    this.comments = this.partNotes
  },
  methods: {
    getSubPartTitle(subpart) {
      let title = ''
      const spaceTypesInc = subpart.space_types_included
      if (spaceTypesInc.length !== 0) {
        if (spaceTypesInc.length === 1) {
          title += spaceTypesInc[0].name
        } else {
          title += spaceTypesInc[0].name
          for (let i = 1; i < spaceTypesInc.length; i++) {
            if (i === spaceTypesInc.length - 1) {
              title += ' & ' + spaceTypesInc[i].name
            } else {
              title += ', ' + spaceTypesInc[i].name
            }
          }
        }
      }
      return title + ''
    },
    async submit() {
      const data = {
        note: this.comment,
        part_id: this.part.id,
        phase: 'assessment',
        private: this.isPrivate,
      }
      try {
        const res = await this.$store.dispatch('scorecard/addPartNote', data)
        if (res.status === 200) {
          this.resetFormData()
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Comment added successfully!',
          })
          await this.$store
            .dispatch('scorecard/getPartNotes', this.part.id)
            .then((res) => {
              this.comments = res
            })
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

    parseSubpart(id) {
      if (id && this.getParts.length) {
        const temp = this.getParts.find((el) => parseInt(el.value) === id)
        if (temp) {
          return temp.label
        }
      } else {
        return 'Comment section***'
      }
    },

    applyFilter() {
      if (this.type === 'none') {
        this.filteredComments = this.partNotes
      } else {
        this.filteredComments = this.partNotes.filter(
          (el) => el.sub_part_id === parseInt(this.type)
        )
      }
    },

    resetFormData() {
      this.comment = ''
      this.isPrivate = false
      this.resetForm = !this.resetForm
    },
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
      this.$refs.deleteComment.isHidden = true
    },
  },
}
</script>
