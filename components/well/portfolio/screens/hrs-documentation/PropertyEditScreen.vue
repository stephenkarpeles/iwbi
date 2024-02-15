<template>
  <div>
    <div class="inline-flex justify-end w-full px-4">
      <div v-if="currentMode === 'list'" class="w-20">
        <WButtonsBase
          v-if="hideEdit"
          icon="pencil"
          @click.native="() => (currentMode = 'edit')"
          >Edit</WButtonsBase
        >
      </div>
      <div v-else class="flex space-x-2">
        <div class="w-22">
          <WButtonsBase icon="pencil" @click.native="updateProperty"
            >Update</WButtonsBase
          >
        </div>
        <div class="w-22">
          <WButtonsBase
            icon="x-circle"
            type="dangerInverted"
            @click.native="() => (currentMode = 'list')"
            >Cancel</WButtonsBase
          >
        </div>
      </div>
    </div>
    <div v-if="currentMode === 'list'" class="px-4">
      <div v-if="filteredProjects && filteredProjects.data.length > 0">
        <div
          class="
            shadow
            overflow-hidden
            border-b border-gray-200
            sm:rounded-lg
            w-full
            mt-3
          "
        >
          <!-- Check for documents -->
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div
                class="
                  py-2
                  align-middle
                  inline-block
                  min-w-full
                  sm:px-6
                  lg:px-8
                "
              >
                <div
                  class="
                    shadow
                    overflow-hidden
                    border-b border-gray-200
                    sm:rounded-lg
                  "
                >
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-primary-700 text-white">
                      <tr>
                        <th
                          scope="col"
                          class="
                            px-6
                            py-3
                            text-left text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                          "
                        >
                          Location Number
                        </th>
                        <th
                          scope="col"
                          class="
                            px-6
                            py-3
                            text-left text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                          "
                        >
                          Location Name
                        </th>
                        <th
                          scope="col"
                          class="
                            px-6
                            py-3
                            text-left text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                          "
                        >
                          Subset
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="project in filteredProjects.data"
                        :key="'document-' + project.id"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div
                            class="
                              flex
                              items-center
                              text-primary-900
                              opacity-80
                            "
                          >
                            {{ project.project_number }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div
                            class="
                              flex
                              items-center
                              text-primary-900
                              opacity-80
                            "
                          >
                            {{ project.name }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div
                            class="
                              flex
                              items-center
                              text-primary-900
                              opacity-80
                            "
                            v-html="getAllSubsetnames(project.id)"
                          ></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FormInputsPagination
          v-if="filteredProjects"
          :pagination="paginateFilter"
          :offset="3"
          @paginate="showProjects()"
        />
      </div>
      <div
        v-else
        class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
      >
        <div class="p-4 my-5 w-full rounded font-semibold text-sm">
          <p class="text-base">There are no documents.</p>
        </div>
      </div>
    </div>
    <div v-else class="px-4 mt-4">
      <div
        v-if="auditMode === false"
        class="flex mx-auto mb-5 border rounded-md p-5"
      >
        <div class="w-1/2">
          <WHeadingsHTwo heading="Locations" class="text-primary-900" />
          <FormulateInput
            v-if="subsetProjects.length"
            v-model="allSelectedProjects"
            type="checkbox"
            :label="allSelectedProjects ? 'Un-select All' : 'Select All'"
          />
          <FormulateInput
            v-if="subsetProjects.length"
            v-model="projects"
            type="checkbox"
            :options="subsetProjectsOptions"
          />
        </div>

        <div class="w-1/2 border-l-2 pl-3">
          <WHeadingsHTwo heading="Subsets" class="text-primary-900" />
          <FormulateInput
            v-if="subsetListFiltered.length"
            v-model="allSelectedSubsets"
            type="checkbox"
            :label="allSelectedSubsets ? 'Un-select All' : 'Select All'"
          />
          <FormulateInput
            v-if="subsetListFiltered.length"
            v-model="subsets"
            :options="subsetListFiltered"
            type="checkbox"
          />
        </div>
      </div>
      <div
        v-if="currentUser.role.includes('well-admin') && !isHsrDoc"
        class="space-y-6 mx-auto mb-5 border rounded-md p-5"
      >
        <FormulateInput
          v-model="isVerified"
          :options="{
            0: 'No',
            1: 'Yes',
          }"
          type="radio"
          label="Verified"
        />
        <FormulateInput
          v-model="expDate"
          type="datetimepicker"
          placeholder="Select date"
          label="Expiration Date"
          max="9999-01-01"
        />
        <FormulateInput
          v-model="comment"
          label="Comment"
          type="textarea"
          class="col-span-2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    selectedDocument: {
      type: Object,
      default: () => {
        return {}
      },
    },
    auditMode: {
      type: Boolean,
      default: false,
      require: false,
    },
    isHsrDoc: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  data() {
    return {
      currentMode: 'list',
      filteredProjects: null,
      activeDocument: null,
      subsets: [],
      projects: [],
      allSelectedSubsets: false,
      allSelectedProjects: false,
      propertiesOptions: [],
      isVerified: 0,
      expDate: null,
      comment: '',
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      subsetList: (state) => state.portfolio.subsetList,
      subsetProjects: (state) =>
        JSON.parse(JSON.stringify(state.portfolio.subsetProjects)),
      currentUser: (state) => state.user.currentUser,
    }),
    paginateFilter() {
      if (this.filteredProjects) {
        return {
          total: this.filteredProjects.total,
          per_page: this.filteredProjects.per_page,
          current_page: this.filteredProjects.current_page,
          last_page: this.filteredProjects.last_page,
          from: this.filteredProjects.from,
          to: this.filteredProjects.to,
        }
      }
      return {}
    },
    subsetListFiltered() {
      return this.subsetList.map((element) => {
        return {
          label: element.name,
          value: element.id,
          project_ids: element.project_ids,
        }
      })
    },
    subsetProjectsOptions() {
      return this.subsetProjects.map((el) => {
        return {
          label: el.label,
          value: el.value,
        }
      })
    },
    hideEdit() {
      if (this.auditMode) {
        if (!this.currentUser.role.includes('well-admin')) {
          return false
        }
      }
      return true
    },
  },
  watch: {
    allSelectedSubsets(value) {
      if (value) {
        this.subsets = this.subsetListFiltered.map((element) => {
          return element.value
        })
      } else {
        this.subsets = []
      }
    },

    allSelectedProjects(value) {
      if (value) {
        this.projects = this.subsetProjects.map((element) => {
          return element.value
        })
      } else {
        this.projects = []
      }
    },
    subsets(newValue, oldValue) {
      let newSubset = []
      if (newValue.length) {
        if (!oldValue.length) {
          newSubset = newValue
        } else {
          newValue.forEach((element) => {
            const value = oldValue.filter((a) => a === element)
            if (!value.length) {
              newSubset.push(element)
            }
          })
        }
      }
      const oldSubset = []
      if (oldValue.length) {
        if (oldValue.length) {
          oldValue.forEach((element) => {
            const value = newValue.filter((a) => a === element)
            if (!value.length) {
              oldSubset.push(element)
            }
          })
        }
      }
      if (newSubset.length && this.subsetList.length !== 0) {
        const subList = JSON.parse(JSON.stringify(this.subsetList))
        newSubset.forEach((element) => {
          const subset = subList.filter((a) => a.id === parseInt(element))[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length === 0) {
              this.projects.push(project)
            }
          })
        })
      }
      if (oldSubset.length) {
        const subList = JSON.parse(JSON.stringify(this.subsetList))
        oldSubset.forEach((element) => {
          const subset = subList.filter((a) => a.id === parseInt(element))[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length !== 0) {
              const index = this.projects.indexOf(project)
              this.projects.splice(index, 1)
            }
          })
        })
      }
    },
  },
  async mounted() {
    await this.$store
      .dispatch('portfolio/getSharedProject', {
        id: this.selectedDocument.id,
        page: this.paginateFilter.current_page,
        hsrId: this.selectedDocument.scorecard_id,
      })
      .then((response) => {
        this.filteredProjects = response
      })
    this.projects = JSON.parse(
      JSON.stringify(this.selectedDocument.project_ids.map((el) => el.id))
    )
    this.subsets = JSON.parse(
      JSON.stringify(this.selectedDocument.portfolio_subset_ids)
    )
    this.isVerified = this.selectedDocument.is_verified
    this.expDate = this.selectedDocument.exp_date
    this.comment = this.selectedDocument.comment
    await this.$store.dispatch('portfolio/getSubsetList')
    await this.$store.dispatch('portfolio/getPortfolioProjects', {
      id: this.portfolio.id,
      paginate: 'no',
    })
  },
  methods: {
    updateProperty() {
      const data = JSON.parse(JSON.stringify(this.selectedDocument))
      data.project_ids = this.projects.map((el) => {
        if (el.id) {
          return el.id
        }
        return el
      })
      data.portfolio_subset_ids = this.subsets
      data.part_ids = data.parts.map((element) => {
        return element.id
      })
      data.is_verified = this.isVerified
      data.exp_date = this.expDate
      data.comment = this.comment

      this.$store.dispatch('portfolio/updateHsrDocument', data).then((res) => {
        this.$parent.$parent.$refs.documentSlide.toggleOpen()
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Document Updated!',
        })
        this.$parent.$parent.getScorecard()
      })
    },
    showProjects() {
      this.$store
        .dispatch('portfolio/getSharedProject', {
          id: this.selectedDocument.id,
          page: this.paginateFilter.current_page,
          hsrId: this.isHsrDoc
            ? this.portfolio.hsr_scorecard_id
            : this.portfolio.scorecard_id,
          all: true,
        })
        .then((response) => {
          this.filteredProjects = response
        })
    },
    getAllSubsetnames(projectId) {
      let renderHTML = ''
      if (this.subsetListFiltered && this.subsetListFiltered.length) {
        this.subsetListFiltered.map((subset) => {
          if (subset.project_ids.filter((a) => a === projectId).length) {
            renderHTML +=
              '<span class="rounded px-2 py-1 bg-primary-100 border border-primary-600 text-primary-600 mr-2">' +
              subset.label +
              '</span>'
          }
          return renderHTML
        })
        return renderHTML
      } else {
        return renderHTML
      }
    },
  },
}
</script>
