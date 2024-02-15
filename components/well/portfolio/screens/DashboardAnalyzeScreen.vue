<template>
  <div v-if="!loading">
    <!-- Stat section -->
    <div class="mt-4 flex space-x-2">
      <!-- WELL Portfolio Score section -->
      <div class="flex items-center flex-col w-1/3 relative">
        <!-- <div
          v-if="
            (mode.name === 'shared' &&
              analyzeDummyData.dummy.hsr_score === null) ||
            (mode.name === 'portfolio' &&
              analyzeDummyData.dummy.cert_score === null)
          "
          class="
            absolute
            w-full
            h-full
            z-10
            backdrop-filter backdrop-blur-sm
            rounded-md
          "
        ></div> -->
        <div
          class="bg-primary-100 flex items-center flex-col py-2 rounded-t-md w-full"
        >
          <span class="text-primary-800 text-2xl">
            <span class="font-bold">WELL</span>
            {{
              mode.name === 'portfolio'
                ? 'Portfolio Score'
                : 'Health-Safety Score'
            }}
            &trade;
          </span>
          <span class="text-primary-700"
            >as of:
            <span class="font-semibold">{{
              $dayjs(new Date()).format('MMMM D, YYYY')
            }}</span></span
          >
          <div class="flex py-6">
            <span
              v-if="analyzeDummyData.dummy"
              class="text-secondary-700 font-bold text-9xl"
              >{{
                mode.name === 'portfolio'
                  ? analyzeDummyData.dummy.cert_score || 0
                  : analyzeDummyData.dummy.hsr_score || 0
              }}</span
            >

            <span v-else class="text-secondary-700 font-bold text-9xl">0</span>

            <div>
              <!-- icon  -->
              <WIconsBase
                class="h-18 w-18 text-primary-800"
                icon="speedometer"
                type=""
              />
              <span class="font-semibold text-secondary-600 text-4xl"
                >/100</span
              >
            </div>
          </div>
        </div>
        <div
          class="mt-2 px-2 flex bg-primary-100 rounded-b-md py-2 w-full h-full items-center justify-around"
        >
          <div class="flex">
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="office-building"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{
                analyzeDummyData.total_property_count
              }}</span>
              <span class="opacity-80">projects</span>
            </div>
          </div>
          <div class="flex">
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="location-marker"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{
                analyzeDummyData.total_location_count
              }}</span>
              <span class="opacity-80">countries</span>
            </div>
          </div>
          <div class="flex">
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="globe"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{
                analyzeDummyData.total_property_area
              }}</span>
              <span class="opacity-80">sq feet</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Total occupants section -->
      <div
        class="bg-primary-100 flex flex-col items-center p-2 rounded-md w-1/3 relative"
      >
        <!-- <div
          v-if="
            analyzeDummyData.dummy &&
            analyzeDummyData.dummy.occupant_regions.length === 0
          "
          class="
            absolute
            w-full
            h-full
            z-10
            backdrop-filter backdrop-blur-sm
            rounded-md
          "
        >
          <div
            class="
              backdrop-filter backdrop-blur-sm
              hover:backdrop-blur-lg
              text-center
              align-middle
              w-full
              h-full
              opacity-0
              hover:opacity-100
              transition
              ease-in-out
              duration-500
              flex
            "
          >
            <span class="text-primary-700 my-20 px-5"
              >Please add regions from edit screen in-order to enable this
              section.</span
            >
          </div>
        </div> -->
        <span class="text-primary-800 text-2xl text-center">
          Total occupants
        </span>
        <div class="text-secondary-700 flex flex-col items-center leading-4">
          <span class="font-bold text-lg">{{
            analyzeDummyData.total_no_of_occupant
          }}</span>
          <span class="uppercase text-center">people impacted</span>
        </div>
        <div v-if="chartData.labels.length">
          <DoughnutChart
            :styles="myStyles"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                animateRotate: true,
              },
            }"
            :chart-data="{
              labels: chartData.labels,
              datasets: [
                {
                  backgroundColor: [
                    '#CFE6ED',
                    '#A9D2E0',
                    '#84BFD2',
                    '#5EABC4',
                    '#4094B0',
                    '#32748A',
                    '#255565',
                  ],
                  data: chartData.values,
                },
              ],
            }"
          />
        </div>
      </div>

      <!-- Badges section -->
      <div
        class="bg-primary-100 rounded-md p-2 flex flex-col items-center w-1/3"
      >
        <span class="text-primary-800 text-2xl text-center">
          Awarded Badges
        </span>
        <!-- <span class="text-secondary-800 text-center text-lg"
          >Congratulations on the completion of this review cycle and on your
          continued progress!
        </span>
        <span class="text-center text-sm text-primary-800 mt-2"
          >Your organization is advancing the health of your business by
          supporting the health and productivity of your people using the WELL
          Portfolio program.</span
        > -->
        <div class="flex space-x-2 justify-around my-auto">
          <div
            v-if="mode.name !== 'shared' && mode.module.cert_status"
            class="w-1/2 flex flex-col items-center"
          >
            <img
              class="w-36"
              :src="getStatusImg(mode.module.cert_status)"
              alt=""
            />
            <span
              class="text-xs font-semibold text-primary-800 text-center mt-2"
              >WELL Certification seal is valid<br />from
              {{ $dayjs(mode.module.date_certified).format('MMM DD, YYYY') }}
              to
              {{
                $dayjs(mode.module.date_certified)
                  .add(3, 'year')
                  .format('MMM DD, YYYY')
              }}</span
            >
          </div>
          <div
            v-if="mode.module.hsr_status === 'achieved'"
            :class="`${
              mode.name !== 'shared' && 'w-1/2'
            } flex flex-col items-center`"
          >
            <img
              class="w-36"
              src="/shared-workspace/Health-Safety_QR-8in-ALL-01.png"
              alt=""
            />
            <span
              class="text-xs font-semibold text-primary-800 text-center mt-2"
              >WELL Health-Safety seal is valid<br />from
              {{ $dayjs(mode.module.hsr_achieved_date).format('MMM DD, YYYY') }}
              to
              {{
                $dayjs(mode.module.hsr_achieved_date)
                  .add(1, 'year')
                  .format('MMM DD, YYYY')
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- grid view -->
    <div class="grid grid-cols-3 gap-2 mt-4">
      <!-- Well Certified Locations -->
      <div
        v-if="mode.name !== 'shared'"
        class="bg-primary-100 rounded-md relative"
      >
        <!-- progress section -->
        <div class="flex flex-col items-center">
          <WHeadingsHFour
            heading="well certified locations"
            class="uppercase text-primary-900"
          />
          <div class="flex">
            <div>
              <ScorecardRadialIndicator
                :radius="45"
                :progress="
                  (analyzeDummyData.certified_property.total /
                    analyzeDummyData.total_property_count) *
                  100
                "
                :stroke="9"
                :color="'#5EABC4'"
                :fill="'#F4F9FB'"
              />
            </div>
            <div>
              <span class="text-primary-900 font-semibold ml-2"
                >Portion of Portfolio Certified</span
              >
              <div class="flex space-x-2 ml-2">
                <div class="flex flex-col text-primary-700">
                  <img
                    class="w-10"
                    src="/scorecard/badges/platinum.png"
                    alt=""
                  />
                  <span class="font-bold text-xs">Platinum</span>
                  <span class="text-xs opacity-80"
                    >{{ certCategories.Platinum || 'Not pursued' }}
                  </span>
                </div>

                <div class="flex flex-col text-primary-700">
                  <img class="w-10" src="/scorecard/badges/gold.png" alt="" />
                  <span class="font-bold text-xs">Gold</span>
                  <span class="text-xs opacity-80">{{
                    certCategories.Gold || 'Not pursued'
                  }}</span>
                </div>

                <div class="flex flex-col text-primary-700">
                  <img class="w-10" src="/scorecard/badges/silver.png" alt="" />
                  <span class="font-bold text-xs">Silver</span>
                  <span class="text-xs opacity-80">{{
                    certCategories.Silver || 'Not pursued'
                  }}</span>
                </div>

                <div class="flex flex-col text-primary-700">
                  <img class="w-10" src="/scorecard/badges/bronze.png" alt="" />
                  <span class="font-bold text-xs">Bronze</span>
                  <span class="text-xs opacity-80">{{
                    certCategories.Bronze || 'Not pursued'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- table section -->
        <div class="flex flex-col mt-3 h-80 px-2">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden sm:rounded-md">
                <table class="min-w-full">
                  <tbody class="divide-y divide-gray-200">
                    <tr
                      v-for="(loc, index) in cert_locations.data"
                      :key="index"
                    >
                      <td class="p-2">
                        <div class="flex items-center">
                          <span
                            class="font-semibold text-primary-700 opacity-80 text-sm"
                            >{{ cert_locations.range[index] }}</span
                          >
                          <img
                            class="w-9 ml-2"
                            :src="getStatusImg(loc.cert_status)"
                            alt=""
                          />
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex flex-col">
                          <span class="text-sm text-primary-700 font-bold">{{
                            loc.name
                          }}</span>
                          <span class="text-xs text-primary-700 opacity-80">{{
                            loc.date_certified
                          }}</span>
                        </div>
                      </td>
                      <td class="p-2 text-primary-700 opacity-80 text-sm">
                        {{ loc.cert_status }}
                      </td>
                      <td class="p-2 text-primary-700 opacity-80 text-sm">
                        {{ loc.type }}
                      </td>
                      <td v-if="loc.dummy" class="p-1">
                        <div class="flex flex-col w-full">
                          <span
                            v-if="loc.dummy.cert_score"
                            class="text-sm text-primary-700 font-bold"
                            >{{ loc.dummy.cert_score }} pts.</span
                          >
                          <span
                            v-if="loc.dummy.cert_expire"
                            class="text-xs text-primary-700 opacity-80"
                            >{{ loc.dummy.cert_expire }}</span
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <FormInputsPagination
          :simplify="true"
          class="bg-primary-100 rounded-b-md absolute bottom-0 w-full"
          :pagination="cert_locations"
          :offset="3"
          @paginate="paginate('cert')"
        />
      </div>
      <!-- Well Precertified Locations -->
      <div
        v-if="mode.name !== 'shared'"
        class="bg-primary-100 rounded-md relative"
      >
        <!-- progress section -->
        <div class="">
          <WHeadingsHFour
            heading="well precertified locations"
            class="uppercase text-primary-900 text-center"
          />
          <div class="flex px-1">
            <div>
              <ScorecardRadialIndicator
                :radius="45"
                :progress="
                  (analyzeDummyData.pre_certified_property.total /
                    analyzeDummyData.total_property_count) *
                  100
                "
                :stroke="9"
                :color="'#5EABC4'"
                :fill="'#F4F9FB'"
              />
            </div>
            <div class="flex flex-col ml-2">
              <span class="text-primary-900 font-semibold"
                >Portion of Portfolio Precertified</span
              >
              <span class="text-primary-700"
                >{{
                  analyzeDummyData.pre_certified_property.total
                }}
                location(s)</span
              >
            </div>
          </div>
        </div>
        <!-- table section -->
        <div class="flex flex-col mt-3 h-80 px-2">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden sm:rounded-md">
                <table class="min-w-full">
                  <tbody class="divide-y divide-gray-200">
                    <tr
                      v-for="(loc, index) in pre_cert_locations.data"
                      :key="index"
                    >
                      <td class="p-2">
                        <div class="flex items-center">
                          <span
                            class="font-semibold text-primary-700 opacity-80 text-sm"
                            >{{ pre_cert_locations.range[index] }}</span
                          >
                          <img
                            class="w-9 ml-2"
                            src="/shared-workspace/precertification.png"
                            alt=""
                          />
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex flex-col">
                          <span class="text-sm text-primary-700 font-bold">{{
                            loc.name
                          }}</span>
                          <span class="text-xs text-primary-700 opacity-80">{{
                            loc.date_certified
                          }}</span>
                        </div>
                      </td>
                      <td class="p-2 text-primary-700 opacity-80 text-sm">
                        {{ loc.type }}
                      </td>
                      <td v-if="loc.dummy" class="p-1">
                        <div class="flex flex-col">
                          <span
                            v-if="loc.dummy.pre_score"
                            class="text-sm text-primary-700 font-bold"
                            >{{ loc.dummy.pre_score }} pts.</span
                          >
                          <span
                            v-if="loc.dummy.pre_cert_expire"
                            class="text-xs text-primary-700 opacity-80"
                            >{{ loc.dummy.pre_cert_expire }}</span
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <FormInputsPagination
          :simplify="true"
          class="bg-primary-100 rounded-b-md absolute bottom-0 w-full"
          :pagination="pre_cert_locations"
          :offset="3"
          @paginate="paginate('pre')"
        />
      </div>
      <!-- Well HSR Locations -->
      <div
        v-if="mode.name === 'shared' || mode.module.hsr_opt"
        class="bg-primary-100 rounded-md relative"
      >
        <!-- progress section -->
        <div>
          <WHeadingsHFour
            heading="well health-safety locations"
            class="uppercase text-primary-900 text-center"
          />
          <div class="flex px-1">
            <div>
              <ScorecardRadialIndicator
                :radius="45"
                :progress="
                  (analyzeDummyData.hsr_certified_property.total /
                    analyzeDummyData.total_property_count) *
                  100
                "
                :stroke="9"
                :color="'#5EABC4'"
                :fill="'#F4F9FB'"
              />
            </div>
            <div class="flex flex-col ml-2">
              <span class="text-primary-900 font-semibold"
                >Portion of Portfolio Rated</span
              >
              <span class="text-primary-700"
                >{{
                  analyzeDummyData.hsr_certified_property.total
                }}
                location(s)</span
              >
            </div>
          </div>
        </div>
        <!-- table section -->
        <div class="flex flex-col mt-3 h-80 px-2">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden sm:rounded-md">
                <table class="min-w-full">
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(loc, index) in hsr_locations.data" :key="index">
                      <td class="p-2">
                        <div class="flex items-center">
                          <span
                            class="font-semibold text-primary-700 opacity-80 text-sm"
                            >{{ hsr_locations.range[index] }}</span
                          >
                          <img
                            class="w-9 ml-2"
                            :src="
                              getStatusImg(loc.hsr_status) ||
                              '/shared-workspace/Health-Safety_QR-8in-ALL-01.png'
                            "
                            alt=""
                          />
                        </div>
                      </td>
                      <td class="p-2">
                        <div class="flex flex-col">
                          <span class="text-sm text-primary-700 font-bold">{{
                            loc.name
                          }}</span>
                          <span class="text-xs text-primary-700 opacity-80">{{
                            loc.date_certified
                          }}</span>
                        </div>
                      </td>
                      <td class="p-2 text-primary-700 opacity-80 text-sm">
                        {{ loc.hsr_status }}
                      </td>
                      <td class="p-2 text-primary-700 opacity-80 text-sm">
                        {{ loc.type }}
                      </td>
                      <td v-if="loc.dummy" class="p-1">
                        <div class="flex flex-col">
                          <span
                            v-if="loc.dummy.hsr_score"
                            class="text-sm text-primary-700 font-bold"
                            >{{ loc.dummy.hsr_score }} pts.</span
                          >
                          <span
                            v-if="loc.dummy.hsr_expire"
                            class="text-xs text-primary-700 opacity-80"
                            >{{ loc.dummy.hsr_expire }}</span
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <FormInputsPagination
          :simplify="true"
          class="bg-primary-100 rounded-b-md absolute bottom-0 w-full"
          :pagination="hsr_locations"
          :offset="3"
          @paginate="paginate('hsr')"
        />
      </div>
    </div>
    <!-- Graph section -->
    <div class="bg-primary-100 rounded-md w-full mt-4 p-2">
      <span class="uppercase text-primary-800 text-2xl"
        >Points by Well Concept</span
      >
      <div class="mt-2">
        <VerticalBar
          :options="{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: '#84BFD2',
                    fontStyle: 'bold',
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontColor: '#84BFD2',
                    fontStyle: 'bold',
                  },
                },
              ],
            },
          }"
          :chart-data="{
            labels: conceptData.labels,
            datasets: [
              {
                label: 'Scorecard',
                backgroundColor: [
                  '#144249',
                  '#07667F',
                  '#0B7B97',
                  '#3B9DB6',
                  '#91CBD3',
                  '#A7D6AD',
                  '#63A984',
                  '#40927D',
                  '#2F6B5E',
                  '#23483D',
                  '#263d46',
                  '#263d46',
                ],
                data: conceptData.values,
              },
            ],
          }"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center py-5">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading Analyze Dashboard...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mode: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cert_locations: {},
      pre_cert_locations: {},
      hsr_locations: {},
      loading: true,
    }
  },
  computed: {
    ...mapState({
      analyzeDummyData: (state) => state.portfolio.analyzeDummyData,
      scorecard: (state) => state.scorecard.scorecard,
    }),
    certCategories() {
      const data = {
        Platinum: '',
        Gold: '',
        Silver: '',
        Bronze: '',
      }
      this.analyzeDummyData.certified_property.count.forEach((el) => {
        const temp = `${el.total} locations`
        data[el.cert_status] =
          temp.length > 13 ? temp.substring(0, 10) + '...' : temp
      })
      return data
    },
    myStyles() {
      return {
        height: `250px`,
        position: 'relative',
      }
    },
    chartData() {
      const data = {
        labels: [],
        values: [],
      }
      const regions = this.analyzeDummyData.dummy?.occupant_regions
      if (regions) {
        for (const region in regions) {
          data.labels.push(region)
          data.values.push(regions[region])
        }
      }
      return data
    },
    conceptData() {
      const data = {
        labels: [],
        values: [],
      }

      this.scorecard.assessment_score.conceptScore.forEach((cons) => {
        data.labels.push(cons.concept_name)
        data.values.push(cons.points)
      })
      return data
    },
  },
  async mounted() {
    await this.$store.dispatch('portfolio/getAnalyzeDummyData', {
      mode: 'portfolio',
      id: this.mode.module.id,
    })

    const id =
      this.mode.name === 'shared'
        ? this.mode.module.hsr_scorecard_id
        : this.mode.module.scorecard_id

    await this.$store.dispatch('scorecard/getScorecard', id)
    ;['cert', 'pre'].forEach(async (el) => await this.getLocations(el))

    if (this.mode.module) {
      if (this.mode.module.hsr_opt || this.mode.name === 'shared') {
        await this.getLocations('hsr')
      }
    }
    this.loading = false
  },
  methods: {
    async getLocations(type, page) {
      try {
        const res = await this.$axios.get(
          `api/portfolio/${
            this.mode.module.id
          }/dashboard/locations?type=${type}&page=${page || 1}`
        )
        switch (type) {
          case 'cert':
            this.cert_locations = res.data
            this.cert_locations.range = this.range(res.data.from, res.data.to)
            break
          case 'pre':
            this.pre_cert_locations = res.data
            this.pre_cert_locations.range = this.range(
              res.data.from,
              res.data.to
            )
            break
          case 'hsr':
            this.hsr_locations = res.data
            this.hsr_locations.range = this.range(res.data.from, res.data.to)
            break
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    getStatusImg(status) {
      switch (status) {
        case 'Gold':
          return '/scorecard/badges/gold.png'
        case 'Bronze':
          return '/scorecard/badges/bronze.png'
        case 'Silver':
          return '/scorecard/badges/silver.png'
        case 'Platinum':
          return '/scorecard/badges/platinum.png'
      }
    },
    async paginate(type) {
      let page = 1
      switch (type) {
        case 'hsr':
          page = this.hsr_locations.current_page
          break
        case 'cert':
          page = this.cert_locations.current_page
          break
        case 'pre':
          page = this.pre_cert_locations.current_page
          break
      }
      await this.getLocations(type, page)
    },

    range(start, end) {
      let length = end - start
      length++
      return Array.from({ length }, (_, i) => start + i)
    },
  },
}
</script>
