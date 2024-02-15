<template>
  <div>
    <div class="lg:flex lg:space-x-4">
      <div class="w-full lg:w-2/3">
        <div class="pt-2 pb-2">
          <label class="typo__label">Find or add a Company</label>
          <ClientOnly>
            <multiselect
              ref="multiselect"
              v-model="value"
              :options="companies"
              :custom-label="setCompany"
              :close-on-select="true"
              :clear-on-select="false"
              :allow-empty="false"
              :block-keys="['Delete']"
              :loading="isLoading"
              deselect-label=""
              no-options=""
              placeholder="Search"
              label="name"
              track-by="name"
              @search-change="searchCompany"
            >
              <span slot="noResult">
                <div class="mt-5 mb-1">
                  There were no matching search results for your entry.<br />
                  Would you like to add this company?
                </div>
                <div class="w-32 mt-5">
                  <WButtonsBase @click.native="addNewCompany"
                    >Add Company</WButtonsBase
                  >
                </div>
              </span>
              <span slot="noOptions" class="hidden"> </span>
            </multiselect>
          </ClientOnly>
          <div v-if="value.name" class="pt-6">Company: {{ value.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fieldState: '',
      value: { name: '', id: '' },
      companies: [],
      isLoading: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.company) {
        this.value.name = this.$route.query.company
        this.value.id = this.$route.query.id
      }
    })
    this.$axios
      .get(`/api/companies`)
      .then((response) => {
        this.companies = response.data
      })
      .catch(() => {
        return {}
      })
  },
  methods: {
    searchCompany(searchQuery) {
      const contentWrapper = document.querySelector(
        '.multiselect__content-wrapper'
      )
      this.fieldState = searchQuery
      this.isLoading = true
      //   this.toggle()
      contentWrapper.style.height = '0px'
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$axios
          .get(`/api/companies`)
          .then((response) => {
            this.companies = response.data
          })
          .catch(() => {
            return {}
          })
        this.isLoading = false
        contentWrapper.style.height = 'auto'
      }, 600)
    },
    setCompany({ name }) {
      return `${name}`
    },
    addNewCompany() {
      const newCompany = this.fieldState
      this.value.name = newCompany
      this.companies.push({ name: newCompany, id: '' })
      this.$refs.multiselect.deactivate()

      //   Currently no endpoint/option to create company saving for future use
      //   this.$axios
      //     .post('api/companies', newCompany)
      //     .then((res) => {
      //       this.$store.dispatch('notifications/toastMessage', {
      //         message: 'Company Added',
      //       })
      //     })
      //     .catch((err) => {
      //       if (err.response) {
      //         this.$store.dispatch('notifications/toastMessage', {
      //           message: err.response.data.msg,
      //         })
      //       } else {
      //         this.$store.dispatch('notifications/toastMessage', {
      //           message: 'Something went wrong...please try again later',
      //         })
      //       }
      //     })
    },
  },
}
</script>

<style>
.multiselect__content-wrapper {
  height: 0px;
  transform: translateY(5px);
  animation: animContent 0.25s forwards;
}
.multiselect__option {
  transform: translateY(5px);
  animation: animContent 0.25s forwards;
}
@keyframes animContent {
  0% {
    transform: translateY(5px);
  }

  100% {
    transform: translateY(0px);
  }
}
.multiselect__spinner:after,
.multiselect__spinner:before {
  border-top-color: rgba(23, 53, 63, var(--tw-bg-opacity));
}
</style>
