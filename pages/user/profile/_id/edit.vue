<template>
  <div class="w-full">
    <WFeedbackAlert ref="alert" />
    <WFeedbackModal ref="modal">
      <div class="max-w-lg mx-10 my-5">
        <div class="flex justify-center mb-4">
          <div
            class="bg-red-100 flex flex-shrink-0 h-16 items-center justify-center mx-auto rounded-full sm:mx-0 w-16"
          >
            <svg
              class="h-8 w-8 text-red-600"
              x-description="Heroicon name: outline/exclamation"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>
        <div
          v-if="viewedUser && viewedUser.role && viewedUser.membership_detail"
          class="mb-5 text-primary-800 text-center py-4"
        >
          Do you still belong to the
          <span class="font-bold">{{
            viewedUser.membership_detail.org_name
          }}</span>
          membership organization?
        </div>
        <div class="flex justify-between space-x-5">
          <div class="w-24">
            <WButtonsBase
              type="danger"
              @click.native=";(formData.membership_remove = 1), submitForms()"
            >
              No
            </WButtonsBase>
          </div>
          <WButtonsBase
            type="primary"
            @click.native=";(formData.membership_remove = 0), submitForms()"
          >
            Yes, I belong to the above membership
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <div v-if="formData" class="">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="Edit Profile" />
        <template #actions>
          <div class="flex space-x-3">
            <div class="w-48">
              <WButtonsBase
                type="primaryInverted"
                @click.native="handleEditCancel"
              >
                Cancel
              </WButtonsBase>
            </div>
            <div class="w-48">
              <WButtonsBase
                @click.native="
                  viewedUser.email !== formData.email &&
                  viewedUser.membership_detail &&
                  viewedUser.membership_detail.user_level !== 'owner'
                    ? ($refs.modal.isHidden = false)
                    : submitForms()
                "
              >
                Save
              </WButtonsBase>
            </div>
          </div>
        </template>
      </NavBreadcrumbs>

      <div
        class="divide-gray-200 divide-y lg:divide-x lg:divide-y-0 lg:grid lg:grid-cols-12"
      >
        <div class="py-6 lg:col-span-3">
          <nav class="-mb-px space-y-4">
            <div>
              <a
                href="#"
                :class="[
                  currentTab === 'personal'
                    ? 'px-3 block text-primary-600 text-sm border-l-4 border-primary-600 py-4 bg-primary-200  '
                    : ' px-3 font-medium text-sm leading-5 text-gray-500 focus:outline-none hover:bg-primary-100 py-4 px-3 block  ',
                ]"
                @click="currentTab = 'personal'"
              >
                Personal Information
              </a>
            </div>
            <div>
              <a
                href="#"
                :class="[
                  currentTab === 'contact'
                    ? 'px-3 block text-primary-600 text-sm border-l-4 border-primary-600 py-4 bg-primary-200  '
                    : ' px-3 font-medium text-sm leading-5 text-gray-500 focus:outline-none hover:bg-primary-100 py-4 px-3 block  ',
                ]"
                @click="currentTab = 'contact'"
              >
                Contact Information
              </a>
            </div>
            <div>
              <a
                href="#"
                :class="[
                  currentTab === 'about'
                    ? 'px-3 block text-primary-600 text-sm border-l-4 border-primary-600 py-4 bg-primary-200 '
                    : ' px-3 font-medium text-sm leading-5 text-gray-500 focus:outline-none hover:bg-primary-100 py-4 px-3 block  ',
                ]"
                aria-current="page"
                @click="currentTab = 'about'"
              >
                About
              </a>
            </div>
          </nav>
        </div>
        <div class="divide-grey-200 lg:col-span-9">
          <!-- Personal Information -->
          <div
            class="mt-6 flex flex-col lg:flex-row"
            :class="{ hidden: currentTab !== 'personal' }"
          >
            <div class="flex-grow space-y-6 px-8">
              <div>
                <FormulateInput
                  v-model="formData.name"
                  type="text"
                  name="first_name"
                  label="First Name*"
                  validation="required"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>
              <div>
                <FormulateInput
                  v-model="formData.last_name"
                  type="text"
                  name="last_name"
                  label="Last Name*"
                  validation="required"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>
              <div>
                <FormulateInput
                  v-model="formData.email"
                  type="email"
                  name="email"
                  label="Email*"
                  validation="bail|required|email"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>
              <FormulateInput
                v-model="formData.job_title"
                type="text"
                name="job_title"
                label="Job Title*"
                validation="required"
              />
              <FormulateInput
                v-model="formData.company"
                type="companymultisearch"
                name="organization"
                label="Organization*"
                validation="required"
                :searchable="true"
                :clearonselect="false"
                :closeonselect="true"
                :optionslimit="20"
              />
              <div>
                <FormulateInput
                  v-model="formData.industry"
                  type="select"
                  name="industry"
                  label="Industry*"
                  :options="industryOptions"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>
              <div>
                <label
                  for="languages"
                  class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >Languages</label
                >
                <ClientOnly>
                  <multiselect
                    v-model="formData.languages"
                    :multiple="true"
                    :options="languages"
                    label="name"
                    name="languages"
                    validation="required"
                    track-by="code"
                  ></multiselect>
                </ClientOnly>
                <div class="text-secondary-800 text-sm">
                  This will appear on your public profile.
                </div>
              </div>
              <FormulateInput
                v-model="formData.gender"
                :options="{
                  Male: 'Male',
                  Female: 'Female',
                }"
                validation="required"
                type="radio"
                label="Gender"
              />

              <FormulateInput
                v-if="isAdminView"
                v-model="formData.roles"
                :options="usersAuthorizationList"
                type="checkbox"
                label="Authorization Roles:"
                name="roles"
              />

              <div class="flex">
                <FormulateInput
                  v-model="formData.dob"
                  class="w-full"
                  type="date"
                  label="Birthday"
                  max="9999-01-01"
                />
                <div v-if="formData.dob" class="w-20 flex pt-2 ml-2">
                  <WButtonsBase
                    class="my-auto"
                    @click.native="formData.dob = null"
                  >
                    Clear
                  </WButtonsBase>
                </div>
              </div>

              <FormulateInput
                v-model="formData.profile_public"
                :options="{
                  0: 'No, hide my profile from WELL Directory',
                  1: 'Yes, show my profile in WELL Directory',
                }"
                validation="required"
                type="radio"
                label="Show profile in WELL Directory:*"
              />
              <FormulateInput
                v-if="
                  viewedUser &&
                  viewedUser.role &&
                  viewedUser.role.includes('well-admin')
                "
                v-model="formData.well_ap"
                :options="{
                  0: 'No',
                  1: 'Yes',
                }"
                validation="required"
                type="radio"
                label="WELL AP:"
              />
              <FormulateInput
                v-if="
                  viewedUser &&
                  viewedUser.role &&
                  viewedUser.role.includes('well-admin')
                "
                v-model="formData.well_faculty"
                :options="{
                  0: 'No',
                  1: 'Yes',
                }"
                validation="required"
                type="radio"
                label="WELL Faculty:"
              />
              <FormulateInput
                v-if="
                  viewedUser &&
                  viewedUser.role &&
                  viewedUser.role.includes('well-admin')
                "
                v-model="formData.featured_profile"
                :options="{
                  0: 'No',
                  1: 'Yes',
                }"
                validation="required"
                type="radio"
                label="Featured Profile:"
              />
              <FormulateInput
                v-if="
                  currentUser &&
                  currentUser.role &&
                  currentUser.role.includes('well-admin')
                "
                v-model="formData.gb_award"
                :options="{
                  'well-faculty': 'WELL Faculty',
                  'well-ap-of-the-year': 'WELL AP of the year',
                  'well-advisor': 'WELL Advisor',
                  'well-portfolio': 'WELL Portfolio',
                }"
                validation="required"
                type="radio"
                label="Greenbuild Award:*"
              />
            </div>

            <!-- Photo -->

            <div
              class="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0"
            >
              <p class="text-sm font-medium text-gray-700" aria-hidden="true">
                Photo
              </p>

              <div
                class="hidden relative rounded-full overflow-hidden lg:block h-40"
              >
                <div v-if="formData.profile_pic">
                  <img
                    v-if="formData.profile_pic"
                    class="relative rounded-full w-40 h-40 bg-center"
                    :src="formData.profile_pic"
                  />

                  <img
                    v-else
                    class="relative rounded-full w-40 h-40 bg-center"
                    :src="formData.profile_pic"
                  />
                </div>
                <img
                  v-else
                  class="relative rounded-full w-40 h-40 bg-center"
                  src="/profile/avatar.jpg"
                />
                <label
                  class="absolute inset-0 w-40 h-40 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 cursor-pointer"
                >
                  <span>Change</span>
                  <input
                    type="file"
                    upload-path="/"
                    accept="image/png,image/jpeg"
                    validation="required|max: 1"
                    class="absolute opacity-0 cursor-pointer"
                    @input="setImage"
                  />
                </label>
              </div>
              <WButtonsBase
                v-if="profilePic.length"
                class="mt-2"
                type="danger"
                @click.native="removeImage(profilePic[0].url)"
                >Remove</WButtonsBase
              >
            </div>
          </div>

          <!-- Contact Infromation -->
          <div :class="{ hidden: currentTab !== 'contact' }">
            <div class="mt-16 pl-8">
              <div
                class="shadow-md justify-between border rounded-md mt-5 mb-5"
              >
                <div
                  class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
                >
                  <div class="font-bold">Billing Address</div>
                </div>
                <div class="px-8 py-4">
                  <FormInputsAddressFormulate
                    :address="formData.addresses[1]"
                    :target="formData.addresses[1]"
                    class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
                  />
                </div>
              </div>

              <div
                class="shadow-md justify-between border rounded-md mt-5 mb-5"
              >
                <div
                  class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
                >
                  <div class="font-bold">Mailing Address</div>
                </div>
                <div class="px-8 py-4">
                  <FormulateInput
                    v-model="mailingEqualsBilling"
                    class="mt-2 mb-2"
                    type="checkbox"
                    label="Mailing address is same as billing address"
                    @input="handleCopyBilling"
                  />
                  <FormInputsAddressFormulate
                    :disabled="mailingEqualsBilling"
                    :address="formData.addresses[0]"
                    :target="formData.addresses[0]"
                    class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
                  />
                </div>
              </div>

              <div>
                <FormulateInput
                  v-model="formData.website"
                  class="mt-5"
                  type="text"
                  name="url"
                  label="Website"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>

              <div>
                <FormulateInput
                  v-model="formData.phone_number"
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  validation="required"
                />
                <div class="text-secondary-800 text-sm -mt-3">
                  This will appear on your public profile.
                </div>
              </div>

              <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">
                Social Links
              </h3>
              <div class="text-secondary-800 text-sm">
                This will appear on your public profile.
              </div>
              <div class="relative mt-2 h-10">
                <div
                  class="absolute top-0 flex h-full bg-primary-100 text-primary-400 border border-primary-300 rounded-l"
                >
                  <div class="my-auto px-3">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="w-5 text-primary-700"
                    >
                      <path
                        fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                        class=""
                      ></path>
                    </svg>
                  </div>
                </div>
                <FormulateInput
                  v-model="formData.linkedin"
                  class="pl-10"
                  type="text"
                />
              </div>
              <div class="relative mt-2 h-10">
                <div
                  class="absolute top-0 flex h-full bg-primary-100 text-primary-400 border border-primary-300 rounded-l"
                >
                  <div class="my-auto px-3">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="twitter"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      class="w-5 text-primary-700"
                    >
                      <path
                        fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                        class=""
                      ></path>
                    </svg>
                  </div>
                </div>
                <FormulateInput
                  v-model="formData.twitter"
                  class="pl-10"
                  type="text"
                />
              </div>
              <div class="relative mt-2 h-10">
                <div
                  class="absolute top-0 flex h-full bg-primary-100 text-primary-400 border border-primary-300 rounded-l"
                >
                  <div class="my-auto px-3">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="w-5 text-primary-700"
                    >
                      <path
                        fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                        class=""
                      ></path>
                    </svg>
                  </div>
                </div>
                <FormulateInput
                  v-model="formData.facebook"
                  class="pl-10"
                  type="text"
                />
              </div>
            </div>
          </div>

          <!-- About -->
          <div :class="{ hidden: currentTab !== 'about' }">
            <div class="mt-8 pt-8 pl-8 space-y-4">
              <div>
                <FormulateInput
                  v-model="formData.about"
                  type="richtext"
                  label="Share your bio - professional background, areas of expertise, and interests with the WELL community."
                />
                <div class="text-secondary-800 text-sm">
                  This will appear on your public profile.
                </div>
              </div>

              <div>
                <FormulateInput
                  v-model="formData.inspiration"
                  type="richtext"
                  label="Why I joined the WELL community?"
                />
                <div class="text-secondary-800 text-sm">
                  This will appear on your public profile.
                </div>
              </div>
              <div>
                <FormulateInput
                  v-model="formData.wellness_mean"
                  type="richtext"
                  label="What does wellness mean to you? How do you incorporate wellness into your life and routine?"
                />
                <div class="text-secondary-800 text-sm">
                  This will appear on your public profile.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading User Edit Profile...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions, mapGetters } = createNamespacedHelpers('user')

