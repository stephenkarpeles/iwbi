<template>
  <div class="overflow-y-scroll h-screen">
    <div>
      <div class="flex">
        <img
          class="w-full"
          :src="$config.assetsURL + 'explore/building_main.png'"
          alt=""
        />
      </div>
      <div class="border-b border-primary-300 p-5">
        <span class="text-primary-900 font-semibold">IWBI - Office Space</span>
        <div class="flex">
          <WIconsBase icon="location-marker" class="text-secondary-700" />
          <span class="text-sm text-primary-600"
            >5th Ave, Suite 212 New York City, USA</span
          >
        </div>
        <div class="flex space-x-2 mt-2 text-sm">
          <div class="text-primary-900">
            <span class="uppercase opacity-60">sq. ft. </span>
            <span>809.809.00</span>
          </div>
          <div
            class="text-primary-900 border-l border-r border-primary-300 px-2"
          >
            <span class="uppercase opacity-60">OCCUPANTS</span>
            <span>234</span>
          </div>
          <div class="text-primary-900">
            <span class="uppercase opacity-60">id</span>
            <span class="p-2 rounded-md bg-gray-200">2024</span>
          </div>
        </div>
      </div>
      <div class="text-primary-900 bg-gray-50 flex flex-col p-5">
        <span class="text-lg font-semibold mt-3">
          This location is WELL Health-Safety Rated
        </span>
        <span class="opacity-60 text-sm mt-2">
          From handwashing support and cleaning practices to health services and
          air and water quality monitoring protocols, this facility has been
          comprehensively reviewed and rated to help support the health and
          safety of everyone who walks through the door.
        </span>
        <WButtonsBase class="mt-4"
          >Learn More about WELL Health Safety</WButtonsBase
        >
        <div class="w-full flex justify-center my-16">
          <img
            class="w-40"
            :src="$config.assetsURL + 'explore/holdersq.png'"
            alt=""
          />
        </div>
        <div class="flex flex-col p-5">
          <span class="text-primary-900 text-lg mx-auto font-semibold"
            >How we’ve achieved it.</span
          >
          <span class="text-sm text-primary-900 opacity-60 mt-2"
            >From handwashing support and cleaning practices to health services
            and air and water quality monitoring protocols, this facility has
            been comprehensively reviewed and rated to help support the health
            and safety of everyone who walks through the door.
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 p-5 mt-3">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex space-x-2 items-center"
          >
            <div
              :style="{ background: `${category.bg}` }"
              class="
                content-center
                flex flex-wrap
                h-10
                justify-center
                rounded-md
                text-white
                w-10
              "
            >
              {{ category.value }}
            </div>
            <span class="text-primary-800">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { name: 'Air', bg: '#41607b', value: 7 },
        { name: 'Sound', bg: '#B9D8AB', value: 11 },
        { name: 'Water', bg: '#517995', value: 7 },
        { name: 'Materials', bg: '#85AC89', value: 11 },
        { name: 'Light', bg: '#74A0B4', value: 9 },
        { name: 'Mind', bg: '#67927C', value: 7 },
        { name: 'Nourishment', bg: '#ADD0CF', value: 12 },
        { name: 'Nourishment', bg: '#4A675D', value: 7 },
        { name: 'Movement', bg: '#ADD0CF', value: 8 },
        { name: 'Innovation', bg: '#599BB3', value: 7 },
        { name: 'Thermal Comfort', bg: '#B9D8AB', value: 7 },
      ],
    }
  },
}
</script>
