<template>
  <tr :class="[module.type !== 'v2-pilot' && 'border-b', 'grid']">
    <td colspan="4">
      <div
        :class="[
          expanded && 'bg-primary-100',
          'hover:bg-primary-100 cursor-pointer flex w-full ',
        ]"
      >
        <div
          class="px-6 my-auto py-2 text-sm leading-5 font-medium text-primary-500"
          @click="expanded = !expanded"
        >
          <div class="font-medium w-12 text-center">
            <img
              v-if="showIcons"
              class="rounded-full w-8 mx-auto"
              :src="`/scorecard/icons/${activeConcept
                .replace(/\s+/g, '-')
                .toLowerCase()}.png`"
            />
            <div>
              {{ part.part_prefix }}
            </div>
          </div>
        </div>
        <div
          class="w-7/12 my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900"
          @click="expanded = !expanded"
        >
          <div class="font-medium">
            <div class="flex">
              <div class="text-primary-600 font-bold">{{ part.name }}</div>
            </div>
            <div class="text-sm text-primary-900">
              {{ part.feature_name }}
              <div
                v-if="
                  checkPartPhaseStatus ===
                    'achievable_with_minor_adjustments' &&
                  module.benchmark_opt === 1
                "
                class="ml-2 inline border px-1 border-yellow-500 text-yellow-500 text-sm rounded"
              >
                Minor Adjustments
              </div>
              <div
                v-if="
                  checkPartPhaseStatus ===
                    'achievable_with_major_adjustments' &&
                  module.benchmark_opt === 1
                "
                class="ml-2 inline border px-1 border-yellow-500 text-yellow-500 text-sm rounded"
              >
                Major Adjustments
              </div>
              <div
                v-if="
                  checkPartPhaseStatus === 'not_achievable' &&
                  module.benchmark_opt === 1
                "
                class="ml-2 inline border px-1 border-gray-500 text-gray-500 text-sm rounded"
              >
                Not Achievable
              </div>
              <div
                v-if="
                  checkPartPhaseStatus === 'achievable' &&
                  module.benchmark_opt === 1
                "
                class="ml-2 inline border px-1 border-green-600 text-green-600 text-sm rounded"
              >
                Anticipated
              </div>
              <div
                v-if="checkPartImplementPhaseStatus === 'completed'"
                class="ml-2 inline border px-1 border-green-600 text-green-600 text-sm rounded"
              >
                Completed
              </div>
              <div
                v-if="checkPartImplementPhaseStatus === 'withdrawn'"
                class="ml-2 inline border px-1 border-gray-600 text-gray-600 text-sm rounded"
              >
                Withdrawn
              </div>
              <div
                v-if="checkPartImplementPhaseStatus === 'need_action'"
                class="ml-2 inline border px-1 border-red-700 text-red-700 text-sm rounded"
              >
                Needs Action
              </div>
              <div
                v-if="checkPartImplementPhaseStatus === 'in_progress'"
                class="ml-2 inline border px-1 border-yellow-500 text-yellow-500 text-sm rounded"
              >
                In Progress
              </div>
              <div
                v-if="checkPartImplementPhaseStatus === 'outstanding'"
                class="ml-2 inline border px-1 border-primary-600 text-primary-600 text-sm rounded"
              >
                Not Started
              </div>
              <div
                v-if="
                  module.portfolio_ids &&
                  module.portfolio_ids.length &&
                  part.scorecard_part.length &&
                  part.scorecard_part[0].awarded
                "
                class="ml-2 inline border px-1 bg-primary-100 border-primary-600 text-primary-600 text-sm rounded"
              >
                Achieved
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-3/12 my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900 flex items-center justify-center"
          @click="expanded = !expanded"
        >
          <!-- For "P" -->
          <div v-if="feature.type === 'P'">
            <!-- Show Darker UI if Response is YES -->
            <div
              v-if="module.portfolio_ids && module.portfolio_ids.length"
              class="ml-4"
            >
              <Flyout
                v-if="part.points === 0 && response === 'yes'"
                y="bottom"
                x="right"
                class="h-full"
              >
                <div
                  class="uppercase font-medium border border-primary-300 h-10 rounded-full font-bold flex"
                  :class="[
                    part.scorecard_part.length && part.scorecard_part[0].awarded
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 text-primary-700',
                    guidancePoints ? 'w-20' : 'w-10',
                  ]"
                >
                  <div class="mx-auto my-auto flex">
                    <span> P </span>
                    <svg
                      v-if="guidancePoints"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span v-if="guidancePoints">{{ guidancePoints }} </span>
                  </div>
                </div>
                <template #content>
                  <div class="p-3 w-max">
                    <div class="flex">
                      <span> P &nbsp; </span>
                      <svg
                        v-if="guidancePoints"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span v-if="guidancePoints">
                        {{ guidancePoints }}&nbsp;
                      </span>
                      {{ guidancePoints > 1 ? 'Targeted' : 'Targeted' }}
                    </div>
                    <div
                      v-if="
                        part.scorecard_part.length &&
                        part.scorecard_part[0].awarded
                      "
                      class="flex"
                    >
                      <span> P &nbsp; </span>
                      <svg
                        v-if="part.scorecard_part[0].core_points_awarded"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span v-if="part.scorecard_part[0].core_points_awarded">
                        {{ part.scorecard_part[0].core_points_awarded }}&nbsp;
                      </span>
                      {{
                        part.scorecard_part[0].core_points_awarded > 1
                          ? 'Awarded'
                          : 'Awarded'
                      }}
                    </div>
                  </div>
                </template>
              </Flyout>

              <div
                v-else
                class="opacity-30 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span v-if="part.points === 0"> P </span>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="part.points === 0 && response === 'yes'"
                class="ml-4 font-medium uppercase border bg-primary-100 text-primary-700 border-primary-300 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span v-if="part.points === 0"> P </span>
                </div>
              </div>
              <div
                v-else
                class="opacity-30 ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span v-if="part.points === 0"> P </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <!-- For Non-P, Portfolio  -->
            <div v-if="module.portfolio_ids && module.portfolio_ids.length">
              <div v-if="partPointsVal !== 0 && part.points > 0" class="ml-4">
                <Flyout y="bottom" x="right" class="h-full">
                  <div
                    class="border border-primary-300 h-10 rounded-full font-bold flex"
                    :class="[
                      part.scorecard_part.length &&
                      part.scorecard_part[0].awarded
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-100 text-primary-700',
                      guidancePoints ? 'w-20' : 'w-10',
                    ]"
                  >
                    <div class="mx-auto my-auto flex">
                      <span>
                        {{
                          part.scorecard_part[0].awarded
                            ? part.scorecard_part[0].points_awarded
                            : partPointsVal
                        }}</span
                      >
                      <svg
                        v-if="guidancePoints"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span v-if="guidancePoints">{{ guidancePoints }} </span>
                    </div>
                  </div>
                  <template #content>
                    <div class="p-3 w-max">
                      <div class="flex">
                        <span> {{ partPointsVal }}&nbsp; </span>
                        <svg
                          v-if="guidancePoints"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="w-2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span v-if="guidancePoints">
                          {{ guidancePoints }}&nbsp;
                        </span>
                        {{
                          guidancePoints + partPointsVal > 1
                            ? 'Points Targeted'
                            : 'Point Targeted'
                        }}
                      </div>
                      <div
                        v-if="
                          part.scorecard_part.length &&
                          part.scorecard_part[0].awarded
                        "
                        class="flex"
                      >
                        <span>
                          {{ part.scorecard_part[0].points_awarded }}&nbsp;
                        </span>
                        <svg
                          v-if="part.scorecard_part[0].core_points_awarded"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="w-2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span v-if="part.scorecard_part[0].core_points_awarded">
                          {{ part.scorecard_part[0].core_points_awarded }}&nbsp;
                        </span>
                        {{
                          part.scorecard_part[0].core_points_awarded +
                            part.scorecard_part[0].points_awarded >
                          1
                            ? 'Points Awarded'
                            : 'Point Awarded'
                        }}
                      </div>
                    </div>
                  </template>
                </Flyout>
              </div>
              <div
                v-else
                class="opacity-30 ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span> {{ part.points }} </span>
                  <svg
                    v-if="guidancePoints"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span v-if="guidancePoints">
                    {{ guidancePoints }}
                  </span>
                </div>
              </div>
            </div>
            <!-- For Non-P Projects (Not Portfolio) -->
            <div v-else>
              <!-- Show Darker UI if Response is YES -->
              <div
                v-if="
                  partPointsVal !== 0 && part.points > 0 && response === 'yes'
                "
                class="ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span> {{ partPointsVal }} </span>
                </div>
              </div>
              <!-- Show Lighter UI if Response is YES -->
              <div
                v-else
                class="opacity-30 ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  <span> {{ part.points }} </span>
                </div>
              </div>
              <div v-if="guidancePoints" class="w-5 text-primary-600 ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div
                v-if="guidancePoints"
                class="ml-4 uppercase bg-secondary-100 border border-secondary-300 text-secondary-700 w-10 h-10 rounded-full font-bold flex"
              >
                <div class="mx-auto my-auto">
                  {{ guidancePoints }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900"
        >
          <div class="w-56 flex">
            <ScorecardHoverIcon :part="part" type="comments" />
            <ScorecardHoverIcon :part="part" type="documents" />

            <div class="flex w-48 ml-2">
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'yes'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-l-lg transition-colors duration-300',
                ]"
                @click.native="sendResponse('yes')"
              >
                Yes
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'maybe'
                    ? 'bg-secondary-700 text-white'
                    : 'bg-white text-primary-600',
                  'border-t border-b  transition-colors duration-300',
                ]"
                @click.native="sendResponse('maybe')"
              >
                Maybe
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'no'
                    ? 'bg-gray-500 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-r-lg  transition-colors duration-300',
                ]"
                @click.native="sendResponse('no')"
              >
                No
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="expanded"
        :class="[
          expanded && 'bg-primary-200',
          'w-full px-4 py-6 border-t bg-primary-100 space-y-3',
        ]"
      >
        <LazyAccordiansBase label="Requirements" :expanded="true">
          <template #content>
            <div
              v-if="part.note && part.note !== ''"
              class="bg-yellow-50 border-l-4 border-yellow-400 p-4"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 text-yellow-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p
                    class="text-sm text-yellow-700"
                    v-html="
                      addCitations(part.note, $store.state.project.project)
                    "
                  ></p>
                </div>
              </div>
            </div>
            <div
              v-if="showMultiPoints"
              class="px-5 pt-3 bg-primary-100 border border-primary-600 text-primary-600 mt-4 rounded"
            >
              <div class="flex justify-between">
                <div class="text-sm w-4/5 leading-4 mt-3">
                  This part has multiple point thresholds available. Please
                  review the requirements and select the appropriate number of
                  points-
                </div>
                <div class="w-1/5">
                  <FormulateInput
                    v-model="partPointsVal"
                    class="text-primary-700"
                    placeholder="Select Points"
                    type="select"
                    :options="getPartPointsOptions"
                    @change="setPoints"
                  />
                </div>
              </div>
            </div>
            <div
              v-for="(sub_part, index) in part.subParts"
              :key="index"
              class="my-5"
            >
              <div class="font-black text-primary-800 pl-2 text-lg text-center">
                {{ getSubPartTitle(sub_part) }}
              </div>
              <div class="mt-2 space-y-2">
                <ScorecardSubPartOption
                  v-if="
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    ).length > 0 &&
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    )[0].option_id
                  "
                  :part="part"
                  :sub-part="sub_part"
                  :scorecard-option="
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    )[0].option_id
                  "
                />
                <ScorecardSubPartOption
                  v-else
                  :part="part"
                  :sub-part="sub_part"
                  :scorecard-option="'null'"
                />
              </div>
            </div>
            <div
              v-if="
                (module && moduleType === 'portfolio') ||
                (module &&
                  project.project_type &&
                  project.project_type === 'cs')
              "
              class="space-y-2"
            >
              <div
                v-if="filterPartGuidance"
                class="bg-primary-100 w-full border-l-4 border-primary-400 p-4"
              >
                <div class="font-bold text-primary-600">
                  WELL Core Guidance:
                </div>
                <p
                  v-for="(guidance, index) in filterPartGuidance"
                  :key="index"
                  class="text-sm leading-5 font-light text-primary-600"
                  v-html="
                    addCitations(
                      guidance.doc_guidance,
                      $store.state.project.project
                    )
                  "
                ></p>
                <FormulateInput
                  v-if="showIfGuidanceTrue()"
                  v-model="partGuianceOpted"
                  class="text-white"
                  type="checkbox"
                  label="I would like to pursue additional point opportunities for WELL Core."
                  @input="togglePartGuidance()"
                />
              </div>
            </div>
            <div class="my-5">
              <div v-if="guidance_summary && guidance_summary !== ''">
                <div
                  class="bg-primary-100 w-full border-l-4 border-primary-400 p-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        class="h-5 w-5 text-primary-400"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="ml-3 flex w-full">
                      <p class="text-sm text-primary-700">
                        <span class="font-bold">IWBI Guidance:</span>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <span
                          v-html="
                            addCitations(
                              guidance_summary,
                              $store.state.project.project
                            )
                          "
                        ></span>
                      </p>
                      <div class="ml-auto">
                        <svg
                          class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          @click="removePartGuidance"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <FormulateForm
                v-else-if="currentUser.role.includes('well-admin')"
                @submit="updatePartGuidance"
              >
                <FormulateInput
                  v-model="new_guidance_summary"
                  type="textarea"
                  placeholder="Please add a part level guidance."
                  validation="required"
                />
                <div class="w-32 mt-3 ml-auto">
                  <FormulateInput type="submit" label="Save" />
                </div>
              </FormulateForm>
            </div>
          </template>
        </LazyAccordiansBase>

        <LazyAccordiansBase label="Resources">
          <template #content>
            <div class="flex space-x-2">
              <div :class="moduleType !== 'hsr' ? 'w-1/2' : 'w-full'">
                <div class="text-lg text-primary-700 font-medium">
                  Resources
                </div>
                <div
                  class="h-64 bg-gray-100 border border-primary-200 rounded overflow-y-auto"
                >
                  <ScorecardSubPartResource
                    :feature-id="part.feature_id"
                    class="p-5"
                  />
                </div>
              </div>
              <div :class="moduleType !== 'hsr' ? 'w-1/2' : 'w-full'">
                <div class="text-lg text-primary-700 font-medium">FAQ</div>
                <div
                  class="h-64 bg-gray-100 border border-primary-200 rounded overflow-y-auto"
                >
                  <ScorecardSubPartFaq
                    :feature-id="part.feature_id"
                    class="p-5"
                  />
                </div>
              </div>
            </div>
            <div v-if="module.type === 'v2-pilot'">
              <div class="w-full mt-5">
                <div class="text-lg text-primary-700 font-medium">
                  Alternatives
                </div>
                <div
                  class="h-64 bg-gray-100 border border-primary-200 rounded overflow-y-auto"
                >
                  <ScorecardStrategiesViewScreen
                    :feature-id="part.feature_id"
                  />
                </div>
              </div>
            </div>
          </template>
        </LazyAccordiansBase>
        <LazyAccordiansBase
          label="Next Steps"
          type="secondary"
          :expanded="true"
        >
          <template #content>
            <ScorecardPartNextSteps
              :module-type="moduleType"
              :module="module"
              :part="part"
              :part-id="part.id"
            />
          </template>
        </LazyAccordiansBase>
        <LazyAccordiansBase
          v-if="
            pendingReview &&
            (currentUser.role.includes('well-admin') ||
              currentUser.role.includes('external-reviewer')) &&
            pendingReview.phase !== 'Preliminary Health-Safety Review' &&
            pendingReview.phase !== 'Final Health-Safety Review'
          "
          :key="'concept-' + activeConcept + 'part-' + part.id"
          :label="'Admin Review - ' + pendingReview.phase"
        >
          <template #content>
            <div class="flex space-x-4">
              <div class="w-1/2">
                <FormulateInput
                  v-model="partResponseSelected"
                  type="select"
                  :options="responseOptions"
                  placeholder="Select response"
                  @input="setResponse"
                />
              </div>
              <div
                v-if="partResponseSelected && feature.type !== 'P'"
                class="w-1/2"
              >
                <FormulateInput
                  v-model="adminPoints"
                  get-admin-part-points-options
                  class="text-primary-700"
                  type="select"
                  :options="getAdminPartPointsOptions"
                  @change="setAdminPoints"
                />
              </div>
            </div>
            <div class="flex">
              <div class="w-1/2">
                <ScorecardAdminResponse
                  ref="adminResponse"
                  :part-id="part.id"
                ></ScorecardAdminResponse>
              </div>
              <div class="w-1/2">
                <ScorecardAdminComments
                  :part-id="part.id"
                  @update-comment="updateComment"
                ></ScorecardAdminComments>
              </div>
            </div>
          </template>
        </LazyAccordiansBase>
      </div>
    </td>
  </tr>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  props: {
    showIcons: {
      type: Boolean,
      required: false,
      default: true,
    },
    module: {
      type: Object,
      required: false,
      default: () => {},
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
    },
    part: {
      type: Object,
      required: true,
    },
    feature: {
      type: Object,
      required: false,
      default: null,
    },
    activeConcept: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
      partPointsVal: 0,
      new_guidance_summary: null,
      guidance_summary: null,
      partGuianceOpted: false,
      partResponseSelected: null,
      adminPoints: null,
      responseOptions: [
        { label: 'Achieved', value: 'Achieved' },
        { label: 'Anticipated', value: 'Anticipated' },
        {
          label: 'Anticipated, Pending On-site Assessment',
          value: 'Anticipated, Pending On-site Assessment',
        },
        { label: 'Not Achieved', value: 'Not Achieved' },
        { label: 'Not Anticipated', value: 'Not Anticipated' },
        { label: 'Not Applicable', value: 'Not Applicable' },
        { label: 'Not Attempted', value: 'Not Attempted' },
        { label: 'Partially Anticipated', value: 'Partially Anticipated' },
        { label: 'Partially Achieved', value: 'Partially Achieved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Pending Documentation', value: 'Pending Documentation' },
        {
          label: 'Pending Documentation, Pending On-site Assessment',
          value: 'Pending Documentation, Pending On-site Assessment',
        },
        {
          label: 'Pending On-site Assessment',
          value: 'Pending On-site Assessment',
        },
        { label: 'Withdrawn', value: 'Withdrawn' },
      ],
    }
  },
  computed: {
    ...mapGetters('review', ['pendingReview']),
    ...mapGetters('scorecard', ['filterPartGuidance']),
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
      scorecard: (state) => state.scorecard.scorecard,
      adminReviewResponses: (state) => state.scorecard.adminReviewResponses,
    }),
    getPartPointsOptions() {
      const points = []

      let maxPoints = 0
      if (this.part && this.module.type === 'v2') {
        if (
          this.module.project_type === 'cs' &&
          this.part.possible_core_points !== null
        ) {
          maxPoints = Math.max(...this.part.possible_core_points)
        } else if (this.part.possible_points !== null) {
          maxPoints = Math.max(...this.part.possible_points)
        }
      }

      if (this.part && this.module.type === 'v2-pilot') {
        maxPoints = this.part.points
      }

      if (maxPoints) {
        for (let index = 1; index <= maxPoints; index++) {
          if (index <= 1) {
            points.push({ label: 'Point ' + index, value: index })
          } else {
            points.push({ label: 'Points ' + index, value: index })
          }
        }
      } else {
        return [{ label: '', value: '' }]
      }
      return points
    },
    getAdminPartPointsOptions() {
      const points = []

      let maxPoints = 0
      if (this.part && this.module.type === 'v2') {
        if (
          this.module.project_type === 'cs' &&
          this.part.possible_core_points !== null
        ) {
          maxPoints = Math.max(...this.part.possible_core_points)
        } else if (this.part.possible_points !== null) {
          maxPoints = Math.max(...this.part.possible_points)
        } else if (
          this.part.possible_core_points === null &&
          this.part.possible_points === null &&
          this.part.points !== null
        ) {
          maxPoints = this.part.points
        }
      }

      if (this.part && this.module.type === 'v2-pilot') {
        maxPoints = this.part.points
      }

      if (maxPoints) {
        for (let index = 0.5; index <= maxPoints; index = index + 0.5) {
          if (index <= 1) {
            points.push({ label: 'Point ' + index, value: index })
          } else {
            points.push({ label: 'Points ' + index, value: index })
          }
        }
      } else {
        return [{ label: 'Points Anticipated/Pending/Achieved', value: '' }]
      }
      return points
    },
    checkPartImplementPhaseStatus() {
      if (this.part && this.part.scorecard_part.length) {
        return this.part.scorecard_part[0].implementation
      } else {
        return ''
      }
    },
    checkPartPhaseStatus() {
      if (this.part && this.part.scorecard_part.length) {
        return this.part.scorecard_part[0].assessment
      } else {
        return ''
      }
    },

    guidancePoints() {
      if (this.part.scorecard_part[0]) {
        return this.part.scorecard_part[0].guidance_points
      }
      return null
    },
    response() {
      if (this.part.scorecard_part[0]) {
        return this.part.scorecard_part[0].response
      }
      return null
    },
    partResponse() {
      const response = ''
      const index = this.pendingReview
        ? this.adminReviewResponses.findIndex(
            (a) => a.id === this.pendingReview.id
          )
        : -1
      if (index !== -1) {
        if (this.adminReviewResponses[index].responses.length) {
          const result = this.adminReviewResponses[index].responses.filter(
            (a) => a.part_id === this.part.id
          )
          if (result.length) {
            return result[0]
          }
        }
      }
      return response
    },
    showMultiPoints() {
      if (this.part.points) {
        if (this.module.type === 'v2-pilot') {
          if (
            this.part.min_points > 0 &&
            this.part.min_points < this.part.points &&
            this.part.points > 1
          ) {
            return true
          }
        } else if (
          (this.part.possible_points !== null &&
            this.module.project_type !== 'cs') ||
          (this.part.possible_core_points !== null &&
            this.module.project_type === 'cs')
        ) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    partResponse: {
      handler() {
        this.partResponseSelected = this.partResponse.response

        // When setting Admin Response, default to User Selection points unless there is an Admin Point Selection
        if (!this.partResponse.points) {
          this.adminPoints = this.partPointsVal
        } else {
          this.adminPoints = this.partResponse.points
        }
      },
      deep: true,
    },
    expanded(value) {
      if (value) {
        this.$store.dispatch('scorecard/getPartGuidance', this.part.id)
        this.partResponseSelected = this.partResponse.response
        this.adminPoints = this.partResponse.points

        // Default Admin Points to user points if Admin Points are not selected
        if (!this.partResponse.points) {
          this.adminPoints = this.partPointsVal
        }

        // Admin Points Dropdown should be empty if Response is "Not Attempted"
        if (this.partResponse.response === 'Not Attempted') {
          this.adminPoints = 0
        }
      }
    },
    response() {
      if (this.part.scorecard_part.length > 0) {
        this.partPointsVal =
          this.part.scorecard_part[0].response === 'yes'
            ? this.part.scorecard_part[0].points
            : 0
      }
    },
    part: {
      handler() {
        if (this.part.scorecard_part.length > 0) {
          this.guidance_summary = this.part.scorecard_part[0].summary
          this.partPointsVal =
            this.part.scorecard_part[0].response === 'yes'
              ? this.part.scorecard_part[0].points
              : 0
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.part.scorecard_part.length > 0) {
      this.guidance_summary = this.part.scorecard_part[0].summary
      this.partPointsVal = this.part.scorecard_part[0].points

      // Pro populate the admin points on load
      if (this.part && this.part.scorecard_part.length && this.pendingReview) {
        const possiblePoints = Array(this.part.scorecard_part[0].points)
          .fill()
          .map((point, i) => `${i === 0 ? 'Point' : 'Points'} ${i + 1}`)
        this.setAdminPoints(possiblePoints.length)
      }
    }
  },
  methods: {
    ...mapActions('scorecard', [
      'updateReviewResponses',
      'setReviewResponses',
      'storePartGuidance',
    ]),
    addCitations(fieldText, projectInfo = null) {
      fieldText = fieldText.replace(/<span>/g, '')
      fieldText = fieldText.replace(/<\/span>/g, '')
      fieldText = fieldText.replace(/CIT:/g, '')
      const pattern = /(<sup>(\[\d*(,*\d*-*\d*)*\])<\/sup>)/g
      const temp = fieldText.match(new RegExp(pattern.source, pattern.flags))
      if (temp) {
        const result = fieldText
          .match(new RegExp(pattern.source, pattern.flags))
          .map((match) => new RegExp(pattern.source, pattern.flags).exec(match))
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== null) {
            const oldMatch = result[i][2]
            const newResult = ''
            fieldText = fieldText.replace(oldMatch, newResult)
          }
        }
      }
      return this.unitFilter(fieldText, projectInfo)
    },
    unitFilter(data, projectInfo = null) {
      let e = data
      const b = e.match(/{{well-unit}}(.*?){{\/well-unit}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-unit}}')
          let temp = element.replace(/{{\/?well-unit}}/g, '')
          temp = this.$store.state.scorecard.activeFilters.imperial
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      if (projectInfo) {
        return this.pointsFilter(e, projectInfo)
      } else {
        return e
      }
    },
    pointsFilter(data, projectInfo) {
      const projectTypeIsWELLCore = projectInfo.project_type === 'cs'
      let e = data
      const b = e.match(/{{well-points}}(.*?){{\/well-points}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-points}}')
          let temp = element.replace(/{{\/?well-points}}/g, '')
          temp = !projectTypeIsWELLCore
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      return e
    },
    async updatePartGuidance() {
      const data = {
        summary: this.new_guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      await this.$store.dispatch('scorecard/updatePartGuidance', data)
      this.guidance_summary = this.new_guidance_summary
      this.new_guidance_summary = ''
    },
    showIfGuidanceTrue() {
      const flag = false
      let max = 0
      const maxValueObject = this.filterPartGuidance.map((key) => {
        return key.points
      })
      max = Math.max.apply(null, maxValueObject)
      if (this.part.scorecard_part.length && max > 0) {
        if (parseInt(this.part.scorecard_part[0].guidance_points) > 0) {
          this.partGuianceOpted = true
        } else {
          this.partGuianceOpted = false
        }
        return true
      }
      return flag
    },
    togglePartGuidance() {
      let max = 0
      if (this.partGuianceOpted) {
        const maxValueObject = this.filterPartGuidance.map((key) => {
          return key.points
        })
        max = Math.max.apply(null, maxValueObject)
      }
      const data = {
        partId: this.part.id,
        scorecardPartId: this.part.scorecard_part[0].id,
        response: this.part.scorecard_part.length
          ? this.part.scorecard_part[0].response
          : 'yes',
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        guidancePoints: {
          guidance_points: max,
        },
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
        scorecardId: this.scorecard.id,
      }
      this.storePartGuidance(data)
    },
    removePartGuidance() {
      this.guidance_summary = ''
      const data = {
        summary: this.guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      this.$store.dispatch('scorecard/updatePartGuidance', data)
    },
    getSubPartTitle(subpart) {
      let title = 'For '
      const spaceTypesInc = subpart.space_types_included
      if (spaceTypesInc.length !== 0) {
        if (spaceTypesInc.length === 1) {
          title += spaceTypesInc[0].name
        } else {
          title += spaceTypesInc[0].name
          for (let i = 1; i < spaceTypesInc.length; i++) {
            if (i === spaceTypesInc.length - 1) {
              title += ' & ' + spaceTypesInc[i].name
            } else {
              title += ', ' + spaceTypesInc[i].name
            }
          }
        }
      }
      return title + ''
    },
    setResponse(value) {
      if (value) {
        const data = {
          data: {
            part_id: this.part.id,
            response: value,
            model_type:
              this.pendingReview && this.pendingReview.project_id
                ? 'ProjectReview'
                : 'Review',
          },
          id: this.pendingReview.id,
          phase: this.pendingReview.phase,
        }
        if (this.partResponse) {
          data.responseId = this.partResponse.id
          this.updateReviewResponses(data)
        } else {
          this.setReviewResponses(data)
        }
      }
    },
    setAdminPoints(value) {
      if (value) {
        const data = {
          data: {
            part_id: this.part.id,
            response: this.partResponseSelected,
            points: this.adminPoints,
            model_type:
              this.pendingReview && this.pendingReview.project_id
                ? 'ProjectReview'
                : 'Review',
          },
          id: this.pendingReview ? this.pendingReview.id : '',
          phase: this.pendingReview ? this.pendingReview.phase : '',
        }
        if (this.partResponse) {
          data.responseId = this.partResponse.id
          this.updateReviewResponses(data)
        } else {
          this.setReviewResponses(data)
        }
      }
    },
    setPoints(e) {
      const data = {
        partId: this.part.id,
        response: 'yes',
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.partPointsVal,
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
      }
      this.$store.dispatch('scorecard/updatePart', data)
    },
    sendResponse(response) {
      const data = {
        partId: this.part.id,
        response,
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
      }
      this.$store.dispatch('scorecard/updatePart', data)
    },
    updateComment(payload) {
      this.$refs.adminResponse.commentNote = payload.comment.description
      this.$refs.adminResponse.editMode = true
      this.$refs.adminResponse.responseId = payload.responseId
      this.$refs.adminResponse.commentId = payload.comment.id
      this.$refs.adminResponse.points = payload.comment.points
      this.$refs.adminResponse.forceReMount++
    },
  },
}
</script>
