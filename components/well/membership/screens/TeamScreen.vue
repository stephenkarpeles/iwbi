<template>
  <div>
    <WFeedbackAlert ref="alert" class="z-50" />

    <div
      class="shadow-md rounded-md px-3 py-6 md:p-6 border-primary-100 border"
    >
      <!-- Message -->
      <div class="p-2 rounded-md text-sm text-white bg-primary-900 flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-10 mt-1 mb-auto mr-3"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          In order to avail the membership benefits, a user needs to be a part
          of an active organizational membership. Please use this section to add
          members to your organization, so that they can avail membership
          benefits including WELL AP discounts.
        </div>
      </div>
      <!-- Header section -->
      <div class="mt-2 border rounded-lg bg-primary-100 text-primary-800">
        <div class="md:flex px-3 md:px-6 mt-5">
          <WHeadingsHFour class="w-2/3" heading="Team Owner" />
          <div class="w-full my-auto">
            <div
              class="
                break-words
                text-primary-400
                border
                bg-white
                p-2
                rounded-md
                border-primary-400
              "
            >
              {{
                membership.owner_email
                  ? '(' + membership.owner_name + ') ' + membership.owner_email
                  : '(' + membership.user_name + ') ' + membership.user_email
              }}
            </div>
          </div>
        </div>
        <div
          v-if="
            membership.organization_users.find(
              (member) => member.role === 'poc'
            )
          "
          class="md:flex px-3 md:px-6 mt-5"
        >
          <WHeadingsHFour class="w-2/3" heading="Point of Contact" />
          <div class="w-full my-auto">
            <div
              class="
                border border-primary-400
                bg-white
                p-2
                rounded-md
                break-words
                text-primary-400
              "
            >
              {{
                '(' +
                membership.organization_users.find(
                  (member) => member.role === 'poc'
                ).user_name +
                ') ' +
                membership.organization_users.find(
                  (member) => member.role === 'poc'
                ).user_email
              }}
            </div>
          </div>
        </div>
        <div
          class="md:flex px-3 md:px-6 py-1 md:py-5 border-b border-primary-200"
        >
          <WHeadingsHFour class="md:w-2/3" heading="Registration Code" />
          <div class="mb-5 md:mb-0 w-full flex space-x-2 my-auto">
            <div
              class="border border-primary-400 bg-white p-2 rounded-md flex-1"
            >
              {{ membership.code }}
            </div>

            <svg
              class="
                flex-shrink-0
                w-6
                cursor-pointer
                text-primary-400
                hover:text-primary-600
              "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="copyCode()"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        shadow-md
        rounded-md
        px-3
        py-6
        md:p-6
        border-primary-100 border
        mt-5
      "
    >
      <!-- Team Members section -->
      <div class="md:flex justify-between">
        <WHeadingsHTwo
          class="text-primary-700 mb-2 md:mb-0"
          heading="Team Members"
        />
        <div class="ml-auto flex space-x-2 mb-2 md:mb-0">
          <div class="w-36">
            <WButtonsBase
              v-if="
                accessLevel === 'owner' ||
                accessLevel === 'poc' ||
                accessLevel === 'manager'
              "
              type="primaryInverted"
              @click.native="addMember()"
            >
              + Add Member
            </WButtonsBase>
          </div>
        </div>
      </div>
      <!-- Main Table -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
            <div
              class="
                shadow
                overflow-hidden
                border-b border-gray-200
                sm:rounded-lg
              "
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-primary-700 text-white">
                  <tr>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                      "
                    >
                      Name / Role
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                      "
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                      "
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-right text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                      "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(member, index) in membership.organization_users"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 relative">
                          <div
                            class="
                              bg-primary-400
                              h-10
                              w-10
                              rounded-full
                              bg-center bg-cover
                              absolute
                              z-0
                            "
                            :style="{
                              backgroundImage: 'url(/profile/avatar.jpg)',
                            }"
                          ></div>
                          <div
                            class="
                              h-10
                              w-10
                              rounded-full
                              bg-center bg-cover
                              z-10
                              relative
                            "
                            :style="[
                              member.profile_pic != null
                                ? {
                                    backgroundImage:
                                      'url(' + member.profile_pic + ')',
                                  }
                                : {
                                    backgroundImage: 'url(/profile/avatar.jpg)',
                                  },
                            ]"
                          ></div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-semibold text-primary-900">
                            {{ member.user_name }}
                          </div>
                          <span
                            v-if="member.is_active && member.role === 'poc'"
                            class="
                              inline-flex
                              items-center
                              px-2.5
                              py-0.5
                              rounded-md
                              text-xs
                              font-medium
                              bg-green-50
                              text-success-700
                              border border-green-100
                            "
                          >
                            Point of Contact
                          </span>
                          <span
                            v-if="member.is_active && member.role === 'manager'"
                            class="
                              inline-flex
                              items-center
                              px-2.5
                              py-0.5
                              rounded-sm
                              text-xs
                              font-medium
                              text-primary-600
                              rounded-md
                              bg-primary-100
                              border border-primary-200
                            "
                          >
                            Team Manager
                          </span>
                          <span
                            v-if="member.is_active && member.role === 'member'"
                            class="
                              inline-flex
                              items-center
                              px-2.5
                              py-0.5
                              rounded-sm
                              text-xs
                              font-medium
                              text-primary-600
                              rounded-md
                              bg-primary-100
                              border border-primary-200
                            "
                          >
                            Team Member
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-primary-900 opacity-50">
                        {{ member.user_email }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-primary-900">
                        <span
                          v-if="member.is_active === 1"
                          class="
                            inline-flex
                            items-center
                            px-2.5
                            py-0.5
                            rounded-md
                            text-xs
                            font-medium
                            bg-green-50
                            text-success-700
                            border border-green-100
                          "
                          >Active</span
                        >
                        <span
                          v-else
                          class="
                            inline-flex
                            items-center
                            px-2.5
                            py-0.5
                            rounded-md
                            text-xs
                            font-medium
                            bg-gray-100
                            text-gray-400
                            border border-gray-100
                          "
                          >Pending Approval</span
                        >
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div
                        v-if="
                          (isApproved(member) &&
                            member.id !== membership.user_id &&
                            accessLevel === 'owner') ||
                          (member.id !== membership.user_id &&
                            accessLevel === 'project-admin')
                        "
                        class="flex space-x-2 justify-end"
                      >
                        <div class="w-42">
                          <WButtonsBase
                            type="primaryInverted"
                            icon="pencil"
                            @click.native="editMember(member)"
                          />
                        </div>
                        <div class="w-42">
                          <WButtonsBase
                            type="dangerInverted"
                            icon="trash"
                            @click.native="removeMember(member.id)"
                          />
                        </div>
                      </div>
                      <div v-else class="flex space-x-2 justify-end">
                        <div
                          v-if="
                            (member.id !== membership.user_id &&
                              accessLevel === 'owner') ||
                            (member.id !== membership.user_id &&
                              accessLevel === 'project-admin')
                          "
                          class="w-42"
                        >
                          <WButtonsBase
                            type="primaryInverted"
                            icon="pencil"
                            @click.native="resolveInvite(member)"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Member Form section -->
    <WFeedbackModal ref="addMemberModal" :can-manually-close="true">
      <div class="md:w-96">
        <WHeadingsHTwo heading="Add Member" />
        <div class="px-6 pb-4">
          <FormulateForm
            name="addForm"
            class="space-y-2"
            @submit="addMemberForm"
          >
            <FormulateInput
              v-model="newMemberData.email"
              :disabled="
                accessLevel === 'owner' || accessLevel === 'manager'
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
              :options="{
                member: 'Team Member',
                manager: 'Team Manager',
                poc: 'Point of Contact',
              }"
              type="radio"
              label="Role"
              name="role"
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
      </div>
    </WFeedbackModal>

    <!-- Edit Member section -->
    <WFeedbackModal ref="editMemberModal" :can-manually-close="true">
      <div class="md:w-96">
        <WHeadingsHTwo heading="Edit Member" />
        <div class="px-6 pb-4">
          <FormulateForm
            name="editForm"
            class="space-y-2"
            @submit="updateMemberForm"
          >
            <FormulateInput
              v-model="newMemberData.email"
              :disabled="true"
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              v-model="newMemberData.role"
              :options="{
                member: 'Team Member',
                manager: 'Team Manager',
              }"
              type="radio"
              label="Role"
              name="role"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput type="submit" label="Update" />
            </div>
          </FormulateForm>
        </div>
      </div>
    </WFeedbackModal>

    <!-- Resolve approval -->
    <WFeedbackModal ref="approveMemberModal" :can-manually-close="true">
      <div class="w-96">
        <WHeadingsHTwo heading="Pending Approval" />
        <div class="px-6 pb-4">
          <FormulateForm
            name="editForm"
            class="space-y-2"
            @submit="approveMember"
          >
            <FormulateInput
              v-model="newMemberData.email"
              :disabled="true"
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              v-model="inviteAction"
              :options="{
                approve: 'Approve',
                disapprove: 'Reject',
              }"
              type="radio"
              label="Actions"
              name="Actions"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput type="submit" label="Submit" />
            </div>
          </FormulateForm>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      inviteAction: '',
      showAddMemberForm: false,
      showAdminForm: false,
      memberID: null,
      memberFormMode: 'new',
      newMemberData: {
        email: '',
        position: '',
        role: '',
      },
      newAdminData: {
        email: '',
        position: '',
        role: 'portfolio-admin',
      },
    }
  },
  computed: {
    ...mapState({
      membership: (state) => state.membership.membership,
      currentUser: (state) => state.user.currentUser,
    }),

    accessLevel() {
      if (
        this.currentUser.role.includes('well-admin') ||
        this.membership.user_id === this.currentUser.id
      ) {
        return 'owner'
      }
      if (this.membership) {
        return this.membership.organization_users.filter(
          (member) => member.id === this.currentUser.id
        ).length
          ? this.membership.organization_users.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : false
      }
      return ''
    },
  },
  methods: {
    isApproved(member) {
      if (member.is_active === 0 && member.code !== null) {
        return false
      }
      return true
    },
    resolveInvite(member) {
      this.$refs.approveMemberModal.isHidden = false
      this.memberID = member.id
      this.newMemberData.email = member.user_email
    },
    approveMember() {
      this.$store
        .dispatch('membership/respondToInvite', {
          userId: this.memberID,
          action: this.inviteAction,
          membershipId: this.membership.id,
        })
        .then((res) => {
          this.$refs.alert.showAlert('success', 'Action confirmed.')
          this.$store.dispatch('membership/getMembership')
          this.$refs.approveMemberModal.isHidden = true
        })
    },
    copyCode() {
      if (process.browser) {
        navigator.clipboard.writeText(this.membership.code)
        this.$refs.alert.showAlert('success', 'Copied Registration Code!')
      }
    },
    addMember() {
      this.$refs.addMemberModal.isHidden = false
      this.memberFormMode = 'new'
      this.showAdminForm = false
      this.newMemberData = {
        email: null,
        position: null,
        role: null,
      }
    },
    removeMember(userId) {
      this.$store
        .dispatch('membership/removeMember', userId)
        .then(this.$refs.alert.showAlert('success', 'Removed Member'))
    },
    addMemberForm() {
      this.$store
        .dispatch('membership/inviteMember', this.newMemberData)
        .then((res) => {
          if (res.data.already_member && res.data.already_member.length) {
            this.formErrors = {
              email:
                "This user is already a part of another organization's membership. Please enter different email address.",
            }
            this.$refs.alert.showAlert('error', this.formErrors.email)
          } else {
            this.$refs.alert.showAlert('success', 'Invite sent!')
            this.newMemberData.role = ''
            this.newMemberData.email = ''
            this.$formulate.resetValidation('addForm')
            this.$refs.addMemberModal.isHidden = true
          }
        })
    },
    updateMemberForm() {
      this.$store
        .dispatch('membership/updateMember', {
          userId: this.memberID,
          role: this.newMemberData.role,
        })
        .then((res) => {
          this.$refs.alert.showAlert('success', 'Updated Member Role!')
          this.$formulate.resetValidation('editForm')
          this.$refs.editMemberModal.isHidden = true
        })
    },
    editMember(member) {
      this.$refs.editMemberModal.isHidden = false
      this.newMemberData.email = member.user_email
      this.newMemberData.role = member.role
      this.memberID = member.id
    },
  },
}
</script>
