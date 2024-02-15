<template>
  <div>
    <div v-if="currentUser" class="">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="WELL AP Exam Registration" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'REGISTER HERE',
              status: 'current',
              link: '/well-ap/register',
            },
            {
              name: 'MAKE THE COMMITMENT',
              status: '',
              link: '/well-ap/invoice',
            },
            {
              name: 'EXAM DASHBOARD',
              status: '',
              link: '/well-ap/materials',
            },
          ]"
        />
      </NavBreadcrumbs>

      <div class="relative bg-white rounded-lg shadow-md">
        <div class="hidden lg:block lg:absolute lg:inset-0">
          <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              class="h-56 w-full object-cover lg:absolute lg:h-full rounded-r-lg"
              :src="'/well-ap/register/' + currentStep + '.jpg'"
              alt=""
            />
          </div>
        </div>
        <div
          class="border rounded-lg relative py-6 px-4 xl:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
        >
          <div class="lg:pr-8">
            <div
              :class="{ hidden: currentStep !== 0 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo heading="Register now"> </WHeadingsHTwo>
              <div
                class="text-yellow-500 border border-yellow-500 mt-3 font-bold text-base leading-6 rounded p-2"
              >
                Please ensure the information below matches the ID you will show
                at the testing center and only use English characters.
              </div>

              <FormulateForm @submit="validateStep">
                <div class="md:flex mt-4">
                  <FormulateInput
                    v-model="first_name"
                    type="text"
                    label="First name*"
                    class="md:mr-5 md:w-1/2"
                    validation="required"
                  />
                  <FormulateInput
                    v-model="last_name"
                    type="text"
                    label="Last name*"
                    class="md:w-1/2"
                    validation="required"
                  />
                </div>

                <FormInputsAddressFormulate
                  :key="forceReMount"
                  ref="mailingAddress"
                  :required="true"
                  :address="mailingAddress"
                  :target="mailingAddress"
                  :element-id="`mailing`"
                />

                <FormulateInput
                  v-model="phone_number"
                  type="text"
                  label="Phone number*"
                  validation="required"
                />
                <FormulateInput class="mt-5" type="submit" label="Continue" />
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 1 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo heading="Tell us more about you"> </WHeadingsHTwo>
              <FormulateForm @submit="validateStep">
                <FormulateInput
                  v-model="job_title"
                  class="mt-8"
                  type="text"
                  label="Job title *"
                  validation="required"
                />
                <!-- <FormulateInput
                  v-model="organization"
                  type="text"
                  label="Organization *"
                  validation="required"
                /> -->
                <FormulateInput
                  v-model="company"
                  type="companymultisearch"
                  name="organization"
                  label="Organization *"
                  validation="required"
                  :searchable="true"
                  :clearonselect="false"
                  :closeonselect="true"
                  :optionslimit="5"
                />
                <FormulateInput
                  v-model="genderLocal"
                  :options="{
                    Male: 'Male',
                    Female: 'Female',
                    'Non-binary': 'Non-binary',
                    'Prefer to self-describe': 'Prefer to self-describe',
                    'Prefer not to say': 'Prefer not to say',
                  }"
                  validation="required"
                  type="radio"
                  label="Gender"
                />
                <FormulateInput
                  v-if="genderLocal === 'Prefer to self-describe'"
                  v-model="gender"
                  type="text"
                  label="Prefer to self-describe *"
                  validation="required"
                />

                <FormulateInput
                  v-model="dob"
                  type="datetimepicker"
                  label="Date of birth *"
                  validation="required|before:2002-10-08"
                  max="9999-01-01"
                />

                <div class="md:flex mt-5">
                  <span
                    class="h-10 md:w-1/2 md:mr-1 mb-2 md:mb-0 inline-block w-full"
                  >
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        ;(currentStep = 0),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 md:w-1/2 md:ml-1 inline-block w-full">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 2 && currentStep !== 3 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo heading="Almost finished!" class="mb-10">
              </WHeadingsHTwo>
              <FormulateForm :form-errors="formErrors" @submit="validateStep">
                <FormulateInput
                  v-model="language"
                  type="select"
                  label="Exam language"
                  placeholder="Select an exam language"
                  validation="required"
                  :options="{
                    en: 'English',
                  }"
                />
                <FormulateInput
                  v-model="is_asid"
                  class="mb-4 mt-3"
                  type="checkbox"
                  label="I am a member of ASID"
                />

                <FormulateInput
                  v-if="is_asid"
                  v-model="asid_number"
                  type="text"
                  label="ASID Number"
                />

                <FormulateInput
                  v-model="is_student"
                  class="mb-4"
                  type="checkbox"
                  label="I am a full time student"
                />

                <FormulateInput
                  v-if="is_student"
                  v-model="institution_name"
                  type="text"
                  label="Institution Name"
                  validation="required"
                />

                <FormulateInput
                  v-if="is_student"
                  v-model="student_id"
                  type="text"
                  label="Student ID"
                  validation="required"
                />

                <FormulateInput
                  v-if="is_student"
                  v-model="graduation_date"
                  type="date"
                  label="Graduation Date"
                  validation="required"
                  max="9999-01-01"
                />
                <div v-if="!is_student">
                  <div v-if="!discountApplied">
                    <div class="mt-8 sm:flex sm:space-x-4 mx-auto">
                      <FormulateInput
                        v-model="discount_code"
                        class="w-full"
                        type="text"
                        label="Discount code"
                      />

                      <div class="sm:w-32 -mt-2 sm:-mt-0">
                        <WButtonsBase
                          class="sm:mt-6"
                          @click.native="applyDiscount"
                        >
                          Apply
                        </WButtonsBase>
                      </div>
                    </div>
                    <div v-if="discountError" class="mt-2 text-sm text-red-600">
                      {{ discountError }}
                    </div>
                  </div>
                  <div
                    v-else
                    class="flex items-center justify-between bg-primary-100 rounded-lg border pl-5"
                  >
                    <div class="my-auto text-primary-700">
                      Discount code ({{ discount_code }}) is applied for this
                      exam.
                    </div>
                    <div>
                      <WButtonsBase
                        icon="trash"
                        type="neutral"
                        class="text-danger-500"
                        @click.native="
                          ;(discount_code = null),
                            (discountApplied = false),
                            (discountError = null)
                        "
                      />
                    </div>
                  </div>
                </div>
                <!-- needs v-model for check box -->
                <FormulateInput
                  v-model="isAgreed"
                  type="checkbox"
                  validation="required"
                  class="xl:mt-32 mt-5 mb-5 flex-wrap"
                  name="Agreement"
                >
                  <template #label>
                    <label>
                      <div class="text-primary-600 pl-3">
                        All candidates must agree to the
                        <a
                          href="https://resources.wellcertified.com/tools/iwbi-disciplinary-and-exam-appeals-policy/"
                          target="_blank"
                          class="border-b"
                        >
                          Disciplinary and Exam Appeals Policy
                        </a>
                        and the
                        <a
                          href="https://resources.wellcertified.com/tools/well-ap-candidate-handbook/"
                          target="_blank"
                          class="border-b"
                        >
                          WELL AP Candidate Handbook
                        </a>
                      </div>
                    </label>
                  </template>
                </FormulateInput>

                <div class="flex flex-col sm:flex-row">
                  <span class="h-10 sm:w-1/2 sm:mr-1 mb-2 sm:mb-0">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                      >Back</WButtonsBase
                    >
                  </span>
                  <span class="h-10 sm:w-1/2 sm:ml-1">
                    <WButtonsBase v-if="submitting" :type="'primaryInverted'">
                      <span>
                        <WLoadingSpinner type="button" class="mx-auto" />
                      </span>
                    </WButtonsBase>
                    <FormulateInput v-else type="submit" label="Submit" />
                  </span>
                </div>
              </FormulateForm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Exam Registration...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      test: '1',
      submitting: false,
      performedSetup: false,
      currentStep: 0,
      countrySelected: { id: 236, code: 'US', name: 'United States' },
      first_name: '',
      last_name: '',
      phone_number: '',
      job_title: '',
      company: null,
      company_id: null,
      organization: '',
      gender: '',
      genderLocal: '',
      dob: '',
      language: '',
      is_asid: false,
      asid_number: '',
      is_student: false,
      institution_name: '',
      student_id: '',
      graduation_date: '',
      discount_code: '',
      bought_in_bundle: 0,
      exam_date: '',
      exam_status: '',
      expiration_date: '',
      discountApplied: false,
      discountError: null,
      isAgreed: false,
      formErrors: [],
      forceReMount: 0,
      mailingAddress: {
        country_code: '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
      },
    }
  },
  head() {
    return {
      title: `WELL AP Registration`,
    }
  },
  computed: {
    ...mapState({
      discountedCountries: (state) => state.exam.discountedCountries,
      exam: (state) => state.exam.exam,
      userMailingAddress: (state) => state.user.currentUser.addresses,
      currentUser: (state) => state.user.currentUser,
    }),
    city() {
      if (this.$refs.mailingAddress.target.city) {
        return this.$refs.mailingAddress.target.city
      }
      return ''
    },
    country() {
      if (this.$refs.mailingAddress.target.country_code) {
        return this.$refs.mailingAddress.target.country_code
      }
      return ''
    },
    postalCode() {
      if (this.$refs.mailingAddress.target.postal_code) {
        return this.$refs.mailingAddress.target.postal_code
      }
      return ''
    },
    address_state() {
      if (this.$refs.mailingAddress.target.state) {
        return this.$refs.mailingAddress.target.state
      }
      return ''
    },
    street() {
      if (this.$refs.mailingAddress.target.street) {
        return this.$refs.mailingAddress.target.street
      }
      return ''
    },
  },
  watch: {
    currentUser(newValue, oldValue) {
      // setup form if there is an exam already present
      this.setupBasicDetails()
    },
    exam(newValue, oldValue) {
      // setup form if there is an exam already present
      if (!this.performedSetup && newValue != null) {
        this.first_name = this.exam.first_name
        this.last_name = this.exam.last_name
        this.phone_number = this.exam.phone_number
        this.job_title = this.exam.job_title
        this.organization = this.exam.organization
        this.gender = this.exam.gender
        if (
          ![
            'Prefer to self-describe',
            'Male',
            'Female',
            'Non-binary',
            'Prefer not to say',
          ].includes(this.exam.gender) &&
          this.exam.gender
        ) {
          this.genderLocal = 'Prefer to self-describe'
          this.gender = this.exam.gender
        } else {
          this.genderLocal = this.exam.gender
        }
        this.dob = this.exam.dob.substring(0, 10)
        this.language = this.exam.language
        this.is_asid = this.exam.is_asid
        this.is_student = this.exam.is_student
        this.institution_name = this.exam.institution_name
        this.student_id = this.exam.student_id
        if (this.exam.graduation_date != null) {
          this.graduation_date = this.exam.graduation_date.substring(0, 10)
        }
        this.asid_number = this.exam.asid_number
        // address info
        this.performedSetup = true
        if (
          this.exam !== '' &&
          this.exam.addresses &&
          this.exam.addresses.length > 0
        ) {
          this.mailingAddress = {
            country_code: this.exam.addresses[0].country_code,
            street: this.exam.addresses[0].street,
            state: this.exam.addresses[0].state,
            city: this.exam.addresses[0].city,
            postal_code: this.exam.addresses[0].postal_code,
          }
          this.forceReMount++
        }
      }
    },
    userMailingAddress() {
      if (this.userMailingAddress && this.exam === '') {
        this.mailingAddress = this.userMailingAddress.find((a) => a.is_primary)
        this.forceReMount++
      }
    },
  },
  async created() {
    this.setupBasicDetails()
    return await this.$store
      .dispatch('exam/getExams')
      .catch((error) => (this.error = error))
  },
  mounted() {
    if (window.analytics) {
      window.analytics.track('Enrollment Started', {
        product: 'WELL AP',
      })
    }
  },
  methods: {
    setupBasicDetails() {
      if (this.exam === '' && !this.performedSetup && this.currentUser) {
        this.first_name = this.currentUser.name
        this.last_name = this.currentUser.last_name
        this.phone_number = this.currentUser.phone_number
        this.job_title = this.currentUser.job_title
        this.organization = this.currentUser.organization

        // Set Autocomplete State on Load
        if (this.organization && this.organization !== '') {
          this.company = {
            ...this.company,
            name: this.organization,
          }
        }
        if (this.company_id) {
          this.company = {
            ...this.company,
            id: this.company_id,
          }
        }

        this.gender = this.currentUser.gender

        this.dob = this.currentUser.dob
        this.performedSetup = true
      }
      if (this.userMailingAddress && this.exam === '') {
        this.mailingAddress = this.userMailingAddress.find((a) => a.is_primary)
        this.forceReMount++
      }
    },
    validateStep() {
      this.$parent.$parent.$refs.content.scrollTop = 0
      if (this.currentStep === 2) {
        this.updateExam()
      } else {
        this.currentStep++
      }
    },
    applyDiscount() {
      this.$axios
        .get(
          this.$axios.defaults.baseURL +
            'api/coupon/validate/' +
            this.discount_code +
            '?for=well-exam'
        )
        .then((response) => {
          this.discountApplied = true
        })
        .catch((err) => {
          if (err) {
            this.discountError = 'Invalid discount code!'
          }
        })
    },
    async updateExam() {
      const formData = {
        first_name: this.first_name, // required
        last_name: this.last_name, // required
        street: this.street, // required
        city: this.city, // required
        state: this.address_state,
        country_code: this.country, // required
        postal_code: this.postalCode, // required
        phone_number: this.phone_number, // required
        job_title: this.job_title, // required
        company_id: this.company.id, // From AutoComplete State
        organization: this.company.name, // From AutoComplete State
        dob: this.dob, // required
        language: this.language, // required
        is_asid: this.is_asid,
        asid_number: this.asid_number,
        is_student: this.is_student,
        institution_name: this.institution_name,
        student_id: this.student_id,
        graduation_date: this.graduation_date,
        discount_code: this.discount_code,
        bought_in_bundle: 0, // required
        id: this.exam.id,
      }
      if (this.genderLocal === 'Prefer to self-describe') {
        formData.gender = this.gender
      } else {
        formData.gender = this.genderLocal
      }
      this.submitting = true
      await this.$store.commit('exam/setExam', formData)

      if (window.analytics) {
        window.analytics.track('Enrollment Created', {
          product: 'WELL AP',
        })
      }

      if (formData.id) {
        await this.$store.dispatch('exam/updateById', formData.id)
        this.$router.push('/well-ap/invoice')
      } else {
        await this.$store.dispatch('exam/create')
        this.$router.push('/well-ap/invoice')
      }
    },
  },
}
</script>
