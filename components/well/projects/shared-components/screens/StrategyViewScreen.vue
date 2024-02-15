<template>
  <div>
    <div v-if="strategy">
      <div class="flex justify-between">
        <WLinksBase
          v-if="currentScreen === 'landing' && $route.params.projectType"
          link="#"
          icon="arrow-narrow-left"
          @click.native="$parent.currentScreen = 'strategies'"
        >
          Back to Alternatives
        </WLinksBase>
        <WLinksBase
          v-else
          link="#"
          icon="arrow-narrow-left"
          @click.native="
            $route.query.redirect
              ? $router.push($route.query.redirect)
              : $router.push(`/alternatives/`)
          "
        >
          Back to Alternatives
        </WLinksBase>
      </div>

      <div
        v-if="currentScreen === 'aap-form'"
        class="shadow-lg border rounded-lg p-5"
      >
        <ProjectAapForm
          v-if="strategy.type_internal !== 'v1'"
          ref="aap-form"
          :strategy="strategy"
        />
        <ProjectV1AapForm v-else ref="aap-form" :strategy="strategy" />
      </div>
      <div
        v-if="currentScreen === 'ep-form'"
        class="shadow-lg border rounded-lg p-5"
      >
        <ProjectEpForm
          v-if="strategy.type_internal !== 'v1'"
          ref="ep-form"
          :strategy="strategy"
        />
        <ProjectV1EpForm v-else ref="ep-form" :strategy="strategy" />
      </div>
      <div v-if="currentScreen === 'landing'">
        <div class="bg-white shadow-lg overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <div class="md:grid md:grid-cols-4 gap-x-4 gap-y-8">
              <div class="md:col-span-3">
                <h3 class="text-2xl font-bold text-primary-700 uppercase my-3">
                  <div
                    :class="
                      type === 'WELL Health-safety'
                        ? 'flex-col md:flex-row'
                        : ''
                    "
                    class="flex"
                  >
                    <div
                      :class="
                        type === 'WELL Health-safety'
                          ? 'md:justify-center'
                          : 'justify-start'
                      "
                      class="flex whitespace-nowrap"
                    >
                      {{ strategy.type + '-0' + strategy.id }}
                    </div>

                    <div
                      :class="
                        type === 'WELL Health-safety'
                          ? 'md:justify-center md:ml-2'
                          : 'justify-start justify-center ml-2'
                      "
                      class="flex text-center w-36 p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold mb-4"
                    >
                      {{ type }}
                    </div>
                  </div>
                </h3>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('well-assessor')
                  "
                  class="md:w-40 w-full inline-block mr-2"
                >
                  <WButtonsBase
                    @click.native="currentScreen = strategy.type + '-form'"
                  >
                    Edit
                  </WButtonsBase>
                </div>
                <div
                  v-if="strategy.status === 'inforequested'"
                  class="md:w-48 md:pt-0 pt-3 w-full mr-2 inline-block"
                >
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="resubmitAlternative()"
                  >
                    Re-Submit for Review
                  </WButtonsBase>
                </div>
              </div>
              <div class="md:col-span-1">
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Status</p>
                <div class="mb-4 font-semibold text-xl">
                  <span
                    v-if="strategy.status === 'pending'"
                    class="text-primary-500"
                    >{{ status }}</span
                  >
                  <span
                    v-else-if="strategy.status === 'approved'"
                    class="text-green-500"
                    >{{ status }}</span
                  >
                  <span
                    v-else-if="strategy.status === 'altered'"
                    class="text-green-500"
                    >{{ status }}</span
                  >
                  <span
                    v-else-if="strategy.status === 'denied'"
                    class="text-danger-500"
                    >Not Approved</span
                  >
                  <span v-else class="text-gray-500">{{ status }}</span>
                </div>
                <div
                  v-if="strategy.status === 'pending'"
                  class="text-xs text-gray-600"
                >
                  Your {{ strategy.type.toUpperCase() }} has been submitted to
                  GBCI for review. A formal ruling on the project's
                  {{ strategy.type.toUpperCase() }} proposal will be provided
                  within <span v-if="strategy.type == 'aap'">10 to 15</span
                  ><span v-else>20 to 25</span> business days.
                </div>
                <div
                  v-if="strategy.status === 'inforequested'"
                  class="text-xs text-gray-600"
                >
                  Please check the Comments section below to provide the
                  information requested. Once completed, you may resubmit the
                  {{ strategy.type.toUpperCase() }} for review.
                </div>
                <div
                  v-if="strategy.status === 'denied'"
                  class="text-xs text-gray-600"
                >
                  Your {{ strategy.type.toUpperCase() }} was not approved by
                  GBCI after review. Please see the response description below
                  for more details.
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl
              class="grid md:grid-cols-4 md:gap-x-4 md:gap-y-8 gap-y-4 sm:grid-cols-4"
            >
              <div v-if="strategy.project_number" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">Project</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <WLinksBase
                    :link="`/projects/${strategy.type_internal}/${strategy.project_number}/dashboard`"
                    target="_blank"
                  >
                    {{ strategy.project_number }} - {{ strategy.project_name }}
                  </WLinksBase>
                </dd>
              </div>
              <div
                v-else-if="
                  strategy.portfolio_number &&
                  strategy.type_internal !== 'v2-hsr'
                "
                class="sm:col-span-3"
              >
                <dt class="text-sm font-medium text-gray-500">Portfolio</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <WLinksBase
                    :link="`/portfolio/${strategy.portfolio_number}/dashboard`"
                    target="_blank"
                  >
                    {{ strategy.portfolio_number }} -
                    {{ strategy.portfolio_name }}
                  </WLinksBase>
                </dd>
              </div>
              <div
                v-else-if="
                  strategy.portfolio_number &&
                  strategy.type_internal === 'v2-hsr'
                "
                class="sm:col-span-3"
              >
                <dt class="text-sm font-medium text-gray-500">
                  Shared Workspace
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <WLinksBase
                    :link="`/shared-workspaces/${strategy.portfolio_number}/dashboard`"
                    target="_blank"
                  >
                    {{ strategy.portfolio_number }} -
                    {{ strategy.portfolio_name }}
                  </WLinksBase>
                </dd>
              </div>
              <div v-else class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500 italic">
                  This alternative is not attached to anything
                </dt>
              </div>
              <div class="sm:col-span-1 select-none">
                <dt class="text-sm font-medium text-gray-500">
                  Applicable Feature/Part(s)
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <div v-if="strategy.parts.length">
                    <div
                      v-for="prt in strategy.parts"
                      :key="prt.id"
                      class="text-primary-900"
                    >
                      {{ prt.part_prefix + ' ' + prt.name }} -
                      {{ prt.feature_name }}
                    </div>
                  </div>
                  <div
                    v-if="strategy.type_internal === 'v1' && strategy.v1feature"
                  >
                    <div>
                      {{ strategy.v1feature.name }}
                    </div>
                    <span
                      v-if="strategy.v1_parts"
                      class="text-center p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold mb-4"
                      style="font-size: 10px"
                    >
                      {{ strategy.v1_parts }}
                    </span>
                  </div>
                </dd>
              </div>
              <div class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Reason for Alternative Means and Methods
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="space-y-4" v-html="strategy.reason"></div>
                </dd>
              </div>
              <div class="sm:col-span-1 select-none">
                <dt class="text-sm font-medium text-gray-500">Submitted by</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ strategy.user.full_name }}
                  <a
                    class="text-primary-600"
                    :href="`mailto:${strategy.user.email}`"
                    >({{ strategy.user.email }})</a
                  >
                </dd>
              </div>
              <div class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Proposed Alternative Means of Compliance
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="space-y-4" v-html="strategy.proposed"></div>
                </dd>
              </div>
              <div class="sm:col-span-1 select-none">
                <dt class="text-sm font-medium text-gray-500">Submitted on</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ $dayjs(strategy.created_at).format('MMM DD, YYYY') }}
                </dd>
              </div>
              <div v-if="strategy.region" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Regions/Countries where Equivalency may be Applicable:
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ strategy.region }}
                </dd>
              </div>
              <div v-if="strategy.verification_method" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Verification method within proposed equivalent
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div
                    class="space-y-4"
                    v-html="strategy.verification_method"
                  ></div>
                </dd>
              </div>
              <div v-if="strategy.similar_feature_req" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Similarities to WELL feature requirement
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div
                    class="space-y-4"
                    v-html="strategy.similar_feature_req"
                  ></div>
                </dd>
              </div>
              <div v-if="strategy.diff_feature_req" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">
                  Differences from WELL feature requirement
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div
                    class="space-y-4"
                    v-html="strategy.diff_feature_req"
                  ></div>
                </dd>
              </div>
              <div v-if="strategy.documents.length" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">Documents</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <ul
                    class="border border-gray-200 rounded-md divide-y divide-gray-200"
                  >
                    <li
                      v-for="(document, index) in strategy.documents"
                      :key="index"
                      class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div class="w-0 flex-1 flex items-center">
                        <svg
                          class="flex-shrink-0 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="ml-2 flex-1 w-0 truncate">
                          <WLinksBase
                            target="_blank"
                            :link="document.link_s3_private"
                            >{{ document.name }}
                          </WLinksBase>
                        </span>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
              <div v-if="strategy.reviewer_notes" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">Admin Notes</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="space-y-4" v-html="strategy.reviewer_notes"></div>
                </dd>
              </div>
              <div v-if="strategy.iwbi_notes" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">IWBI Notes</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="space-y-4" v-html="strategy.iwbi_notes"></div>
                </dd>
              </div>
              <div v-if="strategy.response" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">IWBI Response</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="space-y-4" v-html="strategy.response"></div>
                </dd>
              </div>
              <div v-if="strategy.response_date" class="sm:col-span-3">
                <dt class="text-sm font-medium text-gray-500">Response Date</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ $dayjs(strategy.response_date).format('MMM DD, YYYY') }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-if="strategyComments.length" class="mt-4">
          <WHeadingsHFour heading="Comments" class="m-2 w-full text-gray-500" />
          <ul class="space-y-4">
            <li
              v-for="comment in strategyComments"
              :key="comment.id"
              class="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg"
            >
              <article aria-labelledby="question-title-81614">
                <div>
                  <div class="flex space-x-3">
                    <div class="flex-shrink-0">
                      <img
                        class="h-10 w-10 rounded-full"
                        src="/profile/avatar.jpg"
                        alt=""
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        {{ comment.user_name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ $dayjs(comment.created_at).format('MMM DD, YYYY') }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-2 text-sm text-gray-700 space-y-4">
                  <div class="space-y-4" v-html="comment.comment"></div>
                  <dl
                    v-if="comment.documents.length"
                    class="grid md:grid-cols-4 gap-x-4 gap-y-8"
                  >
                    <div class="sm:col-span-3">
                      <dd class="mt-1 text-sm text-gray-900">
                        <ul
                          class="border border-gray-200 rounded-md divide-y divide-gray-200"
                        >
                          <li
                            v-for="(document, index) in comment.documents"
                            :key="index"
                            class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                          >
                            <div class="w-0 flex-1 flex items-center">
                              <svg
                                class="flex-shrink-0 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              <span class="ml-2 flex-1 w-0 truncate">
                                <WLinksBase
                                  target="_blank"
                                  :link="document.link_s3_private"
                                  >{{ document.name }}
                                </WLinksBase>
                              </span>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          </ul>
        </div>

        <div
          v-if="strategy.status === 'inforequested'"
          class="shadow-md mt-5 p-5 border border-primary-300 rounded-lg text-primary-600"
        >
          <WHeadingsHFour
            heading="Add Comment"
            class="mx-2 w-full text-gray-500"
          />
          <div class="mb-2">
            <FormulateForm name="mrccomment" @submit="addComment()">
              <div>
                <ClientOnly>
                  <FormulateInput
                    :key="forceReMount"
                    v-model="formData.comment"
                    type="richtext"
                    validation="required"
                  />
                  <FormulateInput
                    :key="forceReMount + 1"
                    v-model="formData.documents"
                    label="Documents"
                    :value="[]"
                    type="fileupload"
                    :upload-path="strategy.type === 'ep' ? `Ep/` : `Aap/`"
                    mime-types=""
                  />
                </ClientOnly>
              </div>
              <div class="flex justify-end mt-2">
                <FormulateInput label="Add Comment" type="submit" />
              </div>
            </FormulateForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    strategyData: {
      required: false,
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
      currentScreen: 'landing',
      forceReMount: 0,
      formData: {
        comment: null,
        documents: [],
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      strategy: (state) => state.alternative.strategy,
    }),
    status() {
      if (this.strategy.status === 'pending') {
        return 'Pending decision'
      }
      if (this.strategy.status === 'altered') {
        return 'Approved with Altered Language'
      }
      if (this.strategy.status === 'inforequested') {
        return 'Additional Information Requested'
      }
      if (this.strategy.status === 'approved') {
        return 'Approved'
      }
      if (this.strategy.status === 'denied') {
        return 'Not Approved'
      }
      if (this.strategy.status === 'not-applicable') {
        return 'Not Applicable'
      }
      return ''
    },
    type() {
      if (this.strategy.type_internal === 'v2') {
        return 'WELL v2'
      }
      if (this.strategy.type_internal === 'v2-pilot') {
        return 'WELL v2-Pilot'
      }
      if (this.strategy.type_internal === 'v2-hsr') {
        return 'WELL Health-safety'
      }
      if (this.strategy.type_internal === 'v1') {
        return 'WELL v1'
      }
      if (this.strategy.type_internal === 'community') {
        return 'WELL community'
      }
      if (this.strategy.type_internal === 'wpr') {
        return 'WELL Performance'
      }
      return ''
    },
    strategyComments() {
      if (this.strategy.comments.length) {
        return this.strategy.comments
      }
      return []
    },
  },
  mounted() {
    this.$store.dispatch('alternative/getStrategy', this.$route.params.altId)
  },
  methods: {
    async addComment() {
      const data = { ...this.formData }
      data.documents = data.documents.map(function (file) {
        const fileInfo = { link_s3: file.url }
        return fileInfo
      })
      data.id = this.strategy.id
      await this.$store.dispatch('alternative/addComment', data)
      await this.$store.dispatch('alternative/getStrategy', this.strategy.id)
      this.formData = {
        documents: [],
        comment: null,
      }
      this.$store.dispatch('notifications/toastMessage', {
        message: 'Successfully added your comments!',
      })
      this.$formulate.reset('mrccomment')
      this.forceReMount++
    },
    resubmitAlternative() {
      this.$store.dispatch('alternative/reSubmitStrategy', this.strategy.id)
      this.$store.dispatch('notifications/toastMessage', {
        message: 'Alternative successfully re-submitted for review!',
      })
    },
  },
}
</script>
