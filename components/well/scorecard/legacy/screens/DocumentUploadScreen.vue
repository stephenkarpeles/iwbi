<template>
  <div>
    <div class="flex w-full border-b justify-between mb-4">
      <WHeadingsHThree
        class="text-primary-900"
        :heading="`${
          view === 'main'
            ? currentVer
              ? 'Upload a Document'
              : 'Update a Document'
            : 'Confirm Locations'
        }`"
      />
      <WIconsBase
        class="text-primary-900 text-lg cursor-pointer"
        icon="x"
        @click.native="closeModal()"
      />
    </div>
    <div
      :style="{
        height: '500px',
      }"
      class="overflow-y-auto"
    >
      <div v-if="view === 'main'" class="space-y-8">
        <div class="flex flex-col space-y-4">
          <span class="text-primary-900 font-bold"
            >1. Select a verification method *</span
          >
          <div class="flex space-x-4">
            <label
              v-for="(option, index) in verificationOptions"
              :key="index"
              class="flex items-center space-x-4 py-4 px-3 bg-primary-100 text-primary-600 rounded-md border border-primary-600"
            >
              <input
                v-model="formData.verif_method"
                type="radio"
                :value="option.value"
                class="focus:ring-primary-600 text-primary-600"
                @input="isAudit = option.is_auditable"
              />
              <span>{{ option.label }}</span>
              <span
                v-if="option.is_auditable"
                class="text-sm text-white bg-yellow-500 px-2 py-1 rounded-full"
                >Audit Pending</span
              >
            </label>
          </div>
        </div>

        <div
          v-if="isAudit"
          class="p-4 flex space-x-2 border border-primary-300 rounded-sm bg-primary-100 items-center"
        >
          <WIconsBase
            class="text-primary-500 w-10 h-10"
            icon="information-circle"
          />
          <span class="text-sm text-primary-900 opacity-90">
            This verification method is subject to an audit. Audit locations are
            randomly selected from your pursued locations shown below. To learn
            more about verification methods and the audit process, click
            <a
              href="https://v2.wellcertified.com/${scorecardVersion.version}/en/overview"
              target="_blank"
              class="active:text-primary-700 font-medium text-primary-600 hover:text-primary-800 transition duration-150 ease-in-out"
            >
              here.
            </a>
          </span>
        </div>

        <div class="flex flex-col space-y-4">
          <span class="text-primary-900 font-bold"
            >2. Select locations to tag to this document *</span
          >
          <div v-if="!isAudit" class="flex space-x-4 items-center">
            <WButtonsBase
              :type="confirmedLocations.length ? 'primaryInverted' : 'primary'"
              class="w-44"
              icon="pencil"
              @click.native="view = 'locations'"
              >{{
                confirmedLocations.length
                  ? 'Edit Locations'
                  : 'Select Locations'
              }}</WButtonsBase
            >
            <span v-if="confirmedLocations.length" class="text-primary-600"
              >{{ confirmedLocations.length }} Selected</span
            >
          </div>

          <div v-else class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              v-if="toDoList"
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="max-h-96 overflow-y-auto sm:rounded-md border">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700">
                    <tr class="text-white uppercase">
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      >
                        <FormulateInput
                          type="checkbox"
                          @click.native="toggleAll()"
                        />
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      >
                        Locations
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      >
                        Pursuing
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      ></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(loc, index) in toDoList.data"
                      :key="index"
                      :class="
                        currentVer && loc.documents.length ? 'opacity-60' : ''
                      "
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormulateInput
                          :key="forceReRender"
                          v-model="loc.selected"
                          :disabled="currentVer && loc.documents.length >= 1"
                          type="checkbox"
                        />
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900"
                      >
                        <span>{{ loc.name }}</span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900"
                      >
                        Assigned
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900"
                      >
                        Now
                      </td>
                      <td
                        v-if="loc.documents.length"
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 flex space-x-2"
                      >
                        <WIconsBase icon="paper-clip" />
                        <span>Submitted</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="mx-auto text-center">
              <WLoadingSpinner class="mx-auto" />
              <div class="mt-3 text-primary-600">Loading locations...</div>
            </div>
          </div>
          <span
            v-if="showErrors && confirmedLocations.length === 0"
            class="text-sm text-danger-500"
            >Please select location(s) before submitting.</span
          >
        </div>
        <div class="flex flex-col space-y-4">
          <span class="text-primary-900 font-bold"
            >3. Which requirement is the document fulfilling?</span
          >
          <ol type="a" style="list-style-type: lower-alpha">
            <FormulateInput
              v-model="formData.requirements"
              :options="reqOptions"
              type="checkbox"
            />
          </ol>
        </div>
        <div class="flex flex-col space-y-4">
          <span class="text-primary-900 font-bold"
            >4. Select file to upload *</span
          >
          <ul v-if="existingDoc">
            <li
              class="bg-gray-100 max-w-md mx-auto px-4 py-3 rounded-md shadow-md my-4 relative"
            >
              <span>
                {{ existingDoc }}
              </span>
              <button
                class="right-0 absolute mr-3 text-danger-500"
                type="button"
                @click="existingDoc = null"
              >
                remove
              </button>
            </li>
          </ul>
          <FileUploader v-else v-model="formData.document" />
          <span
            v-if="showErrors && formData.document === null"
            class="text-sm text-danger-500"
            >Please select a file before submitting.</span
          >
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="flex space-x-4">
          <FormulateInput
            v-model="targetName"
            class="w-52 -mb-4"
            type="search"
            name="search"
            placeholder="Search Locations"
            @keyup.enter="getLocations"
            @input.native="targetName === '' && getLocations()"
          />
        </div>
        <div class="flex justify-between">
          <FormulateInput
            v-model="filterPursue"
            :element-class="['flex space-x-4']"
            type="checkbox"
            :options="[
              { label: 'Select All Pursuing Now', value: 'now' },
              {
                label: 'Select All Pursuing Later',
                value: 'later',
              },
            ]"
          />
          <div class="flex items-center">
            <WIconsBase class="text-primary-600" icon="information-circle" />
            <span class="text-sm">Achieved locations cannot be untagged.</span>
          </div>
        </div>

        <div v-if="locations.length" class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="max-h-96 overflow-y-auto sm:rounded-md border">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700">
                    <tr class="text-white uppercase">
                      <th
                        scope="col"
                        class="pl-12 py-3 text-left text-sm tracking-wider"
                      >
                        Locations
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-sm tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(loc, index) in locations" :key="index">
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900 flex space-x-2 items-center"
                      >
                        <FormulateInput
                          v-model="loc.selected"
                          type="checkbox"
                        />
                        <span>{{ loc.name }}</span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900"
                      >
                        {{ loc.pursue_status ? 'Pursue' : '-' }}
                        {{ loc.pursue_status | capitalize }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-full p-4 bg-primary-100 rounded-md border">
          <span class="text-primary-700">No locations were found...</span>
        </div>
      </div>

      <div class="mt-24 border-t py-4 grid grid-cols-2 items-center">
        <WButtonsBase
          v-if="view !== 'main'"
          type="primaryInverted"
          class="w-24"
          icon="arrow-narrow-left"
          @click.native="view = 'main'"
          >Back</WButtonsBase
        >
        <FormulateInput
          v-if="view === 'main'"
          v-model="formData.isIntentStage"
          class="text-primary-900 text-sm"
          label="This is an intent-stage document"
          type="checkbox"
        />
        <WButtonsBase
          v-if="view === 'main'"
          class="w-52 col-start-2 justify-self-end"
          @click.native="uploadDocuments()"
          >{{ currentVer ? 'Submit' : 'Update' }}
          {{ formData.verif_method }}</WButtonsBase
        >
        <WButtonsBase
          v-else
          :disabled="selectedLocations.length <= 0"
          class="w-52 col-start-2 justify-self-end disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed"
          @click.native="
            ;(view = 'main'), (confirmedLocations = selectedLocations)
          "
          >Confirm Locations</WButtonsBase
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { globalMixin } from '~/mixins/globalMixin'
export default {
  mixins: [globalMixin],
  props: {
    part: {
      type: Object,
      required: true,
    },
    activeOption: {
      type: Object,
      required: true,
    },
    currentVer: {
      type: Object,
      required: false,
      default: null,
    },
    selectedDocID: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      view: 'main',
      formData: {
        isIntentStage: false,
        verif_method: '',
        requirements: [],
        document: null,
      },
      filterPursue: [],
      locations: [],
      confirmedLocations: [],
      targetName: '',
      isAudit: false,
      toggleAllEnabled: false,
      toDoList: null,
      forceReRender: 0,
      selectedDoc: null,
      showErrors: false,
      existingDoc: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    errors() {
      let errors = 0
      if (this.isAudit) {
        if (this.selectedLocations.length === 0) errors += 1
      } else if (this.confirmedLocations.length === 0) errors += 1
      if (this.formData.document === null) {
        if (this.currentVer) {
          errors += 1
        }
      }
      return errors
    },
    verificationOptions() {
      const arr = []
      this.activeOption.verifications.forEach((el) => {
        arr.push({
          label: el.name,
          value: el.name,
          is_auditable: el.is_auditable,
          id: el.id,
        })
      })
      return arr
    },
    selectedLocations() {
      if (this.isAudit) {
        return this.toDoList.data.filter((loc) => loc.selected)
      } else {
        return this.locations.filter((loc) => loc.selected)
      }
    },
    reqOptions() {
      return this.activeOption.requirements.map((el) => {
        return {
          label:
            `<li class='ml-2 tags' >` +
            this.addCitations(
              el.description,
              this.$store.state.project.project
            ) +
            '</li>',
          value: el.id,
        }
      })
    },
    scorecardPartID() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
    },
  },
  watch: {
    filterPursue(val) {
      const now = val.includes('now')
      const later = val.includes('later')
      if (val.length) {
        this.locations.forEach((loc) => {
          if (loc.pursue_status === 'now') {
            loc.selected = now
          } else if (loc.pursue_status === 'later') {
            loc.selected = later
          }
        })
      } else {
        this.locations.forEach((loc) => (loc.selected = false))
      }
    },
  },
  async mounted() {
    await this.getLocations()
    if (this.currentVer) {
      this.formData.verif_method = this.currentVer.name
      this.isAudit = this.currentVer.is_auditable
      if (this.isAudit)
        await this.getToDoList(this.currentVer.type, this.currentVer.id)
    }
    if (this.selectedDocID) {
      this.selectedDoc = await this.getDocument()
      this.formData.verif_method = this.selectedDoc.verifiable.name
      this.existingDoc = this.selectedDoc.name
      this.isAudit = this.selectedDoc.verifiable.is_auditable
      if (this.isAudit) {
        await this.getToDoList(
          this.selectedDoc.verifiable_type.split('\\').pop(),
          this.selectedDoc.verifiable_id
        )
        this.toDoList.data.forEach((el) => {
          this.selectedDoc.project_ids.forEach((proj) => {
            if (el.id === proj.id) {
              el.selected = true
            }
          })
        })
      } else {
        this.locations.forEach((loc) => {
          this.selectedDoc.project_ids.forEach((proj) => {
            if (loc.id === proj.id) {
              loc.selected = true
            }
          })
        })
      }

      this.confirmedLocations = this.selectedDoc.project_ids

      this.formData.requirements = this.selectedDoc.requirements.map(
        (el) => el.id
      )
      this.selectedDoc.stage === 'Intent'
        ? (this.formData.isIntentStage = true)
        : (this.formData.isIntentStage = false)
    }
  },
  methods: {
    closeModal() {
      this.$parent.isHidden = true
    },

    toggleAll() {
      this.toggleAllEnabled = !this.toggleAllEnabled
      this.toDoList.data.forEach((loc) => {
        loc.selected = this.toggleAllEnabled
      })
      this.forceReRender++
    },

    async getLocations() {
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${
              this.scorecardPartID
            }/projects?assigned_only=1${
              this.targetName !== '' ? '&name=' + this.targetName : ''
            }`
          )
          .then((res) => {
            res.data.forEach((loc) => (loc.selected = false))
            this.locations = res.data
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },

    async getToDoList(type, id) {
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecardPartID}/${type}/${id}/todo?all`
          )
          .then((res) => {
            this.toDoList = res.data
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },

    async getDocument() {
      try {
        const res = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/document/${this.selectedDocID}/get`
        )
        return res.data
      } catch (error) {}
    },
    async uploadDocuments() {
      if (this.errors !== 0) {
        return (this.showErrors = true)
      }
      const projectIDs = this.isAudit
        ? this.selectedLocations.map((loc) => parseInt(loc.id))
        : this.confirmedLocations.map((loc) => parseInt(loc.id))
      const reqIDs = this.formData.requirements.map((el) => parseInt(el))
      let data

      if (this.currentVer) {
        data = new FormData()
        data.append('file', this.formData.document)
        data.append('verifiable_type', this.currentVer.type)
        data.append('verifiable_id', this.currentVer.id)
        projectIDs.forEach((id) => {
          data.append('project_ids[]', id)
        })
        data.append('sub_part_id', this.activeOption.sub_part_id)
        data.append('part_ids[]', this.part.id)
        reqIDs.forEach((id) => {
          data.append('requirement_ids[]', id)
        })
        data.append(
          'stage',
          this.formData.isIntentStage ? 'Intent' : 'Implementation'
        )
      } else {
        data = new FormData()
        data.requirement_ids = reqIDs.forEach((id) => {
          data.append('requirement_ids[]', id)
        })
        data.append('part_ids[]', this.part.id)
        projectIDs.forEach((id) => {
          data.append('project_ids[]', id)
        })
        if (this.formData.document) {
          data.append('file', this.formData.document)
        }
        data.append(
          'stage',
          this.formData.isIntentStage ? 'Intent' : 'Implementation'
        )
      }

      try {
        let res = null
        if (this.currentVer) {
          res = await this.$store.dispatch('shared/uploadScorecardDocument', {
            scorecardId: this.scorecard.id,
            data,
          })
        } else {
          res = await this.$store.dispatch('shared/updateScorecardDocument', {
            scorecardId: this.scorecard.id,
            doc_id: this.selectedDocID,
            data,
          })
        }
        if (res.status === 200) {
          this.$store.dispatch('scorecard/getVerificationList', {
            scorecardPartID: this.scorecardPartID,
          })
          this.$parent.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document submitted successfully!',
          })
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.data.message,
        })
      }
    },
  },
}
</script>
