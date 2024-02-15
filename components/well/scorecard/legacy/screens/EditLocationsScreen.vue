<template>
  <div v-if="!loading">
    <ModalsConfirm ref="remLocModal" @confirm="removeLocation">
      <template slot="body">
        <div class="sm:flex sm:items-start">
          <div
            class="
              mx-auto
              flex-shrink-0 flex
              items-center
              justify-center
              h-12
              w-12
              rounded-full
              bg-red-100
              sm:mx-0 sm:h-10 sm:w-10
            "
          >
            <WIconsBase class="h-6 w-6 text-red-600" icon="exclamation" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              id="modal-title"
              class="text-lg leading-6 font-medium text-gray-900"
            >
              Remove Audited Location
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Warning about removing an audited location
              </p>
            </div>
          </div>
        </div>
      </template>
    </ModalsConfirm>
    <div class="w-full border-b mb-4">
      <div class="flex justify-between">
        <WHeadingsHThree class="text-primary-900" heading="Assign Locations" />
        <WIconsBase
          class="text-primary-900 text-lg cursor-pointer"
          icon="x"
          @click.native="closeModal()"
        />
      </div>

      <WTabsHorizontal
        ref="tabs"
        v-model="currentTab"
        class="w-3/5 -mb-px uppercase"
        alignment="space-x-6"
        :tabs="tabs"
      />
    </div>

    <div class="flex justify-between mb-4">
      <div class="flex space-x-4">
        <FormulateInput
          v-model="locName"
          class="w-56 -mb-4"
          type="search"
          name="search"
          placeholder="Search Assigned Locations"
          @keyup.enter="getLocations"
          @input.native="locName === '' && getLocations()"
        />
      </div>
      <WButtonsBase
        class="w-32"
        icon="plus"
        @click.native="$emit('enableLocationsList')"
        >Locations</WButtonsBase
      >
    </div>

    <div class="h-96">
      <div
        v-if="displayCard"
        class="w-full p-4 bg-primary-100 rounded-md border"
      >
        <span class="text-primary-700">No locations to display...</span>
      </div>

      <div v-else class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
            <div class="max-h-96 overflow-y-auto sm:rounded-md border">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-primary-700">
                  <tr class="text-white">
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Construction
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Occupants
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Pursue
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(loc, index) in currentTab[1] === 'l'
                      ? assignedLocations
                      : achievedLocations"
                    :key="index"
                  >
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        flex flex-col
                      "
                    >
                      <span>
                        {{ loc.name || '-' }}
                      </span>
                      <span
                        v-if="loc.audit_required"
                        class="text-sm text-gray-500"
                      >
                        <span
                          class="
                            flex-shrink-0
                            inline-block
                            h-2
                            w-2
                            bg-yellow-500
                            rounded-full
                          "
                          aria-hidden="true"
                        ></span>
                        Audit Required</span
                      >
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      {{
                        loc.construction_status === 0
                          ? 'Under Construction'
                          : 'Constructed'
                      }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ loc.no_of_occupants || '-' }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      <PillSwitch
                        v-model="loc.pursue_status"
                        @click.native="assignPursueStatus(loc)"
                      />
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      <button
                        class="
                          flex
                          space-x-2
                          text-danger-500
                          hover:text-danger-400
                        "
                        @click="
                          ;($refs.remLocModal.isHidden = false),
                            (selected_loc = loc)
                        "
                      >
                        <WIconsBase icon="trash" />
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading locations...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    activeOption: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      locations: [],
      currentTab: 'All Assigned',
      scorecard_part_id: null,
      selected_loc: null,
      loading: false,
      locName: '',
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    assignedLocations() {
      return this.locations.filter((loc) => loc.assigned === 1)
    },
    tabs() {
      return [
        { name: `All Assigned (${this.assignedLocations.length})` },
        { name: `Achieved (${this.achievedLocations.length})` },
      ]
    },
    achievedLocations() {
      return this.locations.filter(
        (loc) =>
          loc.pursue_status !== 'now' &&
          loc.pursue_status !== 'later' &&
          loc.pursue_status !== null
      )
    },
    displayCard() {
      if (this.currentTab[1] === 'l' && this.assignedLocations.length === 0) {
        return true
      }
      if (this.currentTab[1] === 'c' && this.achievedLocations.length === 0) {
        return true
      }
      return false
    },
    scorecardPartID() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
    },
  },
  async mounted() {
    this.loading = true
    await this.getLocations()
    this.loading = false
  },
  methods: {
    async removeLocation() {
      try {
        const res = await this.$axios.delete(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecard_part_id}/projects/${this.selected_loc.id}`
        )
        if (res.status === 200) {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Location removed successfully!',
          })
          await this.getLocations()
          this.$parent.$parent.getProjects()
          await this.$store.dispatch('scorecard/getVerificationList', {
            scorecardPartID: this.scorecardPartID,
          })
        }
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.msg,
          })
        } else {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Something went wrong...',
          })
        }
      }
    },

    async getLocations() {
      this.scorecard_part_id = this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${
              this.scorecard_part_id
            }/projects${this.locName !== '' ? '?name=' + this.locName : ''}`
          )
          .then((res) => {
            this.locations = res.data
          })
      } catch (error) {
        if (error.response) {
          this.$store.dispatch('notifications/toastMessage', {
            message: error.response.data.msg,
          })
        } else {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Something went wrong...',
          })
        }
      }
    },

    async assignPursueStatus(loc) {
      try {
        const res = await this.$axios.put(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecard_part_id}/projects/${loc.id}`
        )
        if (res.status === 200) {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Pursue status changed successfully!',
          })
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong...',
        })
      }
    },

    closeModal() {
      this.$parent.isHidden = true
    },
  },
}
</script>
