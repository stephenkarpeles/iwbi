<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div :class="classKey">
    <FormulateInput
      data-id="country-input"
      v-model="target.country_code"
      :options="countryOptions"
      type="select"
      :label="required ? 'Country/Region*' : 'Country/Region'"
      :validation="required ? 'required' : ''"
      :disabled="disabled"
    />
    <FormulateInput
      v-if="
        target.country_code &&
        target.country_code !== '' &&
        stateOptions.length > 0
      "
      v-model="target.state"
      :options="stateOptions"
      type="select"
      :label="required ? 'State / Province*' : 'State / Province'"
      :validation="required ? 'required' : ''"
      :disabled="disabled"
    />
    <FormulateInput
      data-id="address-input"
      v-model="target.street"
      type="text"
      :label="required ? 'Street address*' : 'Street address'"
      :validation="required ? 'required' : ''"
      :disabled="disabled"
    />
    <FormulateInput
      data-id="city-input"
      v-model="target.city"
      type="text"
      :label="required ? 'City*' : 'City'"
      :validation="required ? 'required' : ''"
      :disabled="disabled"
    />

    <FormulateInput
      data-id="postal-input"
      v-model="target.postal_code"
      type="text"
      :label="required ? 'Postal Code*' : 'Postal Code'"
      :validation="required ? 'required' : ''"
      :disabled="disabled"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    classKey: {
      type: String,
      required: false,
      default: null,
    },
    target: {
      type: [Array, Object],
      required: false,
      default() {
        return {
          country_code: '',
          state: '',
          street: '',
          city: '',
          postal_code: '',
        }
      },
    },
    address: {
      type: [Array, Object],
      required: false,
      default() {
        return {}
      },
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      addressData: {
        country_code: '',
        street: '',
        city: '',
        postal_code: '',
      },
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      states: (state) => state.address.states,
    }),
    stateOptions() {
      const options = []
      if (
        this.target.country_code &&
        this.target.country_code !== '' &&
        this.states[this.target.country_code]
      ) {
        for (const property in this.states[this.target.country_code]) {
          const option = {
            value: this.states[this.target.country_code][property],
            label: this.states[this.target.country_code][property],
          }
          options.push(option)
        }
      }
      return options
    },
    countryOptions() {
      const options = []

      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].code,
          label: this.countries[i].name,
        }
        options.push(option)
      }

      return options
    },
  },
  watch: {
    'target.country_code'() {
      // eslint-disable-next-line vue/no-mutating-props
      this.target.state = ''
    },
  },
}
</script>
