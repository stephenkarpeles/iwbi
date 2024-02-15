<template>
  <div
    v-if="documents && documents.data.length"
    class="max-w-screen-lg min-w-full"
  >
    <ModalsGeneral
      ref="editDocModal"
      :show-back-option="mode === 'locations'"
      :header="mode === 'locations' ? '' : 'Edit Document'"
      :header-background="noBakground"
    >
      <div style="width: 900px" class="px-6 overflow-x-auto overflow-y-auto">
        <PortfolioEditDocScreen
          v-if="selectedDoc && Object.keys(selectedDoc).includes('parts')"
          :part="selectedDoc.parts[0]"
          :selected-doc="selectedDoc"
          :mode-name="mode"
          @get-document="getDocuments"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="deleteDoc">
      <PortfolioConfirmFileDeleteScreen
        header="Delete document"
        :selected="selectedDoc"
        :part="selectedDoc"
      />
    </ModalsGeneral>

    <ModalsGeneral
      ref="locationsList"
      header="Locations"
      :header-background="noBakground"
    >
      <div style="width: 700px" class="px-6">
        <PortfolioScorecardDocLocationScreen
          v-if="selectedDoc"
          :locations="selectedDoc.project_ids"
        />
      </div>
    </ModalsGeneral>

    <Table v-if="!loadPage">
      <template #header>
        <tr class="text-white uppercase text-sm">
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            document
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            locations
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            options
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            verification method
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            document stage
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">Scale</th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">type</th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            Review status
          </th>
        </tr>
      </template>
      <template #body>
        <tr v-for="(el, i) in documents.data" :key="i">
          <td valign="top" class="whitespace-nowrap px-6 py-4 flex flex-col">
            <WLinksBase :link="el.link_s3_private" target="_blank">
              {{ el.name }}
            </WLinksBase>
            <div class="flex space-x-2 items-center">
              <div class="flex">
                <div
                  v-if="
                    el.documentable_sub_type !== 'general' &&
                    el.documentable_sub_type !== 'legal'
                  "
                >
                  <Flyout
                    v-if="el.portfolio_scorecard_id"
                    ref="conceptFlyout"
                    y="bottom"
                    x="right"
                    class="h-full"
                  >
                    <WIconsBase
                      class="text-gray-300 hover:cursor-not-allowed"
                      icon="pencil-alt"
                      :disabled="true"
                    />
                    <template #content>
                      <div
                        class="p-3 text-primary-600 text-sm w-60 whitespace-normal"
                      >
                        Documents uploaded in individual project scorecards
                        cannot be edited here.
                      </div>
                    </template>
                  </Flyout>
                  <WIconsBase
                    v-else
                    class="text-danger-500 hover:cursor-pointer hover:text-danger-400"
                    icon="pencil-alt"
                    @click.native="setDocument(el)"
                  />
                </div>
                <Flyout
                  v-if="el.portfolio_scorecard_id"
                  ref="conceptFlyout"
                  y="bottom"
                  x="right"
                  class="h-full"
                >
                  <WIconsBase
                    :disabled="true"
                    class="text-gray-300 hover:cursor-not-allowed h-6 w-6 mt-1"
                    icon="trash"
                  />

                  <template #content>
                    <div
                      class="p-3 text-primary-600 text-sm w-60 whitespace-normal"
                    >
                      Documents uploaded in individual project scorecards cannot
                      be deleted here.
                    </div>
                  </template>
                </Flyout>
                <div v-else>
                  <WIconsBase
                    v-if="
                      !el.scorecard_doc_review_status ||
                      el.scorecard_doc_review_status === 'Ready For Review'
                    "
                    class="text-danger-700 hover:cursor-pointer hover:text-danger-600"
                    icon="trash"
                    @click.native="
                      ;(selectedDoc = el), ($refs.deleteDoc.isHidden = false)
                    "
                  />
                </div>
              </div>
              <span class="text-gray-400 text-sm"
                >Uploaded
                {{ $dayjs(el.created_at).format('MMM DD, YYYY') }}</span
              >
            </div>
          </td>
          <td valign="top" class="whitespace-nowrap px-6 py-4">
            <button
              class="font-medium text-primary-600"
              :class="
                Object.keys(el).includes('documentable_sub_type')
                  ? ''
                  : 'underline'
              "
              @click="
                ;(selectedDoc = el), ($refs.locationsList.isHidden = false)
              "
            >
              {{ (el.project_ids && el.project_ids.length) || '-' }}
              {{
                Object.keys(el).includes('documentable_sub_type')
                  ? ''
                  : ' Assigned'
              }}
            </button>
          </td>
          <td
            v-if="el.scorecard_parts && el.scorecard_parts.length"
            valign="top"
            class="whitespace-nowrap text-primary-800 px-6 py-4 flex flex-col space-y-1"
          >
            <div v-for="(option, index) in el.scorecard_parts" :key="index">
              <div class="flex">
                <span class="font-semibold">{{ option.part.part_prefix }}</span>
                <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>

                <span
                  v-if="option.option && option.option.option_order"
                  class="mr-2"
                >
                  Option {{ option.option.option_order }}</span
                >
                <span
                  v-if="option.pivot.status"
                  class="bg-primary-100 rounded border border-primary-400 text-primary-800 px-2 text-sm"
                  >{{ option.pivot.status }}</span
                >
              </div>
              <span v-if="option.sub_part" class="text-xs">{{
                getSubPartTitle(option.sub_part)
              }}</span>
            </div>
          </td>

          <td
            v-else
            valign="top"
            class="whitespace-nowrap text-primary-800 px-6 py-4 flex flex-col space-y-1"
          >
            -
          </td>
          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            {{
              el.verifiable_type === 'App\\Models\\LetterofAssurance'
                ? 'Letter of Assurance - '
                : ''
            }}
            {{ el.verifiable && el.verifiable.name ? el.verifiable.name : '-' }}
          </td>
          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            {{ el.stage || '-' }}
          </td>
          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            {{ el.verifiable ? el.verifiable.scale_type : '-' }}
          </td>

          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            <span v-if="Object.keys(el).includes('verifiable')"
              >{{ el.verifiable.is_auditable ? 'Audit' : 'Feature' }}
            </span>

            <div v-else class="capitalize">
              {{ el.documentable_sub_type ? el.documentable_sub_type : '-' }}
              <div class="text-sm text-gray-600 mt-2">{{ el.type }}</div>
            </div>
          </td>
          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            {{
              Object.keys(el).includes('scorecard_doc_review_status')
                ? el.scorecard_doc_review_status || '-'
                : 'NA'
            }}
          </td>
        </tr>
      </template>
    </Table>
    <div v-else class="mx-auto mt-10 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading list of documents...</div>
    </div>

    <FormInputsPagination
      class="mt-1 rounded-md"
      :pagination="documents"
      :show-max="true"
      :offset="3"
      @paginate="getDocuments()"
    />
  </div>
  <div v-else-if="loading" class="mx-auto mt-10 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Loading list of documents...</div>
  </div>
  <div
    v-else
    class="bg-white rounded-md border-primary-300 border px-6 py-8 flex flex-col items-center w-full"
  >
    <WIconsBase class="text-primary-600 w-10 h-10" icon="document" />
    <span class="text-primary-600 text-2xl font-semibold mt-2"
      >No documents to show</span
    >
    <span class="text-primary-600 mt-2">
      Begin uploading documents in your task list. Your documents will appear
      here.
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      documents: null,
      selectedDoc: null,
      part: '',
      loading: true,
      loadPage: false,
      noBakground: true,
      mode: '',
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  watch: {
    $route() {
      this.getDocuments()
    },
  },
  async mounted() {
    await this.getDocuments()
  },
  methods: {
    setDocument(el) {
      this.selectedDoc = el
      this.$refs.editDocModal.isHidden = false
    },
    getSubPartTitle(subpart) {
      let title = 'For '
      const spaceTypesInc = subpart.space_types_included
      if (spaceTypesInc.length !== 0) {
        if (spaceTypesInc.length === 1) {
          title += spaceTypesInc[0].name
        } else {
          title += spaceTypesInc[0].name
          for (let i = 1; i < spaceTypesInc.length; i++) {
            if (i === spaceTypesInc.length - 1) {
              title += ' & ' + spaceTypesInc[i].name
            } else {
              title += ', ' + spaceTypesInc[i].name
            }
          }
        }
      }
      if (subpart.space_types_excluded.length) {
        const spaceTypeExc = subpart.space_types_excluded
        title += ' except '

        spaceTypeExc.forEach((e) => {
          title += e.name + ' & '
        })

        title = title.slice(0, -3)
      }
      return title + ''
    },
    async getDocuments(documentName) {
      let payload = null
      if (Object.keys(this.$route.query).length > 2) {
        payload = {
          verifications: this.$route.query.verification
            ? Array.isArray(this.$route.query.verification)
              ? this.$route.query.verification
              : [this.$route.query.verification]
            : [],
          type: this.$route.query.type ? this.$route.query.type : [],
          documentable_sub_type: this.$route.query.type
            ? this.$route.query.type.includes('General') ||
              this.$route.query.type.includes('Legal')
              ? this.$route.query.type
              : []
            : [],
          stage: this.$route.query.document_stage
            ? Array.isArray(this.$route.query.document_stage)
              ? this.$route.query.document_stage
              : [this.$route.query.document_stage]
            : [],
          scorecard_doc_review_status: this.$route.query
            .scorecard_doc_review_status
            ? Array.isArray(this.$route.query.scorecard_doc_review_status)
              ? this.$route.query.scorecard_doc_review_status
              : [this.$route.query.scorecard_doc_review_status]
            : [],
          project_ids: this.$route.query.project_ids
            ? Array.isArray(this.$route.query.project_ids)
              ? this.$route.query.project_ids
              : [this.$route.query.project_ids]
            : [],
          letter_of_assurances: this.$route.query.loa
            ? Array.isArray(this.$route.query.loa)
              ? this.$route.query.loa
              : [this.$route.query.loa]
            : [],
          on_sites: this.$route.query.on_sites
            ? Array.isArray(this.$route.query.on_sites)
              ? this.$route.query.on_sites
              : [this.$route.query.on_sites]
            : [],
          annotated_documents: this.$route.query.annotated_documents
            ? Array.isArray(this.$route.query.annotated_documents)
              ? this.$route.query.annotated_documents
              : [this.$route.query.annotated_documents]
            : [],
        }
      } else {
        payload = {
          name: documentName,
        }
      }
      this.selectedDoc = null
      const page = this.documents ? this.documents.current_page : 1
      this.loadPage = true
      await this.$axios
        .get(
          `api/portfolio/${this.portfolio.id}/${this.portfolio.scorecard_id}/documents`,
          {
            params: { ...payload, page },
          }
        )
        .then((response) => {
          this.documents = response.data
          this.loading = false
          this.loadPage = false
          this.$parent.$parent.$parent.$parent.$refs.content.scrollTop = 0
        })
    },
  },
}
</script>
