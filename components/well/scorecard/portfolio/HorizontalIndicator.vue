<template>
  <div class="flex w-full bg-gray-50 h-2 rounded-full overflow-hidden shadow">
    <div
      class="h-2 transition-all duration-200"
      :style="{
        width: (yes / total) * 100 + '%',
        backgroundColor: colors[conceptName],
      }"
    ></div>
    <div
      class="h-2 bg-secondary-700 transition-all duration-200"
      :style="{ width: (maybe / total) * 100 + '%' }"
    ></div>
    <div
      class="h-2 bg-gray-300 transition-all duration-200"
      :style="{ width: (no / total) * 100 + '%' }"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    conceptName: {
      type: String,
      default: 'Air',
    },
    yes: {
      type: Number,
      default() {
        return 0
      },
    },
    maybe: {
      type: Number,
      default() {
        return 0
      },
    },
    no: {
      type: Number,
      default() {
        return 0
      },
    },
    total: {
      type: Number,
      default() {
        return 0
      },
    },
  },
  data() {
    return {
      colors: {
        Air: '#144249',
        Water: '#07667F',
        Nourishment: '#0B7B97',
        Light: '#3B9DB6',
        Movement: '#91CBD3',
        'Thermal Comfort': '#A7D6AD',
        Sound: '#63A984',
        Materials: '#40927D',
        Mind: '#2F6B5E',
        Community: '#23483D',
        Innovation: '#263d46',
        Innovations: '#263d46',
      },
    }
  },
  computed: {
    color() {
      return 'red'
    },
  },
}
</script>
