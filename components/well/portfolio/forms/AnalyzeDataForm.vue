<template>
  <div v-if="!loading">
    <div style="max-height: 70vh" class="overflow-y-scroll pr-2">
      <WHeadingsHTwo class="text-primary-900" heading="Additional Details" />
      <FormulateForm
        :key="forceReRender"
        class="space-y-2"
        :form-errors="formErrors"
        @submit="submit"
      >
        <div
          v-if="mode.name !== 'shared'"
          class="border border-gray-300 rounded-md shadow p-4"
        >
          <WHeadingsHFour
            class="text-primary-900"
            heading="WELL Certification"
          />
          <div class="flex space-x-2 mb-2">
            <FormulateInput
              v-model="formData.cert_score"
              type="number"
              class="w-full"
              label="Certification score"
              :validation="[
                ['max', 100],
                ['min', 0],
              ]"
            />
            <FormulateInput
              v-if="mode.name == 'project'"
              v-model="cert_status"
              class="w-full"
              :options="[
                { value: 'na', label: 'N/A' },
                { value: 'Compliance', label: 'Compliance' },
                { value: 'Silver', label: 'Silver' },
                { value: 'Gold', label: 'Gold' },
                { value: 'Platinum', label: 'Platinum' },
                { value: 'Pilot', label: 'Pilot' },
              ]"
              type="select"
              label="Certification status:"
            />
          </div>
          <div v-if="mode.name == 'project'" class="flex space-x-2">
            <FormulateInput
              v-model="formData.date_certified"
              class="w-full"
              type="datetimepicker"
              label="Certified date"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="formData.cert_expire"
              type="datetimepicker"
              class="w-full"
              label="Certified expiration"
              max="9999-01-01"
            />
          </div>
        </div>
        <div
          v-if="mode.name == 'project'"
          class="border border-gray-300 rounded-md shadow p-4"
        >
          <WHeadingsHFour
            class="text-primary-900"
            heading="WELL Precertification"
          />
          <div class="flex space-x-2">
            <FormulateInput
              v-model="formData.pre_score"
              class="w-full"
              type="number"
              label="Precertification score"
              :validation="[
                ['max', 100],
                ['min', 0],
              ]"
            />
            <FormulateInput
              v-model="pre_cert_status"
              class="w-full"
              :options="[
                { value: 'na', label: 'N/A' },
                { value: 'Compliance', label: 'Achieved' },
              ]"
              type="select"
              label="Precertification status"
            />
          </div>
          <div class="flex space-x-2">
            <FormulateInput
              v-model="formData.pre_cert_date"
              type="datetimepicker"
              class="w-full"
              label="Precertification date"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="formData.pre_cert_expire"
              class="w-full"
              type="datetimepicker"
              label="Precertification expiration"
              max="9999-01-01"
            />
          </div>
        </div>
        <div
          v-if="mode.module.hsr_opt || mode.name === 'shared'"
          class="border border-gray-300 rounded-md shadow p-4"
        >
          <WHeadingsHFour
            class="text-primary-900"
            heading="WELL Health-Safety"
          />
          <div class="flex space-x-2">
            <FormulateInput
              v-model="formData.hsr_score"
              type="number"
              label="Health-Safety score"
              class="w-full"
              :validation="[
                ['max', 100],
                ['min', 0],
              ]"
            />
            <FormulateInput
              v-if="mode.name == 'project'"
              v-model="hsr_status"
              type="select"
              :options="[
                { label: 'N/A', value: null },
                { label: 'Achieved', value: 'achieved' },
                { label: 'Not Achieved', value: 'not_achieved' },
              ]"
              class="w-full mb-2"
              label="Health-Safety status"
            />
          </div>
          <div v-if="mode.name == 'project'" class="flex space-x-2">
            <FormulateInput
              v-model="formData.hsr_achieved_date"
              type="datetimepicker"
              class="w-full"
              label="Health-Safety date"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="formData.hsr_expire"
              class="w-full"
              type="datetimepicker"
              label="Health-Safety expiration"
              max="9999-01-01"
            />
          </div>
        </div>
        <div v-if="mode.name !== 'project'" class="space-y-2">
          <div class="border border-gray-300 rounded-md shadow p-4">
            <WHeadingsHFour class="text-primary-900" heading="Report" />
            <FormulateInput
              v-model="document"
              label="Report Document"
              :value="document"
              type="fileupload"
              :multiple="false"
              :upload-path="`portfolio/${mode.module.portfolio_number}/dashboard/`"
              mime-types="application/pdf"
            />
            <FormulateInput
              v-model="formData.summary"
              label="Summary"
              type="textarea"
              input-class="h-44 border-primary-300 rounded-lg text-primary-700 block w-full mb-4 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            />
          </div>
          <div class="border border-gray-300 rounded-md shadow p-4">
            <WHeadingsHFour class="text-primary-900" heading="Concept Scores" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormulateInput
                v-for="(el, index) in mode.name === 'shared'
                  ? hsrConceptsData
                  : conceptData"
                :key="index"
                v-model="el.num"
                type="number"
                name="Score"
                step=".01"
                :validation="[
                  ['max', 15],
                  ['min', 0],
                ]"
                placeholder="Please enter score"
                :label="el.label"
                class="md:w-60 lg:w-80"
              />
            </div>
          </div>
          <div class="border border-gray-300 rounded-md shadow p-4">
            <WHeadingsHFour class="text-primary-900" heading="Region(s)" />

            <div v-if="formData.occupant_regions.length">
              <div
                v-for="(el, index) in formData.occupant_regions"
                :key="index"
                class="md:flex md:space-x-3 space-y-3 md:space-y-0 w-full justify-center"
              >
                <FormulateInput
                  v-model="el.value"
                  type="text"
                  name="Label"
                  validation="required|not:undefined"
                  label="Please enter name of the region"
                />
                <FormulateInput
                  v-model="el.num"
                  type="number"
                  name="Occupants"
                  validation="required"
                  label="Please enter number of occupants in the region"
                />
                <WIconsBase
                  icon="trash"
                  @click.native="
                    formData.occupant_regions.splice(index, 1), forceReRender++
                  "
                />
              </div>
            </div>
            <div class="w-48 mx-auto my-4">
              <WButtonsBase
                icon="plus"
                @click.native="
                  formData.occupant_regions.push({ name: null, num: null })
                "
              >
                Add Region
              </WButtonsBase>
            </div>
          </div>
        </div>
        <FormulateInput type="submit" label="Submit" />
        <FormulateErrors class="text-red-500" />
      </FormulateForm>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mode: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formErrors: [],
      formData: {
        occupant_regions: [],
      },
      document: [],
      conceptData: [
        {
          label: 'Air',
          value: 'Air',
          num: 0,
        },
        {
          label: 'Water',
          value: 'Water',
          num: 0,
        },
        {
          label: 'Nourishment',
          value: 'Nourishment',
          num: 0,
        },
        {
          label: 'Light',
          value: 'Light',
          num: 0,
        },
        {
          label: 'Movement',
          value: 'Movement',
          num: 0,
        },
        {
          label: 'Thermal Comfort',
          value: 'Thermal Comfort',
          num: 0,
        },
        {
          label: 'Sound',
          value: 'Sound',
          num: 0,
        },
        {
          label: 'Materials',
          value: 'Materials',
          num: 0,
        },
        {
          label: 'Mind',
          value: 'Mind',
          num: 0,
        },
        {
          label: 'Community',
          value: 'Community',
          num: 0,
        },
        {
          label: 'Innovation',
          value: 'Innovation',
          num: 0,
        },
      ],
      hsrConceptsData: [
        {
          label: 'Cleaning and Sanitization Procedures',
          value: 'Cleaning and Sanitization Procedures',
          num: 0,
        },
        {
          label: 'Emergency Preparedness Programs',
          value: 'Emergency Preparedness Programs',
          num: 0,
        },
        {
          label: 'Health Service Resources',
          value: 'Health Service Resources',
          num: 0,
        },
        {
          label: 'Air and Water Quality Management',
          value: 'Air and Water Quality Management',
          num: 0,
        },
        {
          label: 'Stakeholder Engagement and Communication',
          value: 'Stakeholder Engagement and Communication',
          num: 0,
        },
      ],
      cert_status: '',
      hsr_status: '',
      pre_cert_status: '',
      loading: true,
      forceReRender: 0,
    }
  },
  computed: {
    ...mapState({
      analyzeDummyData: (state) => state.portfolio.analyzeDummyData,
    }),
  },
  async mounted() {
    if (this.mode.name === 'project') {
      await this.$axios
        .get(`api/admin/project/${this.mode.module.id}/dummy/get`)
        .then((res) => {
          this.formData = { ...res.data.dummy }
          // dates
          this.formData.date_certified = res.data.date_certified
          this.formData.hsr_achieved_date = res.data.hsr_achieved_date
          this.formData.pre_cert_date = res.data.pre_cert_date
          // status
          this.hsr_status = res.data.hsr_status
          this.cert_status = res.data.cert_status
          this.pre_cert_status = res.data.pre_cert_status
        })
    } else {
      await this.$store.dispatch('portfolio/getAnalyzeDummyData', {
        mode: this.mode.name === 'shared' ? 'portfolio' : this.mode.name,
        id: this.mode.module.id,
      })
      if (this.analyzeDummyData.dummy) {
        this.formData = JSON.parse(JSON.stringify(this.analyzeDummyData.dummy))
        this.formData.occupant_regions = this.formatInput(
          this.analyzeDummyData.dummy.occupant_regions
        )
        if (this.analyzeDummyData.dummy.concept_score)
          if (this.mode.name === 'shared') {
            this.hsrConceptsData = this.formatInput(
              this.analyzeDummyData.dummy.concept_score
            )
          } else if (this.mode.name === 'portfolio') {
            this.conceptData = this.formatInput(
              this.analyzeDummyData.dummy.concept_score
            )
          }
        this.formData.link_s3 &&
          this.document.push({ url: this.formData.link_s3 })
      }
    }
    this.loading = false
  },
  methods: {
    async submit() {
      const data = { ...this.formData }
      data.cert_status = this.cert_status
      data.hsr_status = this.hsr_status
      data.pre_cert_status = this.pre_cert_status
      const endpoint =
        this.mode.name === 'portfolio' || this.mode.name === 'shared'
          ? 'portfolio'
          : this.mode.name
      let regionError = false
      if (
        this.formData.occupant_regions.length &&
        this.formData.occupant_regions.filter((region) => !region.value).length
      ) {
        regionError = true
      }
      if (!regionError) {
        if (this.mode.name === 'portfolio' || this.mode.name === 'shared') {
          if (this.formData.occupant_regions.length > 0) {
            data.occupant_regions = this.formatOutput(
              this.formData.occupant_regions
            )
          }
          if (this.mode.name === 'portfolio') {
            data.concept_score = this.formatOutput(this.conceptData)
          } else if (this.mode.name === 'shared') {
            data.concept_score = this.formatOutput(this.hsrConceptsData)
          }
          if (this.document.length) {
            data.link_s3 = this.document[0].url
          } else {
            data.link_s3 = null
          }
        }
        try {
          const res = await this.$axios.post(
            `api/admin/${endpoint}/${this.mode.module.id}/dummy/createOrUpdate`,
            data
          )
          if (res.status === 200) {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Additional data submitted!',
            })
          }
          if (this.mode.name === 'portfolio' || this.mode.name === 'shared') {
            await this.$store.dispatch('portfolio/getAnalyzeDummyData', {
              mode: endpoint,
              id: this.mode.module.id,
            })
            if (this.mode.name === 'portfolio') {
              await this.$store.dispatch('portfolio/getPortfolio', {
                id: this.mode.module.portfolio_number,
              })
            }
            if (this.mode.name === 'shared') {
              await this.$store.dispatch('shared/getSharedWorkspace', {
                id: this.mode.module.portfolio_number,
              })
            }
            this.$parent.forceReRender++
          }
        } catch (error) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.message,
          })
        }
        this.$parent.$parent.$refs.modal.isHidden = true
        this.formErrors = []
      } else {
        this.formErrors = [
          'Please check that all information is filled for the regions section.',
        ]
      }
    },
    formatOutput(arr) {
      const data = {}
      if (arr.length) {
        arr.forEach((el) => {
          data[el.value] = el.num
        })
      }
      return data
    },
    formatInput(regions) {
      const data = []
      for (const region in regions) {
        data.push({
          label: region,
          value: region,
          num: regions[region],
        })
      }
      return data
    },
  },
}
</script>
