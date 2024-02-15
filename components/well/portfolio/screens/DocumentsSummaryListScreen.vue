<template>
  <div class="px-4">
    <WTabsHorizontal
      ref="tabs"
      v-model="currentTabs"
      class="w-full -mb-px"
      :tabs="[
        { name: 'General', icon: 'document' },
        { name: 'Scorecard', icon: 'chart-bar' },
        { name: 'Shared-Documents', icon: 'view-grid' },
      ]"
    />

    <div v-if="currentTabs === 'General'">
      <div
        v-if="documents && documents.length"
        class="
          shadow
          overflow-hidden
          border-b border-gray-200
          sm:rounded-lg
          w-full
          mt-3
        "
      >
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="
                  shadow
                  overflow-hidden
                  border-b border-gray-200
                  sm:rounded-lg
                "
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700 text-white">
                    <tr>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Uploaded By
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(document, index) in documents" :key="index">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-secondary-800">
                          <WLinksBase
                            target="_blank"
                            :link="document.link_s3_private"
                          >
                            {{ document.name }}
                          </WLinksBase>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-primary-600">
                          {{ getDocument(document.type) }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col">
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{ document.user_name }} on
                          </div>
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{
                              $dayjs(document.created_at).format('MMM DD, YYYY')
                            }}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
      >
        <div
          class="
            p-4
            my-5
            w-full
            rounded
            font-semibold
            text-sm
            bg-primary-100
            text-primary-700
          "
        >
          <p class="text-base">
            There is no documents uploaded into the scorecard for this portfolio
          </p>
        </div>
      </div>
    </div>

    <div v-if="currentTabs === 'Scorecard'">
      <div
        v-if="
          showScoreCard &&
          scorecardDocuments.data &&
          scorecardDocuments.data.length
        "
        class="
          shadow
          overflow-hidden
          border-b border-gray-200
          sm:rounded-lg
          w-full
          mt-3
        "
      >
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="
                  shadow
                  overflow-hidden
                  border-b border-gray-200
                  sm:rounded-lg
                "
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700 text-white">
                    <tr>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Parts
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Document Type
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        PRECERTIFICATION
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        STAGE
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        UPLOADED BY
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(document, index) in scorecardDocuments.data"
                      :key="index"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col space-y-2 items-start">
                          <div
                            v-for="(part, i) in document.parts"
                            :key="i"
                            class="
                              text-sm
                              font-medium
                              rounded-full
                              bg-primary-800
                              text-white
                              px-3
                              py-1
                            "
                          >
                            {{ part.part_prefix }} {{ part.feature_name }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-secondary-800">
                          <WLinksBase
                            target="_blank"
                            :link="document.link_s3_private"
                          >
                            {{ document.name }}
                          </WLinksBase>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-secondary-800">
                          {{ document.document_type }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div
                            v-if="document.d_and_o"
                            v-html="preCert(document.d_and_o)"
                          ></div>
                          <div v-else>-</div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-primary-600">
                          {{ document.stage }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col">
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{ document.user_name }} on
                          </div>
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{
                              $dayjs(document.created_at).format('MMM DD, YYYY')
                            }}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <FormInputsPagination
          v-if="scorecardDocuments && scorecardDocuments.data"
          :pagination="scorecardDocuments"
          :offset="3"
          @paginate="getScorcard()"
        />
      </div>
      <div
        v-else
        class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
      >
        <div
          class="
            p-4
            my-5
            w-full
            rounded
            font-semibold
            text-sm
            bg-primary-100
            text-primary-700
          "
        >
          <p class="text-base">
            There is no documents uploaded into the scorecard for this portfolio
          </p>
        </div>
      </div>
    </div>

    <div v-if="currentTabs === 'Shared-Documents'">
      <div
        v-if="sharedDocument.data && sharedDocument.data.length"
        class="
          shadow
          overflow-hidden
          border-b border-gray-200
          sm:rounded-lg
          w-full
          mt-3
        "
      >
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="
                  shadow
                  overflow-hidden
                  border-b border-gray-200
                  sm:rounded-lg
                "
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700 text-white">
                    <tr>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Parts
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        UPLOADED BY
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(document, index) in sharedDocument.data"
                      :key="index"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col space-y-2 items-start">
                          <div
                            v-for="(part, i) in document.parts"
                            :key="i"
                            class="
                              text-sm
                              font-medium
                              rounded-full
                              bg-primary-800
                              text-white
                              px-3
                              py-1
                            "
                          >
                            {{ part.part_prefix }} {{ part.feature_name }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center text-secondary-800">
                          <WLinksBase
                            target="_blank"
                            :link="document.link_s3_private"
                          >
                            {{ document.name }}
                          </WLinksBase>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col">
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{ document.user_name }} on
                          </div>
                          <div class="text-primary-900 opacity-80 text-sm">
                            {{
                              $dayjs(document.created_at).format('MMM DD, YYYY')
                            }}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <FormInputsPagination
          v-if="sharedDocument && sharedDocument.data"
          :pagination="sharedDocument"
          :offset="3"
          @paginate="getSharedDocuments()"
        />
      </div>
      <div
        v-else
        class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
      >
        <div
          class="
            p-4
            my-5
            w-full
            rounded
            font-semibold
            text-sm
            bg-primary-100
            text-primary-700
          "
        >
          <p class="text-base">
            There is no documents uploaded into the scorecard for this portfolio
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    projectInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTabs: 'General',
      typeOption: [
        { label: 'General', value: 'general' },
        { label: 'Legal', value: 'legal' },
        { label: 'Ongoing data reports', value: 'report' },
        { label: 'Feature', value: 'feature' },
      ],
      showScoreCard: false,
    }
  },
  computed: {
    ...mapState({
      scorecardDocuments: (state) =>
        JSON.parse(JSON.stringify(state.portfolio.scorecardDocuments)),
      documents: (state) => state.portfolio.documents,
      sharedDocument: (state) => state.portfolio.sharedDocument,
    }),
  },
  async mounted() {
    await this.getDocuments()
    await this.getScorcard()
    await this.getSharedDocuments()
  },
  beforeDestroy() {
    this.$store.commit('portfolio/setScorecardDocuments', [])
  },

  methods: {
    getDocument(type) {
      if (type === 'review-d&o') {
        return 'Precertification documentation review'
      } else if (type === 'review-pre') {
        return 'Preliminary Documentation Review'
      } else if (type === 'review-final') {
        return 'Final Documentation Review'
      } else if (type === 'review-Curative Action Plan Review') {
        return 'Curative Action Plan Review'
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.typeOption.filter((a) => a.value === type).length) {
          return this.typeOption.filter((a) => a.value === type)[0].label
        } else {
          return type
        }
      }
    },
    preCert(val) {
      if (val === 1) {
        return '<span class="bg-primary-500 text-white rounded-md px-2 py-1">Yes</span>'
      }
      return '<span class="bg-yellow-400 text-white rounded-md px-2 py-1">No</span>'
    },
    async getScorcard() {
      if (this.projectInfo.scorecard_id) {
        await this.$store.dispatch('portfolio/getScorecardDocuments', {
          scorecardId: this.projectInfo.scorecard_id,
          page: this.scorecardDocuments.current_page,
        })
        this.showScoreCard = true
      }
    },

    async getSharedDocuments() {
      await this.$store.dispatch('portfolio/getSharedDocumentList', {
        id: this.projectInfo.id,
        page: this.sharedDocument.current_page,
      })
    },

    async getDocuments() {
      await this.$store.dispatch(
        'portfolio/getDocumentList',
        this.projectInfo.id
      )
    },
  },
}
</script>
