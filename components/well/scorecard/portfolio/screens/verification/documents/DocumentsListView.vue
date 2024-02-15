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
        <PortfolioScorecardEditDocScreen
          :mode-name="mode"
          :part="part"
          :selected-doc="selectedDoc"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="deleteDoc">
      <PortfolioScorecardConfirmDeleteScreen
        header="Delete document"
        :selected="selectedDoc"
        :part="part"
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

    <Table>
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
          <th scope="col" class="px-6 py-3 text-left tracking-wider">Type</th>
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
                <WIconsBase
                  class="text-danger-500 hover:cursor-pointer hover:text-danger-400"
                  icon="pencil-alt"
                  :disabled="el.portfolio_scorecard_id"
                  @click.native="
                    () => {
                      !el.portfolio_scorecard_id ? setDocument(el) : null
                    }
                  "
                />
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
              <span class="text-gray-400 text-sm"
                >Uploaded
                {{ $dayjs(el.created_at).format('MMM DD, YYYY') }}</span
              >
            </div>
          </td>
          <td valign="top" class="whitespace-nowrap px-6 py-4">
            <button
              v-if="el.project_ids.length"
              class="font-medium text-primary-600 underline"
              @click="
                ;(selectedDoc = el), ($refs.locationsList.isHidden = false)
              "
            >
              {{ el.project_ids.length + ' Assigned' }}
            </button>
            <span v-else>0</span>
          </td>
          <td
            valign="top"
            class="whitespace-nowrap text-primary-800 px-6 py-4 flex flex-col space-y-1"
          >
            <div v-for="(option, index) in el.scorecard_parts" :key="index">
              <div class="flex">
                <span class="font-semibold">{{ option.part.part_prefix }}</span>
                <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>
                <span class="mr-2"
                  >Option
                  {{
                    option && option.option ? option.option.option_order : ''
                  }}</span
                >
                <span
                  v-if="option.pivot.status"
                  class="bg-primary-100 rounded border border-primary-400 text-primary-800 px-2 text-sm"
                  >{{ option.pivot.status }}</span
                >
              </div>

              <span v-if="option && option.sub_part">{{
                option.sub_part.space_types_included | getSubPartTitle
              }}</span>
            </div>
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
            <span v-if="el.verifiable && el.verifiable.is_auditable">
              Audit
            </span>
            <span v-else> Feature </span>
          </td>
          <td
            valign="top"
            class="whitespace-nowrap font-medium text-primary-900 px-6 py-4"
          >
            {{ el.scorecard_doc_review_status || '-' }}
          </td>
        </tr>
      </template>
    </Table>

    <FormInputsPagination
      class="mt-1 rounded-md"
      :pagination="documents"
      :offset="3"
      @paginate="getDocuments()"
    />
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
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      documents: null,
      selectedDoc: null,
      noBakground: true,
      mode: '',
    }
  },
  computed: {
    ...mapState({
      partDocuments: (state) => state.scorecard.partDocuments,
    }),
  },
  watch: {
    partDocuments(val) {
      this.documents = val
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
    async getDocuments() {
      await this.$store.dispatch('scorecard/getPartDocs', {
        part_id: this.part.id,
        page: this.documents ? this.documents.current_page : '1',
      })
    },
    async getVerificationList() {
      await this.$store.dispatch('scorecard/getPartVerifications', {
        part_id: this.part.id,
      })
      await this.$store.dispatch('scorecard/getSelectedOptions', {
        part_id: this.part.id,
      })
    },
  },
}
</script>
