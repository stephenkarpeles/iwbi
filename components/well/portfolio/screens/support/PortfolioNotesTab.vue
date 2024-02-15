<template>
  <div>
    <div v-if="computedNotes.length !== 0">
      <div v-for="(note, index) in computedNotes" :key="index" class="">
        <div class="mb-5 shadow p-2 rounded">
          <div
            class="
              flex-col
              md:flex md:flex-row md:justify-between md:items-center
              mb-4
            "
          >
            <div
              class="
                text-sm text-primary-900
                opacity-50
                tracking-tighter
                flex
                justify-between
              "
            >
              <span class="mr-3 mt-1">{{ note.user_name }}</span
              ><WIconsBase
                v-if="currentUser.role.includes('well-admin')"
                class="cursor-pointer"
                icon="pencil"
                type="primary"
                @click.native="editNote(note)"
              />
            </div>
            <div
              class="
                bg-primary-100
                text-primary-700
                px-5
                py-2
                rounded
                uppercase
                text-sm text-center
                leading-5
              "
            >
              {{ note.is_internal ? 'internal' : 'public' }}
            </div>
          </div>
          <div class="flex justify-between items-center mb-4">
            <div class="text-primary-900 text-base leading-6 tracking-tighter">
              <b>Agenda:</b> {{ note.agenda }}
            </div>
            <div
              class="text-xs text-primary-900 opacity-50 tracking-tighter mr-5"
            >
              {{ $dayjs(note.created_at).format('MMM-DD-YYYY') }}
            </div>
          </div>
          <div class="flex justify-between mb-4">
            <div class="text-primary-900 text-base leading-6 tracking-tighter">
              <b>Attendees:</b> {{ note.attendees }}
            </div>
          </div>
          <div class="flex justify-between mb-4">
            <div class="text-primary-900 text-base leading-6 tracking-tighter">
              <b>Communication Type:</b> {{ note.communication_type }}
            </div>
          </div>
          <div class="flex justify-between mb-2">
            <div class="text-primary-900 text-base leading-6 tracking-tighter">
              <b>Note:</b>
            </div>
          </div>
          <div class="flex justify-between mb-4">
            <div
              class="text-primary-900 text-base leading-6 tracking-tighter"
              v-html="note.description"
            ></div>
          </div>
          <div class="flex justify-between mb-2">
            <div class="text-primary-900 text-base leading-6 tracking-tighter">
              <b>Documents:</b>
            </div>
          </div>
          <div
            class="
              border border-primary-300
              p-5
              rounded
              space-y-2
              overflow-x-scroll
            "
          >
            <div v-for="(document, ind) in note.documents" :key="ind">
              <div class="flex justify-between">
                <div class="flex">
                  <WIconsBase icon="paper-clip" type="primary" />
                  <span class="ml-4">{{ document.name }}</span>
                </div>
                <div class="p-2">
                  <WLinksBase :link="document.link_s3_private" target="_blank">
                    Download
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="bg-primary-300 text-primary-700 p-5 text-sm rounded">
        We can not find any notes for this portfolio.
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      is_user: true,
    }
  },
  computed: {
    ...mapState({
      notesList: (state) => state.portfolio.notesList,
      currentUser: (state) => state.user.currentUser,
    }),
    computedNotes() {
      if (!this.currentUser.role.includes('well-admin')) {
        return this.notesList.filter((note) => !note.is_internal)
      }

      return this.notesList
    },
  },
  methods: {
    editNote(note) {
      this.$parent.note = note
      this.$parent.currentScreen = 'edit'
    },
  },
}
</script>
