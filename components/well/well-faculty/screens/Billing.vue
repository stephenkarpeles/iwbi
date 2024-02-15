<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full md:flex">
      <div class="w-full lg:w-1/3 lg:pr-16">
        <WHeadingsHThree heading="Billing" />
      </div>
      <div class="w-full lg:w-3/4 space-y-3">
        <div v-for="(invoice, index) in faculty.invoices" :key="index">
          <InvoiceCard :invoice="invoice" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: '',
    }
  },
  computed: {
    ...mapState({
      faculty: (state) => state.faculty.faculty,
    }),
  },
}
</script>
