<template>
  <div class="my-5 w-full">
    <div class="flex mb-2">
      <div class="block w-1/4 h-2 ml-4">
        <div class="space-y-2">
          <WButtonsBase
            :type="currentTab === 'GeneralInfo' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'GeneralInfo'"
          >
            General Information
          </WButtonsBase>
          <WButtonsBase
            :type="currentTab === 'Story' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'Story'"
          >
            Your WELL Certification Story
          </WButtonsBase>
        </div>
      </div>
      <div class="w-3/4">
        <FormulateForm @submit="updateProfile">
          <div :class="{ hidden: currentTab !== 'Story' }">
            <div class="space-y-2">
              <div class="rounded-lg p-5">
                <WHeadingsHFour
                  heading="Your WELL Certification Story"
                  class="rounded-t-lg shadow-lg -mb-2 py-3 w-full px-3 -mt-5"
                />

                <WCardsBase>
                  <p class="pb-1 text-sm font-semibold text-gray-700">
                    Why did your project decide to pursue WELL? What were your
                    objectives?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="1"
                      v-model="formData.why_well"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    How does WELL align with the mission or values of your
                    organization?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="2"
                      v-model="formData.well_value"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    How did your team approach the WELL Certification process,
                    and work together to achieve your WELL goals?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="3"
                      v-model="formData.approach"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    What are the most innovative or stand-out aspects of your
                    WELL project?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="4"
                      v-model="formData.aspects"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    What challenges did you face as you were incorporating WELL
                    features? How did you solve them?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="5"
                      v-model="formData.challenges"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    What positive impacts resulted from your WELL Certification?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="6"
                      v-model="formData.impacts"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    What post-certification metrics can you share related to
                    outcomes? (If applicable) What did you learn from WELL?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="7"
                      v-model="formData.pc_metrics"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    How has WELL Certification changed or improved your company
                    culture or operations?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      :key="8"
                      v-model="formData.benefit"
                      type="richtext"
                    />
                  </ClientOnly>
                </WCardsBase>
              </div>
            </div>
          </div>
          <div :class="{ hidden: currentTab !== 'GeneralInfo' }">
            <div class="space-y-2">
              <div class="rounded-lg p-5">
                <!-- Set loading to make sure all data is loaded -->
                <div
                  v-if="isLoading"
                  class="w-full h-screen flex justify-center items-center flex-col mb-5"
                >
                  <WLoadingSpinner />
                  <h4 class="text-primary-500 mt-3">Loading Form...</h4>
                </div>
                <!-- Once we know all data has been loaded and set properly then show the form -->
                <div v-else class="animate-fadeIn">
                  <WHeadingsHFour
                    heading="General Information"
                    class="rounded-t-lg shadow-lg -mb-2 py-3 w-full px-3 -mt-5 py-4 w-full px-3 -mt-5"
                  />

                  <WCardsBase>
                    <p class="text-sm font-semibold text-gray-700">
                      Project Bio:
                    </p>
                    <ClientOnly>
                      <FormulateInput
                        v-model="formData.bio"
                        :value="formData.bio"
                        type="richtext"
                      />
                    </ClientOnly>
                    <div class="max-w-lg mx- my-5">
                      <FormulateForm class="space-y-2"> </FormulateForm>
                    </div>

                    <div class="max-w-lg mx- my-5">
                      <FormulateForm class="space-y-2">
                        <div
                          v-if="
                            projectLogo &&
                            projectLogo.length > 0 &&
                            projectLogo[0].url
                          "
                        >
                          <p class="text-sm font-semibold text-gray-700">
                            Logo
                          </p>
                          <div class="flex">
                            <img class="w-32" :src="projectLogo[0].url" />
                            <div class="mb-auto mr-auto ml-2">
                              <WButtonsBase
                                type="dangerInverted"
                                icon="trash"
                                @click.native="
                                  ;(projectLogo = []), forceReMount++
                                "
                              />
                            </div>
                          </div>
                        </div>
                        <FormulateInput
                          v-if="projectLogo && projectLogo.length === 0"
                          :key="10"
                          v-model="projectLogo"
                          :multiple="false"
                          label="Logo"
                          :value="projectLogo"
                          type="fileupload"
                          upload-url="/api/upload/image"
                          upload-type="image"
                          :upload-path="'project-logos/'"
                          mime-types="image/png,image/jpeg,image/jpg"
                        />
                        <FormulateInput
                          id="primary-profile"
                          key="primaryImages"
                          v-model="primaryImages"
                          :multiple="false"
                          :value="primaryImages"
                          upload-type="image"
                          name="primary-profile"
                          label="Attached Primary Profile Image"
                          type="fileupload"
                          upload-url="/api/upload/image"
                          :upload-path="'project-profiles/'"
                          mime-types="image/png,image/jpeg,image/jpg"
                        />
                        <FormulateInput
                          id="profile"
                          key="images"
                          v-model="images"
                          :multiple="true"
                          :value="images"
                          upload-type="image"
                          label="Attached Profile Image(s)"
                          type="fileupload"
                          upload-url="/api/upload/image"
                          :upload-path="'project-profiles/'"
                          mime-types="image/png,image/jpeg,image/jpg"
                          name="profile"
                        />
                      </FormulateForm>
                    </div>

                    <FormulateInput
                      v-if="currentTab === 'GeneralInfo'"
                      v-model="formData.project_consent"
                      name="terms"
                      type="checkbox"
                      label="By submitting Project Information and images to this Public Project Directory, I hereby consent to IWBI using, reproducing, distributing and publicly displaying such Project Information and images on its website and also wish to benefit from other publicity opportunities. Accordingly, I consent that IWBI has right and license to use, reproduce, distribute and publicly display such submitted Project Information and images to create case studies highlighting a Project’s features, reference a Project on the website or to the media, or create other derivative works. Information that may be used for articles, Project profiles, public presentations or similar promotional pieces may include service providers, project team members, promotional or other project photographs, project alternatives for certification, or quotations from team members. If you have any questions about this consent form, please contact marketing@wellcertified.com."
                      validation="accepted"
                      class="px-3 py-5 text-sm font-bold"
                    />
                  </WCardsBase>
                </div>
              </div>
            </div>
          </div>
          <FormulateInput
            v-if="!isLoading && project.type !== 'v2-pilot-upgraded'"
            class="w-1/6 ml-4 mb-4 inline-block"
            type="submit"
            label="Save Profile"
          />
        </FormulateForm>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'sidebar',
  props: {
    project: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      forceReMount: 0,
      currentTab: 'GeneralInfo',
      images: [],
      primaryImages: [],
      projectLogo: null,
      isLoading: true,
      formData: {
        approach: null,
        aspects: null,
        benefit: null,
        bio: null,
        challenges: null,
        images: [],
        logo: [],
        pc_metrics: null,
        project_consent: true,
        well_value: null,
        why_well: null,
      },
    }
  },
  async mounted() {
    this.projectLogo = []
    if (this.project) {
      await this.$store
        .dispatch('project/getProfileInformation', this.project.id)
        .then((res) => {
          if (res.data.profile) {
            this.formData = res.data.profile
            if (res.data.profile.logo) {
              this.projectLogo.push({ url: res.data.profile.logo })
            }
            if (res.data.images.length > 0) {
              res.data.images.forEach((element) => {
                if (element.is_primary === 0)
                  this.images.push({ url: element.link_s3 })
                else this.primaryImages.push({ url: element.link_s3 })
              })
            }
          }

          this.formData.project_consent = true
          this.isLoading = false
          this.forceReMount++
        })
    }
  },

  methods: {
    updateProfile() {
      const data = { ...this.formData }
      data.projectId = this.project.id
      data.images = []
      if (this.images.length > 0) {
        this.images.forEach((element) => {
          data.images.push({
            link_s3: element.url,
            desc: 'profile Image',
            is_primary: 0,
          })
        })
      }
      if (this.primaryImages.length > 0) {
        this.primaryImages.forEach((element) => {
          data.images.push({
            link_s3: element.url,
            desc: 'primary profile Image',
            is_primary: 1,
          })
        })
      }
      if (this.projectLogo.length > 0) {
        data.logo = this.projectLogo[0].url
      } else {
        data.logo = null
      }
      const self = this
      this.$store.dispatch('project/updateProfile', data).then(
        self.$store.dispatch('notifications/toastMessage', {
          message: 'Updated Profile!',
        })
      )
    },
  },
}
</script>
