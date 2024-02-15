<template>
  <div
    class="
      flex
      justify-around
      items-center
      px-6
      py-6
      rounded-md
      border border-primary-200
      bg-primary-50
    "
  >
    <div class="w-1/2">
      <span
        v-if="details.action === 'create'"
        class="text-primary-900 leading-8"
      >
        We have started importing {{ details.success_rows }} new locations to
        this Portfolio on
        {{ $dayjs(details.import_date.date).format('MMM DD, YYYY') }} and the
        process may take some time to complete. <br />
        <br />
        We will notify you via email on your registered email ID when the import
        gets completed. You can now close this screen or start another import.
      </span>
      <span v-else class="text-primary-900 leading-8">
        We have started updating {{ details.success_rows }} existing locations
        in this Portfolio on
        {{ $dayjs(details.import_date.date).format('MMM DD, YYYY') }} and the
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
export default {
  props: {
    details: {
      type: Object,
      required: true,
      default: null,
    },
  },
}
</script>
