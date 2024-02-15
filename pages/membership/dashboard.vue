<template>
  <div>
    <div v-if="!loading">
      <WFeedbackAlert ref="alert" class="z-50" />
      <WSlideoversOverlay
        ref="renewalSlide"
        title="Membership Renewal"
        class="z-50"
      >
        <template #content>
          <div class="px-4">
            <FormulateForm class="" @submit="renewMembership">
              <WHeadingsHFour heading="Membership Details" />
              <FormulateInput
                v-model="formData.name"
                label="Organization Name"
                disabled="true"
                type="text"
                validation="required"
              />
              <FormulateInput
                v-model="formData.membership_id"
                :options="membershipLevels"
                type="select"
                placeholder="Membership Level*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.no_of_years"
                :options="{
                  1: '1 year',
                  2: '2 years',
                  3: '3 years',
                  4: '4 years',
                  5: '5 years',
                }"
                type="radio"
                label="Number of years*"
                validation="required"
              />
              <WHeadingsHFour heading="Point of Contact" />

              <FormulateInput
                v-model="formData.poc_name"
                type="text"
                name="Name"
                label="Name*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.poc_email"
                type="text"
                name="Email Address"
                label="Email Address*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.poc_job_title"
                type="text"
                name="Job Title"
                label="Job Title"
              />

              <FormulateInput
                v-model="formData.poc_phone"
                type="tel"
                name="phone"
                label="Phone Number"
              />

              <FormulateInput
                v-model="formData.poc_public"
                type="checkbox"
                label="I agree to share my point of contact details on the membership profile directory."
              />

              <WHeadingsHFour
                heading="Owner Details"
                sub-heading="The IWBI membership owner is the individual who holds the authority to make decisions related to the organization’s membership."
              />

              <FormulateInput
                v-model="formData.owner_name"
                type="text"
                name="Owner Name"
                label="Owner Name*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_email"
                type="text"
                name="Owner Email Address"
                label="Owner Email Address*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_job_title"
                type="text"
                name="Owner Job Title"
                label="Owner Job Title"
              />

              <FormulateInput
                v-model="formData.owner_phone"
                type="tel"
                name="phone"
                label="Owner Phone Number"
              />

              <WHeadingsHFour
                heading="Office Address"
                sub-heading="Your personal details"
              />
              <FormInputsAddressFormulate
                ref="officeAddress"
                :address="address"
                :target="address"
                :element-id="`renewal-mailing`"
              />

              <!-- This is where Renewal code goes -->
              <div v-if="!isVerified" class="flex items-center pb-2">
                <div class="w-full">
                  <FormulateInput
                    v-model="renewalCode"
                    class="flex-grow"
                    type="text"
                    name="discount_code"
                    label="Renewal code:"
                    help="If you were issued a special code for membership registration, please enter here."
                    @keyup.enter.native="verifyCoupon"
                  />
                </div>
                <div class="w-32 md:-mt-5 ml-3 mb-16 md:mb-0 pt-2 md:pt-0">
                  <WButtonsBase type="primary" @click.native="verifyCoupon">
                    Apply
                  </WButtonsBase>
                </div>
              </div>
              <div v-if="isVerified">
                <span class="text-base mr-5"
                  >Discount code
                  <span class="text-primary-900 font-bold"
                    >({{ renewalCode }})</span
                  >
                  is applied for this exam.</span
                >
                <span
                  class="font-base cursor-pointer font-bold mb-10 text-red-900 rounded"
                  @click="resetCoupon"
                  >Remove Code</span
                >
              </div>

              <label
                class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
              >
                Terms and Conditions
              </label>

              <div
                class="border border-primary-200 h-48 overflow-auto p-3 rounded-md"
              >
                <LegalGenericAgreement />
              </div>
              <FormulateInput
                type="checkbox"
                label="I accept the terms and conditions"
                validation="required"
              />

              <FormulateInput type="submit" label="Proceed to Payment" />
            </FormulateForm>
          </div>
        </template>
      </WSlideoversOverlay>
      <div class="relative">
        <div class="px-4 sm:px-6 md:px-8">
          <NavBreadcrumbs>
            <div class="md:flex">
              <img
                v-if="membership && membership.type === 'Cornerstone'"
                class="h-full md:mr-5 my-auto w-20"
                :src="$config.assetsURL + 'membership/cornerstone-logo.png'"
              />
              <img
                v-else
                class="h-full md:mr-5 my-auto w-24"
                :src="$config.assetsURL + 'membership/member-logo.png'"
              />

              <div>
                <div class="flex">
                  <WHeadingsHTwo :heading="membership.name" />
                </div>
                <div
                  class="uppercase text-primary-500 font-bold text-sm mt-2 md:mt-0"
                >
                  {{ membership.type }} Membership
                </div>
                <div class="flex text-base leading-6 text-gray-500 font-bold">
                  Membership duration:
                  <span class="pl-1 font-normal">
                    {{ $dayjs(membership.opts_at).format('MMM DD, YYYY') }}
                    -
                    {{ $dayjs(membership.ends_at).format('MMM DD, YYYY') }}
                  </span>
                </div>
              </div>
            </div>
            <template #actions>
              <div class="grid md:grid-flow-col auto-cols-auto gap-2">
                <div
                  v-if="
                    canRenew && membership && membership.type !== 'Portfolio'
                  "
                  class="md:w-48"
                >
                  <WButtonsBase
                    icon="refresh"
                    type="primaryInverted"
                    @click.native="$refs.renewalSlide.toggleOpen()"
                  >
                    Renew Membership
                  </WButtonsBase>
                </div>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.id === membership.user_id
                  "
                  class="md:w-48"
                >
                  <WButtonsBase
                    icon="download"
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('membership/downloadAgreement')
                    "
                  >
                    Agreement
                  </WButtonsBase>
                </div>
              </div>
            </template>
          </NavBreadcrumbs>
        </div>
      </div>
      <div class="flex flex-wrap lg:mt-10 px-4 sm:px-6 md:px-8">
        <div :class="{ hidden: currentTab !== 'Team' }" class="w-full">
          <MembershipTeamScreen />
        </div>
        <div :class="{ hidden: currentTab !== 'Profile' }" class="w-full">
          <FormulateForm @submit="validateForm">
            <div
              class="shadow-md rounded-md py-6 px-3 md:p-6 border-primary-100 border"
            >
              <WHeadingsHThree
                heading="Organization"
                sub-heading="Organization details and domain."
              />
              <WHeadingsHFour
                class="mt-5 md:mt-8"
                heading="Organization Name"
              />
              <!-- <FormulateInput
                v-model="formData.name"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                validation="required"
                help="As it should appear publicly in the IWBI member directory and other promotional opportunities."
              /> -->
              <FormulateInput
                v-model="company"
                type="companymultisearch"
                name="organization"
                label="Organization*"
                validation="required"
                :disabled="accessLevel === 'owner' ? false : true"
                help="As it should appear publicly in the IWBI member directory and other promotional opportunities."
                :searchable="true"
                :clearonselect="false"
                :closeonselect="true"
                :optionslimit="10"
              />

              <WHeadingsHFour
                class="mt-5 md:mt-8"
                heading="Organization Logo"
              />
              <FormulateInput
                :key="forceReMount"
                v-model="formData.profile_pic"
                :multiple="false"
                label="Logo"
                :value="formData.profile_pic"
                type="fileupload"
                upload-url="/api/upload/image"
                upload-type="image"
                :upload-path="'membership/'"
                mime-types="image/png,image/jpeg,image/jpg"
              />

              <WHeadingsHFour class="mt-5 md:mt-8" heading="Domain(s)" />
              <FormulateInput
                v-model="formData.domains"
                type="group"
                name="domains"
                :repeatable="accessLevel === 'owner' ? true : false"
                add-label="+ Add Domain"
                remove-label="x"
                minimum="0"
                help="Sharing your organization's email domain(s) allows IWBI to more easily identify your fellow colleagues and in turn give them access to your firm's IWBI membership. (ex: @wellcertified.com)"
              >
                <FormulateInput
                  :disabled="accessLevel === 'owner' ? false : true"
                  type="text"
                  name="domain"
                  label="Domain"
                  placeholder="@"
                />
              </FormulateInput>
            </div>
            <div
              class="shadow-md rounded-md md:p-6 py-6 px-3 mt-5 border-primary-100 border space-y-2 md:space-y-4"
            >
              <FormulateInput
                v-model="formData.website"
                type="text"
                label="Organization website"
                class="w-full mt-4"
              />

              <ClientOnly>
                <div class="flex flex-col space-y-2 md:space-y-4">
                  <FormulateInput
                    :key="forceReMount"
                    v-model="formData.tell_us_about"
                    type="richtext"
                    label="Tell us about your organization and what you do."
                    help="As it should appear publicly in the IWBI member directory."
                  />
                  <FormulateInput
                    v-if="selectedLevel === 3"
                    :key="forceReMount"
                    v-model="formData.why_well"
                    type="richtext"
                    label="Why did your organization decide to participate in WELL Portfolio?"
                  />
                  <FormulateInput
                    :key="forceReMount"
                    v-model="formData.achievements"
                    type="richtext"
                    label="Which of your organization’s health and wellness achievements have been the most impactful, or make you feel pride?"
                    help="As it should appear publicly in the IWBI member directory."
                  />
                  <FormulateInput
                    v-if="selectedLevel === 3"
                    :key="forceReMount"
                    v-model="formData.goals"
                    type="richtext"
                    label="What are your goals for your participation in the WELL Portfolio program? What initiatives are you currently advancing, and what’s your approach to achieving success?"
                  />
                  <FormulateInput
                    :key="forceReMount"
                    v-model="formData.company_mission"
                    type="richtext"
                    label="What is your organization’s mission?"
                  />
                  <FormulateInput
                    v-if="selectedLevel !== 3"
                    :key="forceReMount"
                    v-model="formData.why_well_member"
                    type="richtext"
                    label="Why is your organization an IWBI member? How does your work support efforts to advance buildings and communities globally that help people thrive?"
                    help="As it should appear publicly in the IWBI member directory."
                  />

                  <FormulateInput
                    v-if="selectedLevel !== 3"
                    :key="forceReMount"
                    v-model="formData.wellness_values"
                    type="richtext"
                    label="How does your team live their wellness values?"
                    help="As it should appear publicly in the IWBI member directory."
                  />
                </div>
              </ClientOnly>
            </div>
            <div
              class="shadow-md rounded-md md:p-6 py-6 px-3 mt-5 border-primary-100 border space-y-2 md:space-y-4"
            >
              <WHeadingsHThree
                heading="Point of Contact"
                sub-heading="Your personal details"
              />

              <FormulateInput
                v-model="formData.poc_name"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Name"
                label="Name*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.poc_email"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Email Address"
                label="Email Address*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.poc_job_title"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Job Title"
                label="Job Title"
              />

              <FormulateInput
                v-model="formData.poc_phone"
                :disabled="accessLevel === 'owner' ? false : true"
                type="tel"
                name="phone"
                label="Phone Number"
              />

              <FormulateInput
                v-model="formData.poc_public"
                :disabled="accessLevel === 'owner' ? false : true"
                type="checkbox"
                label="I agree to share my point of contact details on the membership profile directory."
              />
            </div>

            <div
              class="shadow-md rounded-md md:p-6 py-6 px-3 mt-5 border-primary-100 border space-y-2 md:space-y-4"
            >
              <WHeadingsHThree
                heading="Owner Details"
                sub-heading="Your personal details"
              />
              <FormulateInput
                v-model="formData.owner_name"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Owner Name"
                label="Owner Name*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_email"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Owner Email Address"
                label="Owner Email Address*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_job_title"
                :disabled="accessLevel === 'owner' ? false : true"
                type="text"
                name="Owner Job Title"
                label="Owner Job Title"
              />

              <FormulateInput
                v-model="formData.owner_phone"
                :disabled="accessLevel === 'owner' ? false : true"
                type="tel"
                name="phone"
                label="Owner Phone Number"
              />
            </div>

            <div
              class="shadow-md rounded-md md:p-6 py-6 px-3 mt-5 border-primary-100 border"
            >
              <WHeadingsHThree
                heading="Office Address"
                sub-heading="Your personal details"
              />
              <FormInputsAddressFormulate
                ref="officeAddress"
                :address="address"
                :target="address"
                :element-id="`mailing`"
              />
            </div>

            <div
              v-if="currentUser.role.includes('well-admin')"
              class="shadow-md rounded-md md:p-6 py-6 px-3 mt-5 border-primary-100 border"
            >
              <WHeadingsHFour heading="Admin Fields" />
              <FormulateInput
                :key="forceReMount"
                v-model="formData.scope"
                label="Membership scope"
                type="richtext"
              />
            </div>

            <div class="mt-5">
              <FormulateInput type="submit" label="Update" />
            </div>
          </FormulateForm>
        </div>

        <div v-if="currentTab === 'Education'" class="w-full">
          <div class="w-full flex flex-wrap">
            <div class="mb-5 md:mb-0 mt-3 md:mt-0 w-full lg:w-1/3 lg:pr-16">
              <WHeadingsHThree
                heading="Keep Learning"
                sub-heading="Advance your career and keep learning with your curated education resources."
              />
            </div>
            <div class="w-full lg:w-2/3">
              <!-- <div class="mt-3 md:mt-0 w-full lg:w-1/3 lg:pr-16"></div> -->
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16"
              >
                <WCardsBase
                  heading="Become a WELL AP"
                  description="Leverage your discount as an IWBI member to purchase the WELL AP exam and get studying!"
                  thumbnail="https://img2.storyblok.com/312x211/smart/f/52232/4168x2084/78173aafc0/wellap_thumbnails-03.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://www.wellcertified.com/well-ap/"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="On-demand education"
                  description="Browse our video library of webcasts to advance your knowledge and earn education credit toward professional credentials."
                  thumbnail="membership/dashboard/cards/education/webcast-orange.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://resources.wellcertified.com/?type=webcasts&tags=resource%20type%2FGeneral%20CE%5Cresource%20type%2FWELL-specific%20CE&showFilters=true"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="Telling the WELL Story"
                  description="This four-module course will help you prepare a compelling and custom narrative to communicate about WELL with simplicity  ..."
                  thumbnail="membership/dashboard/cards/education/story.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://tellingwellstory.wellcertified.com"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="Ergonomics: Setting yourself up for success"
                  description="This members-only presentation from IWBI’s Angela Spangler, a trained ergonomist, teaches strategies for creating a healthy and product  ..."
                  thumbnail="membership/dashboard/cards/education/webcast-blue.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://us02web.zoom.us/rec/share/6dwnK0RK20IOIKBY97y3sZGopXQVTq3wh1xdGRWQYObzSWStc0_o5zVhQ_4VUcQ.gODNtUijbMOakvkx?startTime=1588194031000"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="Connecting wellness strategies to research"
                  description="This members-only presentation from IWBI’s Senior Vice President of Research, Dr. Whitney Austin Gray, educates viewers on how to  ..."
                  thumbnail="membership/dashboard/cards/education/webcast-orange.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://us02web.zoom.us/rec/share/UNiZe1MqQyKsplkZvTvGiH0WwLA_3zvVv9ZgcwoiiEQ1WtGyq-XLN3EX0lIZfuHu.k1M9I0AAiVLZUEHP?startTime=1588701653000"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="2021 IWBI Member Meeting"
                  description="During our inaugural member meeting, hear from the IWBI team about what’s been happening at IWBI and key updates in the  ..."
                  thumbnail="membership/dashboard/cards/education/annual-meeting.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://us02web.zoom.us/rec/share/ZWcbUzN7N9Ty7cZCwPCz5Z4J7vcs5AbXwgUU3PafSmOK5SAAakI0Tyc5hxopbP8.F5U4w2T-u-PzRJza?startTime=1600272045000"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-wrap border-t mt-10 md:pt-10">
            <div class="mb-5 md:mb-0 mt-3 md:mt-0 w-full lg:w-1/3 lg:pr-16">
              <WHeadingsHThree
                heading="Resources to help you thrive"
                sub-heading="Access a suite of research to stay up to speed on all things WELL."
              />
            </div>
            <div class="w-full lg:w-2/3">
              <!-- <div class="mt-3 md:mt-0 w-full lg:w-1/3 lg:pr-16"></div> -->
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16"
              >
                <WCardsBase
                  heading="WELL Research Digests"
                  description="Dive into the research behind the ten WELL concepts to learn how the places we create today can impact our health tomorrow."
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/3350e9d6c7/etofaowxyaaenuz.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://resources.wellcertified.com/tools/research-digests/"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="WELL for Every Industry"
                  description="Download individual summaries for how WELL can help tackle industry-specific challenges. "
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/4167x2084/4ae6fa6b30/wellforeveryindustry-01.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://resources.wellcertified.com/tools/well-for-every-industry/"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="IWBI Special Report"
                  description="Explore actionable insights and proven strategies for managing buildings and organizations now and into the future."
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1100x550/ef689ab446/specialreport_header.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://resources.wellcertified.com/tools/iwbi-special-report/"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="IWBI Global Research Agenda"
                  description="Access this report to learn about 12 Impact Topics that are deemed important, timely and actionable."
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/0a14c671e2/gra-thumbnail.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://resources.wellcertified.com/tools/iwbi-global-research-agenda/"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="WELL Country Briefs"
                  description="The WELL country briefs connect national health data to strategies for enhancing health and well-being in buildings and communities  ..."
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/e46c1d5a99/well-countrybriefs.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://www.wellcertified.com/certification/v2/country-briefs"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="Crosswalks and Alignments"
                  description="Crosswalks are intended to identify synergies between WELL and other green or sensor-related building standards, and  ..."
                  thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/e03a94d538/crosswalks-socialpost-v2.png"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://standard.wellcertified.com/well-crosswalks"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
                <WCardsBase
                  heading="The Business Case for Health and Well-being"
                  description="The report evaluates health and wellbeing features that were integrated into the facilities, such as: enhanced fresh air ventilation, acoustic privacy, increase of daylight penetration and use of biophilic design elements such as green walls and extensive indoor plants."
                  thumbnail="membership/dashboard/cards/education/health-and-wellbeing.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://www.worldgbc.org/sites/default/files/WorldGBC%20-%20Doing%20Right%20by%20Planet%20and%20People%20-%20April%202018_0.pdf"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="ASID Report: Design in the Workplace"
                  description="ASID completed a full spectrum of pre- and post-occupancy research on its new Washington, D.C. headquarters. The research  ..."
                  thumbnail="membership/dashboard/cards/education/asid-report.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://www.asid.org/news/asid-releases-comprehensive-research-study-on-the-impact-of-design-in-the-workplace"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>

                <WCardsBase
                  heading="A surprising way to cut real estate costs"
                  description="A holistic view of your real estate considers both the hard costs like rent and utilities as well as their residual impact on the people who work  ..."
                  thumbnail="membership/dashboard/cards/education/real-estate.jpg"
                >
                  <div class="mt-4">
                    <WLinksBase
                      link="https://www.us.jll.com/en/trends-and-insights/workplace/a-surprising-way-to-cut-real-estate-costs"
                      target="_blank"
                      icon="arrow-narrow-right"
                      icon-position="right"
                    >
                      Learn More
                    </WLinksBase>
                  </div>
                </WCardsBase>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5 md:mb-0 mt-3 md:mt-0 w-full lg:w-1/3 lg:pr-16">
          <WHeadingsHThree
            v-if="currentTab === 'Promotion'"
            heading="Tool Kit"
            sub-heading="The membership communications tool kit contains social media, PR and marketing resources to help you communicate your membership status to your community. The kit includes the official member mark, social media copy and graphics, and a template press release. We encourage you to access these resources and explore ways to spread the word about your membership at IWBI!"
          />

          <WHeadingsHThree
            v-if="currentTab === 'Billing'"
            :heading="currentTab"
          />
        </div>
        <div class="w-full lg:w-2/3">
          <div
            v-if="currentTab === 'Promotion'"
            class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16"
          >
            <WCardsBase
              :heading="`WELL ${membership.type} member mark`"
              description="Use the member mark in accordance with IWBI's brand guidelines to communicate your membership to the world."
              thumbnail="membership/dashboard/cards/promotion/member-mark.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  :link="
                    membership.type === 'Portfolio'
                      ? `https://cdn.wellcertified.com/resources/membership/Member+Marks-Portfolio.zip`
                      : membership.type === 'Cornerstone'
                      ? `https://cdn.wellcertified.com/resources/membership/Member+Marks+-+Cornerstone.zip`
                      : `https://cdn.wellcertified.com/resources/membership/Member+Marks+-+Keystone.zip`
                  "
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
            <WCardsBase
              heading="IWBI Brand Guidelines"
              description="Consult IWBI's brand guidelines to learn how you can use the official member mark."
              thumbnail="membership/dashboard/cards/promotion/brand-guidelines.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  link="https://resources.wellcertified.com/tools/well-branding-guidelines/"
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
            <WCardsBase
              heading="Press Release Template"
              description="Customize the included membership press release template to announce your membership."
              thumbnail="membership/dashboard/cards/promotion/press-release.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  link="https://cdn.wellcertified.com/resources/membership/Template+Press+Release+for+WELL+Members.docx"
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
            <WCardsBase
              heading="IWBI Member Public Relations Guidelines"
              description="Browse our PR guidelines for information on how to refer to yourself as an official IWBI member."
              thumbnail="membership/dashboard/cards/promotion/pr.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  link="https://cdn.wellcertified.com/resources/membership/PR+Guidelines.pdf"
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
            <WCardsBase
              heading="Social Media Posts"
              description="Post these pre-written statements to your social media accounts, or draft your own."
              thumbnail="membership/dashboard/cards/promotion/social-media-posts.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  link="https://resources.wellcertified.com/tools/membership-social-promotion-kit/"
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
            <WCardsBase
              heading="Social Media Promotional Assets"
              description="Leverage the included graphics for an extra pop on your social posts about IWBI membership."
              thumbnail="membership/dashboard/cards/promotion/social-media-assets.jpg"
            >
              <div class="mt-4">
                <WLinksBase
                  link="https://www.dropbox.com/sh/robq26c2qfm6vxc/AAAIS22IRwC88kSWdJu_bggha?dl=0"
                  target="_blank"
                  icon="download"
                />
              </div>
            </WCardsBase>
          </div>

          <div v-if="currentTab === 'Billing'" class="space-y-2 md:space-y-4">
            <div
              v-for="(subscription, index) in membership.subscriptions"
              :key="index"
            >
              <div v-for="inv in subscription.invoices" :key="inv.id">
                <InvoiceCard :invoice="inv" />
              </div>
            </div>
          </div>
        </div>

        <MembershipBenefitsScreen
          v-if="currentTab === 'Benefits'"
          :benefits="membershipList.benefits"
          :current-user="currentUser"
        />

        <div v-if="currentTab === 'Promotion'">
          <div
            class="max-w-screen-xl mx-auto py-10 md:py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
          >
            <h2 class="text-3xl leading-9 font-extrabold text-gray-900">
              Spread the word
            </h2>

            <div class="mt-3 md:mt-6 border-t border-gray-200 pt-5 md:pt-10">
              <dl
                class="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:col-gap-8 md:row-gap-12 gap-7"
              >
                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    What is WELL?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Learn about what makes WELL the premier standard for
                    buildings and communities around the globe.
                  </dd>
                  <WLinksBase
                    link="https://resources.wellcertified.com/tools/telling-the-well-story-or-what-is-well-/"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    Why WELL?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Learn why and how WELL Certification can result in
                    meaningful return on investment.
                  </dd>
                  <WLinksBase
                    link="https://www.wellcertified.com/ttws"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    How to share membership access
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Download for tips on encouraging others to access and
                    experience the benefits of IWBI membership.
                  </dd>
                  <WLinksBase
                    link="https://cdn.wellcertified.com/resources/membership/Membership_How+to+share+access+with+other+employees.pdf"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    Global Adoption of WELL
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Access now to explore how WELL is accelerating market
                    transformation around in over 58 countries around the world.
                  </dd>
                  <WLinksBase
                    link="https://a.storyblok.com/f/52232/x/cab583e68c/well-global-adoption.pdf"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    Membership One-Pager
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Spread the word about IWBI membership with your community.
                    Download for a snapshot of the membership program at IWBI,
                    including an overview and list of benefits.
                  </dd>
                  <WLinksBase
                    v-if="membership.type === 'Cornerstone'"
                    link="https://resources.wellcertified.com/tools/cornerstone-membership-at-iwbi/"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                  <WLinksBase
                    v-else
                    link="https://resources.wellcertified.com/tools/keystone-membership-at-iwbi/"
                    target="_blank"
                    icon="arrow-narrow-right"
                    icon-position="right"
                  >
                    Learn more
                  </WLinksBase>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading membership...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('notifications/clearBanner')
    next()
  },
  layout: 'sidebar',

  data() {
    return {
      loading: false,
      renewalCode: '',
      isVerified: false,
      showAddMemberForm: false,
      processingRenew: false,
      newMemberData: {
        role: '',
        email: '',
      },
      formErrors: {},
      selectedLevel: null,
      company: null,
      formData: {},
      forceReMount: 0,
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
    }
  },
  head() {
    return {
      title: `Membership Dashboard`,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      membership: (state) => state.membership.membership,
      currentUser: (state) => state.user.currentUser,
      membershipList: (state) => state.membership.membershipList,
    }),
    membershipLevels() {
      const levels = []

      for (let i = 0; i < this.membershipList.memberships.length; i++) {
        const level = {
          value: String(this.membershipList.memberships[i].id),
          label:
            this.membershipList.memberships[i].name +
            ' ($' +
            this.membershipList.memberships[i].fee +
            ')',
        }
        if (this.membershipList.memberships[i].name !== 'Portfolio')
          levels.push(level)
      }

      return levels
    },
    canRenew() {
      const endDate = this.membership.ends_at

      if (endDate === null) {
        return false
      }

      // grab the current date
      const d1 = new Date()
      // grab the end date
      const d2 = new Date(endDate)

      // check the difference in months between the two dates
      let months
      months = (d2.getFullYear() - d1.getFullYear()) * 12
      months -= d1.getMonth()
      months += d2.getMonth()

      // if there's a negative difference lets just make it 0
      if (months <= 0) {
        months = 0
      }

      // computation to see if the membership can be renewed of not
      // less or equal to 6 months remaning in memebership
      if (months <= 6 && this.accessLevel === 'owner') {
        return true
      }

      // default to false
      return false
    },
    accessLevel() {
      if (
        this.currentUser.role.includes('well-admin') ||
        this.membership.user_id === this.currentUser.id
      ) {
        return 'owner'
      } else {
        return this.membership.organization_users.find(
          (user) => user.user_id === this.currentUser.id
        ).role
      }
    },
  },
  async created() {
    this.loading = true
    await this.$store.dispatch('membership/getMembership')
    await this.$store.dispatch('membership/getMembershipList')

    if (this.$route.query.id) {
      if (this.currentUser.role.includes('well-admin')) {
        this.$store.dispatch(
          'notifications/showBanner',
          'Viewing Organization with ID: ' + this.$route.query.id
        )
      }
      await this.$store.dispatch(
        'membership/getMembership',
        this.$route.query.id
      )
    }

    if (this.$store.state.membership.membership.length !== 0) {
      this.formData = {
        scope: null,
        membership_id: null,
        profile_pic: [],
        website: null,
        country_code: null,
        state: null,
        city: null,
        postal_code: null,
        street: null,
        poc_name: null,
        poc_email: null,
        poc_job_title: null,
        poc_phone: null,
        poc_public: null,
        owner_name: null,
        owner_email: null,
        owner_phone: null,
        owner_job_title: null,
        no_of_years: null,
        discount_code: null,
        domains: null,
        name: null,
      }

      const membershipState = this.$store.state.membership.membership

      if (membershipState) {
        this.formData = {
          scope: membershipState.scope,
          id: membershipState.id,
          membership_id: membershipState.subscriptions[0].membership_id,
          profile_pic: [{ url: membershipState.profile_pic }],
          website: membershipState.website,
          country_code: membershipState.addresses[0].country_code,
          state: membershipState.addresses[0].state,
          city: membershipState.addresses[0].city
            ? membershipState.addresses[0].city
            : null,
          postal_code: membershipState.addresses[0].postal_code,
          street: membershipState.addresses[0].street,
          poc_name: membershipState.poc_name,
          poc_email: membershipState.poc_email,
          poc_job_title: membershipState.poc_job_title,
          poc_phone: membershipState.poc_phone,
          poc_public: membershipState.poc_public,
          owner_name: membershipState.owner_name,
          owner_email: membershipState.owner_email,
          owner_phone: membershipState.owner_phone,
          owner_job_title: membershipState.owner_job_title,
          no_of_years: membershipState.no_of_years,
          discount_code: null,
          domains: [],
          name: membershipState.name,
          tell_us_about: membershipState.tell_us_about,
          why_well_member: membershipState.why_well_member,
          achievements: membershipState.achievements,
          company_mission: membershipState.company_mission,
          wellness_values: membershipState.wellness_values,
          why_well: membershipState.why_well,
          goals: membershipState.goals,
        }

        if (this.formData.name && this.formData.name !== '') {
          this.company = {
            ...this.company,
            name: this.formData.name,
          }
        }
        if (this.formData.company_id) {
          this.company = {
            ...this.company,
            id: this.formData.company_id,
          }
        }

        this.address = {
          country_code: this.formData.country_code,
          state: this.formData.state,
          street: this.formData.street,
          city: this.formData.city,
          postal_code: this.formData.postal_code,
        }

        for (let i = 0; i < membershipState.domain.length; i++) {
          this.formData.domains.push({ domain: membershipState.domain[i] })
        }
        this.forceReMount++
        this.selectedLevel =
          this.$store.state.membership.membership.subscriptions[0].membership.id
      }
    } else {
      this.$router.push('/membership/pricing')
    }
    this.loading = false
  },
  mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Promotion')
    }
  },
  methods: {
    async responseToInvite(id, value) {
      await this.$store
        .dispatch('membership/respondToInvite', {
          membershipId: this.membership.id,
          userId: id,
          action: value,
        })
        .then((res) => {
          this.$store.dispatch('membership/getMembership')
        })
    },
    resetCoupon() {
      this.renewalCode = ''
      this.isVerified = false
    },
    verifyCoupon() {
      if (this.renewalCode) {
        this.$axios
          .get(
            'api/coupon/validate/' +
              this.renewalCode +
              '?for=membership&type=' +
              this.membership.name
          )
          .then((response) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Membership code successfully applied!',
            })
            this.isVerified = true
          })
          .catch((response) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Invalid renewal code.',
            })
          })
      } else {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Please enter renewal code',
        })
      }
    },
    copyCode() {
      if (process.browser) {
        navigator.clipboard.writeText(this.membership.code)
        this.$refs.alert.showAlert('success', 'Copied Registration Code!')
      }
    },
    renewMembership() {
      if (this.processingRenew === false) {
        this.processingRenew = true
        this.formData.profile_pic = this.formData.profile_pic[0].url
        this.$store
          .dispatch('membership/renewMembership', this.formData)
          .then((response) => {
            this.$router.push(
              '/invoice/' +
                response.data.invoice_number +
                `?redirect=/membership/dashboard?id=${this.membership.id}`
            )
          })
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
              email: [
                "This user is already a part of another organization's membership.",
              ],
            }
          } else {
            this.$refs.alert.showAlert('success', 'Invite sent!')
            this.newMemberData.role = ''
            this.newMemberData.email = ''
            this.showAddMemberForm = false
          }
        })
    },
    updateMember(userId, newRole) {
      this.$store
        .dispatch('membership/updateMember', { userId, role: newRole })
        .then(this.$refs.alert.showAlert('success', 'Updated Member Role!'))
    },
    async validateForm() {
      const data = { ...this.formData }

      data.profile_pic = data.profile_pic[0].url

      const domains = []

      for (let i = 0; i < data.domains.length; i++) {
        domains.push(data.domains[i].domain)
      }
      if (this.company.name && this.company.id && this.company.name !== '') {
        data.name = this.company.name
        data.company_id = this.company.id
      }
      data.domain = domains
      await this.$store
        .dispatch('membership/update', data)
        .then(
          this.$refs.alert.showAlert('success', 'Profile changes saved!'),
          this.$route.query.id
            ? this.$store.dispatch(
                'membership/getMembership',
                this.$route.query.id
              )
            : this.$store.dispatch('membership/getMembership')
        )

      if (this.$route.query.id) {
        await this.$store.dispatch(
          'membership/getMembership',
          this.$route.query.id
        )
      }
    },
  },
}
</script>
