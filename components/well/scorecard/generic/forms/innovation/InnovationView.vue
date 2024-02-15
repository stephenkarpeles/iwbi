<template>
  <div v-if="innovationData" class="overflow-y-scroll" style="max-height: 70vh">
    <div class="flex justify-between px-4 py-5 sm:px-6">
      <div class="">
        <div class="flex space-x-2 items-center">
          <span class="text-2xl font-bold text-primary-700 uppercase"
            >I0{{ innovationData.id }}</span
          >
          <span
            class="text-center w-32 p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold"
          >
            {{ innovationData.iproposable_details.type }}
          </span>
        </div>
        <WButtonsBase class="mt-2 hidden">Edit</WButtonsBase>
      </div>
      <div class="w-1/4">
        <p class="text-sm text-gray-500">Status</p>

        <div class="mb-4 font-semibold text-xl">
          <span class="text-primary-500 uppercase">{{
            innovationData.status
          }}</span>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl class="grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-4">
        <div class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">Project</dt>
          <dd class="mt-1">
            <WLinksBase
              :link="projectLink ? projectLink : null"
              target="_blank"
            >
              {{
                innovationData.iproposable_details.type === 'WELL v2 HSR'
                  ? innovationData.iproposable_details.portfolio_number
                  : innovationData.iproposable_details.project_number
              }}
              - {{ innovationData.iproposable_details.name }}</WLinksBase
            >
          </dd>
        </div>
        <div class="sm:col-span-1 select-none">
          <dt class="text-sm font-medium text-gray-500">Part Name</dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div class="text-primary-900">
              {{ innovationData.part_name }}
            </div>
          </dd>
        </div>

        <div v-if="innovationData.description" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">Description</dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div class="space-y-4" v-html="innovationData.description"></div>
          </dd>
        </div>
        <div class="sm:col-span-1 select-none">
          <dt class="text-sm font-medium text-gray-500">Submitted by</dt>
          <dd class="mt-1 text-sm text-primary-900">
            {{ innovationData.user_name }}
            <a
              class="text-primary-600"
              :href="`mailto:${innovationData.user_email}`"
              >({{ innovationData.user_email }})</a
            >
          </dd>
        </div>
        <div v-if="innovationData.additional_info" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            Additional Information
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div
              class="space-y-4"
              v-html="innovationData.additional_info"
            ></div>
          </dd>
        </div>

        <div class="sm:col-span-1 select-none">
          <dt class="text-sm font-medium text-gray-500">Submitted on</dt>
          <dd class="mt-1 text-sm text-primary-900">
            {{ $dayjs(innovationData.created_at).format('MMM DD, YYYY') }}
          </dd>
        </div>

        <div v-if="innovationData.implementation_plan" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">Implementation Plan</dt>
          <dd
            class="mt-1 text-sm text-primary-900"
            v-html="innovationData.implementation_plan"
          ></dd>
        </div>

        <div v-if="innovationData.research_desc" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            Research Description
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div class="space-y-4" v-html="innovationData.research_desc"></div>
          </dd>
        </div>

        <div v-if="innovationData.why_not_covered" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            Explain how the proposal supports occupant health and well-being in
            a novel way that is not already covered in WELL v2.
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div
              class="space-y-4"
              v-html="innovationData.why_not_covered"
            ></div>
          </dd>
        </div>

        <div v-if="innovationData.statement_1" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            The expectations and requirements for this beta feature were clear.
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_1 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_1 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_1 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_1 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_1 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div v-if="innovationData.statement_2" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            All components of this beta feature were applicable to my project
            (e.g., relevant to our space type, population, health and wellness
            goals).
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_2 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_2 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_2 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_2 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_2 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div v-if="innovationData.statement_3" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            The resources required to implement this beta feature were
            reasonable (e.g., cost, time).
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_3 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_3 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_3 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_3 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_3 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div v-if="innovationData.statement_4" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            The resources required to document this beta feature were reasonable
            (e.g., cost, time).
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_4 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_4 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_4 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_4 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_4 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div v-if="innovationData.statement_5" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            I would recommend this beta feature to other WELL projects.
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_5 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_5 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_5 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_5 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_5 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div v-if="innovationData.statement_6" class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">
            I believe this beta feature should become a part of the permanent
            WELL feature library.
          </dt>
          <dd class="mt-1 text-sm text-primary-900">
            <div v-if="innovationData.statement_6 === 5" class="space-y-4">
              Strongly Agree
            </div>
            <div v-if="innovationData.statement_6 === 4" class="space-y-4">
              Agree
            </div>
            <div v-if="innovationData.statement_6 === 3" class="space-y-4">
              Neutral
            </div>
            <div v-if="innovationData.statement_6 === 2" class="space-y-4">
              Disagree
            </div>
            <div v-if="innovationData.statement_6 === 1" class="space-y-4">
              Strongly Disagree
            </div>
          </dd>
        </div>

        <div class="sm:col-span-3">
          <dt class="text-sm font-medium text-gray-500">Documents</dt>
          <dd class="mt-1 text-sm text-primary-900">
            <ul
              class="border border-gray-200 rounded-md divide-y divide-gray-200"
            >
              <li
                v-for="(document, index) in innovationData.documents"
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
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </span>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    innovationData: {
      required: false,
      default: null,
      type: Object,
    },
  },
  computed: {
    projectLink() {
      if (this.innovationData.iproposable_details.type === 'WELL v2') {
        return `/projects/v2/${this.innovationData.iproposable_details.project_number}/dashboard`
      }

      if (this.innovationData.iproposable_details.type === 'WELL v2 Pilot') {
        return `/projects/v2-pilot/${this.innovationData.iproposable_details.project_number}/dashboard`
      }
      if (this.innovationData.iproposable_details.type === 'WELL v2 HSR') {
        return `/shared-workspaces/${this.innovationData.iproposable_details.portfolio_number}/dashboard`
      }
      return null
    },
  },
  //   async mounted() {
  //     await this.$axios
  //       .get(`api/admin/innovationProposals?id=${this.$route.params.id}`)
  //       .then((res) => (this.innovationData = res.data.data[0]))
  //   },
}
</script>
