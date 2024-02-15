<template>
  <div class="w-full">
    <div class="h-full flex flex-col bg-white">
      <div class="divide-gray-200 divide-y rounded-md shadow-md">
        <div class="pb-6">
          <div
            class="h-24 sm:h-20 lg:h-28 bg-cover bg-center rounded-t-md"
            :style="{ backgroundImage: `url('/profile/bg-well.png')` }"
          ></div>
          <div
            class="
              -mt-12
              relative
              flow-root
              px-4
              space-y-6
              sm:-mt-8 sm:flex sm:items-end sm:px-6
              lg:-mt-15
            "
          >
            <div class="absolute right-0 bottom-0 -mt-7 flex mb-10 space-x-4">
              <div class="flex pr-10 space-x-4">
                <!-- Award badges -->
                <img
                  v-if="user.well_advisory"
                  src="/profile/well-advisory.png"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />
                <!-- Previously Removed WELL AP until a 2021 badge wass created ::: Adding back upon requeest -->
                <img
                  v-if="user.well_ap && user.well_ap === 1"
                  src="/profile/badges/well-ap.svg"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />

                <!-- 2021 GB Award badges -->
                <img
                  v-if="
                    user.gb_award && user.gb_award === 'well-ap-of-the-year'
                  "
                  src="/profile/badges/badges-2021/well-ap.png"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />
                <img
                  v-if="user.gb_award && user.gb_award === 'well-advisor'"
                  src="/profile/badges/badges-2021/well-advisor.png"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />
                <img
                  v-if="user.gb_award && user.gb_award === 'well-portfolio'"
                  src="/profile/badges/badges-2021/well-portfolio.png"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />
                <!-- Temporarily removing well faculty badge as it it more of a status rather than an award -->
                <img
                  v-if="user.gb_award && user.gb_award === 'well-faculty'"
                  src="/profile/badges/badges-2021/well-faculty.png"
                  class="py-1 h-20 w-20 my-auto mx-auto rounded-full shadow-md"
                />
              </div>
            </div>
            <div>
              <div class="-m-1 flex">
                <div
                  class="
                    inline-flex
                    rounded-full
                    overflow-hidden
                    border-4
                    shadow
                    border-white
                  "
                  style="background-image: url('/profile/avatar.jpg')"
                >
                  <div
                    class="
                      flex-shrink-0
                      h-24
                      w-24
                      sm:h-40 sm:w-40
                      lg:w-48 lg:h-48
                      bg-cover bg-center
                    "
                    :style="[
                      user.profile_pic
                        ? {
                            backgroundImage: 'url(' + user.profile_pic + ')',
                          }
                        : { backgroundImage: 'url(/profile/avatar.jpg)' },
                    ]"
                  ></div>
                </div>
              </div>
            </div>
            <div class="-ml-10 space-y-5 sm:flex-1 py-5">
              <div class="ml-16 -mb-4">
                <div class="flex items-center space-x-2.5">
                  <h3
                    class="
                      font-bold
                      text-xl
                      leading-7
                      text-primary-900
                      sm:text-2xl sm:leading-8
                    "
                  >
                    {{ user.full_name }}
                  </h3>
                </div>
                <p class="text-sm leading-5 text-primary-400">
                  {{ user.job_title }}
                </p>
              </div>
              <div class="flex flex-wrap border-b relative ml-1">
                <WTabsHorizontal
                  ref="tabs"
                  v-model="currentTab"
                  class="w-96 -mb-px"
                  alignment="justify-around"
                  :tabs="[
                    { name: 'About', icon: 'identification' },
                    { name: 'Contact', icon: 'mail' },
                  ]"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="
            px-4
            py-5
            sm:px-0 sm:py-0
            w-4/5
            border
            rounded-lg
            shadow-lg
            m-5
            mx-auto
            mb-16
          "
          :class="{ hidden: currentTab !== 'About' }"
        >
          <dl class="space-y-8 sm:space-y-0">
            <div
              v-if="user.about"
              class="
                sm:flex sm:space-x-6 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                About me
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="user.about"> </span>
              </dd>
            </div>
            <div
              v-if="user.inspiration"
              class="sm:flex sm:space-x-6 sm:px-6 sm:py-5"
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Why I joined the WELL community
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="user.inspiration"> </span>
              </dd>
            </div>
            <div
              v-if="user.wellness_mean"
              class="
                sm:flex
                sm:space-x-6
                sm:border-t
                sm:border-gray-200
                sm:px-6
                sm:py-5
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                What wellness means to me
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="user.wellness_mean"> </span>
              </dd>
            </div>
            <div
              v-if="user.industry"
              class="
                sm:flex
                sm:space-x-6
                sm:border-t
                sm:border-gray-200
                sm:px-6
                sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Industry
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="user.industry"> </span>
              </dd>
            </div>
            <div
              v-if="user.languages"
              class="
                sm:flex sm:space-x-6 sm:border-gray-200 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Languages
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <span v-for="(language, index) in user.languages" :key="index">
                  {{ language
                  }}<span v-if="index < user.languages.length - 1"> , </span>
                </span>
              </dd>
            </div>
            <div
              v-if="user.languages"
              class="
                sm:flex sm:space-x-6 sm:border-gray-200 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Socials
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <div class="flex space-x-2">
                  <WLinksBase
                    v-if="user.linkedin"
                    :link="user.linkedin"
                    target="_blank"
                    icon="linkedin"
                  />
                  <WLinksBase
                    v-if="user.twitter"
                    :link="user.twitter"
                    target="_blank"
                    icon="twitter"
                  />
                  <WLinksBase
                    v-if="user.facebook"
                    :link="user.facebook"
                    target="_blank"
                    icon="facebook"
                  />
                </div>
              </dd>
            </div>
          </dl>
        </div>
        <div
          class="
            px-4
            py-5
            sm:px-0 sm:py-0
            w-4/5
            border
            rounded-lg
            shadow-lg
            m-5
            mx-auto
            mb-16
          "
          :class="{ hidden: currentTab !== 'Contact' }"
        >
          <dl class="space-y-8 sm:space-y-0">
            <div
              v-if="user.addresses[1] && user.addresses[1].country_code"
              class="
                sm:flex sm:space-x-6 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Billing Address
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <span>
                  {{ user.addresses[1].street }}, {{ user.addresses[1].city }},
                  {{ user.addresses[1].country_code }}
                </span>
              </dd>
            </div>
            <div
              v-if="user.website"
              class="
                sm:flex sm:space-x-6 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Website
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <WLinksBase
                  v-if="user.website"
                  :link="user.website"
                  target="_blank"
                >
                  {{ user.website }}
                </WLinksBase>
              </dd>
            </div>
            <div
              v-if="user.phone_number"
              class="
                sm:flex sm:space-x-6 sm:px-6 sm:py-5
                border-b border-gray-200
              "
            >
              <dt
                class="
                  text-sm
                  leading-5
                  font-semibold
                  text-primary-600
                  sm:w-40 sm:flex-shrink-0
                  lg:w-60
                "
              >
                Phone
              </dt>
              <dd
                class="
                  mt-1
                  text-sm
                  leading-5
                  text-gray-900
                  sm:mt-0 sm:col-span-2
                "
              >
                <span>
                  {{ user.phone_number }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'About',
    }
  },
}
</script>
