<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <WHeadingsHTwo heading="WELL v2 Timeline Estimator" />
        <div class="border-t text-sm font-light my-4 pt-5">
          <p class="mb-3">
            This resource is a tool to help estimate WELL Certification
            timelines for v2 projects.
          </p>
          <p class="mb-3">
            WELL v2 projects have the option to select full-service performance
            verification by GBCI or to contract directly with a<a
              href="https://www.wellcertified.com/performance-testing"
              target="_blank"
              class="text-primary-500 cursor-pointer"
            >
              WELL Performance Testing Organization</a
            >, under which a WELL Performance Testing Agent will conduct
            performance testing. WELL Performance Testing Agents must submit
            both analyzed results and raw data to GBCI for performance review
            using the prescribed format outlined in the
            <a
              href="https://resources.wellcertified.com/tools/performance-verification-guidebook/"
              target="_blank"
              class="text-primary-500 cursor-pointer"
              >Performance Verification Guidebook</a
            >. The WELL Reviewer will evaluate performance testing results to
            confirm tests were conducted according to specification, verify
            results have been analyzed correctly, and determine whether the
            project meets the requirements in WELL.
          </p>
          <p class="mb-3">
            Answer a few questions below and we’ll get started.
          </p>
          <p class="mb-3">
            Note: Certification timelines for projects will vary based on what
            is agreed upon between the project and the Performance Testing
            organization.
          </p>
        </div>
        <FormulateForm
          class="grid grid-cols-4 gap-4 my-4"
          @submit="generateTimeline()"
        >
          <div class="col-span-3">
            <p class="font-bold text-lg mb-2">
              When do you plan to submit the Preliminary Documentation Review?
            </p>
            <div class="text-sm text-gray-400 mb-4">
              Note: Documentation must be submitted at or after the date of
              construction completion. If Multifamily Residential Pilot or Core
              projects need to submit documents before construction completion,
              (for example, if performance verification needs to be conducted
              before tenants move in) please reach out to your WELL coaching
              contact to discuss this possibility. However, the project cannot
              schedule performance verification until construction is complete
              and occupancy requirements have been met according to
              <a
                href="https://resources.wellcertified.com/tools/well-certification-guidebook/"
                target="_blank"
                class="text-primary-500 cursor-pointer"
                >Table 2 of the WELL Certification Guidebook</a
              >.
            </div>
          </div>
          <FormulateInput
            v-model="appSubmissionDate"
            name="Date"
            class="col-span-1"
            type="datetimepicker"
            validation="required"
          />
          <div class="col-span-3">
            <p class="font-bold text-lg mb-2">
              How many business days do you anticipate needing to respond to
              possible clarifications requested in the Preliminary documentation
              review?
            </p>
            <div class="text-sm text-gray-400 mb-4">
              Typically about 5-25 business days are required to respond to
              clarifications. Clarifications may require actions from several
              team members and typically require updates to documentation.
            </div>
          </div>
          <FormulateInput
            v-model="daysRequired"
            class="col-span-1"
            type="number"
            min="1"
            max="100"
            validation="required"
            @change="clearDates()"
          />
          <div class="col-span-3">
            <p class="font-bold text-lg mb-2">
              How many business days after receiving the final review report
              does the project anticipate undergoing performance verification?
            </p>
          </div>
          <FormulateInput
            v-model="ptoDaysRequired"
            class="col-span-1"
            type="number"
            min="1"
            max="100"
            validation="required"
            @change="clearDates()"
          />
          <div class="col-span-3">
            <p class="font-bold text-lg mb-2">
              How many business days do you anticipate your Performance Testing
              Agent needing to respond to possible clarifications requested in
              the preliminary performance verification review?
            </p>
            <div class="text-sm text-gray-400 mb-4">
              Typically about 5-15 business days are required to respond to
              clarifications.
            </div>
          </div>
          <FormulateInput
            v-model="ptaClarificationDaysReq"
            class="col-span-1"
            type="number"
            min="1"
            max="100"
            validation="required"
            @change="clearDates()"
          />
          <div class="col-span-1">
            <FormulateInput type="submit" label="Generate my timeline" />
          </div>
        </FormulateForm>
        <div v-if="showTimeline" ref="timelineform" class="p-5 my-5 border-t">
          <div class="w-full text-center mb-8">
            <div class="text-3xl mb-4">
              Your Estimated v2 Certification Timeline
            </div>
            <div class="text-md text-gray-400">
              All calculated dates are approximations and will vary depending on
              project circumstances. The solid circles are calculated based on
              established GBCI protocol, while the white circles may vary based
              on the project team’s ability to submit clarifications, appeals or
              scheduling requests.
            </div>
          </div>
          <div class="flow-root py-4 px-16">
            <ul class="-mb-8">
              <li class="shadow-md rounded-md p-4">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold text-primary-600">
                          Contract WELL Performance Testing Agent
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          It is recommended that the project contract the
                          organization no later than the documentation
                          submission phase.
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-400">
                        <p>
                          <strong>Note:</strong> The date of the performance
                          verification site visit cannot occur until the final
                          documentation review report is issued by GBCI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10" r="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.prelimReviewDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Preliminary Documentation Review report
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Approximate date that the preliminary documentation
                          review report will be provided by GBCI. (Approximately
                          20-25 business days from the date of application
                          submission.)
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-400">
                        <p>
                          <strong>Note:</strong> Documentation review invoice
                          must be paid in order for GBCI to return the report.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.finalDocSubDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Submit for Final Documentation Review
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Your final documentation submission date, based on the
                          number of business days the project team needs to
                          address clarifications from the preliminary
                          documentation review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10" r="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.docReviewDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Final Documentation Review report
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Approximate date that the Final Documentation Review
                          report will be provided by GBCI. (Approximately 20-25
                          business days from the date of application
                          submission.)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 bg-gray-100 mt-2">
                <div class="relative pb-2">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold text-primary-600">
                          Schedule performance verification
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          If all
                          <span class="text-primary-500"
                            >documentation is approved by GBCI</span
                          >
                          after the Final Documentation Review, projects can
                          schedule performance verification.
                        </p>
                        <p class="mt-1 text-md text-gray-800">
                          Project teams must demonstrate there is no conflict of
                          interest between the project and the Performance
                          Testing Agent. Performance verification dates will
                          vary depending on what is agreed upon by the project
                          team and the WELL Performance Testing Organization.
                        </p>
                        <div class="mt-2 text-sm text-gray-400">
                          <p>
                            <strong>Note:</strong> The project cannot schedule
                            performance verification until construction is
                            complete and occupancy requirements have been met
                            according to
                            <a
                              href="https://resources.wellcertified.com/tools/well-certification-guidebook/"
                              target="_blank"
                              >Table 2 of the WELL Certification Guidebook.</a
                            >.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 bg-gray-100 mt-2">
                <div class="relative pb-2">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold text-primary-600">
                          Submit appeal report application
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          If
                          <span class="text-primary-500"
                            >documentation is not approved</span
                          >, you may need to submit an appeal application, in
                          which case the timeline will be extended.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.pvSiteVisitDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Performance verification site visit
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Date of performance verification should be agreed upon
                          between the project and the Performance Testing
                          Organization. Performance verification requires
                          coordination with multiple laboratories (for Radon,
                          Formaldehyde, VOC, and water quality tests) and
                          laboratory equipment arrangements may need to be made.
                        </p>
                        <p class="mt-1 text-md text-gray-800">
                          If results are not meeting feature requirements, the
                          Performance Testing Agent can immediately inform the
                          project team and organize retesting until testing
                          results indicate feature compliance.
                        </p>
                        <div class="mt-2 text-sm text-gray-400">
                          <p>
                            <strong>Note:</strong> Scheduling requirements may
                            differ across WELL Performance Testing
                            Organizations. If results from performance
                            verification do not meet WELL requirements, projects
                            will need to address the results and undergo
                            re-testing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10" r="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.reviewerReceivingDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          GBCI receives performance testing results
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Approximate date the Performance Testing Agent will
                          send the performance verification report to GBCI for
                          review.
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-400">
                        <p>
                          <strong>Note:</strong> This date is subject to change
                          based on the timeline agreed upon by the Performance
                          Testing Organization and the project team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="shadow-md rounded-md p-4 mt-2">
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10" r="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.prePerfReviewDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Performance verification review report
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          Approximate date that the preliminary performance
                          verification review report will be provided by GBCI to
                          the Performance Testing Agent. (Approximately 20-25
                          business days from the date of submission.) Your
                          project team will be notified if any further action is
                          needed.
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-400">
                        <p>
                          <strong>Note:</strong> If no further action is needed,
                          the Final WELL Report may be delivered at this time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li
                class="
                  shadow-md
                  rounded-md
                  p-4
                  border border-gray-600 border-dashed
                  mt-2
                "
              >
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="black"
                              stroke-width="1"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.agentPerfSubmitDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Performance Testing Agent submits for final
                          performance verification report review
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          If further action is required, this is the date by
                          which the Performance Testing Agent sends the final
                          performance verification report to GBCI. This date is
                          based on the number of business days the Performance
                          Testing Agent needs to address clarifications
                          requested by GBCI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li
                class="
                  shadow-md
                  rounded-md
                  p-4
                  border border-gray-600 border-dashed
                  mt-2
                "
              >
                <div class="relative pb-4">
                  <span
                    class="
                      absolute
                      top-5
                      left-5
                      -ml-px
                      h-full
                      w-0.5
                      bg-gray-200
                    "
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div
                          class="
                            h-8
                            w-8
                            bg-gray-100
                            rounded-full
                            ring-8 ring-white
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <svg
                            class="h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10" r="10" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-lg text-semibold">
                          {{ formatDate(dates.perfResDate) }}
                        </div>
                        <div class="text-lg text-semibold text-primary-600">
                          Final WELL Report
                        </div>
                        <p class="mt-1 text-md text-gray-800">
                          20-25 days after the final performance verification
                          report has been submitted, GBCI will issue a final
                          WELL Report.<br /><br />The project will have 180 days
                          to accept the WELL Report.
                        </p>
                      </div>
                      <div class="mt-2 text-sm text-gray-400">
                        <p>
                          <strong>Note:</strong> The Final WELL Report may be
                          delivered on
                          {{ formatDate(dates.prePerfReviewDate) }} if no
                          clarifications are requested by GBCI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div class="w-full text-gray-500 my-10">
              <p class="text-sm px-16 py-4">
                <strong>Note:</strong> Not all projects will require steps
                represented by a dashed line. If no action is needed after the
                performance verification review is conducted, the Final WELL
                Report will be delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      appSubmissionDate: '',
      daysRequired: 10,
      ptoDaysRequired: 10,
      ptaClarificationDaysReq: 10,
      dates: {
        prelimReviewDate: '',
        finalDocSubDate: '',
        docReviewDate: '',
        pvSiteVisitDate: '',
        perfResDate: '',
        reviewerReceivingDate: '',
        prePerfReviewDate: '',
        agentPerfSubmitDate: '',
      },
      showTimeline: false,
    }
  },
  methods: {
    generateTimeline() {
      this.$axios
        .post('api/v2ProjectTimeline', {
          appSubmissionDate: this.appSubmissionDate,
          daysRequired: this.daysRequired,
          ptoDaysRequired: this.ptoDaysRequired,
          ptaClarificationDaysReq: this.ptaClarificationDaysReq,
        })
        .then((res) => {
          this.dates = { ...res.data }
          this.showTimeline = true
        })
    },
    formatDate(date) {
      return this.$dayjs(date).format('MMM DD, YYYY')
    },
    clearDates() {
      this.dates.prelimReviewDate = ''
      this.dates.finalDocSubDate = ''
      this.dates.docReviewDate = ''
      this.dates.pvSiteVisitDate = ''
      this.dates.perfResDate = ''
      this.dates.reviewerReceivingDate = ''
      this.dates.prePerfReviewDate = ''
      this.dates.agentPerfSubmitDate = ''
      this.showTimeline = false
    },
  },
}
</script>
