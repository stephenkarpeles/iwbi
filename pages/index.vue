<template>
  <div>
    <div class="lg:flex lg:space-x-4">
      <div class="w-full lg:w-2/3">
        <WHeadingsHTwo
          heading="Dashboard"
          class="text-primary-800 mb-2 sm:mb-2 -mt-2"
        />
        <div
          class="md:h-80 bg-cover bg-center rounded-lg shadow-lg p-6 md:p-12"
          :style="{
            backgroundImage: `url('/dashboard/banner.jpg')`,
          }"
        >
          <WHeadingsHFour
            heading="WELL HEALTH-SAFETY RATING"
            class="text-primary-200 -mb-2"
          />
          <WHeadingsHThree
            heading="Start your health and safety journey"
            class="text-white"
          />
          <div class="text-primary-200 max-w-md">
            Prioritize health and safety in a post-COVID-19 world and beyond
            with the third-party verified WELL Health-Safety Rating for Facility
            Operations and Management.
          </div>
          <div class="flex space-x-6 mt-2">
            <div class="w-32 mt-2">
              <WButtonsBase @click.native="$router.push('/shared-workspaces/')">
                Enroll now
              </WButtonsBase>
            </div>
            <div class="w-32 mt-3.5">
              <WLinksBase
                link="https://www.wellcertified.com/health-safety/"
                target="_blank"
                type="primary"
              >
                Learn more
              </WLinksBase>
            </div>
          </div>
        </div>
        <WHeadingsHThree
          heading="Explore more programs"
          class="text-primary-800 mt-6"
        />
        <div class="md:grid grid-cols-3 gap-x-2 space-y-2 md:space-y-0">
          <li
            class="cursor-pointer col-span-1 flex shadow-sm rounded-md"
            @click="$router.push('/projects/v2/landing')"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center border-t border-l border-b border-gray-200 w-16 bg-secondary-200 text-white text-sm font-medium rounded-l-md"
            >
              <WIconsBase type="secondary" icon="chart-pie" />
            </div>
            <div
              class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <a
                  href="#"
                  class="text-primary-700 font-bold hover:text-gray-600"
                >
                  WELL Certification
                </a>
                <p class="text-primary-500">Start a project</p>
              </div>
            </div>
          </li>
          <li
            class="cursor-pointer col-span-1 flex shadow-sm rounded-md"
            @click="$router.push('/portfolio/list')"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center border-t border-l border-b border-gray-200 w-16 bg-secondary-200 text-white text-sm font-medium rounded-l-md"
            >
              <WIconsBase type="secondary" icon="briefcase" />
            </div>
            <div
              class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <a
                  href="#"
                  class="text-primary-700 font-bold hover:text-gray-600"
                >
                  WELL Portfolio
                </a>
                <p class="text-primary-500">Start a portfolio</p>
              </div>
            </div>
          </li>
          <li
            class="cursor-pointer col-span-1 flex shadow-sm rounded-md"
            @click="$router.push('/membership/')"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center border-t border-l border-b border-gray-200 w-16 bg-secondary-200 text-white text-sm font-medium rounded-l-md"
            >
              <WIconsBase type="secondary" icon="user-group" />
            </div>
            <div
              class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
            >
              <div class="flex-1 px-4 py-2 text-sm truncate">
                <a
                  href="#"
                  class="text-primary-700 font-bold hover:text-gray-600"
                >
                  IWBI Membership
                </a>
                <p class="text-primary-500">Access your benefits</p>
              </div>
            </div>
          </li>
        </div>
        <div
          class="p-4 md:p-6 bg-primary-100 rounded-lg mt-6 md:mt-4 shadow-lg border border-primary-200"
        >
          <h4 class="text-lg font-semibold mt-4 mb-1 text-primary-900">
            Get involved
          </h4>
          <div class="text-gray-400">
            Learn how IWBI is leading the movement for people first places
          </div>
          <hr class="mt-2" />
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 md:gap-y-16 pt-8"
          >
            <div class="border bg-white rounded-lg">
              <div>
                <img
                  src="/shared-workspace/roadmap-resource.png"
                  class="w-full rounded-t-md"
                />
              </div>
              <div class="p-4">
                <div class="font-bold text-primary-900"></div>
                <div class="text-primary-600 font-medium"></div>
                <div class="mt-4 text-sm text-primary-900"><span></span></div>
                <div>
                  <div>
                    <div>
                      <span
                        class="text-sm font-semibold text-primary-900 text-opacity-50"
                      >
                        Aug 30,2021
                      </span>
                      <p class="text-base font-semibold text-primary-900">
                        WELL Health-Safety Roadmap Tool
                      </p>
                      <p
                        class="text-sm font-normal text-primary-900 text-opacity-50"
                      >
                        A self-evaluation tool that could help you better plan
                        the alternatives you would pursue
                      </p>
                      <a
                        href="/shared-workspaces/roadmap"
                        target="_blank"
                        class="text-sm font-normal text-primary-600"
                        >See More</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border bg-white rounded-lg shadow-md shadow-none">
              <div>
                <img
                  src="/dashboard/investing-for-health.jpg"
                  class="w-full rounded-t-md"
                />
              </div>
              <div class="p-4">
                <div class="font-bold text-primary-900"></div>
                <div class="text-primary-600 font-medium"></div>
                <div class="mt-4 text-sm text-primary-900"><span></span></div>
                <div>
                  <div>
                    <div>
                      <span
                        class="text-sm font-semibold text-primary-900 text-opacity-50"
                      >
                        Mar 16, 2020
                      </span>
                      <p class="text-base font-semibold text-primary-900">
                        Investing for Health
                      </p>
                      <p
                        class="text-sm font-normal text-primary-900 text-opacity-50"
                      >
                        WELL is strengthening investment strategy by driving
                        organizational excellence and supporting ESG
                        performance.
                      </p>
                      <a
                        href="https://resources.wellcertified.com/tools/driving-better-investment-decisions/"
                        target="_blank"
                        class="text-sm font-normal text-primary-600"
                        >See More</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border bg-white rounded-lg shadow-md shadow-none">
              <div>
                <img
                  src="/dashboard/global-research-agenda.jpg"
                  class="w-full rounded-t-md"
                />
              </div>
              <div class="p-4">
                <div class="font-bold text-primary-900"></div>
                <div class="text-primary-600 font-medium"></div>
                <div class="mt-4 text-sm text-primary-900"><span></span></div>
                <div>
                  <div>
                    <div>
                      <span
                        class="text-sm font-semibold text-primary-900 text-opacity-50"
                        >Feb 17, 2021</span
                      >
                      <p class="text-base font-semibold text-primary-900">
                        Global Research Agenda
                      </p>
                      <p
                        class="text-sm font-normal text-primary-900 text-opacity-50"
                      >
                        The spaces we create and inhabit are intimately and
                        inextricably connected to human health.
                      </p>
                      <a
                        href="https://resources.wellcertified.com/articles/translating-research-into-practice-a-blueprint-for-a-healthier-world"
                        target="_blank"
                        class="text-sm font-normal text-primary-600"
                        >See More</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 md:mt-4 lg:mt-0 w-full lg:w-1/3 space-y-6">
        <div
          class="bg-cover bg-center rounded-lg shadow-lg p-4 md:py-12 md:px-6 border border-primary-200 md:flex lg:block items-center justify-between"
          :style="{
            backgroundImage: `url('/dashboard/advance-your-career.jpg')`,
          }"
        >
          <div>
            <WHeadingsHFour heading="WELL AP" class="text-primary-500 -mb-2" />
            <WHeadingsHThree
              heading="Advance your career"
              class="text-primary-800"
            />
            <div class="text-primary-700 max-w-md text-sm">
              Explore how the WELL AP credential can help you tap into new
              opportunities and advocate for alternatives to improve health for
              your organization, family, friends and community in this new
              normal.
            </div>
          </div>
          <div>
            <div class="mt-2">
              <WButtonsBase
                v-if="currentUser.well_ap === 1"
                type="primary"
                @click.native="$router.push('/well-ap/credentials')"
              >
                Manage credential
              </WButtonsBase>
              <WButtonsBase
                v-else
                type="primary"
                @click.native="$router.push('/well-ap')"
              >
                Register for the exam
              </WButtonsBase>
            </div>
            <div class="mt-4 flex justify-center">
              <WLinksBase
                link="https://www.wellcertified.com/well-ap/"
                target="_blank"
                type="primary"
              >
                Learn more
              </WLinksBase>
            </div>
          </div>
        </div>
        <div
          class="cursor-pointer text-primary-800 hover:text-white hover:bg-primary-900 transition-colors duration-200 bg-cover bg-center rounded-lg shadow-lg p-6 border border-primary-200 text-center"
          @click="$router.push('/user/profile')"
        >
          <div
            class="inline-flex rounded-full overflow-hidden border-4 shadow border-white bg-cover"
            style="background-image: url('/profile/avatar.jpg')"
          >
            <div
              class="flex-shrink-0 h-24 w-24 sm:h-40 sm:w-40 lg:w-32 lg:h-32 bg-cover bg-center"
              :style="[
                currentUser.profile_pic
                  ? {
                      backgroundImage: 'url(' + currentUser.profile_pic + ')',
                    }
                  : { backgroundImage: 'url(/profile/avatar.jpg)' },
              ]"
            ></div>
          </div>
          <div class="text-md mt-3 text-light">Welcome,</div>
          <WHeadingsHThree
            :heading="currentUser.name + ' ' + currentUser.last_name"
            class="-mt-3"
          />
          <div v-if="currentUser.job_title" class="text-sm -mt-3 text-gray-500">
            {{ currentUser.job_title }}
          </div>
        </div>
        <div class="space-y-4">
          <WHeadingsHFour heading="Quick links" class="text-primary-800" />
          <WLinksBase
            target="_blank"
            link="https://well.support/ae534dff-4934-4d6c-a21b-741c8b71aa11"
          >
            <li
              class="cursor-pointer col-span-1 w-full flex shadow-sm rounded-md"
            >
              <div
                class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-700 text-white text-sm font-medium rounded-l-md"
              >
                <WIconsBase
                  type="blank"
                  class="text-white"
                  icon="document-search"
                />
              </div>
              <div
                class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
              >
                <div class="flex-1 px-4 py-2 text-sm truncate">
                  <a
                    href="#"
                    class="text-primary-700 font-bold hover:text-gray-600"
                  >
                    Knowledge base
                  </a>
                  <p class="text-primary-500">View support resources</p>
                </div>
              </div>
            </li>
          </WLinksBase>
          <WLinksBase
            target="_blank"
            link="https://account.wellcertified.com/directories/projects"
          >
            <li
              class="cursor-pointer col-span-1 w-full flex shadow-sm rounded-md"
            >
              <div
                class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-700 text-white text-sm font-medium rounded-l-md"
              >
                <WIconsBase type="blank" class="text-white" icon="library" />
              </div>
              <div
                class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
              >
                <div class="flex-1 px-4 py-2 text-sm truncate">
                  <a
                    href="#"
                    class="text-primary-700 font-bold hover:text-gray-600"
                  >
                    Projects directory
                  </a>
                  <p class="text-primary-500">View participating locations</p>
                </div>
              </div>
            </li>
          </WLinksBase>
          <WLinksBase
            target="_blank"
            link="https://resources.wellcertified.com/webcasts"
          >
            <li
              class="cursor-pointer col-span-1 w-full flex shadow-sm rounded-md"
            >
              <div
                class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-700 text-white text-sm font-medium rounded-l-md"
              >
                <WIconsBase
                  type="blank"
                  class="text-white"
                  icon="desktop-computer"
                />
              </div>
              <div
                class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
              >
                <div class="flex-1 px-4 py-2 text-sm truncate">
                  <a
                    href="#"
                    class="text-primary-700 font-bold hover:text-gray-600"
                  >
                    Webcasts
                  </a>
                  <p class="text-primary-500">View community discussions</p>
                </div>
              </div>
            </li>
          </WLinksBase>
          <WLinksBase
            target="_blank"
            link="https://resources.wellcertified.com/articles/"
          >
            <li
              class="cursor-pointer col-span-1 w-full flex shadow-sm rounded-md"
            >
              <div
                class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-700 text-white text-sm font-medium rounded-l-md"
              >
                <WIconsBase type="blank" class="text-white" icon="document" />
              </div>
              <div
                class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate"
              >
                <div class="flex-1 px-4 py-2 text-sm truncate">
                  <a
                    href="#"
                    class="text-primary-700 font-bold hover:text-gray-600"
                  >
                    Articles &amp; press releases
                  </a>
                  <p class="text-primary-500">View recent publications</p>
                </div>
              </div>
            </li>
          </WLinksBase>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  auth: false,
  head() {
    return {
      title: 'Welcome',
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
}
</script>
