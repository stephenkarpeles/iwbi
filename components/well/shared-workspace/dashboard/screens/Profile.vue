<template>
  <div class="mb-5">
    <h1 class="text-4xl mb-2 md:ml-4">Profile</h1>
    <div class="md:flex mb-2">
      <div class="block md:w-1/4 h-2 md:ml-4">
        <div class="space-y-2">
          <WButtonsBase
            :type="currentTab === 'HSR' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'HSR'"
          >
            WELL Health-Safety Story
          </WButtonsBase>
          <WButtonsBase
            :type="currentTab === 'GeneralInfo' ? 'primary' : 'primaryInverted'"
            @click.native="currentTab = 'GeneralInfo'"
          >
            General Information
          </WButtonsBase>
        </div>
      </div>
      <div class="mt-24 md:mt-0 md:w-3/4">
        <div :class="{ hidden: currentTab !== 'HSR' }">
          <FormulateForm class="space-y-2">
            <div class="rounded-lg md:p-5 py-5">
              <WHeadingsHFour
                heading="WELL Health-Safety Story"
                class="border py-3 w-full px-3 -mt-5"
              />

              <WCardsBase>
                <p class="pb-1 text-sm font-semibold text-gray-700">
                  Why did your project decide to pursue WELL Health-Safety? What
                  were your objectives?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="bio"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  How does WELL align with the mission or values of your
                  organization?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="well_value"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  How did your team approach the WELL Health-Safety Rating
                  process, and work together to achieve your WELL goals?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="approach"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  What are the most innovative or stand-out aspects of your WELL
                  Health-Safety project?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="aspects"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  What challenges did you face as you were incorporating WELL
                  Health-Safety features? How did you solve them?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="challenges"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  What positive impacts resulted from your WELL Health-Safety
                  Rating?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="impacts"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <p class="pb-1 mt-4 text-sm font-semibold text-gray-700">
                  How has WELL Health-Safety Rating changed or improved your
                  company culture or operations?
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="benefits"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <div class="text-gray-700">
                  <FormulateInput
                    v-model="contactable"
                    type="checkbox"
                    label="Check here if you’d like IWBI to contact you about additional visibility opportunities."
                    class="px-3 py-5 text-sm font-bold"
                  />
                </div>
              </WCardsBase>
            </div>
          </FormulateForm>
        </div>
        <div :class="{ hidden: currentTab !== 'GeneralInfo' }">
          <FormulateForm class="space-y-2">
            <div class="rounded-lg md:p-5 py-5">
              <WHeadingsHFour
                heading="General Information"
                class="border py-4 w-full px-3 -mt-5"
              />

              <WCardsBase>
                <p class="text-sm font-semibold text-gray-700">
                  Tell us about your organization:
                </p>
                <ClientOnly>
                  <FormulateInput
                    v-model="whyWell"
                    type="richtext"
                    validation="required"
                  />
                </ClientOnly>
                <div class="max-w-lg mx- my-5">
                  <FormulateForm class="space-y-2">
                    <FormulateInput
                      :key="'icon' + forceReMount"
                      v-model="attachedIcon"
                      :multiple="false"
                      label="Organization logo"
                      :value="attachedIcon"
                      type="fileupload"
                      :upload-path="documentData"
                      mime-types="image/png,image/jpeg,image/jpg"
                    />
                    <FormulateInput
                      :key="'img' + forceReMount"
                      v-model="attachedDocuments"
                      label="Profile Image(s)"
                      :value="attachedDocuments"
                      type="fileupload"
                      :upload-path="documentData"
                      mime-types="image/png,image/jpeg,image/jpg"
                    />
                  </FormulateForm>
                </div>
              </WCardsBase>
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>

    <FormulateInput
      class="md:w-1/6 md:ml-4 mb-4 md:inline-block"
      type="submit"
      label="Save Profile"
      @click.native="data.profile === null ? saveData() : updateData()"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  layout: 'sidebar',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'HSR',
      documentData: [],
      attachedDocuments: [],
      attachedIcon: [],
      bio: '',
      whyWell: '',
      well_value: '',
      approach: '',
      aspects: '',
      challenges: '',
      impacts: '',
      pc_metrics: '',
      benefits: '',
      project_consent: 1,
      contactable: 0,
      forceReMount: 0,
    }
  },
  mounted() {
    this.setInformation()
  },
  methods: {
    ...mapActions('shared', ['saveSharedProfile', 'updateSharedProfile']),
    setInformation() {
      this.documentData =
        'portfolio-profiles/' + this.data.portfolio_number + '/'
      if (this.data.profile) {
        this.attachedIcon.push({ url: this.data.profile.icon })
        this.bio = this.data.profile.bio
        this.approach = this.data.profile.approach
        this.aspects = this.data.profile.aspects
        this.benefits = this.data.profile.benefit
        this.challenges = this.data.profile.challenges
        this.impacts = this.data.profile.impacts
        this.pc_metrics = this.data.profile.pc_metrics
        this.well_value = this.data.profile.well_value
        this.whyWell = this.data.profile.why_well
        this.project_consent = this.data.profile.project_consent
        this.data.profile.images.forEach((element) => {
          this.attachedDocuments.push({ url: element.link_s3 })
        })
        this.contactable = this.data.profile.contactable
        this.forceReMount++
      }
    },
    getApiJson() {
      const data = {
        bio: this.bio,
        why_well: this.whyWell,
        well_value: this.well_value,
        approach: this.approach,
        aspects: this.aspects,
        challenges: this.challenges,
        impacts: this.impacts,
        pc_metrics: this.pc_metrics,
        benefit: this.benefits,
        project_consent: this.project_consent,
        contactable: this.contactable,
        images: this.attachedDocuments.map((element) => {
          return { link_s3: element.url, desc: 'profile Image' }
        }),
        icon: this.attachedIcon.length ? this.attachedIcon[0].url : '',
      }
      return data
    },
    async saveData() {
      const data = await this.getApiJson()
      this.saveSharedProfile(data)
      this.$store
        .dispatch('notifications/toastMessage', {
          message: 'Profile updated successfully.',
        })
        .then(
          this.$router.push(
            `/shared-workspaces/${this.$route.params.id}/dashboard`
          )
        )
    },
    async updateData() {
      const data = await this.getApiJson()
      this.updateSharedProfile(data)
      this.$store
        .dispatch('notifications/toastMessage', {
          message: 'Profile updated successfully.',
        })
        .then(
          this.$router.push(
            `/shared-workspaces/${this.$route.params.id}/dashboard`
          )
        )
    },
  },
}
</script>
