<template>
  <div class="w-full">
    <div
      :class="[
        bgStyle,
        'flex items-center shadow-lg rounded-xl relative w-full pt-6 pb-10 md:py-0 border md:border-0',
      ]"
    >
      <div
        :class="[
          'md:h-80 bg-gray-200 w-full overflow-hidden rounded-lg hidden md:block',
        ]"
      >
        <img
          class="object-cover h-full w-full"
          :src="slides[currentIndex].bgImg"
          alt=""
        />
      </div>
      <div
        v-if="slides.length > 1"
        id="controls"
        class="absolute w-full h-full pointer-events-none"
      >
        <div
          class="
            absolute
            w-full
            flex
            bottom-0
            md:bottom-1
            pointer-events-auto
            md:pb-3
          "
        >
          <div class="mx-auto">
            <span
              v-for="(slide, index) in slides"
              :key="index"
              :class="[
                currentIndex === index && 'bg-opacity-100',
                'h-2 cursor-pointer w-2 rounded-full bg-primary-400 bg-opacity-50 hover:bg-opacity-100 inline-block ml-1 active:bg-primary-200',
              ]"
              @click="currentIndex = index"
            ></span>
          </div>
        </div>
        <div
          class="
            h-10
            flex
            justify-between
            z-10
            absolute
            items-center
            pin-center
            w-full
          "
        >
          <WButtonsBase
            icon="left-chevron"
            type="blank"
            class="
              flex
              text-base
              font-semibold
              text-primary-600
              bg-primary-200
              w-8
              h-8
              rounded-r-lg
              pointer-events-auto
            "
            @click.native="prev"
          >
          </WButtonsBase>

          <WButtonsBase
            icon="right-chevron"
            type="blank"
            class="
              flex
              text-base
              font-semibold
              text-primary-600
              bg-primary-200
              w-8
              h-8
              rounded-l-lg
              pointer-events-auto
            "
            @click.native="next"
          >
          </WButtonsBase>
        </div>
      </div>
      <div
        v-if="slides[currentIndex].description"
        id="content"
        class="md:absolute flex flex-col items-start px-10 max-w-md"
      >
        <span id="preTitle" class="uppercase text-sm text-primary-600">{{
          slides[currentIndex].preTitle
        }}</span>
        <span id="title" class="text-xl">{{ slides[currentIndex].title }}</span>
        <span
          id="description"
          class="text-base text-gray-400 mt-2"
          v-html="slides[currentIndex].description"
        ></span>
        <span v-if="slides[currentIndex].button" class="mt-2">
          <a
            v-if="slides[currentIndex].button.actionType === 'external'"
            :href="slides[currentIndex].button.url"
            target="_blank"
          >
            <WButtonsBase class="px-5">{{
              slides[currentIndex].button.text
            }}</WButtonsBase>
          </a>
          <WButtonsBase
            v-else
            class="px-5"
            @click.native="$router.push(slides[currentIndex].button.url)"
            >{{ slides[currentIndex].button.text }}</WButtonsBase
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    slides: {
      type: Array,
      required: false,
      default: null,
    },
    bgStyle: {
      type: String,
      required: false,
      default: 'bg-cover',
    },
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  methods: {
    next() {
      this.currentIndex++
      if (this.currentIndex > this.slides.length - 1) {
        this.currentIndex = 0
      }
    },
    prev() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.slides.length - 1
      }
    },
  },
}
</script>
