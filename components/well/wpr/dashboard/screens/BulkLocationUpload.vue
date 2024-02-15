<template>
  <div class="w-full">
    <WFeedbackAlert ref="alert" />
    <div class="w-full rounded">
      <label>Download Template</label>
      <WButtonsDropdown>
        <WButtonsBase type="primaryInverted">
          WELL bulk upload.xlsm
        </WButtonsBase>
        <template #customButtons>
          <WButtonsBase
            class="leading-3"
            type="neutral"
            @click.native.prevent.stop="downloadTemplate('sqft')"
          >
            Imperial (ft<sup>2</sup>)
          </WButtonsBase>
          <WButtonsBase
            class="leading-3"
            type="neutral"
            @click.native.prevent.stop="downloadTemplate('sqm')"
          >
            Metric (m<sup>2</sup>)
          </WButtonsBase>
        </template>
      </WButtonsDropdown>
      <FormulateInput
        v-model="type"
        class="mt-2"
        type="select"
        :options="[
          { label: 'sqft', value: 'sqft' },
          { label: 'sqm', value: 'sqm' },
        ]"
        label="Type*"
      />
    </div>
    <FormulateForm class="my-2" @submit="submitForm">
      <div v-if="error !== ''" class="rounded w-full p-3 bg-danger-300 mt-3">
        <p class="text-white" v-html="error"></p>
      </div>
      <div
        v-if="!file"
        class="
          flex
          justify-center
          px-6
          pt-5
          pb-6
          border-2 border-gray-300 border-dashed
          rounded-md
        "
      >
        <div class="text-center w-full">
          <div class="mt-1 text-sm text-gray-600">
            <ul></ul>
            <div class="overflow-hidden relative w-full mt-4 mb-4">
              <div class="text-center w-full">
                <svg
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  class="mx-auto h-12 w-12 text-gray-400"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <div class="mt-1 text-sm text-gray-600">
                  <div
                    class="
                      font-medium
                      text-primary-600
                      hover:text-primary-500
                      focus:outline-none focus:underline
                      transition
                      duration-150
                      ease-in-out
                    "
                  >
                    Upload a file
                  </div>
                  or drag and drop
                </div>
                <p class="mt-1 text-xs text-gray-500"></p>
              </div>
              <input
                type="file"
                accept=""
                class="
                  cursor-pointer
                  absolute
                  block
                  py-2
                  px-4
                  w-full
                  h-full
                  opacity-0
                  top-0
                "
                @change="handleFileChange($event)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <ul class="my-12">
          <li
            class="
              bg-gray-100
              max-w-md
              mx-auto
              px-4
              py-3
              rounded-md
              shadow-md
              my-4
              relative
            "
          >
            <span>
              {{ file.name }}
            </span>
            <button
              class="right-0 absolute mr-3 text-danger-500"
              type="button"
              @click="file = null"
            >
              remove
            </button>
          </li>
        </ul>
        <div class="flex w-full">
          <div class="w-full mx-auto">
            <FormulateInput
              v-if="!apiLoading"
              :disabled="apiLoading"
              class="col-start-6"
              type="submit"
              icon="upload"
              label="Upload"
            />
            <WButtonsBase v-else disabled type="primary">
              <WLoadingSpinner type="button" class="mx-auto"
            /></WButtonsBase>
          </div>
        </div>
      </div>
      <div
        class="
          mt-7
          rounded-md
          bg-yellow-50
          p-4
          mb-5
          rounded-lg
          border border-yellow-300
        "
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="mt-3 h-5 w-5 text-yellow-400"
              x-description="Heroicon name: exclamation"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div class="ml-3">
            <WHeadingsHFour
              class="text-yellow-600"
              heading="Adding 100+ locations?"
            />
            <div class="mt-2 text-sm leading-5 text-yellow-700">
              <p>
                If your file contains more than 100 locations, it should be
                shared with the WELL Health-Safety Rating team (<a
                  class="text-primary-700"
                  href="mailto:healthsafety@wellcertified.com"
                  >healthsafety@wellcertified.com</a
                >) to be uploaded on your behalf.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      apiLoading: false,
      type: 'sqft',
      file: '',
      error: '',
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
  },
  methods: {
    downloadTemplate(type) {
      if (type === 'sqft') {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/hsr-locations-sqft.xlsm',
          '_blank'
        )
      } else {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/hsr-locations-sqm.xlsm',
          '_blank'
        )
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0]
      if (this.file.name.split('.').pop() !== 'xlsm') {
        this.file = ''
        this.error = ' Please select a valid file.'
      } else {
        this.error = ''
      }
    },
    async submitForm() {
      this.apiLoading = true
      if (!this.file) {
        this.error = 'Please select a file.'
        this.apiLoading = false
        return false
      }
      const data = {
        unit: this.type,
        type: 'location',
        file: this.file,
      }

      const self = this

      await this.$store
        .dispatch('shared/uploadLocations', data)
        .then((res) => {
          self.$store.dispatch('shared/getSharedProjects', {
            paginate: 'Yes',
            page: 1,
          })
          self.$store.dispatch('notifications/toastMessage', {
            message: 'Excel import will be processed in next 10-15 minutes.',
          })
          self.apiLoading = false
          self.$parent.toggleOpen()
        })
        .catch((err) => {
          this.apiLoading = false
          this.error =
            err.response.data.msg +
            '&nbsp;Click here to <a class="underline" href="' +
            err.response.data.url +
            '" target="_open">download</a>'
        })
    },
  },
}
</script>
