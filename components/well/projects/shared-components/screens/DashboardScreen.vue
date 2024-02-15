<template>
  <div class="md:p-5">
    <!-- warning -->
    <div
      v-if="isTestNuxt && !project.agreement_status"
      class="bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <WHeadingsHFour
            class="text-yellow-600"
            heading="The WELL Building Standard Certification Agreement has not been
                signed."
          />
          <div class="mt-2 text-sm leading-5 text-yellow-700">
            <p>
              Project documentation features are not available until the
              certification agreement has been signed by the project owner.
            </p>
          </div>
          <WLinksBase
            class="text-warning-500 mt-3"
            icon="arrow-narrow-right"
            icon-position="right"
            type="warning"
            @click.native="$store.dispatch('project/signProject', project.id)"
          >
            Sign Now!
          </WLinksBase>
        </div>
      </div>
    </div>
    <WFeedbackModal
      ref="docSubmissionModal"
      class="z-20 mt-12"
      :can-manually-close="false"
    >
      <div class="md:w-96">
        <div>
          <div
            class="bg-primary-300 text-white text-lg -mx-6 -mt-6 p-6 bg-gradient-to-r from-primary-400 to-primary-900 rounded"
            v-html="estimatedDateTitle"
          ></div>
          <div class="my-5 leading-5 text-sm">
            The estimated date of documentation submission is an approximate
            date for when the project team aims to submit for WELL documentation
            review. This date can be updated at any point from the Edit tab, and
            your project is not held to submitting on this date. This date helps
            our team to better understand where your project is in the WELL
            journey so we can support your team in staying on track!
          </div>
          <div
            class="flex"
            :class="
              (estimatedDate && !estimatedDateAfter) ||
              (estimatedDateToday &&
                allReviews.length === 0 &&
                !estimatedDateAfter)
                ? 'justify-between'
                : 'justify-center'
            "
          ></div>
          <div class="mb-5">
            <FormulateInput
              :key="forceReMount"
              v-model="formData.doc_sub_date_est"
              type="datetimepicker"
              max="9999-01-01"
              :min="today"
              label="Provided estimated date of document submission"
            />
            <WButtonsBase
              data-id="document-update-btn"
              :class="{
                'opacity-50': estimatedDateAfter && newDateDiff,
              }"
              :disabled="estimatedDateAfter && newDateDiff"
              @click.native="updateProject"
              >{{
                $dayjs(project.doc_sub_date_est).format('YYYY-MM-DD') ===
                $dayjs(formData.doc_sub_date_est).format('YYYY-MM-DD')
                  ? 'Confirm'
                  : 'Update'
              }}</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="docSubmissionNoModal" class="z-20 mt-12">
      <div class="md:w-96">
        <div>
          <div
            class="text-base text-primary-900 leading-7 font-bold text-center"
          >
            You're good to go!
          </div>
          <div class="flex mt-4">
            <div class="mx-auto">
              <WButtonsBase
                data-id="continue-journey-btn"
                type="primary"
                @click.native="$refs.docSubmissionNoModal.isHidden = true"
                >Continue the journey</WButtonsBase
              >
            </div>
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <!-- Next Steps -->
    <WFeedbackModal v-if="project" ref="modal">
      <div class="max-w-lg">
        <ProjectPrecertification />
      </div>
    </WFeedbackModal>
    <!-- Certification Enabled Top Section -->
    <div
      v-if="
        (project.cert_status && project.cert_status !== 'na') ||
        (project.hsr_status && project.hsr_achieved_date)
      "
      class=""
    >
      <!-- Certification Congratulations text -->
      <div class="mb-8">
        <h6 class="text-lg font-semibold mt-8 ml-1 text-primary-900">
          {{
            project.cert_status &&
            project.cert_status !== 'na' &&
            project.hsr_status !== null &&
            project.hsr_achieved_date !== null
              ? 'Congratulations on the achievement of WELL Certification and the WELL Health-Safety Rating for your project!'
              : project.cert_status && project.cert_status !== 'na'
              ? 'Congratulations on the achievement of WELL Certification for your project!'
              : 'Congratulations on the earning the WELL Health-Safety seal!'
          }}
        </h6>
        <p
          class="text-base font-normal ml-1 mt-4 mb-6 leading-6 text-primary-900 text-opacity-60"
        >
          {{
            project.cert_status &&
            project.cert_status !== 'na' &&
            project.hsr_status !== null &&
            project.hsr_achieved_date !== null
              ? 'Your project is joining a select group of buildings and spaces that are enhancing human health and well-being through the WELL Building Standard (WELL).'
              : project.cert_status && project.cert_status !== 'na'
              ? 'Your project is joining a select group of buildings and spaces that are enhancing human health and well-being through the WELL Building Standard (WELL).'
              : 'You’ve now joined a community of organizations pushing the boundaries of what health and safety look like in a post-COVID environment. Not only did you put in the work - you third-party verified your investment. it’s time to celebrate and communicate your accomplishments with your broader community and social network.'
          }}
        </p>
      </div>
      <!-- Show Recertification Flow -->
      <div
        v-if="recertification && recertification.type !== 'v2-hsr'"
        class="w-2/3 my-6"
      >
        <WCardsBase
          class="h-full border border-primary-300"
          heading="Annual reporting guidance"
          description="For WELL Certification status to remain in good standing, annual reporting should be submitted within 15 months of initial certification and then every 12 months thereafter. Features where the verification method is 'Ongoing Report' require annual reporting. More details can be found in the Renewal Guide."
        >
          <div class="mt-4 grid grid-cols-1">
            <WButtonsBase
              type="primaryInverted"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/documents`,
                  query: { ...$route.query },
                })
              "
            >
              Upload ongoing data report
            </WButtonsBase>
          </div>
        </WCardsBase>
      </div>
    </div>
    <div class="flex">
      <div
        v-if="
          (project.cert_status && project.cert_status !== 'na') ||
          (project.hsr_status && project.hsr_achieved_date)
        "
        class="cert-header lg:w-9/12 order-last lg:order-none"
      >
        <!-- Show Enrollment Flow if no Well Certification -->
        <div
          v-if="!project.date_certified && !project.cert_status"
          class="p-5 border-primary-300 rounded border-2"
        >
          <div class="w-full">
            <WHeadingsHThree
              class="text-primary-900"
              heading="WELL Certification"
            ></WHeadingsHThree>
            <WHeadingsHThree
              class="text-primary-900"
              heading="Next Steps"
              sub-heading="Every project's approach to WELL is unique - customize yours now. The objective here is to quickly visualize how your project can benefit from applying for WELL."
            />
          </div>
          <div class="w-full">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div v-if="project.type !== 'v1'">
                <WCardsBase
                  v-if="project.reg_payment_status !== 'paid'"
                  class="h-full border border-primary-300"
                  heading="1. Build your scorecard"
                  description="Start with a brief review of WELL features to select which best support your goals."
                >
                  <div class="mt-4 grid-cols-1 sm:grid-cols-2 grid gap-2">
                    <WButtonsBase
                      v-if="project.scorecard_id == null"
                      @click.native="createScorecard()"
                    >
                      Start Building
                    </WButtonsBase>
                    <WButtonsBase
                      v-else
                      @click.native="
                        $router.push({
                          path: `/projects/${project.type}/${project.project_number}/scorecard`,
                          query: { ...$route.query },
                        })
                      "
                    >
                      Access Scorecard
                    </WButtonsBase>
                    <div class="-mt-4 sm:-mt-0">
                      <Flyout y="bottom" x="left" class="h-full">
                        <WButtonsBase type="primaryInverted">
                          Learn More
                        </WButtonsBase>
                        <template #content>
                          <div class="w-96 p-4">
                            <h3 class="text-xl text-primary-700 mb-2">
                              Why customize my scorecard?
                            </h3>
                            <div class="">
                              <div class="leading-tight text-sm text-gray-700">
                                <ul class="list-disc ml-5">
                                  <li>
                                    Tailor the recommendations to your space and
                                    occupant types
                                  </li>
                                  <li>
                                    Curate requirements relevant to my project
                                    details: location, ownership, use types,
                                    etc.
                                  </li>
                                  <li>
                                    Consider the point-value of strategies that
                                    align with your wellness goals
                                  </li>
                                  <li>
                                    Inspire approaches that go beyond normal
                                    scope to enhance your occupant experience
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </template>
                      </Flyout>
                    </div>
                  </div>
                </WCardsBase>
                <WCardsBase
                  v-else
                  class="h-full border border-primary-300"
                  heading="1. Achieve Features"
                  description="Start with a planning kick-off then track achievement status of each requirement."
                >
                  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <WButtonsBase
                      v-if="project.scorecard_id == null"
                      @click.native="createScorecard()"
                    >
                      Start Building
                    </WButtonsBase>
                    <WButtonsBase
                      v-else
                      @click.native="
                        $router.push({
                          path: `/projects/${project.type}/${project.project_number}/scorecard`,
                          query: { ...$route.query },
                        })
                      "
                    >
                      Continue customizing
                    </WButtonsBase>
                    <div class="-mt-4 sm:-mt-0">
                      <Flyout y="bottom" x="left" class="h-full w-full">
                        <WButtonsBase type="primaryInverted">
                          Learn More
                        </WButtonsBase>
                        <template #content>
                          <div class="w-96 p-4">
                            <h3 class="text-xl text-primary-700 mb-2">
                              How do I manage feature implementation?
                            </h3>
                            <div class="">
                              <div class="leading-tight text-sm text-gray-700">
                                <ul class="list-disc ml-5">
                                  <li>
                                    Host kick-off reviews with project team
                                    and/or coaching contact
                                  </li>
                                  <li>
                                    Assign responsible parties to each feature
                                    you wish to pursue
                                  </li>
                                  <li>
                                    Set deadlines for feedback, status updates
                                    and verification documents
                                  </li>
                                  <li>
                                    Facilitate review and adoption of policies
                                    and protocols
                                  </li>
                                  <li>
                                    Educate and train external vendors and
                                    project partners
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </template>
                      </Flyout>
                    </div>
                  </div>
                </WCardsBase>
              </div>
              <WCardsBase
                v-if="project.reg_payment_status !== 'paid'"
                class="h-full border border-primary-300"
                heading="2. Enroll your Project"
                description="Enroll to begin detailed reviews and action planning with the help of IWBI coaching."
              >
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <WButtonsBase
                    data-id="dash-enroll-btn"
                    v-if="project.reg_status !== 1 && project.type === 'v2'"
                    @click.native="
                      $router.push({
                        path: `/projects/${project.type}/${project.project_number}/register`,
                        query: { ...$route.query },
                      })
                    "
                  >
                    Enroll
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="
                      project.reg_status === 1 &&
                      project.reg_payment_status !== 'paid'
                    "
                    @click.native="
                      $router.push({
                        path: `/projects/${project.type}/${project.project_number}/billing`,
                        query: { ...$route.query },
                      })
                    "
                  >
                    Pay Now
                  </WButtonsBase>
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="
                      $router.push({
                        path: `/projects/${project.type}/${project.project_number}/pricing`,
                        query: { ...$route.query },
                      })
                    "
                  >
                    View price estimate
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="project.agreement_status !== 0"
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/downloadAgreement', project.id)
                    "
                  >
                    Download agreement
                  </WButtonsBase>
                  <div class="-mt-4 sm:-mt-0">
                    <Flyout
                      v-if="
                        project.reg_status !== 1 || !project.reg_payment_status
                      "
                      y="bottom"
                      x="left"
                      class="h-full"
                    >
                      <WButtonsBase type="primaryInverted">
                        Learn More
                      </WButtonsBase>
                      <template #content>
                        <div class="w-96 p-4">
                          <h3 class="text-xl text-primary-700 mb-2">
                            Why enroll my project?
                          </h3>
                          <div class="">
                            <div class="leading-tight text-sm text-gray-700">
                              <ul class="list-disc ml-5">
                                <li>
                                  Access dedicated coaching support for
                                  scorecard review and goal setting
                                </li>
                                <li>
                                  Centralize technical support for the entire
                                  project team
                                </li>
                                <li>
                                  Utilize promotional opportunities available to
                                  enrolled projects
                                </li>
                                <li>
                                  Access additional tools and resources
                                  available to help you implement WELL
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </template>
                    </Flyout>
                  </div>
                </div>
              </WCardsBase>
              <WCardsBase
                v-else
                class="h-full border border-primary-300"
                heading="2. Submit Documents"
                description="Collect relevant verification from team members to confirm compliance by GBCI."
              >
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <WButtonsBase
                    v-if="
                      project.reg_payment_status === 'paid' &&
                      !pendingReview &&
                      project.agreement_status !== 0
                    "
                    @click.native="
                      $router.push({
                        path: `/projects/${project.type}/${project.project_number}/reviews`,
                        query: { ...$route.query },
                      })
                    "
                  >
                    Submit for Review
                  </WButtonsBase>
                  <WButtonsBase
                    v-else-if="allReviews.length"
                    @click.native="
                      $router.push({
                        path: `/projects/${project.type}/${project.project_number}/reviews`,
                        query: { ...$route.query },
                      })
                    "
                  >
                    View Review Status
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="
                      (currentUser.role.includes('well-admin') ||
                        currentUser.role.includes('well-assessor') ||
                        currentUser.role.includes('external-reviewer')) &&
                      project.reg_payment_status === 'paid' &&
                      pendingReview
                    "
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/downloadAllDocuments', {
                        hsr: 'no',
                      }),
                        $store.dispatch('notifications/toastMessage', {
                          message:
                            'We will notify you by email once we are ready with your file.',
                        })
                    "
                  >
                    Download All Documents
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="
                      project.reg_status === 1 &&
                      !project.agreement_status &&
                      !project.portfolio_ids.length
                    "
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/sendAgreement', project.id),
                        $parent.$refs.alert.showAlert(
                          'success',
                          'We have sent the certification agreement to the project owner!'
                        )
                    "
                  >
                    Send Agreement
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="project.agreement_status !== 0"
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/downloadAgreement', project.id)
                    "
                  >
                    Download agreement
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="
                      (currentUser.role.includes('well-admin') ||
                        currentUser.role.includes('well-assessor') ||
                        currentUser.role.includes('external-reviewer')) &&
                      project.reg_payment_status === 'paid' &&
                      pendingReview
                    "
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/downloadAllDocuments', {
                        include: 'all',
                      }),
                        $store.dispatch('notifications/toastMessage', {
                          message:
                            'We will notify you by email once we are ready with your file.',
                        })
                    "
                  >
                    Download All Documents
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="
                      project.reg_status === 1 &&
                      !project.agreement_status &&
                      !project.portfolio_ids.length
                    "
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/sendAgreement', project.id),
                        $parent.$refs.alert.showAlert(
                          'success',
                          'We have sent the certification agreement to the project owner!'
                        )
                    "
                  >
                    Send Agreement
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="project.agreement_status !== 0"
                    type="primaryInverted"
                    @click.native="
                      $store.dispatch('project/downloadAgreement', project.id)
                    "
                  >
                    Download agreement
                  </WButtonsBase>
                  <div class="-mt-4 sm:-mt-0">
                    <Flyout
                      v-if="project.reg_payment_status === 'paid'"
                      y="bottom"
                      x="left"
                      class="h-full w-full"
                    >
                      <WButtonsBase type="primaryInverted">
                        Learn More
                      </WButtonsBase>
                      <template #content>
                        <div class="w-96 p-4">
                          <h3 class="text-xl text-primary-700 mb-2">
                            How do I submit documents for review?
                          </h3>
                          <div class="">
                            <div class="leading-tight text-sm text-gray-700">
                              <ul class="list-disc ml-5">
                                <li>
                                  Utilize documentation templates and examples
                                  for customizing
                                </li>
                                <li>
                                  Track upload status when documents are pending
                                  or received
                                </li>
                                <li>
                                  Anticipate ideal onsite testing timeframe and
                                  ensure documentation happens on time
                                </li>
                                <li>
                                  Review for accuracy prior to GBCI review
                                </li>
                                <li>
                                  Provide additional project details for WELL
                                  Reviewer
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </template>
                    </Flyout>
                  </div>
                </div>
              </WCardsBase>
            </div>
          </div>
        </div>
      </div>
      <!-- HSR Seal - Only HSR Enabled -->
      <div
        v-if="
          project.hsr_status &&
          project.hsr_achieved_date &&
          !project.cert_status
        "
        class="hsr-cert lg:w-3/12 p-4 text-center lg:ml-3 rounded-md border border-primary-200 shadow flex flex-col justify-center"
      >
        <img
          :src="$config.assetsURL + 'assessment/hsr-seal-1.png'"
          class="img img-fluid w-32 md:w-40 mx-auto p-4"
        />
        <div>
          <span class="text-sm font-semibold text-primary-900 text-center"
            >Your
            {{
              recertificationList.filter(
                (a) => a.type == 'v2-hsr' && a.date_certified
              ).length
                ? 'renewed'
                : ''
            }}
            WELL Health-Safety rating seal <br />is valid<br />from
            {{ expiresFrom }}
            to
            {{ expiresTo }}</span
          ><br
            v-if="
              recertificationList.filter(
                (a) => a.type == 'v2-hsr' && a.date_certified
              ).length
            "
          />
          <span
            v-if="
              recertificationList.filter(
                (a) => a.type == 'v2-hsr' && a.date_certified
              ).length
            "
            class="text-sm font-semibold text-primary-900 text-center"
            >Past achievements:<br
              v-if="
                recertificationList.filter(
                  (a) => a.type == 'v2-hsr' && a.date_certified
                ).length
              "
            />
            {{ $dayjs(project.hsr_achieved_date).format('MMM DD,YYYY') }}
            to
            {{
              $dayjs(project.hsr_achieved_date)
                .add(1, 'year')
                .format('MMM DD,YYYY')
            }}
          </span>
          <div class="mt-4 mb-2">
            <WButtonsBase
              v-if="renewDate"
              type="primaryInverted"
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr-recertification`
                )
              "
              >Renew now</WButtonsBase
            >
          </div>
        </div>
        <div v-if="recertification" class="mt-4 mb-2">
          <WButtonsBase
            type="primaryInverted"
            @click.native="
              $router.push(
                `/projects/${project.type}/${project.project_number}/hsr-checklist`
              )
            "
          >
            Access your renewal checklist
          </WButtonsBase>
        </div>
      </div>
      <!-- <hr class="my-6 border-primary-200" /> -->
    </div>
    <!-- Certification Enabled Timeline Section -->
    <div
      v-if="
        (project.cert_status &&
          project.cert_status !== 'na' &&
          project.hsr_status &&
          project.hsr_achieved_date) ||
        (project.cert_status && project.cert_status !== 'na')
      "
      class="timeline-cert-group flex flex-col lg:flex-row"
    >
      <CardTimeline
        v-if="project.date_certified"
        class="mt-2"
        :module="project"
      />
      <div
        class="cert-container flex flex-1 flex-col items-center justify-center mt-2 lg:ml-4 rounded-md border border-primary-200 py-6 px-4 shadow"
      >
        <div
          v-if="project.cert_status && project.cert_status !== 'na'"
          class="well-cert md:whitespace-nowrap lg:block text-center"
        >
          <div>
            <strong v-if="project.cert_status === 'Pilot'" class="font-bold"
              >WELL Certified</strong
            >
            <img
              v-if="project.project_type === 'cs'"
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-core-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
            <img
              v-else
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
          </div>
          <span class="text-sm font-semibold text-primary-900 text-center"
            >Your WELL Certification seal is valid<br />from
            {{ $dayjs(project.date_certified).format('MMM DD, YYYY') }}
            to
            {{
              $dayjs(project.date_certified)
                .add(3, 'year')
                .format('MMM DD, YYYY')
            }}</span
          >
          <WButtonsBase
            v-if="
              !recertificationList.find((a) => a.type !== 'v2-hsr') &&
              $dayjs().isAfter(
                $dayjs(project.date_certified).add(24, 'months')
              ) &&
              isTestNuxt
            "
            @click.native="
              $router.push(
                `/projects/${project.type}/${project.project_number}/recertification`
              )
            "
            >Start Recertification</WButtonsBase
          >
          <WButtonsBase
            v-if="
              recertificationList.find(
                (a) => a.type !== 'v2-hsr' && a.version_upgrade
              ) &&
              !project.child &&
              isTestNuxt &&
              currentUser.role.includes('well-admin')
            "
            :disabled="loading"
            @click.native="createRecertification"
          >
            <WLoadingSpinner
              v-if="loading"
              type="button"
              class="mx-auto"
            />Create Recertification</WButtonsBase
          >
        </div>
        <div
          v-if="project.hsr_status && project.hsr_achieved_date"
          class="hsr-cert text-center md:whitespace-nowrap lg:block items-center"
        >
          <!-- <img
            src="https://a.storyblok.com/f/52232/800x800/540bd08b16/well-health-safety_gradient_2020.png"
            class="img img-fluid w-32 md:w-40 mx-auto"
          /> -->
          <img
            :src="$config.assetsURL + 'assessment/hsr-seal-1.png'"
            class="img img-fluid w-32 md:w-40 mx-auto p-5"
          />
          <div>
            <span class="text-sm font-semibold text-primary-900 text-center"
              >Your
              {{
                recertificationList.filter(
                  (a) => a.type == 'v2-hsr' && a.date_certified
                ).length
                  ? 'renewed'
                  : ''
              }}
              WELL Health-Safety rating seal is valid<br />from
              {{ expiresFrom }}
              to
              {{ expiresTo }}</span
            ><br
              v-if="
                recertificationList.filter(
                  (a) => a.type == 'v2-hsr' && a.date_certified
                ).length
              "
            />
            <span
              v-if="
                recertificationList.filter(
                  (a) => a.type == 'v2-hsr' && a.date_certified
                ).length
              "
              class="text-sm font-semibold text-primary-900 text-center"
              >Past achievements:<br
                v-if="
                  recertificationList.filter(
                    (a) => a.type == 'v2-hsr' && a.date_certified
                  ).length
                "
              />
              {{ $dayjs(project.hsr_achieved_date).format('MMM DD,YYYY') }}
              to
              {{
                $dayjs(project.hsr_achieved_date)
                  .add(1, 'year')
                  .format('MMM DD,YYYY')
              }}
            </span>
            <div class="mt-4 mb-2">
              <WButtonsBase
                v-if="renewDate"
                type="primaryInverted"
                @click.native="
                  $router.push(
                    `/projects/${project.type}/${project.project_number}/hsr-recertification`
                  )
                "
                >Renew now</WButtonsBase
              >
            </div>
          </div>
          <div v-if="recertification" class="mt-4 mb-2">
            <WButtonsBase
              type="primaryInverted"
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr-checklist`
                )
              "
            >
              Access your renewal checklist
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!project.cert_status && !project.hsr_status"
      class="flex flex-wrap pt-6"
    >
      <div class="w-full lg:w-4/12 xl:w-1/4 lg:pr-16">
        <WHeadingsHThree
          class="text-primary-900"
          heading="Next Steps"
          sub-heading="Every project's approach to WELL is unique - customize yours now. The objective here is to quickly visualize how your project can benefit from applying for WELL."
        />
      </div>
      <div class="w-full lg:w-8/12 xl:w-3/4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 sm:gap-y-16"
        >
          <div v-if="project.type !== 'v1'">
            <WCardsBase
              v-if="project.reg_payment_status !== 'paid'"
              class="h-full border border-primary-300"
              heading="1. Build your scorecard"
              description="Start with a brief review of WELL features to select which best support your goals."
            >
              <div class="mt-4 flex sm:grid-cols-2 grid gap-2">
                <WButtonsBase
                  v-if="project.scorecard_id == null"
                  @click.native="createScorecard()"
                >
                  Start Building
                </WButtonsBase>
                <WButtonsBase
                  v-else
                  @click.native="
                    $router.push({
                      path: `/projects/${project.type}/${project.project_number}/scorecard`,
                      query: { ...$route.query },
                    })
                  "
                >
                  Access Scorecard
                </WButtonsBase>
                <div class="-mt-4 sm:-mt-0">
                  <Flyout y="bottom" x="left" class="h-full w-full">
                    <WButtonsBase type="primaryInverted">
                      Learn More
                    </WButtonsBase>
                    <template #content>
                      <div class="w-96 p-4">
                        <h3 class="text-xl text-primary-700 mb-2">
                          Why customize my scorecard?
                        </h3>
                        <div class="">
                          <div class="leading-tight text-sm text-gray-700">
                            <ul class="list-disc ml-5">
                              <li>
                                Tailor the recommendations to your space and
                                occupant types
                              </li>
                              <li>
                                Curate requirements relevant to my project
                                details: location, ownership, use types, etc.
                              </li>
                              <li>
                                Consider the point-value of strategies that
                                align with your wellness goals
                              </li>
                              <li>
                                Inspire approaches that go beyond normal scope
                                to enhance your occupant experience
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </template>
                  </Flyout>
                </div>
              </div>
            </WCardsBase>
            <WCardsBase
              v-else
              class="h-full border border-primary-300"
              heading="1. Achieve Features"
              description="Start with a planning kick-off then track achievement status of each requirement."
            >
              <div class="mt-4 grid sm:grid-cols-2 gap-2">
                <WButtonsBase
                  v-if="project.scorecard_id == null"
                  @click.native="createScorecard()"
                >
                  Start Building
                </WButtonsBase>
                <WButtonsBase
                  v-else
                  @click.native="
                    $router.push({
                      path: `/projects/${project.type}/${project.project_number}/scorecard`,
                      query: { ...$route.query },
                    })
                  "
                >
                  Continue customizing
                </WButtonsBase>
                <div class="-mt-4 md:-mt-0">
                  <Flyout y="bottom" x="left" class="h-full w-full">
                    <WButtonsBase type="primaryInverted">
                      Learn More
                    </WButtonsBase>
                    <template #content>
                      <div class="w-96 p-4">
                        <h3 class="text-xl text-primary-700 mb-2">
                          How do I manage feature implementation?
                        </h3>
                        <div class="">
                          <div class="leading-tight text-sm text-gray-700">
                            <ul class="list-disc ml-5">
                              <li>
                                Host kick-off reviews with project team and/or
                                coaching contact
                              </li>
                              <li>
                                Assign responsible parties to each feature you
                                wish to pursue
                              </li>
                              <li>
                                Set deadlines for feedback, status updates and
                                verification documents
                              </li>
                              <li>
                                Facilitate review and adoption of policies and
                                protocols
                              </li>
                              <li>
                                Educate and train external vendors and project
                                partners
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </template>
                  </Flyout>
                </div>
              </div>
            </WCardsBase>
          </div>
          <WCardsBase
            v-if="project.reg_payment_status !== 'paid'"
            class="h-full border border-primary-300"
            heading="2. Enroll your Project"
            description="Enroll to begin detailed reviews and action planning with the help of IWBI coaching."
          >
            <div class="mt-4 grid sm:grid-cols-2 gap-2">
              <WButtonsBase
                v-if="project.reg_status !== 1 && project.type === 'v2'"
                @click.native="
                  $router.push({
                    path: `/projects/${project.type}/${project.project_number}/register`,
                    query: { ...$route.query },
                  })
                "
              >
                Enroll
              </WButtonsBase>
              <WButtonsBase
                v-if="
                  project.reg_status === 1 &&
                  project.reg_payment_status !== 'paid'
                "
                @click.native="
                  $router.push({
                    path: `/projects/${project.type}/${project.project_number}/billing`,
                    query: { ...$route.query },
                  })
                "
              >
                Pay Now
              </WButtonsBase>

              <WButtonsBase
                type="primaryInverted"
                @click.native="
                  $router.push({
                    path: `/projects/${project.type}/${project.project_number}/pricing`,
                    query: { ...$route.query },
                  })
                "
              >
                View price estimate
              </WButtonsBase>
              <WButtonsBase
                v-if="
                  project.reg_status === 1 &&
                  !project.agreement_status &&
                  !project.portfolio_ids.length
                "
                type="primaryInverted"
                @click.native="
                  $store.dispatch('project/sendAgreement', project.id),
                    $parent.$refs.alert.showAlert(
                      'success',
                      'We have sent the certification agreement to the project owner!'
                    )
                "
              >
                Send Agreement
              </WButtonsBase>

              <WButtonsBase
                v-if="project.agreement_status !== 0"
                type="primaryInverted"
                @click.native="
                  $store.dispatch('project/downloadAgreement', project.id)
                "
              >
                Download agreement
              </WButtonsBase>
              <div class="-mt-4 sm:-mt-0">
                <Flyout
                  v-if="project.reg_status !== 1 || !project.reg_payment_status"
                  y="bottom"
                  x="left"
                  class="h-full w-full"
                >
                  <WButtonsBase type="primaryInverted">
                    Learn More
                  </WButtonsBase>
                  <template #content>
                    <div class="w-96 p-4">
                      <h3 class="text-xl text-primary-700 mb-2">
                        Why enroll my project?
                      </h3>
                      <div class="">
                        <div class="leading-tight text-sm text-gray-700">
                          <ul class="list-disc ml-5">
                            <li>
                              Access dedicated coaching support for scorecard
                              review and goal setting
                            </li>
                            <li>
                              Centralize technical support for the entire
                              project team
                            </li>
                            <li>
                              Utilize promotional opportunities available to
                              enrolled projects
                            </li>
                            <li>
                              Access additional tools and resources available to
                              help you implement WELL
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </template>
                </Flyout>
              </div>
            </div>
          </WCardsBase>
          <WCardsBase
            v-else
            class="h-full border border-primary-300"
            heading="2. Submit Documents"
            description="Collect relevant verification from team members to confirm compliance by GBCI."
          >
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <WButtonsBase
                v-if="
                  project.reg_payment_status === 'paid' &&
                  !pendingReview &&
                  project.agreement_status !== 0
                "
                @click.native="
                  $router.push({
                    path: `/projects/${project.type}/${project.project_number}/reviews`,
                    query: { ...$route.query },
                  })
                "
              >
                Submit for Review
              </WButtonsBase>
              <WButtonsBase
                v-else-if="allReviews.length"
                @click.native="
                  $router.push({
                    path: `/projects/${project.type}/${project.project_number}/reviews`,
                    query: { ...$route.query },
                  })
                "
              >
                View Review Status
              </WButtonsBase>
              <WButtonsBase
                v-if="
                  (currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('well-assessor') ||
                    currentUser.role.includes('external-reviewer')) &&
                  project.reg_payment_status === 'paid' &&
                  pendingReview
                "
                type="primaryInverted"
                @click.native="
                  $store.dispatch('project/downloadAllDocuments', {
                    hsr: 'no',
                  }),
                    $store.dispatch('notifications/toastMessage', {
                      message:
                        'We will notify you by email once we are ready with your file.',
                    })
                "
              >
                Download All Documents
              </WButtonsBase>
              <WButtonsBase
                v-if="
                  project.reg_status === 1 &&
                  !project.agreement_status &&
                  !project.portfolio_ids.length
                "
                type="primaryInverted"
                @click.native="
                  $store.dispatch('project/sendAgreement', project.id),
                    $parent.$refs.alert.showAlert(
                      'success',
                      'We have sent the certification agreement to the project owner!'
                    )
                "
              >
                Send Agreement
              </WButtonsBase>
              <WButtonsBase
                v-if="project.agreement_status !== 0"
                type="primaryInverted"
                @click.native="
                  $store.dispatch('project/downloadAgreement', project.id)
                "
              >
                Download agreement
              </WButtonsBase>
              <Flyout
                v-if="project.reg_payment_status === 'paid'"
                y="bottom"
                x="left"
                class="h-full"
              >
                <WButtonsBase type="primaryInverted"> Learn More </WButtonsBase>
                <template #content>
                  <div class="w-96 p-4">
                    <h3 class="text-xl text-primary-700 mb-2">
                      How do I submit documents for review?
                    </h3>
                    <div class="">
                      <div class="leading-tight text-sm text-gray-700">
                        <ul class="list-disc ml-5">
                          <li>
                            Utilize documentation templates and examples for
                            customizing
                          </li>
                          <li>
                            Track upload status when documents are pending or
                            received
                          </li>
                          <li>
                            Anticipate ideal onsite testing timeframe and ensure
                            documentation happens on time
                          </li>
                          <li>Review for accuracy prior to GBCI review</li>
                          <li>
                            Provide additional project details for WELL Reviewer
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </template>
              </Flyout>
            </div>
          </WCardsBase>
        </div>
      </div>
      <div>
        <div
          v-if="project.cert_status && project.cert_status !== 'na'"
          class="bg-white shadow rounded"
        >
          <hr class="my-3 mx-3 border-primary-200" />

          <div class="text-center">
            <strong v-if="project.cert_status === 'Pilot'" class="font-bold"
              >WELL Certified</strong
            >
            <img
              v-if="project.project_type === 'cs'"
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-core-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
            <img
              v-else
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
          </div>
          <span class="text-xs font-semibold text-primary-900 text-center"
            >Your WELL Certification seal is valid<br />from
            {{ $dayjs(project.date_certified).format('MMM DD, YYYY') }}
            to
            {{
              $dayjs(project.date_certified)
                .add(3, 'year')
                .format('MMM DD, YYYY')
            }}</span
          >
        </div>
        <!-- <div
          v-if="
            project.hsr_status !== null && project.hsr_achieved_date !== null
          "
          class="bg-white shadow rounded"
        >
          <hr class="my-3 md:mx-3 border-primary-200" />

          <div class="text-center whitespace-nowrap">
            <strong class="font-bold">WELL Health-Safety Rating</strong>
            <img
              src="https://a.storyblok.com/f/52232/800x800/540bd08b16/well-health-safety_gradient_2020.png"
              class="img img-fluid w-40 mx-auto"
            />
          </div>
          <div
            class="text-center bg-primary-100 font-bold text-primary-600 py-2"
          >
            {{ $dayjs(project.hsr_achieved_date).format('MMM DD, YYYY') }}
          </div>
        </div> -->
      </div>
    </div>

    <hr class="mt-24 mb-6 border-primary-200" />
    <!-- Optional Activities -->
    <WHeadingsHThree
      v-if="project && !project.portfolio_ids.length"
      class="text-primary-900"
      heading="Optional activities for success"
    />
    <div
      v-if="project && !project.portfolio_ids.length"
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3"
    >
      <div
        v-for="(card, index) in optionalActivitiesCards"
        id="card"
        :key="index"
        class="flex flex-col border border-primary-300 rounded-lg relative shadow-md"
      >
        <img
          class="rounded-t-md"
          :src="$config.assetsURL + card.thumbnail"
          alt=""
        />
        <div id="content" class="flex flex-col p-4">
          <span class="uppercase text-sm text-secondary-700">activity</span>
          <span class="text-xl my-1 text-primary-800">{{
            project.hsr_opt && card.button.urlInternal === 'hsr'
              ? 'WELL Health-Safety Rating Journey'
              : card.title
          }}</span>
          <ul
            v-if="project.hsr_opt && card.button.urlInternal === 'hsr'"
            class="list-inside list-disc text-sm mb-12"
          >
            <li class="text-primary-900">
              Take the necessary steps to prioritize the health and safety of
              the people who interact with your space.
            </li>
            <li class="text-primary-900">
              Submit feature-specific documentation reflecting operational
              policies, maintenance protocols and emergency plans.
            </li>
            <li class="text-primary-900">
              Earn the WELL Health-Safety Rating and promote your achievement.
            </li>
          </ul>

          <ul v-else class="list-inside list-disc text-sm mb-6 md:mb-12">
            <li
              v-for="(item, i) in card.info"
              :key="i"
              class="text-primary-900"
            >
              {{ item }}
            </li>
          </ul>
          <div class="md:absolute inset-x-0 bottom-0 md:m-4">
            <WButtonsBase
              v-if="card.button.urlInternal"
              type="primaryInverted"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/${card.button.urlInternal}`,
                  query: { ...$route.query },
                })
              "
            >
              {{
                project.hsr_opt && card.button.urlInternal === 'hsr'
                  ? 'Complete your checklist'
                  : card.button.title
              }}
            </WButtonsBase>
            <a
              v-else-if="card.button.url"
              :href="card.button.url"
              target="_blank"
            >
              <WButtonsBase type="primaryInverted">
                {{ card.button.title }}
              </WButtonsBase>
            </a>
            <WButtonsBase
              v-if="card.button.modal"
              type="primaryInverted"
              @click.native="showModal(card.button.modal)"
            >
              {{ card.button.title }}
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>
    <hr
      v-if="project && !project.portfolio_ids.length"
      class="my-3 md:mx-3 border-primary-200"
    />
    <!-- Supplemental resources -->
    <div class="space-y-6">
      <WHeadingsHThree
        class="text-primary-900"
        heading="Supplemental resources to explore"
      />
      <div class="2xl:grid grid-cols-2 gap-4 space-y-6">
        <div
          v-for="(card, index) in supplementalCards"
          :key="index"
          class="w-full shadow-md lg:flex border border-primary-300 rounded-lg"
        >
          <div
            class="w-full md:h-52 lg:h-auto lg:w-2/6 bg-cover bg-center rounded-l-md hidden md:block"
            :style="{
              backgroundImage: 'url(' + $config.assetsURL + `${card.bgImage})`,
            }"
          ></div>
          <div class="lg:w-4/6 px-4 lg:px-8 py-3">
            <span class="uppercase text-sm text-secondary-700">resource</span>
            <WHeadingsHFour class="text-primary-800" :heading="card.title" />
            <hr />
            <span class="text-base text-primary-800 mt-2 inline-block">{{
              card.description
            }}</span>

            <div class="mt-4 flex flex-row md:space-x-4 flex-wrap">
              <ul class="pl-4 list-disc text-primary-900">
                <li v-for="(link, i) in card.links[0]" :key="i">
                  <WLinksBase :link="link.url" target="_blank">{{
                    link.title
                  }}</WLinksBase>
                </li>
              </ul>
              <ul class="pl-4 list-disc text-primary-900">
                <li v-for="(link, i) in card.links[1]" :key="i">
                  <WLinksBase :link="link.url" target="_blank">{{
                    link.title
                  }}</WLinksBase>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-if="project.parent !== null" class="flex space-x-5">
        <div class="rounded-md bg-primary-200 p-4 w-full flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: solid/information-circle -->
            <svg
              class="h-5 w-5 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm text-primary-700">
              To access your legacy project, please
              <WLinksBase
                class="inline-flex"
                :link="
                  `/projects/${project.parent.type}/${project.parent.project_number}/dashboard?redirect=` +
                  $route.fullPath
                "
              >
                click here</WLinksBase
              >.
            </p>
          </div>
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
      checkInviteAccess: '',
      loading: false,
      formData: {},
      forceReMount: 0,
      // v2-pilot, v2 -> registered
      supplementCards: [
        {
          title: 'Tutorials and Guides',
          bgImage: 'projects/v2/dashboard/ergonomics.png',
          description:
            'If you’ve got questions along the way, we’re here to help. Dive into our robust resources and how-to guides, developed by the WELL coaching team to streamline every step of your WELL journey.',
          links: [
            [
              {
                title: 'Guidebooks',
                url: 'https://well.support/1495db1d-f230-47ea-bda1-5d03bc9507b5',
              },
              {
                title: 'Getting Started Guide',
                url: 'https://well.support/8286e676-575c-4486-8ec2-4c0f017a88b2',
              },
              {
                title: 'Documentation Guide',
                url: 'https://well.support/3ba5ace6-aeec-4fe7-af6d-1e7b144b3cb8',
              },
              {
                title: 'WELL Core Guide',
                url: 'https://well.support/5d924cc2-2826-4654-b319-95578db3ce2d',
              },
              {
                title: 'Tenants Guide',
                url: 'https://well.support/32ad853d-e2fe-477f-8a0c-20518e69f983',
              },
            ],
            [
              {
                title: 'Precertification Guide',
                url: 'https://well.support/4182b6ca-2ac9-42b2-ae94-3a8ded5d98e6',
              },
              {
                title: 'Review Guide',
                url: 'https://well.support/ef1dd73b-5466-4bd4-9903-7d8fd00565d5',
              },
              {
                title: 'Performance Verification Guide',
                url: 'https://well.support/e5454a09-d443-4f69-930f-45ca9725c988',
              },
              {
                title: 'Award Guide',
                url: 'https://well.support/2aa66099-d819-4f16-a807-fd5a298d449a',
              },
              {
                title: 'Renewal Guide',
                url: 'https://well.support/93dc9085-7ec6-446a-afc4-683b7b5258b2',
              },
            ],
          ],
        },
        {
          title: 'Professional Development',
          bgImage: 'projects/v2/dashboard/well-ap-article-img-2.png',
          description:
            'Working on a project seeking WELL Certification can offer great opportunities for professional growth. The WELL AP credential signifies your growing expertise in how our buildings impact our health and well-being and the ways that we can use the best practices outlined in WELL to optimize our environments. You may benefit from joining monthly webcasts, local events or taking on a leadership role as a WELL Faculty using some of the resources below:',
          links: [
            [
              {
                title: 'WELL Education Portal',
                url: 'https://www.wellcertified.com/education',
              },
              {
                title: 'WELL Events Calendar',
                url: 'https://www.wellcertified.com/events',
              },
              {
                title: 'Register for the WELL AP Exam',
                url: 'https://account.wellcertified.com/well-ap/',
              },
            ],
            [
              {
                title: 'Study Plan',
                url: 'https://resources.wellcertified.com/tools/well-ap-study-plan/',
              },
              {
                title: 'WELL Presentation Template',
                url: 'https://www.wellcertified.com/node/4858',
              },
              {
                title: 'IWBI Speaker + Event Request Form',
                url: 'https://www.wellcertified.com/en/iwbi-speaker-event-request',
              },
            ],
          ],
        },
        {
          title: 'Concepts in Action',
          bgImage: 'projects/v2/dashboard/7conceptsgif-sticky.png',
          description:
            'Many WELL Certified projects have shared their experiences with the community, in an effort to better illustrate their approach to certain concepts of the WELL Building Standard. You may be inspired by the unique approaches of the following projects:',
          links: [
            [
              {
                title: 'WELL Story: Fitness at MNP Tower',
                url: 'https://www.wellcertified.com/en/articles/well-story-fitness-mnp-tower',
              },
              {
                title: 'WELL Story: Nourishment at Structure Tone',
                url: 'https://www.wellcertified.com/en/articles/well-story-nourishment-structure-tone',
              },
              {
                title: 'WELL Story: Light at Arup',
                url: 'https://www.wellcertified.com/en/articles/well-story-light-at-arup',
              },
            ],
            [
              {
                title: 'WELL Story: Mind at CBRE Madrid',
                url: 'https://www.wellcertified.com/en/articles/well-story-mind-cbre-madrid',
              },
              {
                title: 'WELL Story: Air at Haworth Shanghai',
                url: 'https://www.wellcertified.com/en/articles/well-story-air-haworth-kerry-center-shanghai-0',
              },
              {
                title:
                  'WELL Story: Comfort at the Allsteel Los Angeles Showroom',
                url: 'https://www.wellcertified.com/en/articles/well-story-comfort-allsteel-los-angeles-showroom',
              },
            ],
          ],
        },
        {
          title: 'Research Summaries',
          bgImage: 'projects/v2/dashboard/research.jpg',
          description:
            'IWBI took an innovative approach to sharing the evidence base for WELL in a digital and interactive way called WELLographies. These living bibliographies offer insight into why certain features are important and how they may impact health and well-being. Below are a few useful summaries you may wish to explore or share with your team:',
          links: [
            [
              {
                title: 'Introducing the WELLographies: The Why Behind WELL',
                url: 'https://www.wellcertified.com/en/articles/introducing-wellographies-why-behind-well',
              },
              {
                title: 'Top 5 Takeaways from the Air WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-air-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Water WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-water-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Nourishment WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-nourishment-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Light WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-light-wellography',
              },
            ],
            [
              {
                title: 'Top 5 Takeaways from the Fitness WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-fitness-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Thermal Comfort WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-thermal-comfort-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Acoustics WELLography',
                url: 'https://www.wellcertified.com/en/articles/top-5-takeaways-acoustics-wellography',
              },
              {
                title: 'Top 5 Takeaways from the Mind WELLography',
                url: 'https://resources.wellcertified.com/articles/top-5-takeaways-from-the-mind-wellography/',
              },
              {
                title: 'Top 5 Takeaways from the Materials WELLography',
                url: 'https://www.wellcertified.com/en/articles/highlights-materials-wellography',
              },
            ],
          ],
        },
      ],
      // v2-pilot, v2 -> not registered
      supplementCardsV2Pilot: [
        {
          title: 'Project Examples',
          description:
            'One of the best ways to inspire your team when setting your certification goals is to see examples of how other organizations have applied WELL at their site. Below are just a few of the over 100 global WELL Certified projects:',
          bgImage: 'projects/v2/dashboard/buildings.jpg',
          links: [
            [
              {
                title: 'WELL Profile: Arup, Boston',
                url: 'https://www.wellcertified.com/en/articles/arup-boston',
              },
              {
                title: 'WELL Profile: Symantec, Mountain View',
                url: 'https://www.wellcertified.com/en/articles/symantec',
              },
              {
                title: 'WELL Profile: Mirvac, Sydney',
                url: 'https://www.wellcertified.com/en/articles/mirvac-headquarters',
              },
              {
                title: 'WELL Profile: Haworth, Shanghai',
                url: 'https://www.wellcertified.com/en/articles/haworth-kerry-center-organic-office-and-showroom',
              },
              {
                title: 'WELL Profile: Cundall, London',
                url: 'https://www.wellcertified.com/en/articles/cundall-office-one-carter-lane',
              },
            ],
            [
              {
                title: 'WELL Profile: Hilson Moran, Manchester',
                url: 'https://www.wellcertified.com/en/articles/hilson-moran-manchester',
              },
              {
                title: 'WELL Profile: JLL, Shanghai',
                url: 'https://www.wellcertified.com/en/articles/jll-shanghai-office-hkri-taikoo-hui',
              },
              {
                title: 'WELL Profile: Oficinas Bioconstruccion, Monterrey',
                url: 'https://www.wellcertified.com/en/articles/oficinas-bioconstruccion',
              },
              {
                title: 'WELL Profile: Sceneo, Paris',
                url: 'https://www.wellcertified.com/en/articles/sceneo-first-well-certification-france',
              },
              {
                title: 'WELL Profile: Citi Tower, Hong Kong',
                url: 'https://www.wellcertified.com/en/articles/citi-tower-one-bay-east-hong-kong',
              },
            ],
          ],
        },
        {
          title: 'Tutorials and Guides',
          bgImage: 'projects/v2/dashboard/ergonomics.png',
          description:
            'If you’ve got questions along the way, we’re here to help. Dive into our robust resources and how-to guides, developed by the WELL coaching team to streamline every step of your WELL journey.',
          links: [
            [
              {
                title: 'Guidebooks',
                url: 'https://well.support/1495db1d-f230-47ea-bda1-5d03bc9507b5',
              },
              {
                title: 'Getting Started Guide',
                url: 'https://well.support/8286e676-575c-4486-8ec2-4c0f017a88b2',
              },
              {
                title: 'Documentation Guide',
                url: 'https://well.support/3ba5ace6-aeec-4fe7-af6d-1e7b144b3cb8',
              },
              {
                title: 'WELL Core Guide',
                url: 'https://well.support/5d924cc2-2826-4654-b319-95578db3ce2d',
              },
              {
                title: 'Tenants Guide',
                url: 'https://well.support/32ad853d-e2fe-477f-8a0c-20518e69f983',
              },
            ],
            [
              {
                title: 'Precertification Guide',
                url: 'https://well.support/4182b6ca-2ac9-42b2-ae94-3a8ded5d98e6',
              },
              {
                title: 'Review Guide',
                url: 'https://well.support/ef1dd73b-5466-4bd4-9903-7d8fd00565d5',
              },
              {
                title: 'Performance Verification Guide',
                url: 'https://well.support/e5454a09-d443-4f69-930f-45ca9725c988',
              },
              {
                title: 'Award Guide',
                url: 'https://well.support/2aa66099-d819-4f16-a807-fd5a298d449a',
              },
              {
                title: 'Renewal Guide',
                url: 'https://well.support/93dc9085-7ec6-446a-afc4-683b7b5258b2',
              },
            ],
          ],
        },
        {
          title: 'Industry Research',
          description:
            'Explore the supporting guidance and case study examples that have been compiled. It can be helpful to see the benefits others have found through their WELL Certification efforts, as well as how they’ve built upon their successes with environmental rating systems.',
          bgImage: 'projects/v2/dashboard/research.jpg',
          links: [
            [
              {
                title:
                  'Doing Right by People and Planet: The Business Case for Health and Wellbeing in Green Buildings 2018, World Green Building Council',
                url: 'http://www.worldgbc.org/sites/default/files/WorldGBC%20-%20Doing%20Right%20by%20Planet%20and%20People%20-%20April%202018_0.pdf',
              },
              {
                title:
                  'Building the Business Case: Health, Wellbeing and Productivity in Green Offices 2016; World Green Building Council',
                url: 'http://www.worldgbc.org/news-media/building-business-case-health-wellbeing-and-productivity-green-offices',
              },
              {
                title:
                  'The Business Case for Healthy Buildings- Insights from Early Adopters, Urban Land Institute',
                url: 'https://americas.uli.org/wp-content/uploads/sites/125/ULI-Documents/Business-Case-for-Healthy-Buildings-FINAL.pdf',
              },
            ],
            [
              {
                title:
                  'Building for Wellness: The Business Case, Urban Land Instiute',
                url: 'https://americas.uli.org/report/building-wellness-report-explores-business-case-healthy-development/',
              },
              {
                title:
                  'Build Well to Live Well: Wellness Lifestyle Real Estate and Communities, Global Wellness Institute',
                url: 'https://www.globalwellnessinstitute.org/wellness-real-estate-communities-research',
              },
            ],
          ],
        },
      ],
      // v2 -> registered
      optionalActivities: [
        {
          title: 'Achieve a WELL Health-Safety Rating',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Learn more about WELL Health Safety Rating: applicable strategies from the WELL Building Standard that support prevention and preparedness, resilience and recovery to address a post-COVID-19 environment now and into the future.',
            'Enroll your project: take the necessary steps to prioritize the health and safety of the people who interact with your space.',
            'Submit feature-specific documentation reflecting operational policies, maintenance protocols and emergency plans.',
            'Earn the WELL Health-Safety Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'hsr',
          },
        },
        {
          title: 'Pursue WELL Precertification',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Identify hurdles to overcome during implementation',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: '',
            modal: 'precertification',
          },
        },
        {
          title: 'Achieve the WELL Performance Rating',
          thumbnail: 'wpr/wprTile.png',
          info: [
            'The WELL Performance Rating focuses on measurable building performance strategies within WELL that are verified through onsite testing and sensor technology.',
            'Opt-in for the Performance Rating to leverage building performance and occupant experience data to shift business performance and organizational culture.',
            'Submit feature-specific documentation and performance data.',
            'Earn the WELL Performance Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'wpr',
          },
        },
      ],
      optionalActivitiesCertifiedAndHSRAchieved: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },
      ],
      optionalActivitiesHSRAchieved: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },

        {
          title: 'Pursue WELL Precertification',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Identify hurdles to overcome during implementation',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: '',
            modal: 'precertification',
          },
        },
        {
          title: 'Achieve the WELL Performance Rating',
          thumbnail: 'wpr/wprTile.png',
          info: [
            'The WELL Performance Rating focuses on measurable building performance strategies within WELL that are verified through onsite testing and sensor technology.',
            'Opt-in for the Performance Rating to leverage building performance and occupant experience data to shift business performance and organizational culture.',
            'Submit feature-specific documentation and performance data.',
            'Earn the WELL Performance Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'wpr',
          },
        },
      ],
      optionalActivitiesCertified: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },
        {
          title: 'Achieve a WELL Health-Safety Rating',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Learn more about WELL Health Safety Rating: applicable strategies from the WELL Building Standard that support prevention and preparedness, resilience and recovery to address a post-COVID-19 environment now and into the future.',
            'Enroll your project: take the necessary steps to prioritize the health and safety of the people who interact with your space.',
            'Submit feature-specific documentation reflecting operational policies, maintenance protocols and emergency plans.',
            'Earn the WELL Health-Safety Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'hsr',
          },
        },
      ],
      // v2 -> not registered
      optionalActivitiesNotReg: [
        {
          title: 'Recruit a Team',
          thumbnail: 'projects/v2/dashboard/team.jpg',
          info: [
            'Capture feedback and track activity history inside project scorecard',
            'Provide visibility and transparency for integrative approach',
            'Orient team to the WELL program',
            'Leverage experts for guidance throughout the process using the people directory',
          ],
          button: {
            title: 'Invite your team',
            urlInternal: 'team',
          },
        },
        {
          title: 'Plan your journey',
          thumbnail: 'projects/v2/dashboard/journey.jpg',
          info: [
            'Understand certification timeline',
            'Estimate dates for key milestones',
            'Communicate important dates to team members',
            'WELL Tip: Planning your project? There’s a timeline tool for that',
            'WELL Performance Testing Organizations',
          ],
          button: {
            title: 'Create timeline now',
            url: 'https://account.wellcertified.com/v2-timeline-estimator',
          },
        },
      ],
      // v2-pilot -> not registered
      optionalActivitiesCertifiedAndHSRAchievedPilot: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },
      ],
      optionalActivitiesHSRAchievedPilot: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },

        {
          title: 'Pursue WELL Precertification',
          thumbnail: 'projects/v2/dashboard/cards/group.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: '',
            modal: 'precertification',
          },
        },

        {
          title: 'Adapt strategies',
          thumbnail: 'projects/v2/dashboard/cards/group-1.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: 'https://www.wellcertified.com/health-safety',
          },
        },
        {
          title: 'Achieve the WELL Performance Rating',
          thumbnail: 'wpr/wprTile.png',
          info: [
            'The WELL Performance Rating focuses on measurable building performance strategies within WELL that are verified through onsite testing and sensor technology.',
            'Opt-in for the Performance Rating to leverage building performance and occupant experience data to shift business performance and organizational culture.',
            'Submit feature-specific documentation and performance data.',
            'Earn the WELL Performance Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'wpr',
          },
        },
        {
          title: 'Strategize messaging',
          thumbnail: 'projects/v2/dashboard/cards/group-3.png',
          info: [
            'Convene project leaders and communications team to explore best ways to share the experience',
            'Reference example materials provided by IWBI or searchable online',
            'Incorporate the goals and strategies the project has chosen to customize the message',
            'Explore the research cited in WELL for relevant facts or figures to use in messaging',
          ],
          button: {
            title: 'Get Started',
            url: 'https://resources.wellcertified.com/articles/introducing-the-welcome-to-well-toolkit/',
          },
        },
      ],
      optionalActivitiesCertifiedPilot: [
        {
          title: ' Communicate your accomplishment',
          thumbnail: 'projects/v2/dashboard/health-safety-aspot2.png',
          info: [
            'Leverage our expertly curated promotional materials, your digital certificate and the official rating mark to share the news with your community and celebrate this momentous achievement.',
          ],
          button: {
            title: 'Explore promotional materials',
            urlInternal: 'promotions',
          },
        },
        {
          title: ' Update your organizational profile',
          thumbnail: 'projects/v2/dashboard/core-and-shell-article-image_0.png',
          info: [
            ' Take a quick look back at the profile you created upon enrollment to ensure it&#8217;s up-to-date. Upload photos to help showcase your efforts to those who may not be able to visit your space in-person',
          ],
          button: {
            title: 'Update your profile',
            urlInternal: 'profile',
          },
        },
        {
          title: 'Achieve a WELL Health-Safety Rating',
          thumbnail: 'projects/v2/dashboard/cards/group-5.png',
          info: [
            'Learn more about WELL Health Safety Rating: applicable strategies from the WELL Building Standard that support prevention and preparedness, resilience and recovery to address a post-COVID-19 environment now and into the future.',
            'Enroll your project: take the necessary steps to prioritize the health and safety of the people who interact with your space.',
            'Submit feature-specific documentation reflecting operational policies, maintenance protocols and emergency plans.',
            'Earn the WELL Health-Safety Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'hsr',
          },
        },
      ],
      optionalActivitiesPilot: [
        {
          title: 'Benchmark Progress',
          thumbnail: 'projects/v2/dashboard/cards/group-5.png',
          info: [
            'Estimate achievement goals by effort level',
            'Facilitate faster planning for project timeline',
            'Identify hurdles to overcome during implementation',
            'Flag meaningful strategies to consider for review',
            'You can opt-out of benchmarking anytime by using this link. Opt-out',
          ],
          button: {
            title: 'Estimate Now',
            urlInternal: 'scorecard',
          },
        },
        {
          title: 'Recruit a Team',
          thumbnail: 'projects/v2/dashboard/cards/group-4.png',
          info: [
            'Capture feedback and track activity history inside project scorecard',
            'Provide visibility and transparency for integrative approach',
            'Orient team to the WELL program',
            'Leverage experts for guidance throughout the process using the people directory',
          ],
          button: {
            title: 'Invite your team',
            urlInternal: 'team',
          },
        },
        {
          title: 'Plan your journey',
          thumbnail: 'projects/v2/dashboard/cards/group-3.png',
          info: [
            'Understand certification timeline',
            'Estimate dates for key milestones',
            'Communicate important dates to team members',
            'WELL Tip: Planning your project? There’s a timeline tool for that',
            'WELL Performance Testing Organizations',
          ],
          button: {
            title: 'Create timeline now',
            url: 'https://account.wellcertified.com/v2-timeline-estimator',
          },
        },
      ],
      // v2-pilot -> registered
      optionalActivitiesReg: [
        {
          title: 'Pursue WELL Precertification',
          thumbnail: 'projects/v2/dashboard/cards/group.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: '',
            modal: 'precertification',
          },
        },
        {
          title: 'Achieve a WELL Health-Safety Rating',
          thumbnail: 'projects/v2/dashboard/cards/group-5.png',
          info: [
            'Learn more about WELL Health Safety Rating: applicable strategies from the WELL Building Standard that support prevention and preparedness, resilience and recovery to address a post-COVID-19 environment now and into the future.',
            'Enroll your project: take the necessary steps to prioritize the health and safety of the people who interact with your space.',
            'Submit feature-specific documentation reflecting operational policies, maintenance protocols and emergency plans.',
            'Earn the WELL Health-Safety Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'hsr',
          },
        },
        {
          title: 'Adapt strategies',
          thumbnail: 'projects/v2/dashboard/cards/group-1.png',
          info: [
            'Pursue an optional Precertification designation for your project plans',
            'Submit preliminary forms of documentation outlining design and operations intent',
            'Promote your Precertification designation to internal and external audiences to earn recognition',
          ],
          button: {
            title: 'Learn More',
            url: 'https://www.wellcertified.com/health-safety',
          },
        },
        {
          title: 'Achieve the WELL Performance Rating',
          thumbnail: 'wpr/wprTile.png',
          info: [
            'The WELL Performance Rating focuses on measurable building performance strategies within WELL that are verified through onsite testing and sensor technology.',
            'Opt-in for the Performance Rating to leverage building performance and occupant experience data to shift business performance and organizational culture.',
            'Submit feature-specific documentation and performance data.',
            'Earn the WELL Performance Rating and promote your achievement.',
          ],
          button: {
            title: 'Enroll Now',
            urlInternal: 'wpr',
          },
        },
        {
          title: 'Strategize messaging',
          thumbnail: 'projects/v2/dashboard/cards/group-3.png',
          info: [
            'Convene project leaders and communications team to explore best ways to share the experience',
            'Reference example materials provided by IWBI or searchable online',
            'Incorporate the goals and alternatives the project has chosen to customize the message',
            'Explore the research cited in WELL for relevant facts or figures to use in messaging',
          ],
          button: {
            title: 'Get Started',
            url: 'https://resources.wellcertified.com/articles/introducing-the-welcome-to-well-toolkit/',
          },
        },
      ],
    }
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    achieveDate() {
      if (this.recertificationList && this.recertificationList.length) {
        const recert = this.recertificationList.filter((a) => a.date_certified)
        if (recert.length) {
          return recert[recert.length - 1].date_certified
        } else {
          return this.project.hsr_achieved_date
        }
      } else {
        return this.project.hsr_achieved_date
      }
    },
    expiresFrom() {
      return this.$dayjs(this.achieveDate).format('MMM DD, YYYY')
    },
    expiresTo() {
      return this.$dayjs(this.achieveDate).add(1, 'year').format('MMM DD, YYYY')
    },
    newDateDiff() {
      const newDate = this.formData.doc_sub_date_est
      const docEstDate = this.$dayjs(newDate)
      const nowDate = this.$dayjs()
      return this.$dayjs(docEstDate).diff(nowDate, 'days') < 0
    },
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    estimatedDate() {
      if (!this.project.doc_sub_date_est) return true
      if (
        this.project.doc_sub_date_est &&
        !this.project.doc_sub_date_est_confirm
      ) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

        const nowDate = this.$dayjs().format('YYYY-MM-DD')
        return (
          docEstDate.diff(nowDate, 'months', true) <= 2 &&
          docEstDate.diff(nowDate, 'months', true) >= 0 &&
          docEstDate.diff(nowDate, 'days') >= 1
        )
      } else if (
        this.project.doc_sub_date_est &&
        this.project.doc_sub_date_est_confirm
      ) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

        const confirmEstimateDate = this.$dayjs(
          this.project.doc_sub_date_est_confirm
        )

        const nowDate = this.$dayjs().format('YYYY-MM-DD')
        return (
          docEstDate.diff(nowDate, 'months', true) <= 2 &&
          docEstDate.diff(nowDate, 'months', true) >= 0 &&
          docEstDate.diff(nowDate, 'days') > 0 &&
          docEstDate.diff(confirmEstimateDate, 'months', true) > 2
        )
      } else {
        return false
      }
    },
    today() {
      return this.$dayjs().format('YYYY-MM-DD')
    },
    estimatedDateToday() {
      const nowDate = this.$dayjs()
      const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

      if (this.project.doc_sub_date_est_confirm) {
        const confirmEstimateDate = this.$dayjs(
          this.project.doc_sub_date_est_confirm
        )
        return (
          nowDate.diff(docEstDate, 'days') === 0 &&
          nowDate.diff(confirmEstimateDate, 'hour') >= 24
        )
      } else {
        return (
          nowDate.diff(docEstDate, 'days') === 0 &&
          nowDate.diff(docEstDate, 'hour') >= 0
        )
      }
    },
    estimatedDateAfter() {
      if (this.project.doc_sub_date_est) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)
        const nowDate = this.$dayjs()
        return nowDate.diff(docEstDate, 'days') >= 1
      } else {
        return false
      }
    },
    estimatedDateTitle() {
      if (!this.project.doc_sub_date_est) {
        return 'Your estimated WELL documentation submittal date is missing. Please take a moment to update this!'
      }
      if (this.estimatedDateAfter) {
        return 'Your estimated WELL documentation submittal date is outdated. Please take a moment to update this!'
      } else if (this.estimatedDateToday) {
        return 'You indicated that your team is aiming to submit for WELL documentation review today. Is this up to date?'
      } else {
        return `You indicated that your team is aiming to submit for WELL documentation review on ${
          this.project.doc_sub_date_est &&
          this.$dayjs(this.project.doc_sub_date_est) !== null
            ? `${this.$dayjs(this.project.doc_sub_date_est).format(
                'MMM DD'
              )}, <span class="font-bold">${this.$dayjs(
                this.project.doc_sub_date_est
              ).format('YYYY')}</span>`
            : `${this.$dayjs().format(
                'MMM DD'
              )}, <span class="font-bold">${this.$dayjs().format(
                'YYYY'
              )}</span>`
        } <span class="font-bold">. Is this up to date?</span>`
      }
    },
    supplementalCards() {
      if (
        this.project.reg_status === 1 &&
        this.project.reg_payment_status === 'paid'
      ) {
        return this.supplementCards
      }
      return this.supplementCardsV2Pilot
    },
    optionalActivitiesCards() {
      if (this.project.type === 'v2') {
        if (
          this.project.reg_status === 1 &&
          this.project.reg_payment_status === 'paid'
        ) {
          if (!this.project.cert_status && !this.project.hsr_achieved_date) {
            return this.optionalActivities
          } else if (
            this.project.cert_status &&
            this.project.hsr_achieved_date
          ) {
            return this.optionalActivitiesCertifiedAndHSRAchieved
          } else if (this.project.cert_status) {
            return this.optionalActivitiesCertified
          } else {
            return this.optionalActivitiesHSRAchieved
          }
        } else {
          return this.optionalActivitiesNotReg
        }
      } else if (this.project.type === 'v2-pilot') {
        if (
          this.project.reg_status === 1 &&
          this.project.reg_payment_status === 'paid'
        ) {
          if (!this.project.cert_status && !this.project.hsr_achieved_date) {
            return this.optionalActivitiesReg
          } else if (
            this.project.cert_status &&
            this.project.hsr_achieved_date
          ) {
            return this.optionalActivitiesCertifiedAndHSRAchievedPilot
          } else if (this.project.cert_status) {
            return this.optionalActivitiesCertifiedPilot
          } else {
            return this.optionalActivitiesHSRAchievedPilot
          }
        } else {
          return this.optionalActivitiesPilot
        }
      }

      return null
    },
    isProjectImported() {
      if (
        this.project.type === 'v2-pilot-upgraded' ||
        this.project.type === 'v1-upgraded'
      ) {
        return true
      } else {
        return false
      }
    },
    pendingReview() {
      if (this.allReviews) {
        if (
          this.allReviews.filter(
            (review) =>
              review.status === 'pending' || review.payment_status !== 'paid'
          ).length > 0
        ) {
          return true
        }
      }

      return false
    },
    isTestNuxt() {
      if (
        window.location.href.search('test-nuxt') === -1 &&
        window.location.href.search('localhost') === -1
      ) {
        return false
      }
      return true
    },
    accessLevel() {
      if (this.project) {
        return this.project.members.find(
          (member) => member.id === this.currentUser.id
        )
          ? this.project.members.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : ''
      }
      return false
    },
    renewDate() {
      if (
        this.accessLevel !== 'project-admin' &&
        this.accessLevel !== 'project-manager' &&
        !this.currentUser.role.includes('well-admin')
      ) {
        return false
      }
      if (!this.project.hsr_achieved_date) return false

      const lastRecertification = this.recertificationList.length
        ? this.recertificationList[this.recertificationList.length - 1]
        : ''
      let recertExpirationDate = ''

      if (lastRecertification) {
        if (!lastRecertification.date_certified) return false

        if (lastRecertification.date_certified)
          recertExpirationDate = this.$dayjs(lastRecertification.date_certified)
        else recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      } else {
        recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      }

      const today = this.$dayjs()
      return today.diff(recertExpirationDate, 'months', true) >= 3
    },
  },
  async mounted() {
    this.formData = {}
    if (this.project && this.project.id) {
      await this.$store.dispatch('review/getReviewList', this.project.id)
    }
    if (this.currentUser) {
      const filtered = this.project.members.filter(
        (a) => a.email === this.currentUser.email
      )
      this.checkInviteAccess = filtered.length ? filtered[0].pivot.role : ''
    }
    if (this.accessLevel === 'project-admin') {
      this.estimateDocumentationSubmission()
    }
  },
  methods: {
    showModal(modal) {
      this.modal = modal
      this.$refs.modal.isHidden = false
    },
    createRecertification() {
      this.$store
        .dispatch('project/recertProject', this.project.id)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project upgraded successfully!',
          })
          this.$store.dispatch('notifications/clearBanner')

          this.loading = false

          window.location.href =
            '/projects/v2/' + response.data.project_number + '/dashboard'
        })
        .catch((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'There was a problem in upgrading this project.',
          })
          this.loading = false
        })
    },
    linkDistribution(links) {
      return links.splice(links.length / 2)
    },
    projectBenchMark(value) {
      const data = {
        name: this.project.name,
        area: this.project.area,
        benchmark_opt: value,
        project_type: this.project.project_type,
        country_id: this.project.country_id,
      }
      const payload = {
        data,
        Id: this.project.id,
      }
      this.$store.dispatch('project/getProjectBenchMark', payload)
    },
    async createScorecard() {
      const data = {
        create_recommended: false,
        name: this.project.name + '-scorecard',
        project_id: this.project.id,
        project_type: 'cs',
        type: this.project.type,
      }
      await this.$store.dispatch('scorecard/createScorecard', data)
      await this.$store.dispatch(
        'project/getProjectByNumber',
        this.$route.params.projectId
      )

      await this.$router.push({
        path: `/projects/${this.project.type}/${this.project.project_number}/scorecard`,
        query: { ...this.$route.query },
      })
    },
    async accessLegacyProject() {
      if (this.project.parent.v1_project !== 1) {
        await this.$router.push({
          path: `/projects/v2-pilot/${this.project.parent.project_number}/dashboard`,
          query: { ...this.$route.query },
        })
      } else {
        await this.$router.push({
          path: `/projects/v1/${this.project.parent.project_number}/dashboard`,
          query: { ...this.$route.query },
        })
      }
    },
    estimateDocumentationSubmission() {
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(this.project))
      this.forceReMount++
      if (this.project.cert_status) {
        return false
      }
      if (
        this.allReviews.filter((a) =>
          a.phase.toLowerCase().includes('documentation')
        ).length
      ) {
        return false
      }

      if (
        this.estimatedDate ||
        this.estimatedDateAfter ||
        this.estimatedDateToday
      ) {
        setTimeout(() => {
          this.$refs.docSubmissionModal.isHidden = false
        }, 1500)
      }
    },
    async updateProject() {
      const payload = {
        doc_sub_date_est: this.formData.doc_sub_date_est,
      }

      try {
        await this.$axios.post(
          `api/project/${this.formData.id}/docSubDateEstUpdate`,
          payload
        )
        await this.$store.dispatch(
          'project/getProjectByNumber',
          this.$route.params.projectId
        )
        this.$store.dispatch('notifications/toastMessage', {
          message:
            'We have updated your Estimate Date. You can also change it from edit section under Project Information.',
        })
        this.$refs.docSubmissionNoModal.isHidden = false
        this.$refs.docSubmissionModal.isHidden = true
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
    },
  },
}
</script>

<style scoped>
li::marker {
  color: #bd907a;
}
</style>
