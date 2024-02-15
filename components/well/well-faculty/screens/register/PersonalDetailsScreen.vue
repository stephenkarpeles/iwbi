<template>
  <div>
    <div
      class="
        relative
        bg-white
        rounded-lg
        shadow-md
        p-4
        md:p-8
        border border-primary-200
      "
    >
      <WHeadingsHThree
        heading="Personal Details"
        sub-heading="Your personal details"
      />
      <FormulateInput
        v-model="formData.first_name"
        type="text"
        label="First name*"
        class="mr-5 w-full"
        validation="required"
      />
      <FormulateInput
        v-model="formData.last_name"
        type="text"
        label="Last name*"
        class="w-full"
        validation="required"
      />
      <FormulateInput
        v-model="formData.email"
        label="Email*"
        type="email"
        validation="required"
      />
    </div>

    <div
      class="
        relative
        bg-white
        rounded-lg
        shadow-md
        p-4
        md:p-8
        mt-6
        border border-primary-200
      "
    >
      <WHeadingsHThree heading="Address" sub-heading="Your personal details " />
      <FormInputsAddressFormulate
        :address="address"
        :target="address"
        :required="true"
      />
    </div>

    <div
      class="
        relative
        bg-white
        rounded-lg
        shadow-md
        p-4
        md:p-8
        mt-6
        border border-primary-200
      "
    >
      <WHeadingsHThree
        heading="Job Details"
        sub-heading="Your personal details "
      />
      <FormulateInput
        v-model="formData.employer"
        label="Employer"
        type="text"
      />
      <FormulateInput
        v-model="formData.position"
        label="Position"
        type="text"
      />
      <ClientOnly>
        <FormulateInput
          v-model="formData.language"
          type="multi"
          :taggable="true"
          :multiple="true"
          :searchable="true"
          label="Language(s)"
          placeholder="Select a language"
          :options="languageOptions"
          track-by="value"
        />
      </ClientOnly>

      <FormulateInput
        v-model="resumes"
        label="Please upload your cv or resume here.*"
        :value="resumesInput"
        type="fileupload"
        upload-path="faculty/"
        mime-types="application/msword, text/plain, application/pdf"
        validation="required|max:1"
        :multiple="false"
        help="Files must be less than 20 MB. Allowed file types: doc, docx, pdf, txt."
      />

      <FormulateInput
        v-model="formData.usgbc_faculty"
        label="Are you a current USGBC Faculty Member?"
        type="radio"
        :options="{ 1: 'Yes', 0: 'No' }"
      />

      <FormulateInput
        v-model="formData.cred_and_cert"
        :options="{
          'WELL AP': 'WELL AP',
          'Register to take WELL exam on a future date':
            'Register to take WELL exam on a future date',
          'Relevant Certification': 'Relevant Certification',
          'Or Equivalent': 'Or Equivalent',
        }"
        type="radio"
        label="Credentials &amp; Certificates"
      />
      <FormulateInput
        v-model="formData.usgbc_migrated"
        :options="{
          1: 'Yes',
          0: 'No',
        }"
        type="radio"
        label="Migrated from USGBC"
      />
      <FormulateInput
        class="mt-5"
        type="submit"
        label="Continue"
        @click="
          $emit('transferData', {
            formData: formData,
            resumes: resumes,
            address: address,
          })
        "
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    dataInput: {
      type: Object,
      required: true,
    },
    addressInput: {
      type: Object,
      required: true,
    },
    resumesInput: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      formData: {},
      resumes: [],
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
    }
  },
  computed: {
    ...mapState({
      languages: (state) => state.languages.languages,
      faculty: (state) => state.faculty.faculty,
      currentUser: (state) => state.user.currentUser,
    }),
    languageOptions() {
      const options = []
      Object.keys(this.languages).map((key, index) => {
        const option = {
          label: this.languages[key],
          value: this.languages[key],
        }
        return options.push(option)
      })
      return options
    },
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.dataInput))
    this.address = JSON.parse(JSON.stringify(this.addressInput))

    if (this.formData.cred_and_cert) {
      if (Array.isArray(this.formData.cred_and_cert)) {
        this.formData.cred_and_cert = this.formData.cred_and_cert[0]
      }
    }

    if (this.faculty.addresses && this.faculty.addresses.length) {
      this.address = { ...this.faculty.addresses[0] }
    }
    if (!this.formData.email) {
      this.formData.email = this.currentUser.email
    }

    if (!this.formData.first_name) {
      this.formData.first_name = this.currentUser.name
    }

    if (!this.formData.last_name) {
      this.formData.last_name = this.currentUser.last_name
    }
  },
}
</script>
