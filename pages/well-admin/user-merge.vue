<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo heading="Merge Accounts" />
        </NavBreadcrumbs>

        <div class="shadow-lg border rounded-lg p-5 mb-5 space-y-2">
          <FormulateForm v-if="currentTab === 'Users'" @submit="viewTable">
            <FormulateInput
              v-model="removeEmail"
              type="text"
              label="The email of the account you wish to remove *"
              validation="required"
              @change="hideRemoveEmailOptions = false"
            />
            <div
              v-if="users && removeEmail.length > 0 && !hideRemoveEmailOptions"
              class="h-56 overflow-y-scroll space-y-1"
            >
              <div
                v-for="(user, index) in users.data"
                :key="index"
                class="
                  cursor-pointer
                  transition-colors
                  hover:bg-primary-600 hover:text-white
                  bg-primary-100
                  p-2
                  rounded-lg
                  text-primary-600
                "
                @click="
                  ;(formData.removeUserId = user.id),
                    (removeEmail = user.email),
                    (hideRemoveEmailOptions = true)
                "
              >
                {{ user.name }} ({{ user.email }})
              </div>
            </div>
            <FormulateInput
              v-model="keepEmail"
              type="text"
              label="The email of the account you wish to keep *"
              validation="required"
              @change="hideKeepEmailOptions = false"
            />
            <FormulateInput
              v-model="removeOrg"
              type="select"
              :options="[
                { label: 'Yes', value: 1 },
                { label: 'No', value: 0 },
              ]"
              validation="required"
              label="Remove all organization affiliations"
            />
            <div
              v-if="users && keepEmail.length > 0 && !hideKeepEmailOptions"
              class="h-56 overflow-y-scroll space-y-1"
            >
              <div
                v-for="(user, index) in users.data"
                :key="index"
                class="
                  cursor-pointer
                  transition-colors
                  hover:bg-primary-600 hover:text-white
                  bg-primary-100
                  p-2
                  rounded-lg
                  text-primary-600
                "
                @click="
                  ;(formData.keepUserId = user.id),
                    (keepEmail = user.email),
                    (hideKeepEmailOptions = true)
                "
              >
                {{ user.name }} ({{ user.email }})
              </div>
            </div>
            <div class="w-40 pt-4">
              <FormulateInput type="submit" label="Review Account Data" />
            </div>
          </FormulateForm>
          <div v-if="currentTab === 'User Summaries'">
            <div v-if="removeUserSummary && keepUserSummary">
              <table
                class="
                  w-full
                  border
                  shadow
                  rounded-lg
                  benefits-table
                  table table-responsive
                  mg-y-15
                  shadow-base
                "
              >
                <thead>
                  <tr>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      Basic Information
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Delete
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Keep
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-primary-300">
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      ID
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.id }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ keepUserSummary.id }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Name
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.name }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ keepUserSummary.name }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Email
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.email }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ keepUserSummary.email }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                class="
                  mt-4
                  border
                  shadow
                  rounded-lg
                  w-full
                  benefits-table
                  table table-responsive
                  mg-y-15
                  shadow-base
                "
              >
                <thead>
                  <tr>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      Additional Information
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Delete
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Keep
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-primary-300">
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Organization
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.organization"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.organization }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.organization"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.organization }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Industry
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.industry"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.industry }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.industry"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.industry }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Job Title
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.job_title"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.job_title }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.job_title"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.job_title }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Languages
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.languages"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <span
                            v-for="(
                              language, index
                            ) in removeUserSummary.languages"
                            :key="index"
                          >
                            {{ language
                            }}<span
                              v-if="
                                index !== removeUserSummary.languages.length - 1
                              "
                              >,</span
                            >
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.languages"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <span
                            v-for="(
                              language, index
                            ) in keepUserSummary.languages"
                            :key="index"
                          >
                            {{ language
                            }}<span
                              v-if="
                                index !== keepUserSummary.languages.length - 1
                              "
                              >,</span
                            >
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      DOB
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.dob"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.dob }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.dob"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.dob }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Gender
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gender"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.gender }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gender"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.gender }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Public Profile
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.profile_public"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.profile_public === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.profile_public"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.profile_public === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Website
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.website"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.website }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.website"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.website }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Twitter
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.twitter"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.twitter }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.twitter"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.twitter }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      GPlus
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gplus"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.gplus }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gplus"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.gplus }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Facebook
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.facebook"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.facebook }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.facebook"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.facebook }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      LinkedIn
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.linkedin"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.linkedin }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.linkedin"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.linkedin }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Phone Number
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.phone_number"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.phone_number }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.phone_number"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.phone_number }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      About
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.about"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="removeUserSummary.about"> </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.about"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="keepUserSummary.about"> </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Inspiration
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.inspiration"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="removeUserSummary.inspiration"> </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.inspiration"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="keepUserSummary.inspiration"> </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Wellness Mean
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.wellness_mean"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="removeUserSummary.wellness_mean">
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.wellness_mean"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <span v-html="keepUserSummary.wellness_mean"> </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      WELL AP
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.well_ap"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.well_ap === 0">No</div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gender"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.gender === 0">No</div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      WELL Faculty
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.well_faculty"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.well_faculty === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.well_faculty"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.well_faculty === 0">No</div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      WELL Advisory
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.well_advisory"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.well_advisory === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.well_advisory"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.well_advisory === 0">No</div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Featured Profile
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.featured_profile"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.featured_profile === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.featured_profile"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.featured_profile === 0">
                          No
                        </div>
                        <div v-else>Yes</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Credential Start Date
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_start_date"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.credential_start_date">
                          {{
                            $dayjs(
                              removeUserSummary.credential_start_date
                            ).format('MMM DD, YYYY')
                          }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_start_date"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.credential_start_date">
                          {{
                            $dayjs(
                              keepUserSummary.credential_start_date
                            ).format('MMM DD, YYYY')
                          }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Credential End Date
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_end_date"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.credential_end_date">
                          {{
                            $dayjs(
                              removeUserSummary.credential_end_date
                            ).format('MMM DD, YYYY')
                          }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_end_date"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.credential_end_date">
                          {{
                            $dayjs(keepUserSummary.credential_end_date).format(
                              'MMM DD, YYYY'
                            )
                          }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Credential Opt Date
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_opt_date"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div v-if="removeUserSummary.credential_opt_date">
                          {{
                            $dayjs(
                              removeUserSummary.credential_opt_date
                            ).format('MMM DD, YYYY')
                          }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.credential_opt_date"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div v-if="keepUserSummary.credential_opt_date">
                          {{
                            $dayjs(keepUserSummary.credential_opt_date).format(
                              'MMM DD, YYYY'
                            )
                          }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Gb Award
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gb_award"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          {{ removeUserSummary.gb_award }}
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.gb_award"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          {{ keepUserSummary.gb_award }}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Roles
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.roles"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <span
                            v-for="(role, index) in removeUserSummary.roles"
                            :key="index"
                          >
                            {{ role
                            }}<span
                              v-if="
                                index !== removeUserSummary.roles.length - 1
                              "
                              >,</span
                            >
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.roles"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <span
                            v-for="(role, index) in keepUserSummary.roles"
                            :key="index"
                          >
                            {{ role
                            }}<span
                              v-if="index !== keepUserSummary.roles.length - 1"
                              >,</span
                            >
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Profile Picture
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.profile_pic"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <div
                            v-if="removeUserSummary.profile_pic"
                            class="w-20 h-20 bg-center bg-cover"
                            :style="{
                              'background-image': `url(${removeUserSummary.profile_pic})`,
                            }"
                          ></div>
                          <div
                            v-else
                            class="w-20 h-20 bg-center bg-cover"
                            :style="{
                              'background-image': `url(/profile/avatar.jpg)`,
                            }"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.profile_pic"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <div
                            v-if="keepUserSummary.profile_pic"
                            class="w-20 h-20 bg-center bg-cover"
                            :style="{
                              'background-image': `url(${keepUserSummary.profile_pic})`,
                            }"
                          ></div>
                          <div
                            v-else
                            class="w-20 h-20 bg-center bg-cover"
                            :style="{
                              'background-image': `url(/profile/avatar.jpg)`,
                            }"
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                class="
                  mt-5
                  w-full
                  border
                  shadow
                  rounded-lg
                  benefits-table
                  table table-responsive
                  mg-y-15
                  shadow-base
                "
              >
                <thead>
                  <tr>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      Addresses
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Delete
                    </th>
                    <th
                      style="width: 33%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      User To Keep
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-primary-300">
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Primary
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.primary_address"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <span v-if="removeUserSummary.addresses[0]">
                            {{ removeUserSummary.addresses[0].street }},
                            {{ removeUserSummary.addresses[0].city }},
                            {{ removeUserSummary.addresses[0].state }},
                            {{ removeUserSummary.addresses[0].country_code }},
                            {{ removeUserSummary.addresses[0].postal_code }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.primary_address"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <span v-if="keepUserSummary.addresses[0]">
                            {{ keepUserSummary.addresses[0].street }},
                            {{ keepUserSummary.addresses[0].city }},
                            {{ keepUserSummary.addresses[0].state }},
                            {{ keepUserSummary.addresses[0].country_code }},
                            {{ keepUserSummary.addresses[0].postal_code }}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Billing
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.billing_address"
                          type="radio"
                          value="from"
                          class="mr-2"
                        />
                        <div>
                          <span v-if="removeUserSummary.addresses[1]">
                            {{ removeUserSummary.addresses[1].street }},
                            {{ removeUserSummary.addresses[1].city }},
                            {{ removeUserSummary.addresses[1].state }},
                            {{ removeUserSummary.addresses[1].country_code }},
                            {{ removeUserSummary.addresses[1].postal_code }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      <div class="flex">
                        <FormulateInput
                          v-model="formData.billing_address"
                          type="radio"
                          value="to"
                          class="mr-2"
                        />
                        <div>
                          <span v-if="keepUserSummary.addresses[0]">
                            {{ keepUserSummary.addresses[1].street }},
                            {{ keepUserSummary.addresses[1].city }},
                            {{ keepUserSummary.addresses[1].state }},
                            {{ keepUserSummary.addresses[1].country_code }},
                            {{ keepUserSummary.addresses[1].postal_code }}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                class="
                  mt-5
                  w-full
                  border
                  shadow
                  rounded-lg
                  benefits-table
                  table table-responsive
                  mg-y-15
                  shadow-base
                "
              >
                <thead>
                  <tr>
                    <th
                      style="width: 50%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      Module Summary
                    </th>
                    <th
                      style="width: 50%"
                      class="
                        w-1/3
                        px-6
                        py-3
                        bg-primary-700
                        text-left text-xs
                        leading-4
                        font-medium
                        text-white
                        uppercase
                        tracking-wider
                      "
                    >
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-primary-300">
                  <tr v-if="removeUserSummary.summary.projects > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Projects
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.projects }} Projects to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.portfolios > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Portfolios
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.portfolios }} Portfolio to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.exams > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Exams
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.exams }} Exams to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.aaps > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      AAPs
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.aaps }} AAPs to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.invoices > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Invoices
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.invoices }} Invoices to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.coach_messages > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Coach Messages
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.coach_messages }} Coach
                      messages to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.faculty > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Faculty
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.faculty }} Faculty to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.ce_hours > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      CE Hours
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.ce_hours }} CE hours to be
                      reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.coaching_projects > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Coaching Projects
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.coaching_projects }} Coaching
                      projects to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.reviewer_projects > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Reviewer projects
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.reviewer_projects }} Reviewer
                      projects to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.pta_projects > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      PTA Projects
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.pta_projects }} PTA projects
                      to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.coaching_portfolios > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Coaching Portfolios
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.coaching_portfolios }}
                      Coaching portfolios to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.reviewer_portfolios > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      Reviewer Portfolios
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.reviewer_portfolios }}
                      Reviewer portfolios to be reassigned
                    </td>
                  </tr>
                  <tr v-if="removeUserSummary.summary.pta_portfolios > 0">
                    <td
                      class="
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      PTA Portfolios
                    </td>
                    <td
                      class="
                        bg-primary-200
                        px-6
                        py-4
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ removeUserSummary.summary.pta_portfolios }} PTA
                      portfolios to be reassigned
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="mt-5 flex">
                <div class="ml-auto w-48">
                  <WButtonsBase @click.native="mergeUsers">
                    Merge Users
                  </WButtonsBase>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="mx-auto text-center">
                <WLoadingSpinner class="mx-auto" />
                <div class="mt-3 text-primary-600">
                  Loading User Summaries...
                </div>
              </div>
            </div>
          </div>
          <div v-if="currentTab === 'Confirmation'">
            You have successfully merged the users
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentTab: 'Users',
      removeEmail: '',
      keepEmail: '',
      hideRemoveEmailOptions: false,
      hideKeepEmailOptions: false,
      keepUserSummary: null,
      removeUserSummary: null,
      removeOrg: 0,
      formData: {
        removeUserId: null,
        keepUserId: null,
        organization: 'to',
        industry: 'to',
        job_title: 'to',
        languages: 'to',
        dob: 'to',
        gender: 'to',
        profile_public: 'to',
        website: 'to',
        twitter: 'to',
        gplus: 'to',
        facebook: 'to',
        linkedin: 'to',
        phone_number: 'to',
        about: 'to',
        inspiration: 'to',
        wellness_mean: 'to',
        well_ap: 'to',
        well_faculty: 'to',
        well_advisory: 'to',
        featured_profile: 'to',
        credential_start_date: 'to',
        credential_end_date: 'to',
        credential_opt_date: 'to',
        gb_award: 'to',
        roles: 'to',
        profile_pic: 'to',
        primary_address: 'to',
        billing_address: 'to',
      },
    }
  },
  computed: {
    ...mapState({
      users: (state) => state.user.adminUsersList,
    }),
  },
  watch: {
    removeEmail: {
      handler(oldVal, newVal) {
        this.$store.dispatch('user/getAdminUsersList', {
          email: this.removeEmail,
        })
      },
    },
    keepEmail: {
      handler(oldVal, newVal) {
        this.$store.dispatch('user/getAdminUsersList', {
          email: this.keepEmail,
        })
      },
    },
  },
  async mounted() {
    await this.$store.dispatch('user/getAdminUsersList')
  },
  methods: {
    mergeUsers() {
      const data = {}

      for (const [key, value] of Object.entries(this.formData)) {
        if (value === 'to') {
          data[key] = this.keepUserSummary[key]
        } else {
          data[key] = this.removeUserSummary[key]
        }
      }

      data.keepUserId = this.keepUserSummary.id
      data.removeUserId = this.removeUserSummary.id
      data.id = this.keepUserSummary.id
      data.email = this.keepUserSummary.email
      data.name = this.keepUserSummary.name
      data.last_name = this.keepUserSummary.last_name
      data.membership_remove = this.removeOrg

      this.$store
        .dispatch('user/mergeUsers', data)
        .then((this.currentTab = 'Confirmation'))
    },
    viewTable() {
      this.currentTab = 'User Summaries'
      this.$store
        .dispatch('user/getUserSummaryById', this.formData.removeUserId)
        .then((res) => (this.removeUserSummary = res.data))
      this.$store
        .dispatch('user/getUserSummaryById', this.formData.keepUserId)
        .then((res) => (this.keepUserSummary = res.data))
    },
  },
  head() {
    return {
      title: `Admin Merge Users`,
    }
  },
}
</script>
