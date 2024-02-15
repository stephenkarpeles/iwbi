<template>
  <div>
    <FormulateForm v-if="formData" class="space-y-2" @submit="updateProject">
      <div class="shadow-lg border rounded-lg p-5">
        <WHeadingsHFour heading="Project Information" />
        <hr class="my-5" />

        <FormulateInput
          v-model="formData.name"
          type="text"
          label="Projects name"
          class="w-full"
          validation="required"
          :disabled="currentUser.role.includes('well-admin') ? false : true"
        />
        <!-- <FormulateInput
          v-model="company"
          type="companymultisearch"
          name="organization"
          label="Projects name"
          validation="required"
          :disabled="currentUser.role.includes('well-admin') ? false : true"
          :searchable="true"
          :clearonselect="false"
          :closeonselect="true"
          :optionslimit="10"
        /> -->
        <div class="w-full relative">
          <FormulateInput
            v-model="formData.area"
            type="number"
            min="0"
            step=".01"
            label="Project area"
            validation="required|number"
            :disabled="currentUser.role.includes('well-admin') ? false : true"
          />
          <div
            style="height: 38px"
            class="absolute right-0 top-0 mt-6 flex bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
          >
            <div class="my-auto px-3">ft <sup>2</sup></div>
          </div>
        </div>
        <FormulateInput
          v-if="currentUser.role.includes('well-admin')"
          v-model="formData.project_type"
          :options="projectTypeOptions"
          label="What are you working on?"
          type="radio"
          validation="required"
        />
        <FormulateInput
          v-model="formData.space_types"
          :options="spaceTypeOptions"
          type="checkbox"
          label="Which of the following space types does your project contain?"
          validation="min:1,length"
        />
        <FormulateInput
          v-model="formData.ventilation_type"
          :options="ventilationOptions"
          label="How will your space be ventilated?"
          type="checkbox"
        />
        <FormulateInput
          v-model="formData.construction_status"
          :options="[
            { label: 'No, existing building', value: 0 },
            { label: 'Yes', value: 1 },
          ]"
          label="Are you planning to undergo construction or renovation?"
          type="radio"
        />
        <FormulateInput
          v-model="formData.target_cert_level"
          :options="certificationLevels"
          label="Target certification level"
          type="radio"
        />
        <FormulateInput
          v-model="formData.no_of_occupants"
          type="number"
          min="0"
          label="Number of occupants"
          validation="number"
        />
        <div class="flex space-x-2">
          <FormulateInput
            data-id="anticipated-input"
            v-model="formData.construction_completion_date"
            class="w-full"
            type="datetimepicker"
            max="9999-01-01"
            label="Anticipated date of construction completion"
          />
          <div v-if="formData.construction_completion_date" class="mt-7">
            <WButtonsBase
              icon="refresh"
              @click.native="formData.construction_completion_date = null"
            >
              Clear
            </WButtonsBase>
          </div>
        </div>
        <div class="flex space-x-2">
          <FormulateInput
            data-id="est-date-input"
            v-model="formData.doc_sub_date_est"
            class="w-full"
            type="datetimepicker"
            max="9999-01-01"
            label="Estimated date of document submission"
          />
          <div v-if="formData.doc_sub_date_est" class="mt-7">
            <WButtonsBase
              icon="refresh"
              @click.native="formData.doc_sub_date_est = null"
            >
              Clear
            </WButtonsBase>
          </div>
        </div>
        <div class="flex space-x-2">
          <FormulateInput
            v-model="formData.d_and_o_est_date"
            class="w-full"
            type="datetimepicker"
            max="9999-01-01"
            label="Estimated date of documentation submission for Precertification Review"
          />
          <div v-if="formData.d_and_o_est_date" class="mt-7">
            <WButtonsBase
              icon="refresh"
              @click.native="formData.d_and_o_est_date = null"
            >
              Clear
            </WButtonsBase>
          </div>
        </div>
        <FormulateInput
          v-model="formData.other_certification"
          :options="otherCertificationOptions"
          label="Other certifications being pursued"
          type="checkbox"
        />
        <FormulateInput
          v-if="
            formData.other_certification &&
            formData.other_certification.includes('other')
          "
          v-model="formData.other_certification_name"
          type="text"
          label="Please specify*"
          validation="required"
        />
        <FormulateInput
          v-model="formData.other_certification_project_id"
          label="Other certification Project ID"
          type="text"
        />
        <FormulateInput
          v-model="formData.scope_and_premises"
          label="Project scope & premises"
          type="textarea"
        />
        <FormulateInput
          v-model="formData.goals_and_vision"
          label="WELL project goals and vision"
          type="textarea"
        />
        <FormulateInput
          v-model="formData.project_public"
          :options="[
            { label: 'No', value: 0 },
            { label: 'Yes', value: 1 },
          ]"
          label="Is this a public project?"
          type="radio"
        />
        <FormulateInput
          data-id="save-btn"
          v-if="formData.type !== 'v2-pilot-upgraded'"
          type="submit"
          label="Save Changes"
        />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    inputData: {
      type: Object,
      required: true,
      default: () => null,
    },
  },
  data() {
    return {
      company: null,
      formData: null,
      projectTypeOptions: [
        { value: 'new-existing', label: 'A building that I own & occupy' },
        { value: 'non-cs', label: 'A building I own and lease out' },
        { value: 'cs', label: 'A building I own and lease out (WELL Core)' },
        { value: 'cics', label: 'A space I lease' },
      ],
      spaceTypeOptions: [
        { label: 'Office', value: 12 },
        { label: 'Residential', value: 3 },
        { label: 'Retail', value: 6 },
        { label: 'Education', value: 11 },
        { label: 'Hospitality', value: 16 },
        { label: 'Assisted Living', value: 17 },
        { label: 'Cultural Institutions', value: 18 },
        { label: 'Public Assembly', value: 19 },
        { label: 'Commercial Kitchen', value: 2 },
        { label: 'Commercial Dining', value: 4 },
        { label: 'Industrial', value: 20 },
        { label: 'Laboratory', value: 21 },
        { label: 'Fitness', value: 22 },
        { label: 'Healthcare', value: 24 },
        { label: 'Warehouses', value: 9 },
        { label: 'Childcare', value: 25 },
        { label: 'Auditorium', value: 26 },
        { label: 'Transportation', value: 27 },
        { label: 'Library', value: 28 },
        { label: 'Grocery', value: 29 },
        { label: 'Sporting Venue', value: 23 },
        { label: 'Shopping Center', value: 30 },
        { label: 'Manufacturing', value: 31 },
        { label: 'Medical Office', value: 32 },
        { label: 'Data Centers', value: 33 },
        { label: 'Convention Centers', value: 34 },
        { label: 'Others', value: 15 },
      ],
      ventilationOptions: [
        {
          value: 'Mechanically ventilated spaces',
          label: 'Mechanically ventilated spaces',
        },
        {
          value: 'Naturally ventilated spaces',
          label: 'Naturally ventilated spaces',
        },
        {
          value: 'Mixed-mode ventilated spaces',
          label: 'Mixed-mode ventilated spaces',
        },
      ],
      certificationLevels: [
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
      ],
      otherCertificationOptions: [
        { label: 'BREEAM', value: 'breeam' },
        { label: 'DGNB', value: 'dgnb' },
        { label: 'Green Star', value: 'green_star' },
        { label: 'HQE', value: 'hqe' },
        { label: 'LEED', value: 'leed' },
        {
          label: 'Living Building Challenge',
          value: 'living_building_challenge',
        },
        { label: 'OSMOZ', value: 'osmoz' },
        { label: 'Other', value: 'other' },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.inputData))
    this.formData.space_types = this.inputData.space_types.map((a) => a.id)
    if (this.inputData.project_type === 'cs') {
      this.spaceTypeOptions.splice(1, 1)
    }
    // Bind CompanyMultiSearch state to existing company_id and name
    // if (this.formData.name && this.formData.name !== '') {
    //   this.company = {
    //     ...this.company,
    //     name: this.formData.name,
    //   }
    // }
    // if (this.formData.company_id) {
    //   this.company = {
    //     ...this.company,
    //     id: this.formData.company_id,
    //   }
    // }
  },
  methods: {
    async updateProject() {
      const payload = {
        name: null,
        area: null,
        company_id: null,
        project_type: null,
        space_types: null,
        primary_space_type_id: null,
        ventilation_type: null,
        construction_status: null,
        target_cert_level: null,
        no_of_occupants: null,
        construction_completion_date: null,
        doc_sub_date_est: null,
        d_and_o_est_date: null,
        other_certification: null,
        other_certification_project_id: null,
        other_certification_name: null,
        scope_and_premises: null,
        goals_and_vision: null,
        project_public: null,
        final_report_accept_date: null,
        portfolio_id: null,
        subset_ids: null,
        doc_sub_date_est_confirm: null,
      }
      Object.keys(this.formData).forEach((key) => {
        if (key in payload) payload[key] = this.formData[key]
      })
      payload.subset_ids = this.formData.subset_ids.ids
      if (!payload.primary_space_type_id) {
        payload.primary_space_type_id = payload.space_types[0]
      }
      if (payload.space_types && payload.space_types.length) {
        if (!payload.space_types.includes(payload.primary_space_type_id)) {
          payload.primary_space_type_id = payload.space_types[0]
        }
      }
      // Bind company_id and name to CompanyMultiSearch state
      // if (this.company.name && this.company.id && this.company.name !== '') {
      //   payload.company_id = this.company.id
      //   payload.name = this.company.name
      // }
      try {
        await this.$axios.put(
          `api/project/update/${this.formData.id}/part1`,
          payload
        )
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Fields updated sucessfully!',
        })
        await this.$store.dispatch(
          'project/getProjectByNumber',
          this.$route.params.projectId
        )
        this.$router.push(
          `/projects/${this.formData.type}/${this.formData.project_number}/dashboard`
        )
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
    },
  },
}
</script>
