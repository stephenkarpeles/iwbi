<template>
  <div class="mb-5">
    <h1 class="text-4xl mb-2 md:ml-4">Profile</h1>
    <div class="md:flex mb-2">
      <div class="block md:w-1/4 h-2 md:ml-4">
        <div class="space-y-2">
          <WButtonsBase
            data-id="general-btn"
            :type="currentTab === 'GeneralInfo' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'GeneralInfo'"
          >
            General Information
          </WButtonsBase>
          <WButtonsBase
            data-id="story-btn"
            :type="currentTab === 'Story' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'Story'"
          >
            Your WELL Certification Story
          </WButtonsBase>
        </div>
      </div>
      <div class="mt-24 md:mt-0 md:w-3/4">
        <FormulateForm @submit="updateProfile">
          <div :class="{ hidden: currentTab !== 'Story' }">
            <div class="space-y-2">
              <div class="rounded-lg md:p-5 py-5">
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
                      data-id="why-input"
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
                      data-id="mission-input"
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
                      data-id="goals-input"
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
                      data-id="innovation-input"
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
                      data-id="challenges-input"
                      v-model="formData.challenges"
                      type="richtext"
                    />
                  </ClientOnly>
                  <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                    What positive impacts resulted from your WELL Certification?
                  </p>
                  <ClientOnly>
                    <FormulateInput
                      data-id="impacts-input"
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
                      data-id="metrics-input"
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
                      data-id="benefit-input"
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
              <div class="rounded-lg md:p-5 py-5">
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
                      data-id="bio-input"
                      v-model="formData.bio"
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
                        data-id="logo-upload"
                        v-if="projectLogo && projectLogo.length === 0"
                        :key="forceReMount + 1"
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
                        data-id="primary-profile-upload"
                        :key="forceReMount"
                        v-model="primaryImages"
                        :multiple="false"
                        :value="primaryImages"
                        upload-type="image"
                        label="Attached Primary Profile Image"
                        type="fileupload"
                        upload-url="/api/upload/image"
                        :upload-path="'project-profiles/'"
                        mime-types="image/png,image/jpeg,image/jpg"
                      />
                      <FormulateInput
                        data-id="profile-upload"
                        :key="forceReMount"
                        v-model="images"
                        :multiple="true"
                        :value="images"
                        upload-type="image"
                        label="Attached Profile Image(s)"
                        type="fileupload"
                        upload-url="/api/upload/image"
                        :upload-path="'project-profiles/'"
                        mime-types="image/png,image/jpeg,image/jpg"
                      />
                    </FormulateForm>
                  </div>

                  <FormulateInput
                    v-if="currentTab === 'GeneralInfo'"
                    v-model="formData.project_consent"
                    name="terms"
                    type="checkbox"
                    label="By submitting Project Information and images to this Public Project Directory, I hereby consent to IWBI using, reproducing, distributing and publicly displaying such Project Information and images on its website and also wish to benefit from other publicity opportunities. Accordingly, I consent that IWBI has right and license to use, reproduce, distribute and publicly display such submitted Project Information and images to create case studies highlighting a Project’s features, reference a Project on the website or to the media, or create other derivative works. Information that may be used for articles, Project profiles, public presentations or similar promotional pieces may include service providers, project team members, promotional or other project photographs, project strategies for certification, or quotations from team members. If you have any questions about this consent form, please contact marketing@wellcertified.com."
                    validation="accepted"
                    class="px-3 py-5 text-sm font-bold"
                  />
                </WCardsBase>
              </div>
            </div>
          </div>
          <FormulateInput
            data-id="save-btn"
            v-if="project.type !== 'v2-pilot-upgraded'"
            class="md:w-1/6 md:ml-4 mb-4 md:inline-block"
            type="submit"
            label="Save Profile"
          />
        </FormulateForm>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      forceReMount: 0,
      currentTab: 'GeneralInfo',
      images: [],
      primaryImages: [],
      projectLogo: null,
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
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      projectImages: (state) => state.project.project.images,
    }),
  },
  mounted() {
    this.projectLogo = []
    if (this.project.profile) {
      if (this.project.type !== 'v2-hsr')
        this.formData = { ...this.project.profile }
      else {
        this.$store
          .dispatch('project/getProfileInformation', this.project.id)
          .then((res) => {
            this.formData = res.data
          })
      }
      if (this.project.profile.logo) {
        this.projectLogo.push({ url: this.project.profile.logo })
      }
      this.projectImages.forEach((element) => {
        if (!element.is_primary) this.images.push({ url: element.link_s3 })
        else this.primaryImages.push({ url: element.link_s3 })
      })
    }
    this.formData.project_consent = true
    this.forceReMount++
    this.forceReMount++
    this.forceReMount++
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
