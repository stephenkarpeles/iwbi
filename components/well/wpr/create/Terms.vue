<template>
  <div class="relative bg-white rounded-lg shadow-md">
    <WFeedbackAlert ref="alert" />
    <div class="md:pt-8 pb-16 px-4 sm:pt-16 sm:px-6 border rounded-md lg:px-8">
      <div>
        <div>
          <ClientOnly>
            <div class="flex justify-between items-center">
              <WHeadingsHTwo
                class="text-primary-700"
                heading="Review terms and conditions"
              >
              </WHeadingsHTwo>
              <WLinksBase
                icon="download"
                target="_blank"
                class="w-10"
                link="https://cdn.wellcertified.com/resources/health-safety/WELL+Health-Safety+Rating+Agreement.pdf"
              >
              </WLinksBase>
            </div>
            <div
              class="space-y-6 w-full border rounded border-primary-500 h-64 overflow-y-scroll p-4 text-sm leading-5 opacity-60 text-primary-900"
            >
              <LegalRatingTerms />
            </div>
          </ClientOnly>
          <div class="my-5 border-l-2 p-3 border-primary-600 bg-primary-100">
            <WHeadingsHFour
              class="text-primary-700"
              heading="Directory Listing"
            />
            <div class="mt-2 text-sm leading-5 text-primary-700">
              <p>
                As a default, an organization enrolling locations to earn a WELL
                WELL Performance Rating has their organization name and
                locations listed in the associated WELL directories and may be
                referenced in IWBI materials or communications. You can opt-out
                of these opportunities at the time of enrollment to remain
                confidential, but organizations cannot publicly promote any
                participation or achievements in the WELL WELL Performance
                Rating or use any IWBI intellectual location including logos
                until their status is public. You may change the privacy setting
                for your project at any time before issuance of the rating
                designation using functionality in the platform. Your privacy
                status will be automatically transitioned to a public project
                upon issuance of the rating, but you can also adjust it from
                private to public at any time in your account.
              </p>
            </div>
          </div>
          <FormulateForm @submit="updateSharedWorkspace">
            <div class="text-sm relative flex font-bold text-primary-900">
              <span class="whitespace-nowrap mr-1"
                >Is this participation considered</span
              >
              <Flyout
                :show-triangle="false"
                y="bottom"
                x="right"
                class="h-full mt-2 w-full"
              >
                <WLinksBase
                  type="primaryInverted"
                  class="text-primary-600 -mt-3 md:mt-0"
                >
                  public</WLinksBase
                ><span class="-mt-3 md:mt-0">*?</span>
                <template #content>
                  <div>
                    <h3
                      class="p-4 text-center bg-primary-100 text-xl text-primary-700 mb-2 py-2"
                    >
                      Public vs Private Projects
                    </h3>
                    <div
                      class="p-4 opacity-50 leading-6 text-sm text-primary-900 font-light"
                    >
                      <!-- New text -->
                      <p>
                        Please confirm your project may appear in the public
                        project directory identifying your project as pursuing a
                        WELL designation and as such will be deemed a "Public
                        Project." All such Public Projects may also accurately
                        promote and publicize their current status on their WELL
                        journey such as pursuing a WELL rating or certification
                        and once achieved, that such project is rated or
                        certified. If you wish for your project to remain
                        private, please designate your project as "Private" in
                        which case it will not appear in the public directory
                        and you will <b><i>not</i></b> be permitted to market or
                        publicize its status of pursuing a WELL designation. You
                        may change your project's status from "private" to
                        "public" at any time. Please note, if the project's
                        status becomes published or made public in IWBI's
                        reasonable discretion or if you achieve the rating or
                        certification, then the project will be deemed a Public
                        Project upon such publication or achievement.
                      </p>
                      <!-- Commenting out original text until confirmation -->
                      <!-- <p>
                        A project may opt-out of the WELL project directory and
                        publicity opportunities by electing to be a “private
                        project” at the time of registration. A private project
                        means that the project name, street address, and
                        identity of the owner will not appear within the WELL
                        project directory. Certain other non-project identifying
                        information may be disclosed, including, but not limited
                        to, the city and state in which the project is located
                        and the total project square footage.
                        <b
                          >All private projects that achieve WELL Certification
                          or the WELL WELL Performance Rating will be prompted
                          upon issuance of award, if any, to transition to
                          public status. A project that wishes to remain a
                          private project will need to re-confirm its private
                          status at the time of certification/rating.</b
                        >
                      </p>

                      <p>
                        For so long as a project maintains its election as a
                        “private project,” the project cannot market or
                        represent itself to the general public as having applied
                        for certification/rating, or as being certified or
                        compliant, and no intellectual property including the
                        WELL certification trademarks may be utilized or
                        displayed in relation to the project. Project owners may
                        change the privacy setting for a project at any time
                        before acceptance of the final award, using
                        functionality in the WELL Digital Platform. Moreover, if
                        it is determined in IWBI’s reasonable discretion that
                        despite its election as private project, your project
                        has been/is being marketed to the public as having
                        registered for or received certification, it will be
                        deemed implied consent given by you to IWBI to consider
                        your project as a public project.
                      </p> -->
                    </div>
                  </div>
                </template>
              </Flyout>
            </div>
            <FormulateInput
              v-model="formData.portfolio_public"
              class="text-primary-700 flex"
              type="radio"
              :options="{
                1: 'Yes',
                0: 'No',
              }"
              validation="required"
            />

            <FormulateInput
              v-model="formData.terms"
              type="checkbox"
              label="By checking this box you acknowledge you have read the Terms & Conditions and agree to be bound by these Terms.*"
              class="mr-5 mt-5"
              validation="required"
            />
            <div class="md:flex space-y-3 md:space-y-0 justify-between mt-5">
              <div>
                <WButtonsBase
                  type="primaryInverted"
                  class="whitespace-nowrap"
                  @click.native="$router.push('/wpr')"
                >
                  Back to homepage
                </WButtonsBase>
              </div>
              <div>
                <WButtonsBase v-if="submitting" :type="'primaryInverted'">
                  <span>
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                </WButtonsBase>
                <FormulateInput
                  v-else
                  type="submit"
                  :label="showInvoice ? 'Continue' : 'Save'"
                  class="md:w-28"
                />
              </div>
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      submitting: false,
      formData: {
        portfolio_public: 1,
      },
    }
  },
  computed: {
    spaceTypes() {
      return this.$store.state.custom.spaceTypes
    },
    showInvoice() {
      if (
        (this.$store.state.shared.sharedWorkspace.multi_use === 1 &&
          this.$store.state.shared.sharedWorkspace.no_of_assets > 1) ||
        (this.$store.state.shared.sharedWorkspace.multi_use === 0 &&
          this.$store.state.shared.sharedWorkspace.no_of_assets > 400)
      ) {
        return false
      }
      return true
    },
  },
  created() {
    this.$store.dispatch('shared/fetchSpaceTypes')
  },
  methods: {
    ...mapActions('shared', {
      sendAgreement: 'sendAgreement',
      updateSharedWorkspaceInfo: 'updateSharedWorkspace',
    }),
    async updateSharedWorkspace() {
      this.submitting = true

      await this.sendAgreement(this.$store.state.shared.sharedWorkspace.id)
      const sharedWorkspace = { ...this.$store.state.shared.sharedWorkspace }
      sharedWorkspace.portfolio_public = this.formData.portfolio_public
      sharedWorkspace.space_types = [
        this.$store.state.shared.sharedWorkspace.space_types[0].id,
      ]
      await this.updateSharedWorkspaceInfo(sharedWorkspace)
      this.$refs.alert.showAlert(
        'success',
        'You have successfully accepted the terms and conditions'
      )
      this.$store.dispatch('shared/setActiveTab', 'PAYMENT')
      await this.$store.dispatch('shared/getSharedWorkspace', {
        id: this.$store.state.shared.sharedWorkspace.portfolio_number,
      })
    },
    downloadOwnerAgreement() {},
  },
}
</script>
