<template>
  <div :class="'formulate-input-element formulate-input-element--'">
    <div class="pb-2">
      <ClientOnly>
        <multiselect
          ref="multiselect"
          v-model="companyData"
          :options="companies"
          :custom-label="setCompany"
          :close-on-select="context.slotProps.label.closeonselect"
          :clear-on-select="context.slotProps.label.clearonselect"
          :allow-empty="true"
          :block-keys="['Delete']"
          :loading="isLoading"
          :searchable="context.slotProps.label.searchable"
          :placeholder="placeholder"
          :options-limit="context.slotProps.label.optionslimit"
          deselect-label=""
          no-options="no options"
          label="name"
          track-by="name"
          :internal-search="false"
          @search-change="searchCompany"
        >
          <span
            v-if="
              !context.attributes['disabled-add'] ||
              (context.attributes['disabled-add'] &&
                context.attributes['disabled-add'] == false)
            "
            slot="noResult"
          >
            <div class="mt-5 mb-1">
              There were no matching search results for your entry.<br />
              Would you like to add this {{ orgtype }}?
            </div>
            <div class="w-32 mt-5">
              <WButtonsBase @click.native="addNewCompany"
                >Add&nbsp;{{ orgtype }}
              </WButtonsBase>
            </div>
          </span>
          <span slot="noOptions">Search for your {{ orgtype }}</span>
        </multiselect>
      </ClientOnly>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    clearOnSelect: {
      type: Boolean,
      default: true,
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    optionsLimit: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      fieldState: '',
      companies: [],
      alias: [],
      isLoading: false,
      companyData: null,
      orgtype: 'Organization',
    }
  },
  computed: {
    model() {
      return this.context.model
    },
  },
  watch: {
    companyData(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.context.model = val
    },
    model(val) {
      this.dateVal = val
    },
  },
  created() {
    this.$nuxt.$on('clear-filters', () => {
      this.clearInputValue()
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.model) {
        if (this.model.id) {
          this.companyData = this.model
        }
      } else {
        this.companyData = this.context.model
      }
    })
    // Updated proptypes to oraganization/company/alias
    if (this.context.slotProps.label.orgtype !== undefined) {
      this.orgtype = this.context.slotProps.label.orgtype
    } else {
      this.orgtype = 'Organization'
    }
  },
  methods: {
    clearInputValue() {
      this.companyData = null
    },
    searchCompany(searchQuery) {
      this.fieldState = searchQuery
      this.isLoading = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if (this.fieldState !== '') {
          this.$axios
            .get(`/api/companies`, {
              params: {
                name: this.fieldState,
                limit: this.context.slotProps.label.optionslimit,
              },
            })
            .then((response) => {
              this.companies = response.data
              this.alias = response.data
            })
            .catch(() => {
              return {}
            })
        } else {
          this.companies = []
        }
        this.isLoading = false
      }, 600)
    },
    setCompany({ name }) {
      return `${name}`
    },
    addNewCompany() {
      this.companyData = { name: this.fieldState }
      this.$refs.multiselect.deactivate()
      this.$axios
        .post('api/companies', { name: this.companyData.name })
        .then((response) => {
          this.companyData.id = response.data.id
          this.$store.dispatch('notifications/toastMessage', {
            message: `${this.companyData.name} was successfully added`,
          })
          this.companies.push({
            name: this.companyData.name,
            id: this.companyData.id,
          })
        })
        .catch((err) => {
          if (err.response) {
            this.$store.dispatch('notifications/toastMessage', {
              message: err.response.data.message,
            })
          } else {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Something went wrong...please try again later',
            })
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.multiselect__spinner:after,
.multiselect__spinner:before {
  border-top-color: rgba(23, 53, 63);
  position: absolute;
  content: '';
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border-style: solid;
  border-width: 2px;
  box-shadow: 0 0 0 1px transparent;
}
.multiselect:focus {
  border: none;
}
.multiselect__tags-wrap {
  border: none;
}
</style>
