<template>
  <div class="pb-20">
    <FormulateForm v-if="portfolio && portfolio.id" @submit="nextStep">
      <div class="flex justify-between my-2 text-gray-500 items-center">
        <WHeadingsHThree
          class="text-primary-800"
          :heading="
            recertification && recertification.location_changed === 1
              ? 'Locations Import'
              : 'Portfolio Locations Import'
          "
        />
        <div>{{ currentStep + 1 }} of 4</div>
      </div>
      <WLinksBase
        link="#"
        icon="arrow-narrow-left"
        class="mb-2"
        @click.native="cancelProcess()"
      >
        Back to Locations
      </WLinksBase>
      <WStepsHorizontal
        alignment="justify-around"
        :steps="[
          {
            name: 'UPLOAD',
            status: stepsStatus[0],
          },
          {
            name: 'MATCH',
            status: stepsStatus[1],
          },
          {
            name: 'VALIDATE',
            status: stepsStatus[2],
          },
          {
            name: 'FINISH',
            status: stepsStatus[3],
          },
        ]"
      />
      <PortfolioSharedUploadScreen
        v-if="currentStep === 0"
        ref="upload"
        class="my-5"
        :err-message="res_message_upload"
        :saved-progress="savedProgress"
        @setUploadData="setUploadData($event)"
      />
      <PortfolioSharedMapScreen
        v-if="currentStep === 1"
        ref="mappings"
        class="mt-5"
        :mapping-data-prop="mappingData"
        :err-message="res_message"
        @getUnmatchedColumns="getUnmatchedColumns($event)"
      />
      <PortfolioSharedValidationScreen
        v-if="currentStep === 2"
        :validation-data="validationData"
        :validation-action="validationAction"
        class="mt-5"
        @getErrors="getValidationErrors($event)"
      />
      <PortfolioSharedDetailsScreen
        v-if="currentStep === 3"
        :details="res_message"
        class="mt-5"
      />
      <div
        :class="[
          navExpanded ? 'ml-64 pr-72' : 'ml-16 pr-24',
          'pl-8 left-0 w-full py-5 fixed bottom-0 bg-primary-100 flex justify-between border-t border-primary-300 shadow',
        ]"
      >
        <div class="flex">
          <div v-if="currentStep !== 3" class="flex space-x-4">
            <div v-if="currentStep !== 0" class="w-32">
              <WButtonsBase type="primaryInverted" @click.native="prevStep()">
                Back
              </WButtonsBase>
            </div>
            <div class="w-32 flex items-center underline">
              <WLinksBase
                class="my-auto items-center flex"
                @click.native="cancelProcess()"
              >
                Cancel
              </WLinksBase>
            </div>
          </div>
        </div>
        <div class="flex space-x-3">
          <div
            v-if="currentStep === 1 && unmatchedColumns.length"
            class="text-primary-900 text-right text-sm"
          >
            <span class="font-semibold"
              >You have {{ unmatchedColumns.length }} unmatched columns</span
            >
            <FormulateInput
              v-model="importDataConfirm"
              label="Don't import data in unmatched columns"
              type="checkbox"
            />
          </div>
          <div v-if="currentStep === 3" class="w-32">
            <WButtonsBase
              type="primaryInverted"
              @click.native="
                $router.push(
                  `/shared-workspaces/${portfolio.portfolio_number}/locations`
                )
              "
            >
              Close
            </WButtonsBase>
          </div>
          <div class="w-48">
            <WButtonsBase v-if="loading" :type="'primaryInverted'">
              <span>
                <WLoadingSpinner type="button" class="mx-auto" />
              </span>
            </WButtonsBase>
            <FormulateInput
              v-else
              :disabled="isNextDisabled"
              type="submit"
              :name="
                currentStep === 2
                  ? 'Finish Import'
                  : currentStep === 3
                  ? 'Import more locations'
                  : 'Next'
              "
            />
          </div>
        </div>
      </div>
    </FormulateForm>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading WELL Locations List...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar-no-footer', // sidebar layout
  data() {
    return {
      currentStep: 0,
      loading: false,
      stepsStatus: ['current', '', '', ''],
      uploadData: null,
      mappingData: {
        action: null,
        import_id: null,
        import_type: null,
        import_type_id: null,
        mappings: null,
        system_fields: null,
      },
      validationData: null,
      validationAction: '',
      res_message: {},
      unmatchedColumns: [],
      importDataConfirm: false,
      savedProgress: null,
      res_message_upload: '',
      validationErrors: null,
    }
  },
  head() {
    return {
      title: `Portfolio Locations Import`,
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
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
    isNextDisabled() {
      switch (this.currentStep) {
        case 0:
          if (this.uploadData === null) return true
          break
        case 1:
          if (this.unmatchedColumns.length > 0 && !this.importDataConfirm)
            return true
          break
        case 2:
          if (this.validationErrors && this.validationErrors.length > 0) {
            return true
          }
          break
      }
      return false
    },
    navExpanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }
      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }
      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Locations')
    }
    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
    // await this.$store.dispatch('portfolio/getProjectLocations')
  },
  methods: {
    nextStep() {
      const self = this
      this.$parent.$parent.$refs.content.scrollTop = 0
      switch (this.currentStep) {
        case 0:
          if (this.uploadData !== null) {
            self.loading = true
            this.$store
              .dispatch('portfolio/bulkUploadProperties', this.uploadData)
              .then((result) => {
                self.mappingData = { ...result }
                self.loading = false
                this.stepsStatus[this.currentStep] = 'complete'
                this.currentStep++
                this.stepsStatus[this.currentStep] = 'current'
              })
              .catch((err) => {
                self.loading = false
                this.res_message_upload = err.response.data.msg
              })
          }
          break
        case 1:
          self.loading = true
          // format project_column before submission
          // eslint-disable-next-line no-case-declarations
          const mappings = self.$refs.mappings.mappings.map((el) => {
            return {
              ...el,
              project_column: el.project_column.value,
            }
          })
          self.$store
            .dispatch('portfolio/bulkUploadValidate', {
              import_id: self.mappingData.import_id,
              mappings,
            })
            .then((result) => {
              this.validationData = result
              self.loading = false
              this.stepsStatus[this.currentStep] = 'complete'
              this.currentStep++
              this.stepsStatus[this.currentStep] = 'current'
            })
            .catch((err) => {
              self.loading = false
              this.res_message = {
                msg: err.response.data.msg,
                reqs: err.response.data.required_mappings,
              }
            })
          break
        case 2:
          self.loading = true
          self.$store
            .dispatch('portfolio/bulkImportStore', {
              id: self.mappingData.import_id,
            })
            .then((res) => {
              this.res_message = res.data
              this.stepsStatus[this.currentStep] = 'complete'
              this.currentStep++
              this.stepsStatus[this.currentStep] = 'current'
              self.loading = false
            })
            .catch((err) => {
              this.$store.dispatch('notifications/toastMessage', {
                message: err.response.data.message,
              })
              self.loading = false
            })
          break
        case 3:
          self.loading = true
          window.location.reload()
          self.loading = false
          break
      }
    },
    async prevStep() {
      if (this.currentStep === 1) {
        this.stepsStatus[this.currentStep] = ''
        this.stepsStatus[this.currentStep - 1] = 'current'
        this.$store
          .dispatch('portfolio/bulkImportInfo', {
            import_id: this.mappingData.import_id,
          })
          .then((res) => {
            this.$refs.upload.formData.action = res.data.action
            this.$refs.upload.formData.file = this.uploadData.file
            this.savedProgress = {
              action: res.data.action,
              file_name: res.data.file_name,
            }
          })
      }
      if (this.currentStep === 2) {
        this.stepsStatus[this.currentStep] = ''
        this.stepsStatus[this.currentStep - 1] = 'current'
        await this.$store
          .dispatch('portfolio/bulkImportInfo', {
            import_id: this.mappingData.import_id,
          })
          .then((res) => {
            this.mappingData.mappings = res.data.mapping
          })
      }
      this.currentStep--
    },
    setUploadData(data) {
      this.uploadData = data
    },
    cancelProcess() {
      this.$router.push(
        `/shared-workspaces/${this.portfolio.portfolio_number}/locations`
      )
    },
    getUnmatchedColumns(val) {
      this.unmatchedColumns = val
    },
    getValidationErrors(val) {
      this.validationErrors = val
    },
  },
}
</script>
