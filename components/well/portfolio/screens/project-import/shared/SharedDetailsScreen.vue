<template>
  <div
    class="flex justify-around items-center px-6 py-6 rounded-md border border-primary-200 bg-primary-50"
  >
    <div class="w-1/2">
      <span
        v-if="details.action === 'create'"
        class="text-primary-900 leading-8"
      >
        We have started importing {{ details.success_rows }} new locations
        {{
          recertification && recertification.location_changed === 1
            ? ''
            : 'to this Portfolio'
        }}
        on {{ $dayjs(details.import_date.date).format('MMM DD, YYYY') }} and the
        process may take some time to complete. <br />
        <br />
        We will notify you via email on your registered email ID when the import
        gets completed. You can now close this screen or start another import.
      </span>
      <span v-else class="text-primary-900 leading-8">
        We have started updating {{ details.success_rows }} existing locations
        {{
          recertification && recertification.location_changed === 1
            ? ''
            : 'in this Portfolio'
        }}
        on {{ $dayjs(details.import_date.date).format('MMM DD, YYYY') }} and the
        process may take some time to complete. <br />
        <br />
        We will notify you via email on your registered email ID when the import
        gets completed. You can now close this screen or start another import.
      </span>
    </div>
    <div class="">
      <img src="/portfolio/import/success.png" alt="success icon" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    details: {
      type: Object,
      required: true,
      default: null,
    },
  },
  computed: {
    ...mapState({
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
  },
  async mounted() {
    await this.$store.dispatch('recertification/getHSRRecertification')
  },
}
</script>
