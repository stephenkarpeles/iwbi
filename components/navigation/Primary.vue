<template>
  <div class="bg-primary-900 absolute left-0 w-screen shadow">
    <div
      v-if="currentUser"
      :class="[
        expanded && canCollapse ? 'md:pr-4' : 'pr-4',
        'flex h-16 items-center justify-between relative shadow z-10',
      ]"
    >
      <div class="flex w-full">
        <div
          :class="[
            expanded || !canCollapse ? 'w-full md:w-64' : 'w-16',
            'flex items-center h-16 md:border-r md:border-b-2 border-primary-800 flex-shrink-0 px-4 bg-primary-900',
          ]"
        >
          <img
            :class="[
              expanded || !canCollapse ? 'block' : 'hidden',
              'h-8 w-auto',
            ]"
            src="/logo/light.svg"
            alt="Workflow"
            class="cursor-pointer"
            @click="$router.push('/')"
          />
          <svg
            v-if="canCollapse"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
            class="h-6 w-6 text-white ml-auto -scale-x-1 transform cursor-pointer"
            @click="toggleExpand"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            ></path>
          </svg>
        </div>

        <!-- Desktop menu -->

        <nav :class="['nav', 'relative', 'hidden', 'md:block']">
          <div
            class="dropdownBackground absolute flex justify-center mt-5 bg-white rounded-lg opacity-0"
          >
            <span
              :class="[
                'arrow',
                'absolute',
                'block',
                'bg-white',
                `arrow${currentTab}`,
              ]"
            ></span>
          </div>
          <ul
            class="navOptions h-full flex justify-center m-0 p-0 list-none relative"
          >
            <li
              v-for="(menuItem, index) in menu"
              :key="index"
              :class="[
                'cursor-default hover:bg-primary-800 text-white hover:font-bold transition-colors border-b-2 hover:border-primary-900 border-primary-800 h-full w-full px-6 relative flex justify-center',
                !currentUser.role.includes(menuItem.allowedRole) && 'hidden',
              ]"
              @mouseenter="mouseEnter($event, menuItem.label)"
              @mouseleave="mouseLeave($event)"
            >
              <div
                class="my-auto text-sm text-white hover:text-primary-200 cursor-pointer select-none pointer-events-none"
              >
                {{ menuItem.label }}
              </div>
              <div
                :class="[
                  `dropdown absolute opacity-0 overflow-hidden rounded-sm flex text-sm font-normal text-primary-900 my-2 -mt-5 pt-6 dropdown${menuItem.label} hidden`,
                ]"
              >
                <div
                  v-for="(item, i) in menuItem.subSections"
                  :key="i"
                  class="p-4 whitespace-nowrap"
                >
                  <div
                    class="my-auto opacity-50 text-sm font-semibold uppercase mb-4 mx-1"
                  >
                    {{ item.label }}
                  </div>

                  <div
                    v-for="(subItem, subIndex) in item.items"
                    :key="subIndex"
                    class="text-primary-900 w-full mb-1"
                  >
                    <div
                      v-if="
                        subItem.allowedRole == null ||
                        currentUser.role.includes(subItem.allowedRole)
                      "
                    >
                      <WLinksBase
                        v-if="subItem.target && subItem.target === '_blank'"
                        target="_blank"
                        type="navPrimary"
                        :link="subItem.link"
                        :icon="subItem.icon"
                      >
                        {{ subItem.label }}
                      </WLinksBase>
                      <WButtonsBase
                        v-else
                        type="navPrimary"
                        :icon="subItem.icon"
                        @click.native="
                          $router.push(subItem.link), ($parent.isActive = false)
                        "
                      >
                        {{ subItem.label }}
                      </WButtonsBase>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <!-- Profile dropdown -->
      <div
        v-if="currentUser"
        class="hidden md:flex relative h-full items-center"
      >
        <Popover :animated="true" x="left">
          <button
            id="user-menu"
            class="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline"
            aria-label="User menu"
            aria-haspopup="true"
          >
            <div
              class="h-8 w-8 rounded-full bg-cover overflow-hidden"
              style="background-image: url('/profile/avatar.jpg')"
            >
              <img
                class="rounded-full"
                :src="$store.state.user.currentUser.profile_pic"
                alt=""
              />
            </div>
          </button>
          <template #content>
            <NavProfileDropDown />
          </template>
        </Popover>
        <div
          class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
        >
          <div
            class="py-1 rounded-md bg-white shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              role="menuitem"
              >Your Profile</a
            >

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              role="menuitem"
              >Settings</a
            >

            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              role="menuitem"
              @click="logOut"
              >Sign out</a
            >
          </div>
        </div>
      </div>
      <!-- mobile menu button -->
      <WIconsBase
        :icon="!mobileToggleExpand ? 'menu' : 'x'"
        :class="[
          expanded && canCollapse ? 'hidden' : 'block',
          'md:hidden text-white cursor-pointer w-6 h-6',
        ]"
        @click.native="mobileToggleExpand = !mobileToggleExpand"
      />
    </div>
    <!-- mobile menu -->
    <div
      v-if="currentUser"
      :class="[
        mobileToggleExpand
          ? 'h-screen pb-20 overflow-y-scroll pt-2'
          : 'h-0 overflow-hidden',
        'md:hidden  transition-height duration-300',
      ]"
    >
      <div v-for="(item, index) in menu" :key="index">
        <div
          v-if="currentUser.role.includes(item.allowedRole)"
          class="border-b border-primary-800"
        >
          <WButtonsExpandable :expanded="item.expanded" class="pl-2">
            <WButtonsBase
              type="nav"
              class="font-semibold text-primary-200 uppercase"
            >
              {{ item.label }}
            </WButtonsBase>

            <template #buttons>
              <div class="mb-2">
                <div
                  v-for="(label, sub_index) in item.subSections"
                  :key="sub_index"
                  class="text-primary-500 text-sm font-semibold mb-3"
                >
                  {{ label.label }}
                  <div
                    v-for="(sub_item, item_index) in label.items"
                    :key="item_index"
                    class="my-2"
                  >
                    <div
                      v-if="
                        sub_item.allowedRole == null ||
                        currentUser.role.includes(sub_item.allowedRole)
                      "
                    >
                      <WLinksBase
                        v-if="sub_item.target && sub_item.target === '_blank'"
                        target="_blank"
                        type="navPrimary"
                        :link="sub_item.link"
                        :icon="sub_item.icon"
                        @click.native="mobileToggleExpand = !mobileToggleExpand"
                      >
                        {{ sub_item.label }}
                      </WLinksBase>
                      <WButtonsBase
                        v-else
                        type="navPrimary"
                        :icon="sub_item.icon"
                        @click.native="
                          $router.push(sub_item.link),
                            ($parent.isActive = false),
                            (mobileToggleExpand = !mobileToggleExpand)
                        "
                      >
                        {{ sub_item.label }}
                      </WButtonsBase>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </WButtonsExpandable>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex items-center px-4">
          <div
            class="h-8 w-8 rounded-full bg-cover overflow-hidden flex-shrink-0"
            style="background-image: url('/profile/avatar.jpg')"
          >
            <img class="rounded-full" :src="currentUser.profile_pic" alt="" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-primary-200">
              {{ currentUser.full_name }}
            </div>
            <div class="text-sm font-medium text-primary-500">
              {{ currentUser.email }}
            </div>
          </div>
        </div>
        <div
          class="mt-2 px-4 space-y-1 font-medium px-3 text-primary-300 text-sm"
        >
          <WLinksBase
            v-for="(option, index) in profileOption"
            :key="index"
            type="navProfile"
            :link="option.url"
            @click="$parent.isActive = false"
            >{{ option.label }}</WLinksBase
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    canCollapse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      mobileToggleExpand: false,
      currentTab: null,
      isOpen: false,
      profileOption: [
        {
          label: 'Profile',
          url: '/user/profile',
        },
        {
          label: 'My Membership',
          url: '/membership',
        },
        {
          label: 'My Alternatives',
          url: '/alternatives',
        },
        {
          label: 'Logout',
          url: '/logout',
        },
      ],
      menu: [
        {
          label: 'Admin',
          allowedRole: 'well-admin',
          expanded: false,
          subSections: [
            {
              label: 'Enrollments',
              items: [
                {
                  label: 'WELL Certification',
                  link: '/well-admin/projects/',
                  icon: 'office-building',
                },
                {
                  label: 'WELL Health-Safety',
                  link: '/well-admin/shared-workspaces/',
                  icon: 'library',
                },
                {
                  label: 'WELL Performance',
                  link: '/well-admin/wpr/',
                  icon: 'chart-square-bar',
                },
                {
                  label: 'WELL Portfolio',
                  link: '/well-admin/portfolios/',
                  icon: 'globe',
                },
              ],
            },
            {
              label: 'People',
              items: [
                {
                  label: 'Users',
                  link: '/well-admin/users/',
                  icon: 'users',
                },
                {
                  label: 'Membership',
                  link: '/well-admin/membership/',
                  icon: 'users',
                },
                {
                  label: 'WELL Faculty',
                  link: '/well-admin/faculty/',
                  icon: 'cube-transparent',
                },
                {
                  label: 'Exams',
                  link: '/well-admin/exams/',
                  icon: 'book-open',
                },
                {
                  label: 'Credentials',
                  link: '/well-admin/credentials/',
                  icon: 'folder',
                },
              ],
            },
            {
              label: 'Finance',
              items: [
                {
                  label: 'Estimates',
                  link: '/well-admin/estimates/',
                  icon: 'calculator',
                },
                {
                  label: 'Invoices',
                  link: '/well-admin/invoices/',
                  icon: 'receipt-tax',
                },
              ],
            },
            {
              label: 'Tools',
              items: [
                {
                  allowedRole: 'well-admin',
                  label: 'Message Center',
                  link: '/message/center',
                  icon: 'mail',
                },
                {
                  label: 'Alternatives',
                  link: '/well-admin/alternatives/',
                  icon: 'view-grid',
                },
                {
                  label: 'Innovations',
                  link: '/well-admin/innovations/',
                  icon: 'light-bulb',
                },
              ],
            },
            {
              label: 'Demo',
              items: [
                {
                  label: 'Mock Portfolio',
                  link: '/well-admin/demo/mock-portfolio',
                  icon: 'presentation-chart-line',
                },
              ],
            },
          ],
        },
        {
          label: 'Projects',

          allowedRole: 'authenticated-user',
          expanded: true,
          subSections: [
            {
              label: 'Enrollments',
              items: [
                {
                  label: 'WELL Certification',
                  link: '/projects/list/',
                  icon: 'office-building',
                },
                {
                  label: 'WELL Health-Safety',
                  link: '/shared-workspaces',
                  icon: 'library',
                },
                {
                  label: 'WELL Performance',
                  link: '/wpr/',
                  icon: 'chart-square-bar',
                },
                {
                  label: 'WELL Portfolio',
                  link: '/portfolio/list',
                  icon: 'globe',
                },
                {
                  label: 'WELL Community',
                  link: '/projects/v1/list/',
                  icon: 'houses',
                },
              ],
            },
          ],
        },
        {
          label: 'Training',

          allowedRole: 'authenticated-user',
          expanded: false,
          subSections: [
            {
              label: 'Professional Development',
              items: [
                {
                  label: 'WELL AP',
                  link: '/well-ap/',
                  icon: 'academic-cap',
                },
                {
                  label: 'WELL Faculty',
                  link: '/well-faculty/',
                  icon: 'cube-transparent',
                },
                {
                  label: 'Performance Testing',
                  link: 'https://www.wellcertified.com/performance-testing',
                  icon: 'user',
                  target: '_blank',
                },
              ],
            },
            {
              label: 'Education',
              items: [
                {
                  label: 'Courses',
                  link: '/education-courses/',
                  icon: 'book-open',
                },
                {
                  label: 'Webcasts',
                  link: 'https://resources.wellcertified.com/webcasts',
                  icon: 'presentation-chart-line',
                  target: '_blank',
                },
              ],
            },
          ],
        },
        {
          label: 'Resources',

          allowedRole: 'authenticated-user',
          expanded: false,
          subSections: [
            {
              label: 'Get Help',
              items: [
                {
                  label: 'Knowledge Base',
                  link: 'http://well.support/',
                  icon: 'book-open',
                  target: '_blank',
                },
                {
                  label: 'Project Tools',
                  link: 'https://resources.wellcertified.com/',
                  icon: 'view-grid',
                  target: '_blank',
                },
                {
                  label: 'FAQ',
                  link: 'https://resources.wellcertified.com/?type=faqs',
                  icon: 'question-mark-circle',
                  target: '_blank',
                },
              ],
            },
            {
              label: 'Learn More',
              items: [
                {
                  label: 'WELL Standards',
                  link: 'https://v2.wellcertified.com/',
                  icon: 'cube-transparent',
                  target: '_blank',
                },
                {
                  label: 'COVID-19 and Global Health',
                  link: 'https://www.wellcertified.com/powerofplace/',
                  icon: 'information-circle-small',
                  target: '_blank',
                },
                {
                  label: 'Investing for Health',
                  link: 'https://www.wellcertified.com/investingforhealth',
                  icon: 'receipt-tax',
                  target: '_blank',
                },
                {
                  label: 'Award Programs',
                  link: 'https://well.support/aa2d59e7-6db8-420d-9c51-2b10515d5968',
                  icon: 'academic-cap',
                  target: '_blank',
                },
              ],
            },
            {
              label: 'Stay Connected',
              items: [
                {
                  label: 'Articles',
                  link: 'https://resources.wellcertified.com/articles/',
                  icon: 'book-open',
                  target: '_blank',
                },
                {
                  label: 'Press Releases',
                  link: 'https://resources.wellcertified.com/?type=press-releases',
                  icon: 'bolt',
                  target: '_blank',
                },
                {
                  label: 'Events',
                  link: 'https://resources.wellcertified.com/events',
                  icon: 'desktop-computer',
                  target: '_blank',
                },
              ],
            },
            {
              label: 'Directories',
              items: [
                {
                  label: 'Users',
                  link: '/directories/users/',
                  icon: 'user-groups',
                },
                {
                  label: 'Organizations',
                  link: '/directories/organizations/',
                  icon: 'office-building',
                },
                {
                  label: 'Projects',
                  link: '/directories/projects/',
                  icon: 'location-marker',
                },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }

      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }

      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
  },
  watch: {
    $route(to, from) {
      this.mobileToggleExpand = false
    },
  },
  mounted() {
    this.$nextTick(() => {
      const uA = navigator.userAgent
      const vendor = navigator.vendor
      const dropdown = document.querySelector('.dropdown')
      // Checks for safari browser if true applies a margin class to dropdown container
      if (
        /Safari/i.test(uA) &&
        /Apple Computer/.test(vendor) &&
        !/Mobi|Android/i.test(uA)
      ) {
        setTimeout(() => dropdown.classList.add('dropdownSafari'), 150)
      }
      if (this.currentUser && this.currentUser.role.includes('well-pta')) {
        const menuIndex = this.menu.findIndex((a) => a.label === 'Training')
        this.menu[menuIndex].subSections[0].items[2].link = '/pt-agents/'
        this.menu[menuIndex].subSections[0].items[2].target = ''
      }
    })
  },
  methods: {
    async logOut() {
      await this.$router.push('/logout')
    },
    toggleExpand() {
      let currentState = this.$store.state.settings.navExpanded
      if (currentState === 'false' || currentState === null) {
        currentState = false
      }

      if (currentState === 'true') {
        currentState = true
      }
      this.$store.commit('settings/setNavState', !currentState)
    },
    mouseEnter($event, itemLabel) {
      const nav = document.querySelector('.nav')
      const currentTarget = $event.target
      const background = document.querySelector('.dropdownBackground')
      const dropdown = currentTarget.querySelector('.dropdown')
      this.currentTab = itemLabel

      currentTarget.classList.add('trigger-enter')

      const dropdownCoords = dropdown.getBoundingClientRect()
      const navCoords = nav.getBoundingClientRect()

      const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top - navCoords.top,
        left: dropdownCoords.left - navCoords.left,
      }

      background.style.setProperty('width', `${coords.width}px`)
      background.style.setProperty('height', `${coords.height}px`)
      background.style.setProperty(
        'transform',
        `translate(${coords.left}px, ${coords.top}px)`
      )

      setTimeout(
        () =>
          currentTarget.classList.contains('trigger-enter') &&
          currentTarget.classList.add('trigger-enter-active'),
        150
      )
      background.classList.add('open')
    },
    mouseLeave($event) {
      const currentTarget = $event.target
      const background = document.querySelector('.dropdownBackground')
      currentTarget.classList.remove('trigger-enter', 'trigger-enter-active')
      background.style.setProperty('height', '0px')
      background.style.setProperty('width', '0px')
      background.classList.remove('open')
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown {
  top: -20px;
  transition: all 0.5s;
  transform: translateY(100px);
  will-change: opacity;
  &.dropdownAdmin {
    margin-left: 215px;
  }
  // &.dropdownResources {
  //   margin-left: -450px;
  // }
  &.dropdownSafari {
    &.dropdownAdmin {
      margin-left: 108px;
    }
    // &.dropdownResources {
    //   margin-left: -225px;
    // }
  }
  // &.dropdownSafari {
  //   &.dropdownResources {
  //     margin-left: -225px;
  //   }
  // }
}

.dropdownBackground {
  width: 0px;
  height: 0px;
  left: 0;
  box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
    0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s, opacity 0.1s, transform 0.2s;
  transform-origin: 50% 0;
  transform: translate(0px, 60px);
  -webkit-transform: translate(0px, 60px);
  &.open {
    opacity: 1;
  }
  .arrow {
    width: 20px;
    height: 20px;
    transform: translateY(-50%) rotate(45deg);
    -webkit-transform: translateY(-50%) rotate(45deg);

    &.arrowAdmin {
      left: 270px;
    }
  }
}
.trigger-enter .dropdown {
  display: flex;
}
.trigger-enter-active .dropdown {
  opacity: 1;
}
</style>
