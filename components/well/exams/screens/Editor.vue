<template>
  <div class="px-5 text-gray-600">
    <div class="leading-loose">
      We want to make sure that you get this right the first time around! Please
      ensure the information below matches the ID you will show at the testing
      center and only use English characters.
    </div>
    <FormulateForm @submit="update">
      <div class="pb-2">
        <FormulateInput
          v-model="registration.first_name"
          type="text"
          name="first_name"
          label="First Name*"
          placeholder="First name (in english characters only) as indicated on your official ID"
          validation="required"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.last_name"
          type="text"
          name="last_name"
          label="Last Name*"
          placeholder="Last name (in english characters only) as indicated on your official ID"
          validation="required"
        />
      </div>
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Your Address</div>
        </div>
        <div
          class="flex flex-wrap px-4 py-2 w-full justify-between text-gray-400"
        >
          <div class="grid grid-cols-1 gap-x-4 gap-y-4 w-full">
            <FormInputsAddressFormulate
              v-if="registration.addresses"
              :address="registration.addresses[0]"
              :target="registration.addresses[0]"
              :required="true"
            />
          </div>
        </div>
      </div>
      <div class="pb-2 pt-2">
        <FormulateInput
          v-model="registration.phone_number"
          type="text"
          name="phone_number"
          label="Your Phone*"
          validation="required"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.job_title"
          type="text"
          name="job_title"
          label="Job Title*"
          validation="required"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="company"
          type="companymultisearch"
          name="organization"
          label="Organization*"
          validation="required"
          :searchable="true"
          :clearonselect="false"
          :closeonselect="true"
          :optionslimit="10"
        />
      </div>

      <div class="pb-2">
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
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.dob"
          type="datetimepicker"
          label="Date of birth *"
          max="9999-01-01"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.language"
          type="select"
          label="Exam Language *"
          placeholder="Select a language"
          :options="{
            '': '',
            en: 'English',
            cn: 'Chinese',
            fr: 'French',
            jp: 'Japanese',
            es: 'Spanish',
          }"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.exam_date"
          type="datetimepicker"
          placeholder="Select date"
          label="Exam Date"
          max="9999-01-01"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.exam_status"
          validation="required"
          type="select"
          label="Exam Status *"
          placeholder="Please select"
          :options="{
            pending: 'Pending',
            pass: 'Pass',
            fail: 'Fail',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
            expired: 'Expired',
          }"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.expiration_date"
          type="datetimepicker"
          placeholder="Select date"
          label="Expiration Date *"
          max="9999-01-01"
        />
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.is_asid"
          type="checkbox"
          label="I am a member of ASID"
        ></FormulateInput>
      </div>
      <div v-if="registration.is_asid">
        <div v-if="!asidResponse" class="flex items-end pb-2">
          <FormulateInput
            v-model="registration.asid_number"
            class="flex-grow"
            name="asid_number"
            type="text"
            placeholder="ASID membership ID"
            label="ASID Membership ID *"
            validation="required"
          />
          <WButtonsBase
            type="primaryInverted"
            @keypress="resetError()"
            @click.native="verify(registration.asid_number)"
            >Verify
          </WButtonsBase>
        </div>
        <div v-if="asidResponse === true">
          <span class="text-base mr-5"
            >Asid number
            <span class="text-primary-900"
              >({{ registration.asid_number }})</span
            >
            is applied for this exam.</span
          >
          <span
            class="font-base cursor-pointer font-bold mb-10 text-red-900 rounded"
            @click="resetAsid()"
            >Remove Code</span
          >
        </div>
        <span v-if="asidResponse === false" class="text-sm text-red-900 mb-5"
          >Please provide valid asid number</span
        >
      </div>
      <div class="pb-2">
        <FormulateInput
          v-model="registration.is_student"
          type="checkbox"
          label="I am a full time student"
        ></FormulateInput>
      </div>
      <div v-if="registration.is_student" class="pb-2">
        <FormulateInput
          v-model="registration.institution_name"
          class="flex-grow"
          type="text"
          name="institution_name"
          label="Institution name *"
        />
      </div>
      <div v-if="registration.is_student" class="pb-2">
        <FormulateInput
          v-model="registration.student_id"
          validation="required"
          type="text"
          name="student_id"
          label="Student ID *"
        />
      </div>
      <div v-if="registration.is_student" class="pb-2">
        <FormulateInput
          v-model="registration.graduation_date"
          validation="required"
          type="datetimepicker"
          name="dateofbirth"
          placeholder="Select date"
          label="Graduation Date *"
          max="9999-01-01"
        />
      </div>
      <div v-if="!isVerified" class="flex items-center pb-2">
        <div class="w-full">
          <FormulateInput
            v-model="registration.discount_code"
            class="flex-grow"
            type="text"
            name="discount_code"
            placeholder="If you have a discount code, please enter here"
            label="Discount code or GBCI Number"
            help="If you were issued a special code for registration, please enter here."
            @keyup.enter.native="verifyCoupon"
          />
        </div>
        <div class="w-32 -mt-5 ml-3">
          <WButtonsBase type="primary" @click.native="verifyCoupon">
            Apply
          </WButtonsBase>
        </div>
      </div>
      <div v-if="isVerified">
        <span class="text-base mr-5"
          >Discount code
          <span class="text-primary-900 font-bold"
            >({{ registration.discount_code }})</span
          >
          is applied for this exam.</span
        >
        <span
          class="font-base cursor-pointer font-bold mb-10 text-red-900 rounded"
          @click="resetCoupon"
          >Remove Code</span
        >
      </div>
      <div class="flex justify-between pb-5 pt-2">
        <div>
          <WButtonsBase type="danger"> Reset Fields </WButtonsBase>
        </div>
        <div>
          <FormulateInput type="submit" label="Update" />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    exam: {
      type: Object,
      required: false,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      isVerified: false,
      company: null,
      registration: {
        first_name: '',
        last_name: '',
        phone_number: '',
        job_title: '',
        organization: '',
        dob: '',
        language: null,
        is_asid: 0,
        asid_number: '',
        is_student: 0,
        institution_name: '',
        student_id: '',
        graduation_date: '',
        discount_code: '',
        bought_in_bundle: '',
      },
      gender: '',
      genderLocal: '',
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      languages: (state) => state.exam.languages,
      asidResponse: (state) => state.exam.asidResponse,
    }),
    countryOptions() {
      const options = []

      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].code,
          label: this.countries[i].name,
        }
        options.push(option)
      }

      return options
    },
  },
  mounted() {
    if (this.exam) {
      this.setupAdvance()
    }
  },
  methods: {
    setupAdvance() {
      this.registration = JSON.parse(JSON.stringify(this.exam))
      if (
        this.registration.organization &&
        this.registration.organization !== ''
      ) {
        this.company = {
          ...this.company,
          name: this.registration.organization,
        }
      }
      if (this.registration.company_id) {
        this.company = {
          ...this.company,
          id: this.registration.company_id,
        }
      }
      if (this.registration.discount_code) {
        this.isVerified = true
      }
      this.registration.language = this.languages.filter(
        (a) => a.value === this.exam.language
      )[0].value
      this.registration.dob = this.$dayjs(this.exam.dob).format('YYYY-MM-DD')
      this.registration.exam_date = this.exam.exam_date
        ? this.$dayjs(this.exam.exam_date).format('YYYY-MM-DD')
        : ''
      this.registration.expiration_date = this.exam.expiration_date
        ? this.$dayjs(this.exam.expiration_date).format('YYYY-MM-DD')
        : ''
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

      // this.registration.is_asid = this.exam.is_asid = !this.exam.is_asid
      // this.registration.is_student = this.exam.is_student = !this.exam
      //   .is_student
    },
    resetError() {
      this.$store.dispatch('message/resetAsidResponse')
    },
    resetAsid() {
      this.$store.dispatch('message/resetAsidResponse')
      this.registration.asid_number = ''
    },
    verify(data) {
      this.$store.dispatch('exam/getverify', data)
    },
    verifyCoupon() {
      if (this.registration.discount_code) {
        this.$axios
          .get(
            'api/coupon/validate/' +
              this.registration.discount_code +
              '?for=well-exam'
          )
          .then((response) => {
            this.isVerified = true
          })
      }
    },
    resetCoupon() {
      this.registration.discount_code = ''
      this.isVerified = false
    },
    async update() {
      const data = JSON.parse(JSON.stringify(this.registration))

      if (this.company.name && this.company.id && this.company.name !== '') {
        data.company_id = this.company.id
        data.organization = this.company.name
      }

      data.country_code = data.addresses[0].country_code
      data.state = data.addresses[0].state
      data.city = data.addresses[0].city
      data.postal_code = data.addresses[0].postal_code
      data.street = data.addresses[0].street
      data.graduation_date = data.graduation_date
        ? this.$dayjs(data.graduation_date).format('YYYY-MM-DD')
        : ''
      data.dob = data.dob ? this.$dayjs(data.dob).format('YYYY-MM-DD') : ''
      data.is_asid = data.is_asid === 'true' || data.is_asid ? 1 : 0
      data.is_student = data.is_student === 'false' || data.is_student ? 1 : 0
      data.exam_date = data.exam_date
        ? this.$dayjs(data.exam_date).format('YYYY-MM-DD')
        : null
      if (this.genderLocal === 'Prefer to self-describe') {
        data.gender = this.gender
      } else {
        data.gender = this.genderLocal
      }
      await this.$store.dispatch('exam/adminUpdateExam', data)
      await this.$store.dispatch(
        'exam/getAdminExamsList',
        this.$parent.$parent.allFilters
      )
    },
  },
}
</script>