export default {
  data() {
    return {
      formData: null,
      languages: null,
      currentTab: 'personal',
      profilePic: [],
      forceReMount: 0,
      industryOptions: [
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Architecture', label: 'Architecture' },
        { value: 'Banking', label: 'Banking' },
        { value: 'Biotechnology', label: 'Biotechnology' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Consulting', label: 'Consulting' },
        { value: 'Education', label: 'Education' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Environmental', label: 'Environmental' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Food & Beverage', label: 'Food & Beverage' },
        { value: 'Government', label: 'Government' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Machinery', label: 'Machinery' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Media', label: 'Media' },
        { value: 'Not For Profit', label: 'Not For Profit' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Recreation', label: 'Recreation' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Telecommunications', label: 'Telecommunications' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Other', label: 'Other' },
      ],
      mailingEqualsBilling: false,
      usersAuthorizationList: [
        { label: 'Well Admin', value: 'well-admin' },
        { label: 'admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Billing Admin', value: 'billing-admin' },
        { label: 'Portfolio Admin', value: 'portfolio-admin' },
        { label: 'Feedback Group', value: 'feedback-group' },
        { label: 'WELL Assessor', value: 'well-assessor' },
        {
          label: 'External Reviewer',
          value: 'external-reviewer',
        },
        {
          label: 'Coaching Contact',
          value: 'project-coach',
        },

        {
          label: 'WELL Reporter',
          value: 'well-reporter',
        },
        { label: 'IWBI Guidance', value: 'iwbi-guidance' },
        { label: 'WELL PTA', value: 'well-pta' },
      ],
      viewedUser: null,
    }
  },
  head() {
    return {
      title: `Edit User`,
    }
  },
  computed: {
    ...mapState(['currentUser', 'countries', 'states']),
    ...mapGetters(['userBillingAddress', 'userMailingAddress']),
    isWellAdmin() {
      return this.$store.state.auth.user.role.includes('well-admin')
    },
    isAdminView() {
      return this.$store.state.auth.user.role.includes('admin')
    },
  },
  watch: {
    profilePic: {
      handler(value) {
        if (value && value.length) {
          this.formData.profile_pic = value[0].url
        } else {
          this.formData.profile_pic = ''
        }
      },
      deep: true,
    },
  },
  async mounted() {
    const languagesRes = await this.$axios.get('api/languages')
    this.languages = languagesRes.data

    if (this.isAdminView || this.isWellAdmin) {
      await this.$store
        .dispatch('user/fetchUserBySlug', this.$route.params.id)
        .then((res) => (this.viewedUser = res))
    } else {
      this.viewedUser = this.currentUser
    }
    return await this.setupForms()
  },
  methods: {
    ...mapActions(['fetchUser']),
    formMessage(type, message) {
      // this.$refs.alert.showAlert(type, message)
    },
    async setImage(e) {
      const oldPicture = this.formData.profile_pic
      if (e && e.target.files.length) {
        if (oldPicture) {
          this.removeImage(oldPicture)
        }
        const file = e.target.files[0]
        const headers = {
          'Content-Type': 'multipart/form-data',
        }
        const formData = new FormData()

        formData.append('file', file)
        formData.append('path', 'profile/')
        await this.$axios
          .post('api/upload/image', formData, {
            headers,
          })
          .then((response) => {
            this.profilePic = [{ url: response.data }]
          })
      }
    },
    async removeImage(profilePic) {
      await this.$axios.post('/api/upload/remove', {
        file: profilePic,
      })
      this.profilePic = []
    },
    setupForms() {
      this.formData = { ...this.viewedUser, roles: this.viewedUser.role }
      delete this.formData.role

      if (this.formData.addresses.length === 0) {
        this.formData.addresses[0] = {
          country_code: '',
          state: '',
          street: '',
          city: '',
          postal_code: '',
          is_primary: 1,
          is_biling: 0,
        }
        this.formData.addresses[1] = {
          country_code: '',
          state: '',
          street: '',
          city: '',
          postal_code: '',
          is_primary: 0,
          is_biling: 1,
        }
      }

      if (
        this.formData.company_id &&
        this.formData.organization &&
        this.formData.organization !== ''
      ) {
        this.formData.company = {
          id: this.formData.company_id,
          name: this.formData.organization,
        }
      }

      if (this.formData.profile_pic)
        this.profilePic = [{ url: this.formData.profile_pic }]

      if (this.formData.languages && this.formData.languages.length > 0) {
        this.formData.languages = this.languages.filter((item) =>
          this.formData.languages.includes(item.name)
        )
      }
    },
    async submitForms() {
      const formData = this.formData
      if (formData.role) {
        formData.roles = [...formData.role]
      }
      delete formData.role

      if (
        formData.company &&
        formData.company !== '' &&
        formData.company.id &&
        formData.company.name
      ) {
        formData.company_id = formData.company.id
        formData.organization = formData.company.name
      }

      if (formData.languages && formData.languages.length > 0) {
        formData.languages = formData.languages.map((item) => item.name)
      }
      try {
        await this.$axios
          .post('api/user/update/' + this.viewedUser.id, formData)
          .then((res) => {
            if (
              this.$route.params.id !== this.$store.state.auth.user.slug &&
              (this.isAdminView || this.isWellAdmin)
            ) {
              this.$router.push('/user/profile/' + this.viewedUser.slug)
            } else {
              this.$router.push(`/user/profile`)
            }
          })
      } catch (error) {
        this.error = true
        this.$formulate.handle(error, 'form')
      }
    },
    handleCopyBilling(boxValue) {
      if (boxValue) {
        this.formData.addresses[0].country_code =
          this.formData.addresses[1].country_code
        this.formData.addresses[0].state = this.formData.addresses[1].state
        this.formData.addresses[0].street = this.formData.addresses[1].street
        this.formData.addresses[0].city = this.formData.addresses[1].city
        this.formData.addresses[0].postal_code =
          this.formData.addresses[1].postal_code
      }
    },
    handleEditCancel() {
      this.formData = null
      if (
        this.$route.params.id !== this.$store.state.auth.user.slug &&
        (this.isAdminView || this.isWellAdmin)
      ) {
        this.$router.push('/well-admin/users')
      } else {
        this.$router.push(`/user/profile`)
      }
    },
    handleOrganization(val) {
      this.formData.company_id = val.id
      this.formData.organization = val.name
    },
  },
}
</script>
