<template>
  <div v-if="loading">
    <ModalsGeneral ref="locationList">
      <div v-if="selectedDocument" class="w-96">
        <div class="flex w-full border-b justify-between mb-4">
          <WHeadingsHThree
            class="text-primary-900"
            :heading="`${
              selectedDocument.projects && selectedDocument.projects.length
            } Locations`"
          />
          <WIconsBase
            class="text-primary-900 text-lg cursor-pointer"
            icon="x"
            @click.native="$refs.locationList.isHidden = true"
          />
        </div>
        <div class="divide-y divide-primary-300">
          <div
            v-for="(loc, index) in selectedDocument.projects"
            :key="index"
            class="py-2"
          >
            <span class="text-gray-500">{{ loc.name }}</span>
          </div>
        </div>
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="documentList">
      <div v-if="selectedLocation" class="w-96">
        <div class="flex w-full border-b justify-between mb-4">
          <WHeadingsHThree
            class="text-primary-900"
            :heading="`${
              selectedLocation.documents && selectedLocation.documents.length
            } Documents`"
          />
          <WIconsBase
            class="text-primary-900 text-lg cursor-pointer"
            icon="x"
            @click.native="$refs.documentList.isHidden = true"
          />
        </div>
        <div class="divide-y divide-primary-300">
          <div
            v-for="(doc, index) in selectedLocation.documents"
            :key="index"
            class="py-2 flex space-x-2"
          >
            <div>
              <WIconsBase icon="paper-clip" class="text-primary-600" />
            </div>
            <WLinksBase class="underline" target="_blank" :link="doc.url">
              {{ doc.name }}
            </WLinksBase>
          </div>
        </div>
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="modal">
      <div style="width: 900px">
        <PortfolioScorecardDocumentUploadScreen
          v-if="selectedDocument"
          :part="part"
          :active-option="activeOption"
          :selected-doc-i-d="selectedDocument.id"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="deleteDocModal">
      <div class="flex">
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
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3
            id="modal-title"
            class="text-lg leading-6 font-medium text-gray-900"
          >
            Delete Document
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Your document will be permenantly deleted.
            </p>
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
              @click="deleteDocument(selectedDocument.id)"
            >
              Delete
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
              @click="$refs.deleteDocModal.isHidden = true"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </ModalsGeneral>

    <WTabsHorizontal v-model="tab" class="w-full -mb-px" :tabs="tabs" />
    <div v-if="tab[0] === 'T'" class="mt-4">
      <div class="rounded-full bg-gray-100 w-max mb-4">
        <button
          :class="`py-2 px-3 rounded-full ${
            subTab === 'pending' ? 'text-white bg-primary-600' : 'text-gray-500'
          }`"
          @click="subTab = 'pending'"
        >
          Pending ({{ toDoList && toDoList.total }})
        </button>
        <button
          :class="`rounded-full py-2 px-3 ${
            subTab === 'completed'
              ? 'text-white bg-primary-600'
              : 'text-gray-500'
          }`"
          @click="subTab = 'completed'"
        >
          Completed ({{ completed && completed.total }})
        </button>
      </div>

      <div v-if="subTab === 'pending'">
        <div v-if="toDoList.data.length">
          <div class="divide-primary-300 divide-y h-48 overflow-y-auto">
            <div v-for="(loc, i) in toDoList.data" :key="i" class="p-3">
              <span class="text-gray-500">{{ loc.name }}</span>
            </div>
          </div>
          <FormInputsPagination
            :pagination="toDoList"
            :offset="3"
            @paginate="getToDoList"
          />
        </div>
        <div v-else class="w-full p-4 bg-primary-100 rounded-md border mt-2">
          <span class="text-primary-700">No pending items to display...</span>
        </div>
      </div>

      <div v-else>
        <div v-if="completed.data.length">
          <div class="divide-primary-300 divide-y h-48 overflow-y-auto">
            <div
              v-for="(loc, index) in completed.data"
              :key="index"
              class="flex justify-between p-3 items-center"
            >
              <div class="flex space-x-2">
                <WIconsBase class="text-green-500" icon="check-circle-solid" />
                <span class="text-gray-500">{{ loc.name }}</span>
              </div>
              <div class="flex space-x-2">
                <span class="text-gray-400">fullfilled by</span>
                <WIconsBase class="text-primary-600" icon="paper-clip" />
                <WLinksBase
                  v-if="loc.documents && loc.documents.length === 1"
                  class="underline"
                  target="_blank"
                  :link="loc.documents[0].url"
                >
                  {{ loc.documents[0].name }}
                </WLinksBase>

                <span
                  v-else
                  class="
                    text-primary-600
                    underline
                    hover:text-primary-500
                    cursor-pointer
                  "
                  @click="
                    ;(selectedLocation = loc),
                      ($refs.documentList.isHidden = false)
                  "
                >
                  {{ loc.documents && loc.documents.length }} documents
                </span>
              </div>
            </div>
          </div>

          <FormInputsPagination
            :pagination="completed"
            :offset="3"
            @paginate="getToDoList(true)"
          />
        </div>
        <div v-else class="w-full p-4 bg-primary-100 rounded-md border mt-2">
          <span class="text-primary-700">No items to display...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="documents.data.length">
        <div class="divide-y h-56 overflow-y-auto">
          <div
            v-for="(doc, index) in documents.data"
            :key="index"
            class="flex justify-between p-6"
          >
            <div class="flex space-x-12">
              <div class="flex space-x-2">
                <WIconsBase class="text-primary-600" icon="paper-clip" />
                <span class="text-primary-600 underline">{{ doc.name }}</span>
              </div>
              <span
                class="
                  text-primary-600
                  underline
                  hover:text-primary-500
                  cursor-pointer
                "
                @click="
                  ;(selectedDocument = doc),
                    ($refs.locationList.isHidden = false)
                "
                >{{ doc.projects && doc.projects.length }} Location(s)</span
              >
            </div>

            <div class="flex space-x-4 items-center">
              <WIconsBase
                class="
                  text-gray-400
                  w-6
                  h-6
                  hover:text-gray-300 hover:cursor-pointer
                "
                icon="pencil"
                @click.native="
                  ;(selectedDocument = doc), ($refs.modal.isHidden = false)
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
                  ;(selectedDocument = doc),
                    ($refs.deleteDocModal.isHidden = false)
                "
              />
            </div>
          </div>
        </div>
        <FormInputsPagination
          :pagination="documents"
          :offset="3"
          @paginate="getDocuments"
        />
      </div>
      <div v-else class="w-full p-4 bg-primary-100 rounded-md border mt-2">
        <span class="text-primary-700">No documents to display...</span>
      </div>
    </div>
  </div>
  <div v-else class="mx-auto text-center my-4">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Loading...</div>
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
    activeOption: {
      type: Object,
      required: true,
    },
    verification: {
      type: Object,
      required: true,
    },
    scorecardPartID: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tab: 'To-Do',
      subTab: 'pending',
      documents: null,
      selectedDocument: null,
      selectedLocation: null,
      toDoList: null,
      completed: null,
      loading: false,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),

    tabs() {
      const tabs = [
        {
          name: `To-Do (${this.toDoList ? this.toDoList.total : '0'})`,
          icon: 'pencil-alt',
        },
        {
          name: `Uploads (${this.documents ? this.documents.total : '0'})`,
          icon: 'check-circle',
        },
      ]

      return tabs
    },
  },
  async mounted() {
    await this.getDocuments()
    await this.getToDoList()
    await this.getToDoList(true)
    this.loading = true
  },
  methods: {
    async getDocuments() {
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${
              this.scorecardPartID
            }/${this.verification.type}/${this.verification.id}/docs?page=${
              this.documents ? this.documents.current_page : '1'
            }`
          )
          .then((res) => {
            this.documents = JSON.parse(JSON.stringify(res.data))
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },

    async deleteDocument(id) {
      try {
        await this.$axios
          .delete(`api/scorecard/${this.scorecard.id}/document/${id}`)
          .then((res) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Document deleted successfully!',
            })
            this.getDocuments()
            this.$store.dispatch('scorecard/getVerificationList', {
              scorecardPartID: this.scorecardPartID,
            })
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },

    async getToDoList(isCompleted = false) {
      let page = '1'
      if (isCompleted) {
        if (this.completed) page = this.completed.current_page
      } else if (this.toDoList) page = this.toDoList.current_page
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${
              this.scorecardPartID
            }/${this.verification.type}/${
              this.verification.id
            }/todo?page=${page}${isCompleted ? '&completed' : ''}`
          )
          .then((res) => {
            if (isCompleted) {
              this.completed = res.data
            } else {
              this.toDoList = res.data
            }
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },
  },
}
</script>
