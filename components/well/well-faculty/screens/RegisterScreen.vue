<template>
  <div>
    <div v-if="faculty" class="p-4">
      <WFeedbackModal ref="submitModal" :can-manually-close="false">
        <div class="max-w-lg mx-6 md:mx-10 my-5">
          <WHeadingsHThree heading="Your application draft has been saved!" />
          <div class="mt-3 text-base leading-6 text-gray-500">
            Should you have questions about the qualifications we seek in our
            Faculty members, please contact us directly at
            <WLinksBase target="_blank" link="mailto:faculty@wellcertified.com">
              faculty@wellcertified.com
            </WLinksBase>
            and we will guide you through the application process.
            <div class="md:flex justify-between mt-5 space-y-2 md:space-y-0">
              <div v-if="$refs.modal">
                <WButtonsBase
                  type="primaryInverted"
                  icon="pencil"
                  @click.native="reviewApplication()"
                >
                  Review Application
                </WButtonsBase>
              </div>
              <div>
                <WButtonsBase
                  icon="check-circle"
                  type="primary"
                  @click.native="submitApproval()"
                >
                  Submit Application
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
      </WFeedbackModal>

      <WFeedbackModal
        ref="modal"
        :can-manually-close="false"
        @hook:mounted="enableModal()"
      >
        <div
          v-if="faculty.application_status !== 'approved'"
          class="mx-4 sm:mx-10 my-5 text-center"
        >
          <div
            class="
              mx-auto
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-full
              bg-green-100
            "
          >
            <svg
              class="h-6 w-6 text-green-600"
              x-description="Heroicon name: check"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <WHeadingsHThree
            heading="Your application has been successfully sent for review."
            class="mt-4"
          />
          <div class="mt-3 text-base text-gray-500 max-w-lg mx-auto">
            <div>Thank you for applying for the WELL Faculty program.</div>

            <div class="my-4">
              The current status of your application is:
              <div class="text-2xl text-primary-600 font-bold italic mt-2">
                {{ faculty.application_status }}
              </div>
            </div>

            If you have any questions, please contact us directly at
            <WLinksBase
              class="flex justify-center"
              target="_blank"
              link="mailto:faculty@wellcertified.com"
            >
              faculty@wellcertified.com
            </WLinksBase>
            and we will guide you through the application process.
          </div>
          <div class="sm:flex inline-block justify-center mt-5 mx-auto w-full">
            <div
              v-if="currentUser.role.includes('well-admin')"
              class="sm:w-56 sm:mr-3"
            >
              <WButtonsBase
                type="primaryInverted"
                @click.native="
                  () => {
                    $refs.modal.isHidden = true
                  }
                "
              >
                Review Application
              </WButtonsBase>
            </div>
            <div class="sm:w-32 mt-2 sm:mt-0">
              <WButtonsBase
                type="primary"
                @click.native="
                  $route.params.id
                    ? $router.push('/well-admin/faculty')
                    : $router.push('/well-faculty')
                "
              >
                Return
              </WButtonsBase>
            </div>
          </div>
        </div>
        <div v-else class="mx-4 sm:mx-10 my-5 text-center">
          <div
            class="
              mx-auto
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-full
              bg-green-100
            "
          >
            <svg
              class="h-6 w-6 text-green-600"
              x-description="Heroicon name: check"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <WHeadingsHThree heading="Congratulations!" />
          <div class="mt-3 text-base text-gray-500 max-w-lg mx-auto">
            <div class="mb-3">
              Your application has been approved after review. Thank you for
              applying for the WELL Faculty program.
            </div>

            <div>
              If you have any questions please contact us directly at
              <WLinksBase
                class="flex justify-center"
                target="_blank"
                link="mailto:faculty@wellcertified.com"
              >
                faculty@wellcertified.com
              </WLinksBase>
              .
            </div>
          </div>
          <div class="flex justify-between mt-5">
            <div class="flex flex-wrap w-1/2 gap-y-2">
              <WButtonsBase
                type="primaryInverted"
                @click.native="
                  $route.params.id
                    ? $router.push('/well-admin/faculty')
                    : $router.push('/well-faculty')
                "
              >
                Return
              </WButtonsBase>
              <WButtonsBase
                v-if="currentUser.role.includes('well-admin')"
                type="primaryInverted"
                @click.native="
                  () => {
                    $refs.modal.isHidden = true
                  }
                "
              >
                Review Application
              </WButtonsBase>
              <WButtonsBase
                type="primaryInverted"
                @click.native="
                  $router.push(
                    `/invoice/${faculty.invoices[0].invoice_number}?redirect=${$route.path}`
                  )
                "
              >
                <span
                  v-if="
                    Object.keys(faculty).length !== 0 &&
                    faculty.invoices &&
                    (faculty.invoices[0].status === 'paid' ||
                      faculty.invoices[0].status === 'waived')
                  "
                >
                  Review invoice
                </span>
                <span v-else> Pay invoice </span>
              </WButtonsBase>
            </div>
            <div>
              <WButtonsBase
                type="primary"
                icon="download"
                @click.native="
                  $store.dispatch('faculty/downloadAgreement', {
                    token: $store.state.authentication.token,
                    id: faculty.id,
                  })
                "
              >
                Download Agreement
              </WButtonsBase>
            </div>
          </div>
        </div>
      </WFeedbackModal>

      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="WELL Faculty Application" />
        <!-- Change status  -->
        <WStepsHorizontal
          :steps="[
            {
              name: 'REGISTER HERE',
              status: faculty ? 'complete' : 'current',
            },
            {
              name: 'SUBMIT FOR REVIEW',
              status: submitStatus,
            },
            {
              name: 'REVIEW RESULT',
              status: reviewStatus,
            },
            {
              name: 'PAY INVOICE',
              status: '',
            },
          ]"
        />
      </NavBreadcrumbs>

      <!-- step 1 -->
      <div v-if="currentStep === 1">
        <FormulateForm @submit="validateStep">
          <FacultyPersonalDetailsScreen
            v-if="Object.keys(formData).length !== 0"
            :resumes-input="resumes"
            :address-input="address"
            :data-input="formData"
            @transferData="transferData"
          />
        </FormulateForm>
      </div>

      <!-- step 2 -->
      <div v-if="currentStep === 2">
        <FormulateForm @submit="validateStep">
          <FacultyPresentationScreen
            v-if="Object.keys(formData).length !== 0"
            :current-step-input="currentStep"
            :presentation-input="presentation"
            :presenter-input="presenter"
            :documentation-input="documentation"
            :data-input="formData"
            @handleStep="handleStep"
            @transferData="transferData"
          />
        </FormulateForm>
      </div>
      <!-- step 3 -->
      <!-- Third form: who should see this section?  -->
      <div v-if="currentUser.role.includes('well-admin') && currentStep === 3">
        <FormulateForm @submit="validateStep">
          <FacultyAdminScreen
            v-if="Object.keys(formData).length !== 0"
            :data-input="formData"
            :current-step-input="currentStep"
            :score-cards-input="scoreCards"
            @handleStep="handleStep"
            @transferData="transferData"
          />
        </FormulateForm>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Loading Registration Information...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      resumes: [],
      presenter: [],
      presentation: [],
      documentation: [],
      scoreCards: [],
      currentStep: 1,
      submitting: false,
      tempData: [],
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      formData: {},
    }
  },
  computed: {
    ...mapState({
      faculty: (state) => state.faculty.faculty,
      currentUser: (state) => state.user.currentUser,
      languages: (state) => state.languages.languages,
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
    allDocuments() {
      const allDocuments = []
      for (let i = 0; i < this.resumes.length; i++) {
        allDocuments.push({
          type: 'cv',
          link_s3: this.resumes[i].url,
        })
      }
      for (let i = 0; i < this.presenter.length; i++) {
        allDocuments.push({
          type: 'presenter',
          link_s3: this.presenter[i].url,
        })
      }
      for (let i = 0; i < this.scoreCards.length; i++) {
        allDocuments.push({
          type: 'scorecard',
          link_s3: this.scoreCards[i].url,
        })
      }
      for (let i = 0; i < this.presentation.length; i++) {
        allDocuments.push({
          type: 'presentation',
          link_s3: this.presentation[i].url,
        })
      }
      for (let i = 0; i < this.documentation.length; i++) {
        allDocuments.push({
          type: 'documentation',
          link_s3: this.documentation[i].url,
        })
      }
      return allDocuments
    },
    registeredStatus() {
      if (Object.keys(this.faculty).length !== 0) {
        return 'complete'
      }
      return 'current'
    },
    submitStatus() {
      if (this.faculty) {
        if (this.faculty.is_draft === 1) {
          return 'current'
        }

        if (this.faculty.is_draft === 0) {
          return 'complete'
        }

        return ''
      }
      return ''
    },
    reviewStatus() {
      if (this.faculty) {
        if (
          this.faculty.is_draft === 0 &&
          this.faculty.application_status !== 'approved'
        ) {
          return 'current'
        }

        if (this.faculty.application_status === 'approved') {
          return 'complete'
        }

        return ''
      }

      return ''
    },
  },
  async mounted() {
    await this.$store.dispatch('faculty/getFaculty', this.$route.params.id)
    if (this.faculty) {
      this.setDocuments()
      this.formData = JSON.parse(JSON.stringify(this.faculty))
      // if there is an existing faculty data then format the language options for the multiselect
      const languageData = []
      if (this.formData.language) {
        for (let i = 0; i < this.formData.language.length; i++) {
          if (
            this.languageOptions.find(
              (language) => language.value === this.formData.language[i]
            )
          ) {
            languageData.push(
              this.languageOptions.find(
                (language) => language.value === this.formData.language[i]
              )
            )
          }
        }
      }
      this.formData.language = languageData
      if (this.faculty.addresses)
        this.address = { ...this.faculty.addresses[0] }
    }
  },
  methods: {
    reviewApplication() {
      this.currentStep = 1
      this.$refs.submitModal.isHidden = true
    },
    enableModal() {
      if (Object.keys(this.faculty).length !== 0) {
        this.$refs.modal.isHidden = false
      }
    },
    transferData(data) {
      this.formData = JSON.parse(JSON.stringify(data.formData))
      if (data.resumes) this.resumes = data.resumes
      if (data.address) this.address = data.address
      if (data.documentation) this.documentation = data.documentation
      if (data.presentation) this.presentation = data.presentation
      if (data.presenter) this.presenter = data.presenter
      if (data.scoreCards) this.scoreCards = data.scoreCards
    },
    handleStep(val) {
      this.currentStep = val
    },
    setDocuments() {
      this.resumes = []
      this.presenter = []
      this.scoreCards = []
      this.presentation = []
      this.documentation = []
      if (this.faculty.documents) {
        for (let i = 0; i < this.faculty.documents.length; i++) {
          switch (this.faculty.documents[i].type) {
            case 'cv':
              this.resumes.push({
                name: this.faculty.documents[i].name,
                url: this.faculty.documents[i].link_s3,
              })
              break
            case 'presenter':
              this.presenter.push({
                url: this.faculty.documents[i].link_s3,
                name: this.faculty.documents[i].name,
              })
              break
            case 'scorecard':
              this.scoreCards.push({
                url: this.faculty.documents[i].link_s3,
                name: this.faculty.documents[i].name,
              })
              break
            case 'presentation':
              this.presentation.push({
                url: this.faculty.documents[i].link_s3,
                name: this.faculty.documents[i].name,
              })
              break
            case 'documentation':
              this.documentation.push({
                url: this.faculty.documents[i].link_s3,
                name: this.faculty.documents[i].name,
              })
              break
          }
        }
      }

      if (this.formData.cred_and_cert) {
        this.formData.cred_and_cert = this.formData.cred_and_cert[0]
      }
    },
    validateStep() {
      // step 3 is only for well-adim user

      if (this.currentStep === 3) {
        if (Object.keys(this.faculty).length !== 0) {
          this.updateForm()
        } else {
          this.submitForm()
        }
      } else if (
        this.currentStep === 2 &&
        !this.currentUser.role.includes('well-admin')
      ) {
        if (Object.keys(this.faculty).length !== 0) {
          this.updateForm()
        } else {
          this.submitForm()
        }
      } else {
        this.currentStep++
      }
    },
    async submitApproval() {
      const newFaculty = { ...this.faculty }

      this.faculty.is_draft = 0

      newFaculty.is_draft = 0
      newFaculty.street = newFaculty.addresses[0].street
      newFaculty.state = newFaculty.addresses[0].state
      newFaculty.city = newFaculty.addresses[0].city
      newFaculty.country_code = newFaculty.addresses[0].country_code
      newFaculty.postal_code = newFaculty.addresses[0].postal_code

      try {
        await this.$store.dispatch('faculty/update', newFaculty)
      } catch (error) {
        throw new Error(error)
      }

      this.$route.params.id
        ? this.$router.push('/well-admin/faculty')
        : this.$router.push('/well-faculty')
    },
    async submitForm() {
      const newFaculty = { ...this.formData }

      const languages = []

      for (let i = 0; i < newFaculty.language.length; i++) {
        languages.push(newFaculty.language[i].value)
      }

      newFaculty.language = languages
      newFaculty.is_draft = 1
      newFaculty.documents = this.allDocuments
      newFaculty.street = this.address.street
      newFaculty.city = this.address.city
      newFaculty.state = this.address.state
      newFaculty.country_code = this.address.country_code
      newFaculty.postal_code = this.address.postal_code

      if (this.formData.cred_and_cert != null) {
        newFaculty.cred_and_cert = [newFaculty.cred_and_cert]
      }
      this.submitting = true

      await this.$store
        .dispatch('faculty/create', newFaculty)
        .then(async (res) => {
          this.$refs.submitModal.isHidden = false
          this.submitting = false
          this.$store.dispatch('faculty/getFaculty')
          await this.$store.dispatch('faculty/getFaculty', res.data.id)
          this.setDocuments()
          this.formData = JSON.parse(JSON.stringify(this.faculty))
          // if there is an existing faculty data then format the language options for the multiselect
          const languageData = []
          if (this.formData.language) {
            for (let i = 0; i < this.formData.language.length; i++) {
              if (
                this.languageOptions.find(
                  (language) => language.value === this.formData.language[i]
                )
              ) {
                languageData.push(
                  this.languageOptions.find(
                    (language) => language.value === this.formData.language[i]
                  )
                )
              }
            }
          }
          this.formData.language = languageData
          if (this.faculty.addresses)
            this.address = { ...this.faculty.addresses[0] }
        })
    },
    async updateForm() {
      const newFaculty = { ...this.faculty, ...this.formData }

      const languages = []

      for (let i = 0; i < newFaculty.language.length; i++) {
        languages.push(newFaculty.language[i].value)
      }

      newFaculty.language = languages

      newFaculty.documents = this.allDocuments

      newFaculty.street = this.address.street
      newFaculty.city = this.address.city
      newFaculty.state = this.address.state
      newFaculty.country_code = this.address.country_code
      newFaculty.postal_code = this.address.postal_code

      if (this.formData.cred_and_cert != null) {
        newFaculty.cred_and_cert = [newFaculty.cred_and_cert]
      }

      const self = this

      this.submitting = true

      await this.$store.dispatch('faculty/update', newFaculty).then(
        setTimeout(() => {
          self.$store
            .dispatch('faculty/getFaculty', self.$route.params.id)
            .then(() => {
              if (this.currentUser.role.includes('well-admin')) {
                self.$refs.modal.isHidden = false
              } else {
                self.$refs.submitModal.isHidden = false
              }
              self.submitting = false
            })
        }, 1000)
      )
    },
  },
}
</script>
