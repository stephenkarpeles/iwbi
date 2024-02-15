<template>
  <div class="space-y-4">
    <!-- ========================= Modals ============================= -->
    <ModalsGeneral ref="commentModal">
      <div style="width: 600px">
        <PortfolioScorecardAddCommentScreen :part="part" :sub-part="subPart" />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="locationsModal">
      <div style="width: 900px">
        <PortfolioScorecardAssignLocationsScreen
          v-if="isListEnabled"
          mode="activeSpace"
          :part="part"
          :active-option="activeOption"
        />
        <PortfolioScorecardEditLocationsScreen
          v-else
          :active-option="activeOption"
          :part="part"
          @enableLocationsList="enableLocationsList"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral ref="changeOptionsModal">
      <div style="width: 900px">
        <div class="flex w-full border-b justify-between mb-4">
          <WHeadingsHThree class="text-primary-900" heading="Change Option" />
          <WIconsBase
            class="text-primary-900 text-lg cursor-pointer"
            icon="x"
            @click.native="$refs.changeOptionsModal.isHidden = true"
          />
        </div>
        <PortfolioScorecardOptionsListScreen
          mode="changeOption"
          :active-option="activeOption"
          :sub-part="subPart"
          :part="part"
        />
      </div>
    </ModalsGeneral>
    <!-- ========================= Modals ============================= -->
    <CardHorizontal
      :card-data="{
        warning:
          activeOption.certification || activeOption.note
            ? parseCardWarning(activeOption)
            : null,
      }"
    >
      <template slot="header">
        <div class="flex space-x-2 items-center">
          <WIconsBase icon="checklist-icon" />
          <span class="text-primary-800 font-semibold">
            {{ activeOption.name }} {{ activeOption.space_property }}
          </span>
        </div>
      </template>
      <template slot="action">
        <button
          class="text-primary-800 flex items-center"
          @click="$refs.changeOptionsModal.isHidden = false"
        >
          <WIconsBase icon="pencil" /> Edit Options
        </button>
      </template>
      <template slot="body">
        <div class="w-full justify-between text-primary-600">
          <div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span
              v-html="
                addCitations(
                  activeOption.description,
                  $store.state.shared.project
                )
              "
            ></span>
          </div>
          <ol
            type="a"
            style="list-style-type: lower-alpha"
            class="pl-5 text-gray-500 text-sm list-disc"
          >
            <li
              v-for="(requirement, req_index) in activeOption.requirements"
              :key="req_index"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="requirementStyles"
                v-html="
                  addCitations(
                    requirement.description,
                    $store.state.project.project
                  )
                "
              />
            </li>
          </ol>
          <div class="flex flex-wrap mt-2 p-2 rounded text-sm">
            <div class="space-x-2 flex w-full">
              <div class="my-auto">Verified by:</div>
              <div
                v-for="(verification, ver_index) in activeOption.verifications"
                :key="ver_index"
                class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white mr-1"
              >
                <div>
                  {{ verification.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CardHorizontal>

    <div
      class="bg-gray-50 items-center flex justify-between px-6 py-3 border border-primary-300 rounded-md"
    >
      <div class="flex space-x-2 items-center text-primary-800">
        <WIconsBase icon="office-building" />
        <span class="font-semibold"> Locations </span>
      </div>

      <div class="text-primary-700 text-sm space-x-2">
        <span>{{ locations.length }} Eligible</span>
        <span class="border-gray-300 border-l border-r px-2"
          >{{ locations.filter((loc) => loc.assigned).length }} Pursuing
        </span>
        <span
          >{{
            locations.filter((loc) => loc.pursue_status === 'achieved').length
          }}
          Achieved
        </span>
      </div>

      <div class="">
        <WButtonsBase @click.native="$refs.locationsModal.isHidden = false"
          >Assign Locations</WButtonsBase
        >
      </div>
    </div>

    <div
      v-if="!areThereDocuments"
      class="flex px-6 py-3 border-2 border-dashed border-primary-300 rounded-md cursor-pointer space-x-2 items-center hover:border-primary-400"
      @click="$refs.modal.isHidden = false"
    >
      <WIconsBase class="text-primary-800" icon="upload" />
      <div class="flex flex-col">
        <span class="text-primary-800 text-sm font-semibold">No Uploads</span>
        <span class="text-primary-600 text-sm"
          >Assign locations before you can upload documents</span
        >
      </div>
    </div>

    <CardHorizontal v-else :is-expandable="false">
      <template slot="header">
        <div class="flex space-x-2 items-center">
          <WIconsBase class="text-primary-800" icon="paper-clip" />
          <span class="text-primary-800 font-semibold"> Documents </span>
        </div>
      </template>
      <template slot="body">
        <PortfolioScorecardActiveDocumentsScreen
          :part="part"
          :active-option="activeOption"
        />
      </template>
    </CardHorizontal>

    <div
      v-if="comments.length <= 0"
      class="bg-gray-50 items-center flex justify-between px-6 py-3 border border-primary-300 rounded-md"
    >
      <div class="flex space-x-2 items-center text-primary-800">
        <WIconsBase icon="chat-alt" />
        <span class="font-semibold"> Comments ({{ comments.length }}) </span>
      </div>

      <div>
        <WButtonsBase
          type="primaryInverted"
          @click.native="$refs.commentModal.isHidden = false"
          >Add Comment</WButtonsBase
        >
      </div>
    </div>

    <CardHorizontal v-else :is-expandable="false">
      <template slot="header">
        <div class="flex space-x-2 items-center text-primary-800">
          <WIconsBase icon="chat-alt" />
          <span class="font-semibold"> Comments ({{ comments.length }}) </span>
        </div>
      </template>
      <template slot="action">
        <div>
          <WButtonsBase
            type="primaryInverted"
            @click.native="$refs.commentModal.isHidden = false"
            >Add Comment</WButtonsBase
          >
        </div>
      </template>
      <template slot="body">
        <PortfolioScorecardOptionCommentsScreen
          v-if="comments.length"
          :part="part"
          :sub-part="subPart"
        />
      </template>
    </CardHorizontal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { globalMixin } from '~/mixins/globalMixin'
export default {
  mixins: [globalMixin],
  props: {
    activeOption: {
      type: Object,
      required: true,
    },
    subPart: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      areThereDocuments: true,
      isListEnabled: false,
      locations: [],
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      comments: (state) => state.scorecard.optionComments,
    }),
    scorecard_part_id() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.subPart.id
      )?.id
    },
  },
  watch: {
    scorecard_part_id(oldVal, newVal) {
      if (newVal !== oldVal) {
        this.getProjects()
        this.$store.dispatch('scorecard/getOptionComments', {
          part_id: this.part.id,
          sub_part_id: this.activeOption.sub_part_id,
        })
      }
    },
  },
  async mounted() {
    await this.getProjects()
    await this.$store.dispatch('scorecard/getOptionComments', {
      part_id: this.part.id,
      sub_part_id: this.activeOption.sub_part_id,
    })
  },
  methods: {
    enableLocationsList() {
      this.isListEnabled = true
    },
    parseCardWarning(option) {
      let msg = null
      if (option.certification) {
        msg = `Projects pursuing this strategy are limited in WELL
                    Certification level to ${option.certification},
                    regardless of total points achieved.`
      } else {
        msg = this.addCitations(option.note, this.$store.state.shared.project)
      }
      return msg
    },
    async getProjects() {
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecard_part_id}/projects`
          )
          .then((res) => {
            this.locations = res.data
          })
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.msg,
          })
        } else {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Something went wrong...',
          })
        }
      }
    },
  },
}
</script>

<style scoped>
.requirementStyles >>> tr {
  @apply px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider;
}
.requirementStyles >>> td {
  @apply p-4 border border-primary-200;
}
.requirementStyles >>> table {
  @apply border rounded-lg border-primary-200 mt-3 mb-5 max-w-2xl;
}
.requirementStyles >>> ol {
  @apply list-decimal ml-5 m-3 space-y-2 text-sm max-w-2xl;
}
.requirementStyles >>> ul {
  @apply list-disc ml-5 m-3 space-y-2 text-sm max-w-2xl;
}
</style>
