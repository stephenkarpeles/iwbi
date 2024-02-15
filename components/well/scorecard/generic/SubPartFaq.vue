<template>
  <div>
    <div v-if="loading">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
      </div>
    </div>
    <div v-if="!faqCountZero">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="bg-white m-5 max-w-full overflow-x-auto rounded-lg shadow"
      >
        <div class="text-sm leading-5 text-gray-900 p-5">
          <div
            class="text-sm leading-5 font-medium text-gray-900"
            v-html="'#' + faq.id + ' - ' + faq.question"
          ></div>
          <div
            class="text-sm leading-5 text-gray-500"
            v-html="faq.answer"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="!loading">
      <div v-if="faqCountZero" class="text-gray-400 m-4">
        No FAQs available for this feature.
      </div>
      <div class="text-sm p-5">
        If you have any additional questions about this feature, please email
        our technical team at
        <a
          class="text-primary-600 cursor-pointer"
          href="mailto:technical@wellcertified.com"
          target="_blank"
          >technical@wellcertified.com</a
        >.
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    featureId: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      faqs: [],
      type: '',
      loading: true,
    }
  },
  computed: {
    faqCountZero() {
      return this.faqs.length === 0 || this.faqs === null
    },
  },

  watch: {
    featureId() {
      this.getFaqs()
    },
  },
  mounted() {
    if (this.featureId) {
      this.getFaqs()
    }
  },
  methods: {
    getFaqs() {
      this.$axios
        .get('api/features/' + this.featureId + '/faq')
        .then((response) => {
          this.faqs = response.data
          this.loading = false
        })
    },
  },
}
</script>
