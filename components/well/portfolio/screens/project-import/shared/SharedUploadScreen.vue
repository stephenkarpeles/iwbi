<template>
  <div class="space-y-6">
    <!-- Error message -->
    <div
      v-if="errMessage !== ''"
      class="mt-2 p-6 rounded-md bg-danger-300 border-2 border-danger-500 bg-opacity-40 flex flex-col"
    >
      <span class="text-primary-900 font-semibold opacity-80"
        >{{ errMessage }} Please try again.</span
      >
    </div>
    <div class="flex">
      <div
        :class="`w-1/2 border border-primary-600 rounded-lg cursor-pointer hover:shadow-lg hover:bg-primary-100 ${
          formData.action === 'update' ? 'opacity-50' : ''
        }`"
        @click="() => (formData.action = 'create')"
      >
        <div
          style="background-image: url('/portfolio/import/inbox.png')"
          class="rounded-t-lg border-b border-primary-600 bg-cover h-28 bg-no-repeat bg-center"
        ></div>
        <div class="px-6 pb-3 flex flex-col">
          <WHeadingsHThree
            class="text-primary-900"
            heading="Create new locations"
          />
          <div class="text-primary-900 opacity-50">
            with individual location profiles
            {{
              recertification && recertification.location_changed === 1
                ? 'for the WELL Health-Safety Ratings'
                : 'and scorecards within your WELL Portfolio'
            }}
          </div>

          <div class="mt-2">
            <WButtonsDropdown>
              <label
                class="text-md font-bold leading-5 text-secondary-800 sm:mt-px sm:pt-2"
              >
                Download sample template
              </label>
              <div
                class="rounded-lg mt-2 flex justify-between text-primary-700 border border-primary-300 px-4 py-2 cursor-pointer hover:bg-primary-200"
              >
                <div class="flex items-center space-x-4">
                  <div class="rounded-md bg-primary-600 p-3">
                    <WIconsBase icon="document-report" class="text-white" />
                  </div>
                  <span class="text-primary-900 opacity-50"
                    >WELL_Bulk_Create.xlsm</span
                  >
                </div>
                <WIconsBase icon="download" />
              </div>
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
          </div>
        </div>
      </div>
      <div
        class="mx-4 bg-secondary-800 rounded-lg py-1 px-3 my-auto text-white h-auto shadow-lg"
      >
        OR
      </div>
      <div
        :class="`w-1/2 border border-primary-600 rounded-lg cursor-pointer hover:shadow-lg hover:bg-primary-100 ${
          formData.action === 'create' ? 'opacity-50' : ''
        }`"
        @click="
          () => {
            if (portfolio && portfolio.total_property_count) {
              formData.action = 'update'
            } else {
              $store.dispatch('notifications/toastMessage', {
                message: `You don't have any project(s) to update. Please import new project(s) and try again.`,
              })
            }
          }
        "
      >
        <div
          style="background-image: url('/portfolio/import/gear.png')"
          class="rounded-t-lg border-b border-primary-600 bg-cover h-28 bg-no-repeat bg-center"
        ></div>
        <div class="px-6 pb-3 flex flex-col">
          <WHeadingsHThree
            class="text-primary-900"
            heading="Update existing locations"
          />
          <div class="text-primary-900 opacity-50">
            {{
              recertification && recertification.location_changed === 1
                ? 'by uploading locations and location specific fields that you want to update for your WELL Health-Safety Rating.'
                : 'by uploading locations and fields that you want to update using WELL Project Numbers'
            }}
          </div>

          <div class="mt-2" @click="$store.dispatch('shared/exportProjects')">
            <label
              class="text-md font-bold leading-5 text-secondary-800 sm:mt-px sm:pt-2"
            >
              {{
                recertification && recertification.location_changed === 1
                  ? 'Download existing location data'
                  : 'Download existing location data with Project Numbers'
              }}
            </label>
            <div
              class="rounded-lg mt-2 flex justify-between text-primary-700 border border-primary-300 px-4 py-2 cursor-pointer hover:bg-primary-200"
            >
              <div class="flex items-center space-x-4">
                <div class="rounded-md bg-primary-600 p-3">
                  <WIconsBase icon="document-report" class="text-white" />
                </div>
                <span class="text-primary-900 opacity-50"
                  >WELL_Bulk_Update.xlsm</span
                >
              </div>
              <WIconsBase icon="download" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center px-6 py-2 border-2 border-primary-300 border-dashed rounded-md bg-primary-100"
    >
      <div class="text-center w-full">
        <div class="mt-1 text-sm text-gray-600">
          <div
            v-if="formData.file"
            class="bg-gray-100 max-w-md mx-auto px-4 py-3 rounded-md shadow-md my-4 flex items-center"
          >
            <WIconsBase icon="document-report" class="w-6 h-6" />
            <span>{{ formData.file.name }}</span>
            <button
              class="ml-auto text-danger-500"
              type="button"
              @click.stop="onDelete()"
            >
              remove
            </button>
          </div>
          <div v-else class="overflow-hidden relative w-full mt-4 mb-4">
            <div class="text-center w-full">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
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
                  class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                >
                  Upload a file
                </div>
                or drag and drop
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Accepted File types: .xls, .xlsx, .xlm, .xlsm
              </p>
            </div>
            <input
              class="cursor-pointer absolute block py-2 px-4 w-full h-full opacity-0 top-0"
              type="file"
              accept=""
              @change="handleFileUpload($event)"
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
    savedProgress: {
      type: Object,
      required: false,
      default: () => {},
    },
    errMessage: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        action: 'create',
        file: null,
        model_type: 'hsr',
        model_id: null,
      },
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        if (val.file && val.action !== '') {
          this.$emit('setUploadData', val)
        }
      },
    },
  },
  async mounted() {
    if (this.portfolio) this.formData.model_id = this.portfolio.id
    await this.$store.dispatch('recertification/getHSRRecertification')
  },
  methods: {
    handleFileUpload(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'zip' || fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else {
        this.formData.file = event.target.files[0]
      }
    },
    onDelete() {
      this.formData.file = null
    },
    downloadTemplate(type) {
      if (process.client && window.location.href.includes('account.')) {
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
      } else if (type === 'sqft') {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/dev-hsr-locations-sqft.xlsm',
          '_blank'
        )
      } else {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/dev-hsr-locations-sqm.xlsm',
          '_blank'
        )
      }
    },
  },
}
</script>
