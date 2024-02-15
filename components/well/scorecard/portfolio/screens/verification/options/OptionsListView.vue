<template>
  <div v-if="options">
    <ModalsGeneral
      ref="locationsModal"
      header="Assign locations"
      :header-background="noBakground"
    >
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <PortfolioScorecardLocationsScreen
          :option="selectedOption"
          :part="part"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral
      ref="achievedLocation"
      :header-background="noBakground"
      :header="part ? part.part_prefix + ' ' + part.name : ''"
    >
      <div style="width: 600px" class="px-6">
        <PortfolioScorecardAchievedListScreen
          :part="part"
          :option="selectedOption"
        />
      </div>
    </ModalsGeneral>
    <div class="space-y-4">
      <div
        v-for="(optionGroup, groupIndex) in optionsList"
        :key="groupIndex"
        :class="[
          optionGroup[0].condition === 'AND' &&
            'border-primary-300 rounded-lg border',
          'flex',
        ]"
      >
        <div v-if="optionGroup[0].condition === 'AND'" class="flex w-full">
          <div class="w-1/2">
            <div
              v-for="(el, i) in optionGroup"
              :key="i"
              class="rounded-lg flex"
            >
              <div
                :class="[
                  'p-6 bg-primary-100 flex justify-between relative w-full',

                  el.condition === 'AND' &&
                    i !== optionGroup.length - 1 &&
                    'border-primary-300 border-b',
                ]"
              >
                <div :class="['flex flex-col']">
                  <span class="text-primary-800"
                    >Option{{ ' ' + el.option.option_order }}
                    {{ el.option.name ? ': ' + el.option.name : '' }}
                    <Flyout
                      v-if="
                        currentUser.role.includes('well-admin') &&
                        part.scorecard_part.length &&
                        part.scorecard_part[0].from_migration &&
                        part.scorecard_part[0].from_migration > 3
                      "
                      y="bottom"
                      x="right"
                      class="h-full"
                    >
                      <WIconsBase
                        type="neutral"
                        icon="exclamation-circle"
                        class="w-6 text-primary-600 cursor-pointer"
                      />
                      <template #content>
                        <div class="w-56 text-xs p-4">
                          <div>
                            The option(s) shown are computer generated. You may
                            confirm or update these options if needed
                          </div>
                          <div>
                            <WLinksBase
                              class="flex justify-end mt-2 text-sm"
                              @click.native="
                                $store.dispatch(
                                  'scorecard/updatePartFromMigration',
                                  {
                                    part_id: part.id,
                                    scorecard_part_id:
                                      part.scorecard_part[0].id,
                                  }
                                ),
                                  //eslint-disable
                                  (part.scorecard_part[0].from_migration = 0)
                              "
                              >Confirm</WLinksBase
                            >
                          </div>
                        </div>
                      </template>
                    </Flyout></span
                  >
                  <span class="text-primary-800 text-sm">{{
                    el.subpart_name
                  }}</span>
                  <div
                    v-if="
                      scorecard.type === 'v2-pilot' &&
                      (part.annotated_documents.length ||
                        part.letter_of_assurances.length ||
                        part.on_sites.length)
                    "
                  >
                    <span
                      v-for="(ver, index) in part.annotated_documents"
                      :key="index"
                      class="text-primary-900 opacity-50 text-sm"
                    >
                      {{ ver.name }}
                    </span>
                    <span
                      v-for="(ver, index) in part.letter_of_assurances"
                      :key="index"
                      class="text-primary-900 opacity-50 text-sm"
                    >
                      {{ 'Letter Of Assurance - ' + ver.name }}
                    </span>
                    <span
                      v-for="(ver, index) in part.on_sites"
                      :key="index"
                      class="text-primary-900 opacity-50 text-sm"
                    >
                      {{ ver.name }}
                    </span>
                  </div>
                  <div
                    v-if="
                      (scorecard.type === 'v2' || scorecard.type === 'wpr') &&
                      el.option.verifications.length
                    "
                  >
                    <span
                      v-for="(ver, index) in el.option.verifications"
                      :key="index"
                      class="text-primary-900 opacity-50 text-sm"
                    >
                      {{ ver.name
                      }}{{
                        el.option.verifications.length > 1 &&
                        index !== el.option.verifications.length - 1
                          ? ','
                          : ''
                      }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="el.condition === 'AND' && i !== optionGroup.length - 1"
                  class="w-full flex absolute bottom-0 z-10 translate-y-1/2 -translate-x-1/1"
                >
                  <div
                    class="-translate-x-1/2 mx-auto bg-primary-200 rounded-lg px-2 text-sm py-1"
                  >
                    AND
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-1/2 bg-white p-4 rounded-r-md flex justify-between items-center"
          >
            <div
              v-if="
                optionGroup[0].location_achieved ||
                optionGroup[0].location_assigned
              "
              class="grid grid-cols-2 gap-4 text-primary-600"
            >
              <div
                v-if="
                  optionGroup[0].location_assigned -
                    optionGroup[0].location_achieved >
                  0
                "
                class="flex items-center space-x-2 cursor-pointer"
                @click="
                  ;(selectedOption = optionGroup[0]),
                    ($refs.locationsModal.isHidden = false)
                "
              >
                <WIconsBase icon="office-building" />
                <span>
                  {{
                    optionGroup[0].location_assigned -
                    optionGroup[0].location_achieved
                  }}
                  Pursued
                </span>
              </div>

              <div
                v-if="optionGroup[0].location_achieved"
                class="flex items-center space-x-2 cursor-pointer"
                @click="
                  ;(selectedOption = optionGroup[0]),
                    ($refs.achievedLocation.isHidden = false)
                "
              >
                <WIconsBase icon="office-building" />
                {{ optionGroup[0].location_achieved }} Achieved
              </div>
            </div>
            <span v-else class="text-primary-600 text-sm w-8/12"
              >Assign locations to this option. This will generate a task list
              to help you keep track of documents.</span
            >
            <WButtonsBase
              class="w-32 shadow-none font-semibold"
              :type="
                optionGroup[0].location_assigned ? 'primaryInverted' : 'primary'
              "
              @click.native="
                ;(selectedOption = optionGroup[0]),
                  ($refs.locationsModal.isHidden = false)
              "
              >{{
                optionGroup[0].location_assigned
                  ? 'Edit locations'
                  : 'Assign locations'
              }}
            </WButtonsBase>
          </div>
        </div>
        <div v-else class="w-full">
          <div
            v-for="(el, i) in optionGroup"
            :key="i"
            class="rounded-lg flex mb-5 border-primary-300 border"
          >
            <div class="p-6 bg-primary-100 flex justify-between relative w-1/2">
              <div :class="['flex flex-col']">
                <span class="text-primary-800"
                  >Option{{ ' ' + el.option.option_order }}
                  {{ el.option.name ? ': ' + el.option.name : '' }}
                  <Flyout
                    v-if="
                      currentUser.role.includes('well-admin') &&
                      part.scorecard_part.length &&
                      part.scorecard_part[0].from_migration &&
                      part.scorecard_part[0].from_migration > 3
                    "
                    y="bottom"
                    x="right"
                    class="h-full"
                  >
                    <WIconsBase
                      type="neutral"
                      icon="exclamation-circle"
                      class="w-6 text-primary-600 cursor-pointer"
                    />
                    <template #content>
                      <div class="w-56 text-xs p-4">
                        <div>
                          The option(s) shown are computer generated. You may
                          confirm or update these options if needed
                        </div>
                        <div>
                          <WLinksBase
                            class="flex justify-end mt-2 text-sm"
                            @click.native="
                              $store.dispatch(
                                'scorecard/updatePartFromMigration',
                                {
                                  part_id: part.id,
                                  scorecard_part_id: part.scorecard_part[0].id,
                                }
                              ),
                                //eslint-disable
                                (part.scorecard_part[0].from_migration = 0)
                            "
                            >Confirm</WLinksBase
                          >
                        </div>
                      </div>
                    </template>
                  </Flyout></span
                >
                <span class="text-primary-800 text-sm">{{
                  el.subpart_name
                }}</span>
                <div
                  v-if="
                    scorecard.type === 'v2-pilot' &&
                    (part.annotated_documents.length ||
                      part.letter_of_assurances.length ||
                      part.on_sites.length)
                  "
                >
                  <span
                    v-for="(ver, index) in part.annotated_documents"
                    :key="index"
                    class="text-primary-900 opacity-50 text-sm"
                  >
                    {{ ver.name }}
                  </span>
                  <span
                    v-for="(ver, index) in part.letter_of_assurances"
                    :key="index"
                    class="text-primary-900 opacity-50 text-sm"
                  >
                    {{ 'Letter Of Assurance - ' + ver.name }}
                  </span>
                  <span
                    v-for="(ver, index) in part.on_sites"
                    :key="index"
                    class="text-primary-900 opacity-50 text-sm"
                  >
                    {{ ver.name }}
                  </span>
                </div>
                <div
                  v-if="
                    scorecard.type === 'v2' && el.option.verifications.length
                  "
                >
                  <span
                    v-for="(ver, index) in el.option.verifications"
                    :key="index"
                    class="text-primary-900 opacity-50 text-sm"
                  >
                    {{ ver.name
                    }}{{
                      el.option.verifications.length > 1 &&
                      index !== el.option.verifications.length - 1
                        ? ','
                        : ''
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="w-1/2 bg-white p-4 rounded-r-md flex justify-between items-center"
            >
              <div
                v-if="el.location_achieved || el.location_assigned"
                class="grid grid-cols-2 gap-4 text-primary-600"
              >
                <div
                  v-if="el.location_assigned - el.location_achieved > 0"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <WIconsBase icon="office-building" />
                  <span>
                    {{ el.location_assigned - el.location_achieved }} Pursuing
                  </span>
                </div>

                <div
                  v-if="el.location_achieved"
                  class="flex items-center space-x-2 cursor-pointer"
                  @click="
                    ;(selectedOption = el),
                      ($refs.achievedLocation.isHidden = false)
                  "
                >
                  <WIconsBase icon="office-building" />
                  {{ el.location_achieved }} Achieved
                </div>
              </div>
              <span v-else class="text-primary-600 text-sm w-8/12"
                >Assign locations to this option. This will generate a task list
                to help you keep track of documents.</span
              >
              <WButtonsBase
                class="w-32 shadow-none font-semibold"
                :type="el.location_assigned ? 'primaryInverted' : 'primary'"
                @click.native="
                  ;(selectedOption = el),
                    ($refs.locationsModal.isHidden = false)
                "
                >{{
                  el.location_assigned ? 'Edit locations' : 'Assign locations'
                }}
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="mx-auto mt-5 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Loading selected options...</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      noBakground: true,
      selectedOption: null,
    }
  },
  computed: {
    ...mapState({
      options: (state) => state.scorecard.selectedOptions,
      scorecard: (state) => state.scorecard.scorecard,
      currentUser: (state) => state.user.currentUser,
    }),
    optionsList() {
      const data = []
      const group = []
      this.options.forEach((el) => {
        const index = group.findIndex((a) => a === el.sub_part_id)
        if (index === -1) {
          group.push(el.sub_part_id)
        }
      })
      group.forEach((option) => {
        let options = this.options.filter((a) => a.sub_part_id === option)
        options = options.map((e) => {
          let title = this.$options.filters.getSubPartTitle(
            e.sub_part.space_types_included
          )
          if (e.sub_part.space_types_excluded.length) {
            title +=
              ' except ' +
              this.$options.filters.getSubPartTitle(
                e.sub_part.space_types_excluded
              )
          }
          return { ...e, subpart_name: title, condition: e.sub_part.condition }
        })
        data.push(options)
      })

      return data
    },
  },

  async mounted() {
    await this.$store.dispatch('scorecard/getSelectedOptions', {
      part_id: this.part.id,
    })
  },
}
</script>
