<template>
  <div class="flex flex-wrap px-10 py-5">
    <div class="w-full mb-5 lg:w-1/3 lg:pr-16">
      <WHeadingsHThree heading="Edit Project" :sub-heading="project.name" />
      <div class="space-y-2">
        <WButtonsBase
          :type="currentTab === 'Project' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Project'"
        >
          Project Information
        </WButtonsBase>
        <WButtonsBase
          :type="currentTab === 'Owner' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Owner'"
        >
          Owner Information
        </WButtonsBase>
        <WButtonsBase
          v-if="
            currentUser.role.includes('admin') ||
            currentUser.role.includes('well-admin')
          "
          :type="currentTab === 'Admin' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Admin'"
        >
          Admin Fields
        </WButtonsBase>
        <WButtonsBase
          v-if="AdminAccess && recertificationList.length"
          :type="currentTab === 'Renewal' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Renewal'"
        >
          Renewal Fields
        </WButtonsBase>
      </div>
      <div
        v-if="
          (currentUser.role.includes('well-admin') ||
            currentUser.role.includes('admin') ||
            formData.user_id === currentUser.id) &&
          formData.reg_payment_status !== 'paid'
        "
        class="mt-10"
      >
        <WButtonsBase type="danger" @click.native="deleteProject()">
          Delete Project
        </WButtonsBase>
      </div>
    </div>
    <div class="w-full lg:w-2/3">
      <div v-if="currentTab === 'Project'">
        <P1InfoScreen :input-data="formData" />
      </div>
      <div v-if="currentTab === 'Owner'">
        <P1OwnerInfoScreen :input-data="formData" />
      </div>
      <div v-if="currentTab === 'Admin'">
        <P1AdminScreen
          :reviewer-selected-input="reviewerSelected"
          :pta-selected-input="ptaSelected"
          :input-data="formData"
        />
      </div>
      <div v-if="currentTab === 'Renewal'">
        <div v-for="renewal in recertificationList" :key="renewal.id">
          <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
            <div
              class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between items-center"
            >
              <div class="font-bold">
                {{
                  renewal.type === 'v2-hsr'
                    ? 'WELL Health Safety'
                    : 'WELL Certification'
                }}
                -
                {{ $dayjs(renewal.created_at).format('MMMM DD, YYYY') }}
              </div>
              <div class="w-1/4">
                <WButtonsBase
                  :disabled="updatingRecert === renewal.id"
                  @click.native="updateRecert(renewal)"
                >
                  <span v-if="updatingRecert === renewal.id">
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                  <span v-else>Save</span>
                </WButtonsBase>
              </div>
            </div>
            <div class="px-8 py-4">
              <div class="mb-5">
                <FormulateInput
                  v-model="renewal.cert_status"
                  :options="[
                    { label: 'N/A', value: null },
                    { label: 'Achieved', value: 'achieved' },
                    { label: 'Not Achieved', value: 'not_achieved' },
                  ]"
                  label="Status"
                  type="radio"
                />
              </div>
              <div class="mb-5">
                <FormulateInput
                  v-model="renewal.date_certified"
                  type="datetimepicker"
                  max="9999-01-01"
                  label="Awarded Date"
                />
              </div>
              <div v-if="renewal.discount" class="mb-5">
                <FormulateInput
                  v-model="renewal.discount.code"
                  disabled
                  type="text"
                  label="Discount Code"
                />
              </div>
            </div>
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
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'Project',
      formData: { ...this.project },
      ownerAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      reviewerSelected: [],
      ptaSelected: [],
      updatingRecert: '',
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      coachingContacts: (state) => state.project.coachingContacts,
      wellReviewers: (state) => state.project.externalReviewers,
      externalReviewers: (state) => state.project.externalReviewers,
      ptAgents: (state) => state.project.ptAgents,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    AdminAccess() {
      return this.currentUser.role.includes('well-admin')
    },
  },
  mounted() {
    const self = this
    if (this.currentUser.role.includes('well-admin')) {
      this.$store
        .dispatch('project/getAdminUsersByRoleWithLimitedFields')
        .then(() => {
          if (self.formData.reviewers !== null) {
            for (
              let index = 0;
              index < self.formData.reviewers.length;
              index++
            ) {
              self.reviewerSelected.push(
                self.externalReviewers.filter(
                  (a) => a.value === self.formData.reviewers[index].id
                )[0]
              )
            }
          }
          if (this.formData.ptas.length) {
            self.ptaSelected = self.ptAgents.filter(
              (a) => a.value === self.formData.ptas[0].id
            )[0]
          }
        })
    }
  },
  methods: {
    async updateRecert(payload) {
      this.updatingRecert = payload.id
      await this.$store.dispatch('recertification/updateProjectRecert', payload)
      await this.$store.dispatch('recertification/getHSRRecertification')
      this.$store.dispatch('notifications/toastMessage', {
        message: 'Renewal updated successfully!',
      })
      this.updatingRecert = ''
    },
    deleteProject() {
      this.$store.dispatch(`project/deleteProject`).then((response) => {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Project Deleted Successfully!',
        })
        this.$router.push(`/user/profile`)
      })
    },
  },
}
</script>
