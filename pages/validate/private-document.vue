<template>
  <div class="text-center py-12 text-primary-600">
    <div v-if="documentLink">
      <div>
        Your document should either download or open in a new window. If this
        does not happen then please check your pop-up settings or click the link
        below.
      </div>
      <div class="max-w-max mt-5 mx-auto text-center">
        <a :href="documentLink" targe="_blank">
          <WButtonsBase icon="download">
            Click to download your document
          </WButtonsBase>
        </a>
      </div>
    </div>
    <div v-else class="mx-auto mt-5 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">
        Please Wait. Preparing your document...
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      documentLink: null,
    }
  },
  head() {
    return {
      title: `Document Validation`,
    }
  },
  mounted() {
    this.validateDocument()
  },
  methods: {
    validateDocument() {
      if (process.browser) {
        this.$axios
          .post('api/upload/signUrl', { url: this.$route.query.url })
          .then((response) => {
            this.documentLink = response.data
            window.open(response.data, '_self')
          })
      }
    },
  },
}
</script>
