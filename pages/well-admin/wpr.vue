<template>
  <div class="flex flex-col">
    <div v-if="adminPortfolioList">
      <WFeedbackAlert ref="alert" />
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="Admin WELL Performance Rating" />
      </NavBreadcrumbs>
      <div class="w-full">
        <WTabsHorizontal
          ref="tabs"
          v-model="currentTab"
          class="-mb-px sm:ml-2"
          :tabs="[
            { name: 'WELL Performance Rating Enrollments' },
            { name: 'Project Opt-ins' },
          ]"
        />
      </div>
      <!-- desktop filters start here -->
      <FormulateForm
        v-if="currentTab === 'WELL Performance Rating Enrollments'"
        class="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5"
        @submit="applyFilters"
      >
        <FormulateInput
          v-model="filters.portfolio_number"
          type="text"
          placeholder="ID"
          label="WELL Performance ID"
        />
        <FormulateInput
          v-model="filters.name"
          type="text"
          placeholder="Name"
          label="Name"
        />
        <FormulateInput
          v-model="filters.user_email"
          type="text"
          placeholder="Email"
          label="Email"
        />
        <FormulateInput
          v-model="filters.recertification_status"
          :options="[
            { label: 'Initial', value: 'initial' },
            { label: 'Renewal', value: 'recertified' },
          ]"
          type="select"
          label="Type"
          placeholder="Type"
        />
        <FormulateInput
          v-if="filters.recertification_status"
          v-model="filters.portfolio_status"
          :options="regPaymentStatusFilters"
          type="select"
          label="Status"
          placeholder="Status"
        />
        <FormulateInput type="submit" label="Apply" class="mt-6" />
        <div
          v-if="
            filters.user_email !== '' ||
            filters.name !== '' ||
            filters.portfolio_number !== '' ||
            filters.reg_status !== '' ||
            filters.portfolio_status !== '' ||
            filters.recertification_status !== ''
          "
          class="mt-6"
        >
          <WButtonsBase type="primaryInverted" @click.native="clearFilters()">
            Clear filters
          </WButtonsBase>
        </div>
      </FormulateForm>
      <LazyAccordiansBase
        ref="mobFilters"
        label="Filters"
        class="sm:hidden mt-3 mb-8 capitalize"
      >
        <template #content>
          <FormulateForm
            v-if="currentTab === 'WELL Performance Rating Enrollments'"
            @submit="applyFilters"
          >
            <FormulateInput
              v-model="filters.portfolio_number"
              type="text"
              placeholder="ID"
              label="WELL Performance ID"
            />
            <FormulateInput
              v-model="filters.name"
              type="text"
              placeholder="Name"
              label="Name"
            />
            <FormulateInput
              v-model="filters.user_email"
              type="text"
              placeholder="Email"
              label="Email"
            />
            <FormulateInput
              v-model="filters.reg_payment_status"
              :options="regPaymentStatusFilters"
              type="select"
              label="Type"
              placeholder="Type"
            />
            <FormulateInput
              v-model="filters.reg_status"
              :options="registrationStatusOptions"
              type="select"
              label="Registration Status"
              placeholder="Registration Status"
            />

            <FormulateInput type="submit" label="Apply" class="mt-6" />
            <div
              v-if="
                filters.user_email !== '' ||
                filters.name !== '' ||
                filters.portfolio_number !== '' ||
                filters.reg_status !== ''
              "
              class="mt-4"
            >
              <WButtonsBase
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </FormulateForm>
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5"
      >
        <div class="overflow-x-scroll">
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr v-if="currentTab === 'WELL Performance Rating Enrollments'">
                <th
                  v-for="(label, index) in tableHeaders.hsr"
                  :key="index"
                  class="px-6 py-3 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider bg-primary-700"
                >
                  {{ label }}
                </th>
              </tr>
              <tr v-else>
                <th
                  v-for="(label, index) in tableHeaders.projects"
                  :key="index"
                  class="px-6 py-3 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider bg-primary-700"
                >
                  {{ label }}
                </th>
              </tr>
            </thead>
            <!-- Enrollments -->
            <tbody
              v-if="currentTab === 'WELL Performance Rating Enrollments'"
              class="bg-white divide-y divide-gray-200"
            >
              <tr
                v-for="(portfolio, index) in adminPortfolioList.data"
                :key="index"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap leading-5 text-primary-500 cursor-pointer flex space-x-2"
                >
                  <div
                    @click="
                      regStatus(portfolio)
                        ? $router.push(
                            `/wpr/${portfolio.portfolio_number}/dashboard`
                          )
                        : $router.push(
                            `/wpr/create/${portfolio.portfolio_number}`
                          )
                    "
                  >
                    {{ portfolio.portfolio_number }}
                  </div>
                  <a
                    :href="
                      regStatus(portfolio)
                        ? `/wpr/${portfolio.portfolio_number}/dashboard`
                        : `/wpr/create/${portfolio.portfolio_number}`
                    "
                    target="_blank"
                  >
                    <WIconsBase
                      icon="external-link"
                      type="blank"
                      class="text-gray-400 hover:text-gray-500"
                    />
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm leading-5 font-medium text-gray-900 truncate max-w-md"
                  >
                    {{ portfolio.name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-400">
                    {{ portfolio.no_of_assets }} locations
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div
                    v-if="!portfolio.recertifications.length"
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                  >
                    Initial
                  </div>
                  <div
                    v-else
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-600 text-white uppercase"
                  >
                    Renewal
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <div v-if="!portfolio.recertifications.length">
                      <div
                        v-if="portfolio.portfolio_status === 'Achieved'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-600 text-white uppercase"
                      >
                        Achieved
                      </div>
                      <div
                        v-else-if="
                          portfolio.portfolio_status === 'Payment Pending'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                      >
                        Payment Pending
                      </div>
                      <div
                        v-else-if="
                          portfolio.portfolio_status === 'Pre-Enrollment'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                      >
                        Pre-Enrollment
                      </div>
                      <div
                        v-else-if="
                          portfolio.portfolio_status === 'Ready to Enroll'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                      >
                        Ready to Enroll
                      </div>
                      <div
                        v-else-if="portfolio.portfolio_status === 'Registered'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-600 text-white uppercase"
                      >
                        Registered
                      </div>
                      <div
                        v-else-if="
                          portfolio.portfolio_status === 'Under Review'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-600 text-white uppercase"
                      >
                        Under Review
                      </div>
                      <div
                        v-else-if="
                          portfolio.portfolio_status === 'Action Required'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                      >
                        Action Required
                      </div>
                      <div
                        v-else-if="portfolio.portfolio_status === 'Expired'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                      >
                        Expired
                      </div>
                    </div>
                    <div v-else>
                      <div
                        v-if="
                          !portfolio.recertifications.slice(-1).pop()
                            .date_certified
                        "
                      >
                        <div
                          v-if="portfolio.portfolio_status === 'Under Review'"
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-600 text-white uppercase"
                        >
                          Under Review
                        </div>
                        <div
                          v-else-if="
                            portfolio.portfolio_status === 'Action Required'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                        >
                          Action Required
                        </div>
                        <div
                          v-else
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                        >
                          Renewal Started
                        </div>
                      </div>

                      <div
                        v-else-if="
                          portfolio.recertifications.slice(-1).pop()
                            .date_certified &&
                          monthDiff(
                            new Date(),
                            new Date(
                              $dayjs(
                                portfolio.recertifications.slice(-1).pop()
                                  .date_certified
                              ).add(1, 'year')
                            )
                          ) > 0 &&
                          monthDiff(
                            new Date(),
                            new Date(
                              $dayjs(
                                portfolio.recertifications.slice(-1).pop()
                                  .date_certified
                              ).add(1, 'year')
                            )
                          ) <= 12
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-600 text-white uppercase"
                      >
                        Achieved
                      </div>

                      <div
                        v-else-if="
                          portfolio.recertifications.slice(-1).pop()
                            .date_certified &&
                          monthDiff(
                            new Date(),
                            new Date(
                              $dayjs(
                                portfolio.recertifications.slice(-1).pop()
                                  .date_certified
                              ).add(1, 'year')
                            )
                          ) > 12
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                      >
                        Expired
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="portfolio.reg_payment_status === 'paid'"
                    class="text-sm leading-5 text-gray-400 pt-1"
                  >
                    {{ $dayjs(portfolio.reg_date).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <span v-if="portfolio.multi_use">Yes</span>
                    <span v-else>No</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <span
                      v-if="portfolio.wpr_aggrement"
                      class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-600 text-white uppercase"
                      >Signed</span
                    >
                    <span
                      v-else
                      class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                      >Pending</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ portfolio.user_name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-400">
                    {{ portfolio.user_email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ $dayjs(portfolio.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="!portfolio.recertifications.length">
                    <span v-if="portfolio.portfolio_status === 'Under Review'">
                      Results expected by
                      {{
                        $dayjs(portfolio.pending_review_est_date).format(
                          'MMM DD, YYYY'
                        )
                      }}
                    </span>
                    <span v-else-if="portfolio.portfolio_status === 'Expired'">
                      Expired on
                      {{
                        $dayjs(portfolio.hsr_achieved_date)
                          .add(1, 'year')
                          .format('MMM DD, YYYY')
                      }}
                      -
                      <span
                        class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                        @click="goToNextStep(portfolio)"
                      >
                        Enroll Now
                      </span>
                    </span>
                    <span v-else-if="portfolio.portfolio_status === 'Achieved'">
                      Expires on
                      {{
                        $dayjs(portfolio.hsr_achieved_date)
                          .add(1, 'year')
                          .format('MMM DD, YYYY')
                      }}

                      <span
                        v-if="
                          monthDiff(
                            new Date(),
                            new Date(
                              $dayjs(portfolio.hsr_achieved_date).add(1, 'year')
                            )
                          ) <= 9
                        "
                      >
                        -
                        <span
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          @click="goToNextStep(portfolio)"
                        >
                          Renew Now
                        </span>
                      </span>
                      <span
                        v-else
                        class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                        @click="goToNextStep(portfolio)"
                      >
                        - Promote your achievement</span
                      >
                    </span>
                    <span
                      v-else-if="paidStatus(portfolio)"
                      class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                      @click="goToNextStep(portfolio)"
                    >
                      View Dashboard
                    </span>
                    <span
                      v-else-if="
                        portfolio.portfolio_status === 'Payment Pending'
                      "
                      class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                      @click="goToNextStep(portfolio)"
                    >
                      Complete Payment
                    </span>
                    <span
                      v-else
                      class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                      @click="goToNextStep(portfolio)"
                    >
                      Enroll now!
                    </span>
                  </div>
                  <div v-else>
                    <div
                      v-if="
                        !portfolio.recertifications.slice(-1).pop()
                          .date_certified
                      "
                    >
                      <span
                        v-if="
                          portfolio.recertifications.slice(-1).pop()
                            .payment_status === 'unpaid'
                        "
                        class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                        @click="goToNextStep(portfolio)"
                      >
                        Complete Payment
                      </span>
                      <span
                        v-if="
                          portfolio.recertifications.slice(-1).pop()
                            .payment_status !== 'unpaid' &&
                          portfolio.portfolio_status === 'Under Review'
                        "
                      >
                        Results expected by
                        {{
                          $dayjs(portfolio.pending_review_est_date).format(
                            'MMM DD, YYYY'
                          )
                        }}
                      </span>
                      <span
                        v-else-if="
                          portfolio.recertifications.slice(-1).pop()
                            .payment_status !== 'unpaid'
                        "
                        class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                        @click="goToNextStep(portfolio)"
                      >
                        View Dashboard
                      </span>
                    </div>
                    <div v-else>
                      <span
                        v-if="
                          monthDiff(
                            new Date(),
                            new Date(
                              $dayjs(
                                portfolio.recertifications.slice(-1).pop()
                                  .date_certified
                              ).add(1, 'year')
                            )
                          ) > 12
                        "
                      >
                        Expired on
                        {{
                          $dayjs(
                            portfolio.recertifications.slice(-1).pop()
                              .date_certified
                          )
                            .add(1, 'year')
                            .format('MMM DD, YYYY')
                        }}
                        -
                        <span
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          @click="goToNextStep(portfolio)"
                        >
                          Enroll Now
                        </span>
                      </span>
                      <span
                        v-else-if="
                          portfolio.recertifications.slice(-1).pop()
                            .date_certified
                        "
                      >
                        Expires on
                        {{
                          $dayjs(
                            portfolio.recertifications.slice(-1).pop()
                              .date_certified
                          )
                            .add(1, 'year')
                            .format('MMM DD, YYYY')
                        }}

                        <span
                          v-if="
                            monthDiff(
                              new Date(),
                              new Date(
                                $dayjs(
                                  portfolio.recertifications.slice(-1).pop()
                                    .date_certified
                                ).add(1, 'year')
                              )
                            ) <= 9
                          "
                        >
                          -
                          <span
                            class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                            @click="goToNextStep(portfolio)"
                          >
                            Renew Now
                          </span>
                        </span>
                        <span
                          v-else
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          @click="goToNextStep(portfolio)"
                        >
                          - Promote your achievement</span
                        >
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <!-- Project Opt Ins -->
            <tbody v-else class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(project, index) in adminProjectsList.data"
                :key="index"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap leading-5 text-primary-500 cursor-pointer flex space-x-2"
                >
                  <div
                    class="text-sm leading-5 text-primary-500 cursor-pointer flex flex-col"
                    @click="
                      $router.push(
                        '/projects/' +
                          project.type +
                          '/' +
                          project.project_number +
                          '/dashboard/'
                      )
                    "
                  >
                    <span>{{ project.project_number }}</span>
                    <div>
                      <span
                        v-if="project.type === 'v2'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >Well {{ project.type }}</span
                      >
                      <span
                        v-else-if="project.type === 'v1'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        Well {{ project.type }}
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        Well {{ project.type }}
                      </span>
                    </div>
                  </div>
                  <a
                    :href="`/projects/${project.type}/${project.project_number}/dashboard/`"
                    target="_blank"
                  >
                    <WIconsBase
                      icon="external-link"
                      type="blank"
                      class="text-gray-400 hover:text-gray-500"
                    />
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ project.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <strong>{{ project.area }}</strong> sqft |
                    <strong>{{ project.area_in_meter }}</strong>
                    sqm
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    :class="
                      project.country_code === null
                        ? 'text-sm leading-5 text-gray-500 italic'
                        : 'text-sm leading-5 font-medium text-gray-900'
                    "
                  >
                    {{
                      project.country_code === null
                        ? 'Not Set'
                        : getCountryName(project.country_code)
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(project.map_city)"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(project.owner_state)"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="!project.recertifications.length"
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                  >
                    Initial
                  </div>
                  <div
                    v-else
                    class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-600 text-white uppercase"
                  >
                    Renewal
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <span
                      v-if="
                        project.reg_status === 1 &&
                        project.reg_payment_status !== null &&
                        project.reg_payment_status !== 'unpaid'
                      "
                      >Registered</span
                    >
                    <span
                      v-else-if="
                        project.reg_status === 1 &&
                        project.reg_payment_status === null
                      "
                      >Registration in progress</span
                    >
                    <span v-else>Not Registered</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    :class="
                      project.hsr_aggrement === null
                        ? 'text-sm leading-5 text-gray-500 italic'
                        : 'text-sm leading-5 font-medium text-gray-900'
                    "
                  >
                    {{
                      project.hsr_aggrement === null
                        ? 'Not Signed'
                        : $dayjs(project.hsr_aggrement).format('MMM DD, YYYY')
                    }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium">
                    <span
                      v-if="project.hsr_payment === 'paid'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >{{ project.hsr_payment }}</span
                    >
                    <span
                      v-else-if="project.hsr_payment === 'waived'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                      >{{ project.hsr_payment }}</span
                    >
                    <span
                      v-else-if="project.hsr_payment === 'unpaid'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize"
                      >{{ project.hsr_payment }}</span
                    >
                    <span
                      v-else
                      class="text-center text-sm leading-5 text-gray-500 italic"
                      >Pending Signature</span
                    >
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <span v-if="project.user.email">{{
                      project.user.email
                    }}</span>
                    <span v-else>-</span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    <span v-if="project.owner_email">{{
                      project.owner_email
                    }}</span>
                    <span v-else>-</span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(project.owner_org)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ $dayjs(project.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FormInputsPagination
          v-if="currentTab === 'WELL Performance Rating Enrollments'"
          :pagination="paginate"
          :offset="3"
          @paginate="
            $store.dispatch('shared/getAdminPortfolioList', allFilters)
          "
        />
        <FormInputsPagination
          v-else
          :pagination="paginate"
          :offset="3"
          @paginate="
            $store.dispatch('project/getAdminProjectsList', allProjectFilters)
          "
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading workspaces...</div>
      </div>
      <div v-else class="mx-auto text-center">
        <div class="mt-3 text-danger-400 font-medium">
          Something went wrong. Please check that you have correct permissions
          to view this.
          <br />
          Error: {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

export default {
  mixins: [tableMixin],
  data() {
    return {
      currentTab: 'WELL Performance Rating Enrollments',

      filters: {
        user_email: '',
        name: '',
        reg_status: '',
        portfolio_number: '',
        portfolio_status: '',
        recertification_status: '',
        wpr_filter: 'all',
        orderBy: 'id',
        order: 'desc',
        type: 'wpr',
      },
      projectFilters: {
        wpr_opt: 1,
        orderBy: 'id',
        order: 'desc',
      },
      error: null,
      registrationStatusOptions: [
        { value: '1', label: 'Registered' },
        { value: '0', label: 'Not Registered' },
      ],
      tableHeaders: {
        hsr: [
          'id',
          'name',
          'type',
          'registration status',
          'multi-use?',
          'agreement',
          'created by',
          'created at',
          'next steps',
        ],
        projects: [
          'id',
          'name',
          'area',
          'location',
          'city',
          'state',
          'type',
          'registration status',
          'WPR agreement',
          'WPR payment',
          'project admin',
          'owner',
          'owner org',
          'created at',
        ],
      },
    }
  },
  head() {
    return {
      title: `Admin WELL WELL Performance`,
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      adminPortfolioList: (state) => state.shared.adminPortfolioList,
      adminProjectsList: (state) => state.project.adminProjectsList,
      regPaymentStatusFilters() {
        if (this.filters.recertification_status === 'initial') {
          return [
            { label: 'Pre-Enrollment', value: 'Pre-Enrollment' },
            { label: 'Ready to Enroll', value: 'Ready to Enroll' },
            { label: 'Payment Pending', value: 'Payment Pending' },
            { label: 'Registered', value: 'Registered' },
            { label: 'Under Review', value: 'Under Review' },
            { label: 'Action Required', value: 'Action Required' },
            { label: 'Achieved', value: 'Achieved' },
            { label: 'Expired', value: 'Expired' },
          ]
        } else if (this.filters.recertification_status === 'recertified') {
          return [
            { label: ' Renewal Started', value: ' Renewal Started' },
            { label: 'Under Review', value: 'Under Review' },
            { label: 'Action Required', value: 'Action Required' },
            { label: 'Achieved', value: 'Achieved' },
            { label: 'Expired', value: 'Expired' },
          ]
        }
      },
    }),

    countryOptions() {
      const options = []

      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].id,
          label: this.countries[i].name,
        }
        options.push(option)
      }

      return options
    },
    paginate() {
      if (
        this.currentTab === 'WELL Performance Rating Enrollments' &&
        this.adminPortfolioList
      ) {
        return {
          total: this.adminPortfolioList.total,
          per_page: this.adminPortfolioList.per_page,
          current_page: this.adminPortfolioList.current_page,
          last_page: this.adminPortfolioList.last_page,
          from: this.adminPortfolioList.from,
          to: this.adminPortfolioList.to,
        }
      } else if (
        this.currentTab === 'Project Opt-ins' &&
        this.adminProjectsList
      ) {
        return {
          total: this.adminProjectsList.total,
          per_page: this.adminProjectsList.per_page,
          current_page: this.adminProjectsList.current_page,
          last_page: this.adminProjectsList.last_page,
          from: this.adminProjectsList.from,
          to: this.adminProjectsList.to,
        }
      }

      return {}
    },

    hasAppliedFilters() {
      const excludedKeys = ['hsr_filter', 'orderBy', 'order']
      for (const key in this.filters) {
        if (
          this.filters[key] !== null &&
          this.filters[key] !== '' &&
          !excludedKeys.includes(key)
        )
          return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      if (parseInt(this.filters.reg_status) === 1) {
        res.reg_payment_status = 'paid'
      } else if (parseInt(this.filters.reg_status) === 0) {
        res.reg_payment_status = 'unpaid'
      }
      delete res.reg_status
      res.page = this.paginate.current_page
      return res
    },
    allProjectFilters() {
      const res = JSON.parse(JSON.stringify(this.projectFilters))
      res.page = this.paginate.current_page
      return res
    },
  },
  watch: {
    currentTab(newVal) {
      if (this.currentTab === 'Project Opt-ins') {
        this.$store.dispatch(
          'project/getAdminProjectsList',
          this.allProjectFilters
        )
      }
    },
  },
  async mounted() {
    await this.$store
      .dispatch('shared/getAdminPortfolioList', this.allFilters)
      .catch((error) => (this.error = error))
    return await this.$store
      .dispatch('project/getAdminProjectsList', this.allProjectFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    goToNextStep(sharedWorkspace) {
      if (!sharedWorkspace.recertifications.length) {
        if (sharedWorkspace.portfolio_status === 'Expired') {
          this.$router.push(
            `/wpr/${sharedWorkspace.portfolio_number}/recertification`
          )
        } else if (sharedWorkspace.portfolio_status === 'Achieved') {
          if (
            this.monthDiff(
              new Date(),
              new Date(
                this.$dayjs(sharedWorkspace.hsr_achieved_date).add(1, 'year')
              )
            ) <= 9
          ) {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/recertification`
            )
          } else {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/promotions`
            )
          }
        } else if (
          this.paidStatus(sharedWorkspace) &&
          sharedWorkspace.d_and_o_submitted === 0
        ) {
          this.$router.push(
            `/wpr/${sharedWorkspace.portfolio_number}/documents`
          )
        } else if (this.paidStatus(sharedWorkspace)) {
          this.$router.push(
            `/wpr/${sharedWorkspace.portfolio_number}/dashboard`
          )
        } else {
          this.$router.push(
            `/wpr/create/${sharedWorkspace.portfolio_number}${
              sharedWorkspace.from_assessment ? '?prelim=0' : ''
            }`
          )
        }
      } else {
        const recert = sharedWorkspace.recertifications.slice(-1).pop()
        if (recert.date_certified) {
          const certifiedMonths = this.monthDiff(
            new Date(),
            new Date(this.$dayjs(recert.date_certified).add(1, 'year'))
          )
          if (certifiedMonths > 12) {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/recertification`
            )
          } else if (certifiedMonths <= 12) {
            if (certifiedMonths <= 9) {
              this.$router.push(
                `/wpr/${sharedWorkspace.portfolio_number}/recertification`
              )
            } else {
              this.$router.push(
                `/wpr/${sharedWorkspace.portfolio_number}/promotions`
              )
            }
          } else if (
            this.paidStatus(sharedWorkspace) &&
            sharedWorkspace.d_and_o_submitted === 0
          ) {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/documents`
            )
          } else if (this.paidStatus(sharedWorkspace)) {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/dashboard`
            )
          } else {
            this.$router.push(
              `/wpr/create/${sharedWorkspace.portfolio_number}${
                sharedWorkspace.from_assessment ? '?prelim=0' : ''
              }`
            )
          }
        } else if (!recert.date_certified) {
          if (recert.payment_status === 'unpaid') {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/billing`
            )
          } else {
            this.$router.push(
              `/wpr/${sharedWorkspace.portfolio_number}/dashboard`
            )
          }
        }
      }
    },
    monthDiff(d1, d2) {
      let months
      months = (d2.getFullYear() - d1.getFullYear()) * 12
      months -= d1.getMonth()
      months += d2.getMonth()
      return months <= 0 ? 0 : months
    },
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch('shared/getAdminPortfolioList', this.allFilters)
      this.$refs.mobFilters.isExpanded = false
    },
    regStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
    getCountryName(countryCode) {
      const res = this.countries.length
        ? this.countries.filter((a) => a.code === countryCode)
        : null
      return res.length ? res[0].name : null
    },
    getProjectType(projectType) {
      const res = this.projectType.filter((a) => a.value === projectType)
      return res.length ? res[0].text : projectType
    },
    clearFilters() {
      this.filters = {
        user_email: '',
        name: '',
        reg_status: '',
        recertification_status: '',
        portfolio_status: '',
        portfolio_number: '',
        wpr_filter: 'all',
        orderBy: 'id',
        order: 'desc',
      }
      this.$store.dispatch('shared/getAdminPortfolioList', this.filters)
    },
    paidStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
