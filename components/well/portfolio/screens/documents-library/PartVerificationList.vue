<template>
  <div>
    <!-- Modals -->
    <ModalsGeneral ref="modal">
      <div style="width: 900px">
        <PortfolioVerifDocUploadScreen :current-ver="currentVer" :part="part" />
      </div>
    </ModalsGeneral>
    <!-- header -->
    <div v-for="(el, index) in verifications" :key="index">
      <div class="flex justify-between w-full items-center py-3">
        <button
          class="flex items-center text-primary-600 space-x-3"
          @click="el.expand = !el.expand"
        >
          <WIconsBase :icon="el.expand ? 'chevron-down' : 'chevron-right'" />
          <span class="font-semibold"> {{ el.name }} </span>
          <span v-if="el.is_auditable" class="text-sm text-yellow-700"
            ><span
              class="flex-shrink-0 inline-block h-2 w-2 bg-yellow-500 rounded-full"
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
              >{{ el.completed }}/{{ el.total }} Locations Fulfilled</span
            >
          </div>
          <WButtonsBase
            class="shadow-none"
            @click.native=";($refs.modal.isHidden = false), (currentVer = el)"
            >Upload</WButtonsBase
          >
        </div>
      </div>

      <!-- body -->
      <div
        :ref="'container' + index"
        style="
          overflow: hidden;
          max-height: 0px;
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 500ms;
        "
        :style="
          el.expand && {
            'max-height': `${$refs['container' + index][0].scrollHeight}px`,
          }
        "
      >
        <PortfolioPartVerificationScreen :verif="el" :part="part" />
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
  },
  data() {
    return {
      verifications: null,
      currentVer: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
  },
  mounted() {
    this.verifications = this.part.verifications
  },
}
</script>
