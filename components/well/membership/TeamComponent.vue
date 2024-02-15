<template>
  <div>
    <WFeedbackAlert ref="alert" class="z-50" />
    <WSlideoversOverlay ref="teamSlide" title="Team Management" class="z-40">
      <template #content>
        <div class="flex px-6 mt-5">
          <WHeadingsHFour class="w-2/3" heading="Project Administrator" />
          <div class="w-full my-auto">
            <FormulateInput
              v-if="membership"
              v-model="
                membership.organization_users.find(
                  (member) => member.role === 'poc'
                ).user_email
              "
              :disabled="true"
              type="text"
            />
          </div>
        </div>
        <div class="flex justify-between px-6 py-5">
          <WHeadingsHFour heading="Team Members" />
          <div class="ml-auto flex space-x-2">
            <div class="w-36">
              <WButtonsBase
                v-if="
                  accessLevel === 'well-admin' ||
                  accessLevel === 'poc' ||
                  accessLevel === 'manager'
                "
                type="primaryInverted"
                @click.native="addMember()"
              >
                + Add Member
              </WButtonsBase>
            </div>
            <div>
              <WButtonsBase
                v-if="
                  accessLevel === 'well-admin' ||
                  accessLevel === 'poc' ||
                  accessLevel === 'manager'
                "
                type="primaryInverted"
                @click.native="changeAdmin()"
              >
                Change Project Administrator
              </WButtonsBase>
            </div>
          </div>
        </div>
        <div v-if="showAdminForm" class="px-6 pb-11">
          <FormulateForm class="space-y-2" @submit="changeAdminForm">
            <FormulateInput
              v-model="newAdminData.email"
              :disabled="
                accessLevel === 'well-admin' || accessLevel === 'poc'
                  ? false
                  : true
              "
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              v-model="newAdminData.position"
              :options="[
                { label: 'Acoustician', value: 'acoustician' },
                { label: 'Architect', value: 'architect' },
                {
                  label: 'Commissioning Agent',
                  value: 'commissioning_agent',
                },
                {
                  label: 'Construction Manager',
                  value: 'construction_manager',
                },
                { label: 'Contractor', value: 'contractor' },
                { label: 'Facilities Manager', value: 'facilities_manager' },
                { label: 'Interior Designer', value: 'interior_designer' },
                { label: 'Lighting Designer', value: 'lighting_designer' },
                { label: 'MEP Engineer', value: 'mep_engineer' },
                { label: 'Owner', value: 'Owner' },
                { label: 'Human Resource', value: 'hr' },
                { label: 'Project Manager', value: 'project_manager' },
                {
                  label: 'Sustainability Consultant',
                  value: 'sustainability_consultant',
                },
                {
                  label: 'Wellness Consultant',
                  value: 'wellness_consultant',
                },
                { label: 'Administrator', value: 'administrator' },
              ]"
              type="select"
              placeholder="Select a role"
              label="Project Role"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput type="submit" label="Update" />
            </div>
          </FormulateForm>
        </div>
        <div v-if="showAddMemberForm" class="px-6 pb-11">
          <FormulateForm class="space-y-2" @submit="addMemberForm">
            <FormulateInput
              v-model="newMemberData.email"
              :disabled="
                accessLevel === 'well-admin' ||
                accessLevel === 'poc' ||
                accessLevel === 'manager'
                  ? false
                  : true
              "
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              v-model="newMemberData.role"
              :options="[
                { value: 'project-manager', label: 'Team Manager' },
                { value: 'project-member', label: 'Team Member' },
                {
                  value: 'project-pta',
                  label: 'Performance Testing Agent',
                },
                { value: 'project-pr', label: 'Marketing POC' },
              ]"
              type="radio"
              label="Project Authorization"
              validation="required"
            />
            <FormulateInput
              v-model="newMemberData.position"
              :options="[
                { label: 'Acoustician', value: 'acoustician' },
                { label: 'Architect', value: 'architect' },
                {
                  label: 'Commissioning Agent',
                  value: 'commissioning_agent',
                },
                {
                  label: 'Construction Manager',
                  value: 'construction_manager',
                },
                { label: 'Contractor', value: 'contractor' },
                { label: 'Facilities Manager', value: 'facilities_manager' },
                { label: 'Interior Designer', value: 'interior_designer' },
                { label: 'Lighting Designer', value: 'lighting_designer' },
                { label: 'MEP Engineer', value: 'mep_engineer' },
                { label: 'Owner', value: 'Owner' },
                { label: 'Human Resource', value: 'hr' },
                { label: 'Project Manager', value: 'project_manager' },
                {
                  label: 'Sustainability Consultant',
                  value: 'sustainability_consultant',
                },
                {
                  label: 'Wellness Consultant',
                  value: 'wellness_consultant',
                },
                { label: 'Administrator', value: 'administrator' },
              ]"
              type="select"
              placeholder="Select a role"
              label="Project Role"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput
                type="submit"
                :label="memberFormMode === 'new' ? 'Invite' : 'Update'"
              />
            </div>
          </FormulateForm>
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="(member, index) in membership.organization_users"
            :key="index"
            class="flex justify-between w-full my-auto border-t border-primary-200 px-6 py-3"
          >
            <div class="w-1/2">
              <div class="font-medium text-lg text-primary-700 flex">
                <span
                  :class="[
                    member.is_member === 1 ? 'bg-green-100' : 'bg-gray-100',
                  ]"
                  class="my-auto inline mr-1 h-4 w-4 rounded-full flex items-center justify-center"
                >
                  <span
                    :class="[
                      member.is_member === 1 ? 'bg-green-400' : 'bg-gray-400',
                    ]"
                    class="h-2 w-2 rounded-full"
                  ></span>
                </span>
                {{ member.full_name }}
              </div>
              <div class="text-sm italic text-gray-500 ml-5">
                <span v-if="member.role === 'project-admin'">
                  Project Administrator
                </span>
                <span v-if="member.role === 'project-manager'">
                  Team Manager
                </span>
                <span v-if="member.role === 'project-pr'"> Marketing POC </span>
                <span v-if="member.role === 'project-member'">
                  Team Member
                </span>
                <span v-if="member.role === 'project-pta'">
                  Performance Testing Agent
                </span>
              </div>
              <div class="text-sm text-primary-500 ml-5">
                {{ member.email }}
              </div>
            </div>
            <div
              class="mr-auto text-white my-auto bg-primary-300 w-36 text-center px-3 rounded-full text-sm"
            >
              <span v-if="member.position === 'acoustician'">
                Acoustician
              </span>
              <span v-if="member.position === 'architect'"> Architect </span>
              <span v-if="member.position === 'commissioning_agent'">
                Commissioning Agent
              </span>
              <span v-if="member.position === 'construction_manager'">
                Construction Manager
              </span>
              <span v-if="member.position === 'contractor'"> Contractor </span>
              <span v-if="member.position === 'facilities_manager'">
                Facilities Manager
              </span>
              <span v-if="member.position === 'interior_designer'">
                Interior Designer
              </span>
              <span v-if="member.position === 'lighting_designer'">
                Lighting Designer
              </span>
              <span v-if="member.position === 'mep_engineer'">
                MEP Engineer
              </span>
              <span v-if="member.position === 'Owner'"> Owner </span>
              <span v-if="member.position === 'hr'"> Human Resource </span>
              <span v-if="member.position === 'project_manager'">
                Project Manager
              </span>
              <span v-if="member.position === 'sustainability_consultant'">
                Sustainability Consultant
              </span>
              <span v-if="member.position === 'wellness_consultant'">
                Wellness Consultant
              </span>
              <span v-if="member.position === 'administrator'">
                Administrator
              </span>
            </div>
            <div>
              <WButtonsDropdown
                v-if="
                  (member.id !== membership.user_id &&
                    accessLevel === 'well-admin') ||
                  (member.id !== membership.user_id &&
                    accessLevel === 'project-admin')
                "
                class="ml-3"
              >
                <WButtonsBase
                  class="h-full"
                  type="primaryInverted"
                  icon="dots-vertical"
                />
                <template #customButtons>
                  <WButtonsBase
                    type="neutral"
                    @click.native="editMember(member)"
                  >
                    Edit
                  </WButtonsBase>
                  <WButtonsBase
                    type="neutral"
                    icon="trash"
                    @click.native="removeMember(member.id)"
                  >
                    Remove
                  </WButtonsBase>
                </template>
              </WButtonsDropdown>
            </div>
          </div>
        </div>
      </template>
    </WSlideoversOverlay>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      showAddMemberForm: false,
      showAdminForm: false,
      memberFormMode: 'new',
      newMemberData: {
        email: '',
        position: '',
        role: '',
      },
      newAdminData: {
        email: '',
        position: '',
        role: 'project-admin',
      },
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      countries: (state) => state.address.countries,
      currentUser: (state) => state.user.currentUser,
      membership: (state) => state.membership.membership,
    }),
    accessLevel() {
      if (this.currentUser.role.includes('well-admin')) {
        return 'well-admin'
      }
      if (this.membership) {
        return this.membership.organization_users.find(
          (member) => member.id === this.currentUser.id
        ).role
      }
      return false
    },
  },
  watch: {
    currentTab(newValue, oldValue) {
      if (newValue === 'Team') {
        this.$refs.teamSlide.toggleOpen()
        this.$store.commit('settings/setSidebarTab', oldValue)
      }
    },
  },
  async mounted() {},
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    changeAdmin() {
      this.showAdminForm = !this.showAdminForm
      this.showAddMemberForm = false
    },
    addMember() {
      if (this.memberFormMode === 'new' && this.showAddMemberForm === true) {
        this.showAddMemberForm = false
      } else {
        this.showAddMemberForm = true
      }
      this.memberFormMode = 'new'
      this.showAdminForm = false
      this.newMemberData = {
        email: null,
        position: null,
        role: null,
      }
    },
    editMember(member) {
      this.memberFormMode = 'edit'
      this.showAddMemberForm = true
      this.newMemberData.email = member.email
      this.newMemberData.position = member.position
      this.newMemberData.role = member.role
    },
    changeAdminForm() {
      this.$store
        .dispatch('membership/inviteMember', this.newAdminData)
        .then(
          (this.newAdminData.email = ''),
          (this.newAdminData.position = ''),
          this.$refs.alert.showAlert(
            'success',
            'We have sent an email invite!'
          ),
          (this.showAdminForm = false)
        )
    },
    addMemberForm() {
      if (this.memberFormMode === 'new') {
        this.$store
          .dispatch('membership/inviteMember', this.newMemberData)
          .then(
            (this.newMemberData.role = ''),
            (this.newMemberData.email = ''),
            this.$refs.alert.showAlert(
              'success',
              'We have sent an email invite!'
            ),
            (this.showAddMemberForm = false)
          )
      } else {
        this.$store
          .dispatch('membership/inviteMember', this.newMemberData)
          .then(
            (this.newMemberData.role = ''),
            (this.newMemberData.email = ''),
            this.$refs.alert.showAlert('success', 'Changes have been saved'),
            (this.showAddMemberForm = false)
          )
      }
    },
    removeMember(userId) {
      this.$store
        .dispatch('membership/removeMember', userId)
        .then(this.$refs.alert.showAlert('success', 'Removed Member'))
    },
  },
}
</script>
