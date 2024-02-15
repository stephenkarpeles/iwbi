<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div
        class="
          flex
          justify-between
          items-center
          shadow
          p-5
          rounded
          my-2
          bg-primary-100
        "
      >
        <div class="w-1/2">
          <p class="text-primary-800 font-bold text-1xl">Project totals</p>
          <p
            class="text-xs italic"
            v-html="
              type == 'SpaceType'
                ? 'by primary space type'
                : type == 'Location'
                ? 'by countries represented'
                : 'by ownership control'
            "
          ></p>
          <VerticalBar
            v-if="amountDonut.data.length > 1"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              segmentShowStroke: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      fontColor: '#84BFD2',
                      fontStyle: 'bold',
                    },
                    grid: {
                      drawOnChartArea: false,
                      drawBorder: false,
                    },
                  },
                ],
                xAxes: [
                  {
                    grid: {
                      drawOnChartArea: false,
                      drawBorder: false,
                      display: true,
                    },
                    ticks: {
                      fontColor: '#84BFD2',
                      fontStyle: 'bold',
                    },
                  },
                ],
              },
            }"
            :chart-data="{
              labels: amountDonut.labels,
              datasets: [
                {
                  label: 'Project Totals',
                  backgroundColor: amountDonut.colors,
                  data: amountDonut.data,
                },
              ],
            }"
          />
        </div>
        <div class="w-1/2">
          <DoughnutChart
            v-if="amountDonut.data.length > 1"
            :styles="myStyles"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                animateRotate: true,
              },
            }"
            :chart-data="{
              labels: amountDonut.labels,
              datasets: [
                {
                  backgroundColor: amountDonut.colors,
                  data: amountDonut.data,
                },
              ],
            }"
          />
        </div>
      </div>

      <div
        class="
          flex
          justify-between
          items-center
          shadow
          bg-primary-100
          p-5
          my-2
          rounded
        "
      >
        <div class="w-1/2">
          <p
            class="text-primary-800 font-bold text-1xl"
            v-html="
              type == 'SpaceType'
                ? 'Primary space type'
                : type == 'Location'
                ? 'Countries represented'
                : 'Ownership control'
            "
          ></p>
          <p class="text-xs italic">by size</p>
          <VerticalBar
            v-if="sqftDonut.data.length > 1"
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
                    grid: {
                      drawOnChartArea: false,
                      drawBorder: false,
                    },
                  },
                ],
                xAxes: [
                  {
                    grid: {
                      drawOnChartArea: false,
                      drawBorder: false,
                      display: true,
                    },
                    ticks: {
                      fontColor: '#84BFD2',
                      fontStyle: 'bold',
                    },
                  },
                ],
              },
            }"
            :chart-data="{
              labels: sqftDonut.labels,
              datasets: [
                {
                  label: 'Project Totals',
                  backgroundColor: sqftDonut.colors,
                  data: sqftDonut.data,
                },
              ],
            }"
          />
        </div>
        <div class="w-1/2">
          <DoughnutChart
            v-if="sqftDonut.data.length > 1"
            chart-id="project-total-sqft"
            :styles="myStyles"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                animateRotate: true,
              },
            }"
            :chart-data="{
              labels: sqftDonut.labels,
              datasets: [
                {
                  backgroundColor: sqftDonut.colors,
                  data: sqftDonut.data,
                },
              ],
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    // --- target fields
    labels: {
      type: String,
      required: false,
      default: null,
    },
    amountSeries: {
      type: String,
      required: false,
      default: null,
    },
    sqftSeries: {
      type: String,
      required: false,
      default: null,
    },
    sqmSeries: {
      type: String,
      required: false,
      default: null,
    },
    colorSeries: {
      type: Array,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      spaceInfo: [],
    }
  },
  computed: {
    ...mapState('analyze', [
      'projectsByLocation',
      'projectsBySpaceType',
      'projectsByOwnershipType',
    ]),
    amountDonut() {
      const totals = this.sortProperties(this.amountSeries)
      const newTotals = {
        data: [],
        labels: [],
        colors: [],
      }
      for (const value of totals) {
        newTotals.labels.push(value.name)
        newTotals.data.push(value.data)
      }
      newTotals.colors = this.buildColors(newTotals)
      return newTotals
    },
    sqftDonut() {
      const totals = this.sortProperties(this.sqftSeries)

      const newTotals = {
        data: [],
        labels: [],
        colors: [],
      }
      for (const value of totals) {
        newTotals.labels.push(value.name)
        newTotals.data.push(value.data)
      }
      newTotals.colors = this.buildColors(newTotals)
      return newTotals
    },
    myStyles() {
      return {
        height: `250px`,
        position: 'relative',
      }
    },
  },
  methods: {
    checkLabelStrings(label) {
      const labelMapping = [
        { value: 'new-existing', text: 'Owner-occupied' },
        { value: 'non-cs', text: 'For sale/lease' },
        { value: 'cs', text: 'For sale/lease' },
        { value: 'cics', text: 'Tenancy' },
        { value: 'Dwelling Units', text: 'Residential' },
      ]
      const lbl = labelMapping.find((el) => {
        return label === el.value ? el.text : false
      })
      return lbl ? lbl.text : label
    },
    validatePropertyList(field) {
      const typeStr = 'projectsBy' + this.type
      const list = []

      if (this[typeStr]) {
        for (const type of this[typeStr]) {
          list.push({
            name: this.checkLabelStrings(type[this.labels]),
            data: parseInt(type[field]),
          })
        }

        // hijack count if we need to sum non-cs + cs ownershipTypes
        if (this.type === 'OwnershipType') {
          let count = 0
          const newList = []
          list.map((item) => {
            if (item.name === 'For sale/lease') {
              count += item.data
            } else {
              newList.push(item)
            }
            return newList
          })
          newList.push({ name: 'For sale/lease', data: count })
          return newList
        }
      }
      return list
    },
    sortProperties(field) {
      let properties = this.validatePropertyList(field)
      properties.sort((a, b) => a.data - b.data).reverse()
      if (properties.length > 9) {
        const formatted = properties.slice(0, 9)
        const remainder = properties.slice(9)
        formatted.push({
          name: 'Others',
          data: remainder.reduce((a, b) => a.data + b.data),
        })
        properties = formatted
      }
      return properties
    },
    hex2rgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
          ]
        : null
    },

    rgb2hex(rgb) {
      return (
        '#' +
        ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
          .toString(16)
          .slice(1)
      )
    },

    interpolateColor(color1, color2, factor) {
      if (arguments.length < 3) {
        factor = 0.5
      }

      const result = color1.slice()
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
      }

      return result
    },

    buildColorRange(count, s, e) {
      const start = s ? this.hex2rgb(s) : this.hex2rgb(this.defaultColorStart)
      const end = e ? this.hex2rgb(e) : this.hex2rgb(this.defaultColorEnd)
      const factorStep = 1 / (count - 1)
      const colorRange = []

      for (let i = 0; i < count; i++) {
        const icol = this.interpolateColor(start, end, factorStep * i)
        const hcol = this.rgb2hex(icol)

        colorRange.push(hcol)
      }

      return colorRange
    },

    buildColors(totals) {
      let colors = []
      colors =
        totals.labels.length > 1
          ? this.colorSeries
            ? this.buildColorRange(
                totals.labels.length,
                this.colorSeries[0],
                this.colorSeries[1]
              )
            : this.buildColorRange(totals.labels.length)
          : this.colorSeries
          ? this.colorSeries[0]
          : ['#095A6D']
      return colors
    },
  },
}
</script>
