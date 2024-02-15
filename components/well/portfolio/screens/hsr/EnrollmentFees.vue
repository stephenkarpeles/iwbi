<template>
  <div>
    <div class="p-5">
      <div class="flex justify-between text-base">
        <div class="font-bold text-xl">Enrollment Fee</div>
        <div>Custom*</div>
      </div>
      <div>
        <p v-if="portfolioDetails.no_of_assets > 1" class="text-xs">
          {{ portfolioDetails.no_of_assets }} high-volume locations.
        </p>
      </div>
      <div class="py-14">
        <div class="text-base">
          We appreciate your interest in the WELL Health-Safety Rating!
        </div>
        <div class="text-xs">
          Given the large number of locations you’d like to enroll, we want to
          provide you with the best possible pricing. We will contact you
          shortly to discuss a custom pricing package to fit your needs.
        </div>
      </div>
      <div class="pb-8">
        <div class="text-right text-xs">ENROLLMENT TOTAL</div>
        <div class="text-primary-400 text-right">Pending Quote</div>
      </div>
      <FormulateForm @submit="setMode('register')">
        <FormulateInput class="mt-3" type="submit" label="Back" />
      </FormulateForm>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      country: '',
      discountChecked: '',
    }
  },
  computed: {
    ...mapState({
      portfolioDetails: (state) => state.portfolio.portfolio,
      countries: (state) => state.address.countries,
    }),
    getCountryName() {
      if (this.country) {
        return this.countries.filter((a) => a.code === this.country)[0].name
      } else {
        return ''
      }
    },
  },
  methods: {
    ...mapMutations('portfolio', ['setMode']),
  },
}
</script>
