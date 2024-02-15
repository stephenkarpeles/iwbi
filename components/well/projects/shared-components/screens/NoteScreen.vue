<template>
  <div class="p-4">
    <div class="md:w-40">
      <WButtonsBase
        v-if="
          (currentUser.role.includes('well-admin') ||
            currentUser.role.includes('well-assessor')) &&
          project.type !== 'v2-pilot-upgraded'
        "
        icon="plus"
        @click.native="
          ;($refs.content.scrollTop = 0),
            ($refs.modal.isHidden = false),
            (selectedNote = null)
        "
      >
        Add Note
      </WButtonsBase>
    </div>
    <WFeedbackModal ref="modal">
      <div class="flex justify-between">
        <WHeadingsHThree heading="Project Notes" />
        <div class="pt-3">
          <WButtonsBase
            icon="x-circle"
            type="blank"
            @click.native="$refs.modal.isHidden = true"
          />
        </div>
      </div>
      <div ref="content" class="mx-auto max-w-5xl overflow-y-scroll h-96">
        <ProjectNoteAddForm :project="project" :selected-note="selectedNote" />
      </div>
    </WFeedbackModal>
    <div>
      <div v-if="notes && notes.data && notes.data.length > 0" class="">
        <div
          v-for="notes in notes.data"
          :key="notes.id"
          class="p-5 shadow-md mt-5 border-2 rounded"
        >
          <div class="justify-end space-x-2 flex mb-4">
            <div
              v-if="notes.created_at !== notes.updated_at"
              class="
                px-2
                inline-flex
                text-xs
                leading-5
                rounded-lg
                bg-primary-600
                text-white
                uppercase
              "
            >
              Edited
            </div>
            <div
              v-if="notes.is_internal"
              class="
                px-2
                inline-flex
                text-xs
                leading-5
                rounded-lg
                bg-primary-600
                text-white
                uppercase
              "
            >
              Internal
            </div>
          </div>
          <div class="mb-3">
            <div
              v-if="notes.description"
              class="mb-2"
              v-html="notes.description"
            ></div>
            <p v-if="notes.agenda" v-html="notes.agenda"></p>
          </div>
          <div v-if="notes && notes.documents.length > 0" class="text-sm">
            <b>Documents:</b>
            <ul class="list-disc ml-6 my-4">
              <div
                v-for="document in notes.documents"
                :key="document.id"
                class="overflow-x-scroll md:overflow-hidden"
              >
                <li>
                  <WLinksBase :link="document.link_s3_private" target="_blank">
                    {{ document.name }}
                  </WLinksBase>
                </li>
              </div>
            </ul>
          </div>
          <div v-if="notes.features.length > 0" class="text-sm">
            <b>Feature(s):</b>
            <span class="text-sm">
              {{ getFeatureName(notes.features) }}
            </span>
          </div>
          <div v-if="notes.v1features.length > 0" class="text-sm">
            <b>Feature(s):</b>
            <span class="text-sm">
              {{ getFeatureName(notes.v1features) }}
            </span>
          </div>
          <div class="text-sm mt-2">
            <b>Posted on:</b>
            <span class="text-sm">{{
              $dayjs(notes.created_at).format('MMM DD, YYYY')
            }}</span>
          </div>
          <div v-if="checkUpdated(notes)" class="text-sm mt-2">
            <b>Updated on:</b>
            <span class="text-sm">{{
              $dayjs(notes.updated_at).format('MMM DD, YYYY')
            }}</span>
          </div>

          <div v-if="notes.user_id" class="text-sm mt-2">
            <b>Posted by:</b>
            <span class="text-sm">{{ notes.user.name }}</span>
          </div>
          <div
            v-if="currentUser.role.includes('well-admin')"
            class="text-sm w-40 mt-5"
          >
            <WButtonsBase
              type="primaryInverted"
              icon="pencil"
              @click.native="editNote(notes)"
            >
              <span class="ml-2">Edit</span>
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div v-else class="p-5">No project notes found for this project.</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedNote: null,
      currentPage: 1,
    }
  },
  computed: {
    ...mapState({
      notes: (state) => state.notes.notes,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    this.$store.dispatch('notes/getNotes', this.project.id)
  },
  methods: {
    checkUpdated(notes) {
      if (this.$dayjs(notes.updated_at).isAfter(notes.created_at)) {
        return true
      } else {
        return false
      }
    },
    getFeatureName(f) {
      const res = f.map((a) => a.feature_full_name)
      return res.join(', ')
    },
    editNote(note) {
      this.selectedNote = { ...note }
      this.$refs.modal.isHidden = false
    },
  },
}
</script>
