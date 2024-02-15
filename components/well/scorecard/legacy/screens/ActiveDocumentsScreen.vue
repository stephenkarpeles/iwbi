<template>
  <div class="divide-y">
    <ModalsGeneral ref="modal">
      <div style="width: 900px">
        <PortfolioScorecardDocumentUploadScreen
          :part="part"
          :active-option="activeOption"
          :current-ver="currentVer"
        />
      </div>
    </ModalsGeneral>
    <div v-if="activeVerificationsList.length" class="divide-y">
      <div v-for="(el, index) in activeVerificationsList" :key="index">
        <!-- header -->
        <div class="flex justify-between w-full items-center py-3">
          <button
            class="flex items-center text-primary-600 space-x-3"
            @click="el.expand = !el.expand"
          >
            <WIconsBase :icon="el.expand ? 'chevron-down' : 'chevron-right'" />
            <span class="font-semibold"> {{ el.name }} </span>
            <span v-if="el.is_auditable" class="text-sm text-yellow-700"
              ><span
                class="
                  flex-shrink-0
                  inline-block
                  h-2
                  w-2
                  bg-yellow-500
                  rounded-full
                "
                aria-hidden="true"
              ></span>
              Audit</span
            >
          </button>
          <div class="flex space-x-4">
            <div class="flex space-x-2 items-center">
              <ProgressCircle
                :radius="12"
                :stroke="2"
                :progress="(el.completed / el.total) * 100"
              />
              <span class="text-gray-500 text-sm whitespace-nowrap"
                >{{ el.completed }}/{{ el.total }} Completed</span
              >
            </div>
            <WButtonsBase
              @click.native=";($refs.modal.isHidden = false), (currentVer = el)"
              >Upload</WButtonsBase
            >
          </div>
        </div>

        <!-- body -->
        <div v-if="el.expand">
          <PortfolioScorecardVerificationScreen
            :scorecard-part-i-d="scorecardPartID"
            :verification="el"
            :part="part"
            :active-option="activeOption"
          />
        </div>
      </div>
    </div>
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
    activeOption: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentVer: null,
    }
  },

  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      activeVerificationsList: (state) =>
        state.scorecard.activeVerificationsList,
    }),
    scorecardPartID() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
    },
  },

  watch: {
    async scorecardPartID(newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.$store.dispatch('scorecard/getVerificationList', {
          scorecardPartID: this.scorecardPartID,
        })
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('scorecard/getVerificationList', {
      scorecardPartID: this.scorecardPartID,
    })
  },
}
</script>
