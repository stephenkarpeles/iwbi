<template>
  <div
    class="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3"
  >
    <div class="space-y-6 lg:col-start-1 lg:col-span-2">
      <div
        v-if="unpaidInvoices.length"
        class="py-2 align-middle md:inline-block min-w-full"
      >
        <WHeadingsHFour heading="Unpaid Invoices" />
        <hr class="border-gray-200 mb-3" />
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Invoice
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="inv in unpaidInvoices"
                  :key="inv.id"
                  class="bg-white"
                >
                  <td
                    class="p-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    <WLinksBase
                      v-if="allowPayment(inv)"
                      @click.native="
                        $router.push(
                          `/invoice/${inv.invoice_number}?redirect=/projects/${project.type}/${project.project_number}/overview`
                        )
                      "
                      >{{ inv.invoice_number }}</WLinksBase
                    >
                    <WLinksBase v-else>{{ inv.invoice_number }}</WLinksBase>
                    <span class="text-gray-400 font-light">{{
                      $dayjs(inv.created_at).format('MMM DD, YYYY')
                    }}</span>
                  </td>
                  <td class="p-4 whitespace-pre-wrap text-sm text-gray-500">
                    <div class="w-84">{{ inv.description }}</div>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-sm font-semibold text-right text-gray-500"
                  >
                    ${{ inv.total_amount | currency }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CardTimeline
        v-if="project.date_certified"
        class="mt-2"
        :module="project"
        title="Ongoing reporting and recertification"
        sub-title="Ongoing reporting and recertification are the heart of what makes the
        WELL system an impactful tool over the lifespan of a project."
      />

      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Project Information
          </h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Project ID</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.project_number }}
              </dd>
            </div>
            <div
              v-if="project.parent && project.parent.project_number"
              class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Initial Project ID
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <WLinksBase
                  :link="`/projects/v1/${project.parent.project_number}/dashboard`"
                >
                  {{ project.parent.project_number }}
                </WLinksBase>
              </dd>
            </div>
            <div
              v-if="project.child && project.child.project_number"
              class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Renewed Project ID
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <WLinksBase
                  :link="`/projects/v1/${project.child.project_number}/dashboard`"
                >
                  {{ project.child.project_number }}
                </WLinksBase>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Project name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.name }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Building sector</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ sectorLabel }}
              </dd>
            </div>
            <div
              v-if="project.v1_project_type !== null"
              class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                WELL Project type
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ projectTypeLabel }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Gross area</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  {{ project.area | formatNumber }}
                  <span v-if="project.v1_project_standard !== 'community'">
                    sq ft
                  </span>
                  <span v-else> acre </span>
                </div>
                <div class="text-gray-500">
                  {{ project.area_in_meter | formatNumber }}
                  <span v-if="project.v1_project_standard !== 'community'">
                    sq m
                  </span>
                  <span v-else> hectare </span>
                </div>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Current status of project
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.current_status">
                  {{
                    projecStatusList.find(
                      (status) => status.value === project.current_status
                    ).text
                  }}
                </span>
              </dd>
            </div>
            <div
              v-if="project.no_of_occupants"
              class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Number of (expected) occupants
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.no_of_occupants }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Project location
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div
                  v-if="
                    project.addresses &&
                    project.addresses.length > 0 &&
                    project.addresses[0].street
                  "
                >
                  <span>
                    {{ project.addresses[0].street }}
                  </span>
                </div>

                <div
                  v-if="
                    (project.addresses &&
                      project.addresses.length > 0 &&
                      project.addresses[0].city) ||
                    (project.addresses &&
                      project.addresses.length > 0 &&
                      project.addresses[0].state)
                  "
                >
                  <span v-if="project.addresses[0].city">
                    {{ project.addresses[0].city }},&nbsp;
                  </span>
                  <span v-if="project.addresses[0].state">
                    {{ project.addresses[0].state }}
                  </span>
                </div>

                <div
                  v-if="
                    project.addresses &&
                    project.addresses.length > 0 &&
                    project.addresses[0].country_code
                  "
                >
                  <span>
                    {{
                      countries.filter(
                        (a) => a.code === project.addresses[0].country_code
                      )[0].name
                    }}
                  </span>
                </div>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Project scope and premises
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.scope_and_premises }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Anticipated date of construction completion
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.construction_completion_date">
                  {{
                    $dayjs(project.construction_completion_date).format(
                      'MMM DD, YYYY'
                    )
                  }}
                </span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Estimated date of documentation submission
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.doc_sub_date_est">
                  {{ $dayjs(project.doc_sub_date_est).format('MMM DD, YYYY') }}
                </span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Owner</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>{{ project.owner_name }}</div>
                <div class="text-gray-500">{{ project.owner_email }}</div>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Owner industry</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.industry }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Owner website</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a
                  :href="project.org_website"
                  class="text-primary-500"
                  target="_blank"
                  >{{ project.org_website }}</a
                >
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Owner organization overview
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.org_overview }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Target certification level
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.target_cert_level }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                WELL project goals and vision
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ project.goals_and_vision }}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Public project</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.project_public === 1">
                  Yes, I want to show my project in Directory
                </span>
                <span v-else>No, I want my project to be private</span>
              </dd>
            </div>
            <div
              v-if="registrationInvoice"
              class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">
                Registration payment
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span> ${{ registrationInvoice.amount_sum | currency }} </span>
                <span
                  v-if="
                    registrationInvoice.status === 'paid' ||
                    registrationInvoice.status === 'waived'
                  "
                  class="text-green-500"
                >
                  (Paid)
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        v-if="currentUser.role.includes('well-admin')"
        class="bg-white shadow overflow-hidden sm:rounded-lg"
      >
        <div class="px-2 py-5 sm:px-6 bg-primary-500">
          <h3 class="text-lg leading-6 font-medium text-white">
            Admin Information
          </h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Coaching contact
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div v-if="project.coach">
                  {{ project.coach.name }} {{ project.coach.last_name }}<br />
                  <span class="text-gray-500">{{ project.coach.email }}</span>
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Project phase</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.project_phase">
                  {{ project.project_phase }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                WELL coaching support (over project life)
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.coaching_support_time">
                  {{ wellCoachingSupport[project.coaching_support_time] }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                WELL enthusiasm level
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.enthusiasm_level">
                  {{ project.enthusiasm_level }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Project challenges
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div v-if="project.challenges">
                  <ul
                    v-for="(challenge, index) in project.challenges"
                    :key="index"
                    class="list-disc pl-4"
                  >
                    <li>{{ challenge }}</li>
                  </ul>
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                WELL challenges notes
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.challenge_note">
                  {{ project.challenge_note }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                WELL communication notes
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span v-if="project.communication_note">
                  {{ project.communication_note }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <div class="lg:col-start-3 lg:col-span-1">
      <div
        v-if="project.cert_status && project.cert_status !== 'na'"
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6"
      >
        <div class="flow-root">
          <strong v-if="project.cert_status === 'Compliance'" class="pd-15"
            >WELL Core & Shell Compliant</strong
          >
          <strong v-else-if="project.cert_status === 'Pilot'" class="pd-15"
            >WELL Certified</strong
          >
          <img
            v-else-if="project.v1_project_standard === 'community'"
            :src="
              'https://cdn.wellcertified.com/static/images/well-community-' +
              project.cert_status.toLowerCase() +
              '-solid.png'
            "
            class="img img-fluid w-48 mx-auto"
          />
          <img
            v-else
            :src="
              'https://cdn.wellcertified.com/static/images/well-' +
              project.cert_status.toLowerCase() +
              '-solid-new.png'
            "
            class="img img-fluid w-48 mx-auto"
          />
          <div class="flex flex-col justify-stretch">
            <span
              class="text-sm font-semibold text-primary-900 text-center whitespace-nowrap mt-2"
              >Your WELL Certification seal is valid<br />from
              {{ $dayjs(project.date_certified).format('MMM DD, YYYY') }}
              to
              {{
                $dayjs(project.date_certified)
                  .add(3, 'year')
                  .format('MMM DD, YYYY')
              }}</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="project.hsr_status !== null && project.hsr_achieved_date !== null"
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6"
      >
        <div class="flow-root mt-1">
          <img
            src="https://cdn.wellcertified.com/static/images/well-health-safety-seal.png"
            class="img img-fluid w-40 mx-auto"
          />
          <div class="flex flex-col justify-stretch">
            <span
              class="text-sm font-semibold text-primary-900 text-center whitespace-nowrap mt-2"
              >Your WELL Health-Safety rating seal is valid<br />from
              {{ expiresFrom }}
              to
              {{ expiresTo }}</span
            >
          </div>
          <div class="mt-4 mb-2">
            <WButtonsBase
              v-if="renewDate"
              type="primaryInverted"
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr-recertification`
                )
              "
              >Renew now</WButtonsBase
            >
          </div>
          <div v-if="recertification" class="mt-4 mb-2">
            <WButtonsBase
              type="primaryInverted"
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr-checklist`
                )
              "
            >
              Access your renewal checklist
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        v-if="
          project.hsr_opt !== 1 && project.v1_project_standard !== 'community'
        "
        class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200 mb-3"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2">
          Achieve a WELL Health-Safety Rating
        </h5>
        <div class="mt-2 flow-root">
          <ul class="list-disc px-5 py-4 text-gray-500 text-light text-sm">
            <li>
              Learn about the
              <a
                href="https://www.wellcertified.com/health-safety"
                target="_blank"
                >WELL Health Safety Rating</a
              >.
            </li>
            <li>
              Enroll your project & take the necessary steps to prioritize the
              health and safety of the people who interact with your space.
            </li>
            <li>
              Submit feature-specific documentation reflecting operational
              policies, maintenance protocols and emergency plans.
            </li>
            <li>
              Earn the WELL Health-Safety Rating and promote your achievement.
            </li>
          </ul>
          <div class="flex flex-col justify-stretch">
            <WButtonsBase
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr`
                )
              "
            >
              Enroll now
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        v-if="project.hsr_opt && !project.hsr_achieved_date"
        class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200 mb-3"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2">
          WELL Health-Safety Rating Journey
        </h5>
        <div class="mt-2 flow-root">
          <ul class="list-disc px-5 py-4 text-gray-500 text-light text-sm">
            <li>
              Take the necessary steps to prioritize the health and safety of
              the people who interact with your space.
            </li>
            <li>
              Submit feature-specific documentation reflecting operational
              policies, maintenance protocols and emergency plans.
            </li>
            <li>
              Earn the WELL Health-Safety Rating and promote your achievement.
            </li>
          </ul>
          <div class="flex flex-col justify-stretch">
            <WButtonsBase
              @click.native="
                $router.push(
                  `/projects/${project.type}/${project.project_number}/hsr-checklist`
                )
              "
            >
              Complete your checklist
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        v-if="
          project.reg_payment_status !== 'paid' &&
          project.v1_project_standard !== 'allprojectsin' &&
          registrationInvoice
        "
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2 d-flex">
          Registration fees
          <WLinksBase
            href="#"
            class="inline float-right pt-1"
            icon="download"
            @click.native="downloadRegInvoice()"
          ></WLinksBase>
        </h5>
        <div class="mt-2 flow-root">
          <div class="px-5 py-3 text-gray-500 text-light text-lg text-center">
            <strong
              >${{ registrationInvoice.amount_sum | formatNumber }}</strong
            >
          </div>
          <div class="flex flex-col justify-stretch">
            <WButtonsBase @click.native="viewRegInvoice()">
              Pay now
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2 d-flex">
          <span
            v-if="
              project.envelope_id !== null && project.agreement_status === 1
            "
          >
            Certification agreement
          </span>
          <span v-else>Next steps</span>
          <WLinksBase
            v-if="project.agreement_status !== null"
            link="https://resources.wellcertified.com/tools/well-certification-agreement/"
            class="inline float-right pt-1"
            icon="download"
            target="_blank"
          ></WLinksBase>
        </h5>
        <div class="mt-2 flow-root">
          <div class="text-gray-500 text-light text-sm py-4">
            <div
              v-if="
                project.envelope_id !== null && project.agreement_status === 1
              "
            >
              The International WELL Building Institute Certification Agreement
              has been signed by the project owner.
            </div>
            <div v-else>
              The project owner is required to sign the International WELL
              Building Institute Certification Agreement. You can send the
              agreement to the project owner for their electronic signature by
              selecting the option below.
            </div>
          </div>
          <div class="flex flex-col justify-stretch">
            <WButtonsBase
              v-if="
                project.envelope_id === null && project.agreement_status === 0
              "
              @click.native="sendOwnerAgreement()"
            >
              Send to owner
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project.envelope_id !== null && project.agreement_status === 0
              "
              @click.native="sendOwnerAgreement()"
            >
              Resend to owner
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project.envelope_id !== null && project.agreement_status === 1
              "
              @click.native="downloadOwnerAgreement()"
            >
              Download agreement
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        v-if="project && project.parent && project.parent.type === 'v1'"
        class="mb-4"
      >
        <WCardsBase
          class="h-full"
          heading="Annual reporting guidance"
          description="For WELL Certification status to remain in good standing, annual reporting should be submitted within 15 months of initial certification and then every 12 months thereafter. Features where the verification method is 'Ongoing Report' require annual reporting. More details can be found in the Renewal Guide."
        >
          <div class="mt-4 grid grid-cols-1">
            <WButtonsBase
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/documents`,
                  query: { ...$route.query },
                })
              "
            >
              Upload ongoing data report
            </WButtonsBase>
          </div>
        </WCardsBase>
      </div>

      <div
        v-if="
          project.type === 'v1' &&
          $store.state.user.currentUser.role.includes('well-admin') &&
          project.cert_status &&
          aboutToexpire
        "
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2 d-flex">
          <span> Recertification </span>
        </h5>
        <div class="mt-2 flow-root">
          <div class="text-gray-500 text-light text-sm py-4"></div>
          <div class="flex flex-col justify-stretch">
            <WButtonsBase @click.native="$refs.recertModal.isHidden = false">
              Renew Now
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div
        v-if="
          project.reg_payment_status === 'paid' &&
          !project.doc_sub_date_est &&
          !project.cert_status
        "
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2 d-flex">
          Project schedule
        </h5>
        <div class="mt-2 flow-root">
          <div class="py-4 text-gray-500 text-light text-sm">
            Please provide an estimated date for when you plan to submit for
            Preliminary Documentation Review.
          </div>
          <div class="flex flex-col justify-stretch">
            <FormulateForm class="space-y-2" @submit="updateProjectEstDate">
              <FormulateInput
                v-model="estDocSubDate"
                type="datetimepicker"
                max="9999-01-01"
                :min="today"
              />
              <FormulateInput type="submit" label="Save" />
            </FormulateForm>
          </div>
        </div>
      </div>
      <div
        v-if="
          project.reg_payment_status === 'paid' &&
          project.v1_version &&
          project.v1_project_standard !== 'allprojectsin'
        "
        class="bg-white px-4 py-5 mb-3 shadow sm:rounded-lg sm:px-6 divide-y divide-gray-200"
      >
        <h5 class="text-lg font-medium text-gray-900 mb-2 d-flex">
          Access digital standard
        </h5>
        <div class="mt-2 flow-root">
          <div class="py-4 text-gray-500 text-light text-sm">
            Based on your registration date, the WELL Building Standard
            applicable for your project is
            <strong>{{ standardVersionLabel }}</strong
            >.
          </div>
          <div class="flex flex-col justify-stretch">
            <WLinksBase :link="project.v1_standard_url" target="_blank"
              >View</WLinksBase
            >
          </div>
        </div>
      </div>
    </div>
    <WFeedbackModal
      ref="docSubmissionModal"
      class="z-20 mt-12"
      :can-manually-close="false"
    >
      <div class="md:w-96">
        <div>
          <div
            class="bg-primary-300 text-white text-lg -mx-6 -mt-6 p-6 bg-gradient-to-r from-primary-400 to-primary-900 rounded"
            v-html="estimatedDateTitle"
          ></div>
          <div class="my-5 leading-5 text-sm">
            The estimated date of documentation submission is an approximate
            date for when the project team aims to submit for WELL documentation
            review. This date can be updated at any point from the Edit tab, and
            your project is not held to submitting on this date. This date helps
            our team to better understand where your project is in the WELL
            journey so we can support your team in staying on track!
          </div>
          <div
            class="flex"
            :class="
              (estimatedDate && !estimatedDateAfter) ||
              (estimatedDateToday &&
                allReviews.length === 0 &&
                !estimatedDateAfter)
                ? 'justify-between'
                : 'justify-center'
            "
          ></div>
          <div class="mb-5">
            <FormulateInput
              :key="forceReMount"
              v-model="formData.doc_sub_date_est"
              type="datetimepicker"
              max="9999-01-01"
              label="Provided estimated date of document submission"
            />
            <WButtonsBase
              :class="{
                'opacity-50': estimatedDateAfter && newDateDiff,
              }"
              :disabled="estimatedDateAfter && newDateDiff"
              @click.native="updateProject"
              >{{
                $dayjs(project.doc_sub_date_est).format('YYYY-MM-DD') ===
                $dayjs(formData.doc_sub_date_est).format('YYYY-MM-DD')
                  ? 'Confirm'
                  : 'Update'
              }}</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="docSubmissionNoModal" class="z-20 mt-12">
      <div class="md:w-96">
        <div>
          <div
            class="text-base text-primary-900 leading-7 font-bold text-center"
          >
            You're good to go!
          </div>
          <div class="flex mt-4">
            <div class="mx-auto">
              <WButtonsBase
                type="primary"
                @click.native="$refs.docSubmissionNoModal.isHidden = true"
                >Continue the journey</WButtonsBase
              >
            </div>
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="recertModal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WHeadingsHThree heading="Recertification" />
        <p>
          This process will automatically generate a project with new Project ID
          and all the documents, team members and checklist progress will be
          duplicated into the new project ID. Please confirm that you would
          proceed and create a WELL v1 Recertification project?
        </p>

        <div class="flex w-full">
          <div class="mx-auto w-32">
            <WButtonsBase
              type="danger"
              @click.native="$refs.recertModal.isHidden = true"
              >Close</WButtonsBase
            >
          </div>
          <div class="mx-auto w-32">
            <WButtonsBase v-if="submitting" :type="'primaryInverted'">
              <span>
                <WLoadingSpinner type="button" class="mx-auto" />
              </span>
            </WButtonsBase>
            <WButtonsBase v-else @click.native="recertProject"
              >Renew now</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    countries: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      estDocSubDate: this.project.doc_sub_date_est,
      submitting: false,
      newVersionData: {
        version: null,
      },
      forceReMount: 0,
      formData: {},
      projecStatusList: [
        { text: 'Concept Design', value: 'concept_design' },
        { text: 'Schematic Design', value: 'schematic_design' },
        { text: 'Design Development', value: 'design_development' },
        {
          text: 'Construction Documentation',
          value: 'construction_documentation',
        },
        { text: 'Under construction', value: 'under_construction' },
        { text: 'Construction complete', value: 'construction_complete' },
        {
          text: 'Existing building or space',
          value: 'existing_building_or_space',
        },
      ],
      wellCoachingSupport: {
        very_high: 'Very high volume: More than 4 hours per month',
        high: 'High volume: More than 2 - 4 hours per month',
        average: 'Average volume: More than .5 - 2 hours per month',
        low: 'Low volume: .5 hrs or less',
        non_responsive: 'Non-responsive',
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      projectInvoices: (state) => state.project.projectInvoices,
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    achieveDate() {
      if (
        this.recertificationList &&
        this.recertificationList.length &&
        this.recertificationList.filter((a) => a.type === 'v2-hsr').length
      ) {
        const recert = this.recertificationList.filter(
          (a) => a.date_certified && a.type === 'v2-hsr'
        )
        if (recert.length) {
          return recert[recert.length - 1].date_certified
        } else {
          return this.project.hsr_achieved_date
        }
      } else {
        return this.project.hsr_achieved_date
      }
    },
    expiresFrom() {
      return this.$dayjs(this.achieveDate).format('MMM DD, YYYY')
    },
    expiresTo() {
      return this.$dayjs(this.achieveDate).add(1, 'year').format('MMM DD, YYYY')
    },
    newDateDiff() {
      const newDate = this.formData.doc_sub_date_est
      const docEstDate = this.$dayjs(newDate)
      const nowDate = this.$dayjs()
      return this.$dayjs(docEstDate).diff(nowDate, 'days') < 0
    },
    today() {
      return this.$dayjs().format('YYYY-MM-DD')
    },
    estimatedDate() {
      if (!this.project.doc_sub_date_est) return true
      if (
        this.project.doc_sub_date_est &&
        !this.project.doc_sub_date_est_confirm
      ) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

        const nowDate = this.$dayjs().format('YYYY-MM-DD')
        return (
          docEstDate.diff(nowDate, 'months', true) <= 2 &&
          docEstDate.diff(nowDate, 'months', true) >= 0 &&
          docEstDate.diff(nowDate, 'days') >= 1
        )
      } else if (
        this.project.doc_sub_date_est &&
        this.project.doc_sub_date_est_confirm
      ) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

        const confirmEstimateDate = this.$dayjs(
          this.project.doc_sub_date_est_confirm
        )

        const nowDate = this.$dayjs().format('YYYY-MM-DD')
        return (
          docEstDate.diff(nowDate, 'months', true) <= 2 &&
          docEstDate.diff(nowDate, 'months', true) >= 0 &&
          docEstDate.diff(nowDate, 'days') > 0 &&
          docEstDate.diff(confirmEstimateDate, 'months', true) > 2
        )
      } else {
        return false
      }
    },
    estimatedDateToday() {
      const nowDate = this.$dayjs()
      const docEstDate = this.$dayjs(this.project.doc_sub_date_est)

      if (this.project.doc_sub_date_est_confirm) {
        const confirmEstimateDate = this.$dayjs(
          this.project.doc_sub_date_est_confirm
        )
        return (
          nowDate.diff(docEstDate, 'days') === 0 &&
          nowDate.diff(confirmEstimateDate, 'hour') >= 24
        )
      } else {
        return (
          nowDate.diff(docEstDate, 'days') === 0 &&
          nowDate.diff(docEstDate, 'hour') >= 0
        )
      }
    },
    estimatedDateAfter() {
      if (this.project.doc_sub_date_est) {
        const docEstDate = this.$dayjs(this.project.doc_sub_date_est)
        const nowDate = this.$dayjs()
        return nowDate.diff(docEstDate, 'days') >= 1
      } else {
        return false
      }
    },
    estimatedDateTitle() {
      if (!this.project.doc_sub_date_est) {
        return 'Your estimated WELL documentation submittal date is missing. Please take a moment to update this!'
      }
      if (this.estimatedDateAfter) {
        return 'Your estimated WELL documentation submittal date is outdated. Please take a moment to update this!'
      } else if (this.estimatedDateToday) {
        return 'You indicated that your team is aiming to submit for WELL documentation review today. Is this up to date?'
      } else {
        return `You indicated that your team is aiming to submit for WELL documentation review on ${this.$dayjs(
          this.project.doc_sub_date_est
        ).format('MMM DD')}, <span class="font-bold">${this.$dayjs(
          this.project.doc_sub_date_est
        ).format('YYYY')}. Is this up to date?</span>`
      }
    },
    accessLevel() {
      if (this.project) {
        return this.project.members.find(
          (member) => member.id === this.currentUser.id
        )
          ? this.project.members.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : ''
      }
      return ''
    },
    renewDate() {
      if (
        this.accessLevel !== 'project-admin' &&
        this.accessLevel !== 'project-manager' &&
        !this.currentUser.role.includes('well-admin')
      ) {
        return false
      }
      if (!this.project.hsr_achieved_date) return false

      const lastRecertification = this.recertificationList.length
        ? this.recertificationList[this.recertificationList.length - 1]
        : ''
      let recertExpirationDate = ''

      if (lastRecertification) {
        if (!lastRecertification.date_certified) return false

        if (lastRecertification.date_certified)
          recertExpirationDate = this.$dayjs(lastRecertification.date_certified)
        else recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      } else {
        recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      }
      const today = this.$dayjs()
      return today.diff(recertExpirationDate, 'months', true) >= 3
    },
    aboutToexpire() {
      if (this.project.date_certified) {
        const certDate = this.$dayjs(
          this.project.date_certified,
          'YYYY-MM-DD'
        ).add(3, 'years')

        const nowDate = this.$dayjs().format('YYYY-MM-DD')
        return certDate.diff(nowDate, 'months') <= 12
      } else {
        return false
      }
    },
    unpaidInvoices() {
      return this.projectInvoices.filter((a) => a.status === 'unpaid')
    },
    registrationInvoice() {
      const inv = this.projectInvoices.filter(
        (a) => a.invoicable_sub_part === 'registration'
      )
      return inv.length ? inv[0] : null
    },
    sectorLabel() {
      const wellStandardList = {
        office: 'WELL Building Standard for Commercial & Institutional Office',
        residential:
          'WELL Building Standard for Multifamily Residential (Pilot)',
        retail: 'WELL Building Standard for Retail (Pilot)',
        education: 'WELL Building Standard for Educational Facilities (Pilot)',
        restaurant: 'WELL Building Standard for Restaurants (Pilot)',
        community: 'WELL Community',
        allprojectsin: 'WELL All Projects In (Pilot)',
      }
      return wellStandardList[this.project.v1_project_standard]
    },
    projectTypeLabel() {
      const projectTypes = {
        nc: 'New and Existing Buildings',
        ci: 'New and Existing Interiors',
        cs: 'Core & Shell',
        cics: 'New and Existing Interiors in a Core & Shell Certified Building',
      }
      return projectTypes[this.project.v1_project_type]
    },
    standardVersionLabel() {
      const versionsList = [
        { value: 'q4-2020', text: 'Q4 2020 version' },
        { value: 'q3-2020', text: 'Q3 2020 version' },
        { value: 'q2-2020', text: 'Q2 2020 version' },
        { value: 'q1-2020', text: 'Q1 2020 version' },
        { value: 'q4-2019', text: 'Q4 2019 version' },
        { value: 'q3-2019', text: 'Q3 2019 version' },
        { value: 'q2-2019', text: 'Q2 2019 version' },
        { value: 'q1-2019', text: 'Q1 2019 version' },
        { value: 'q4-2018', text: 'Q4 2018 version' },
        { value: 'q3-2018', text: 'Q3 2018 version' },
        { value: 'q2-2018', text: 'Q2 2018 version' },
        { value: 'q1-2018', text: 'Q1 2018 version' },
        { value: 'q4-2017', text: 'Q4 2017 version' },
        { value: 'q3-2017', text: 'Q3 2017 version' },
        { value: 'q2-2017', text: 'Q2 2017 version' },
        { value: 'jan-2017', text: 'January 2017 version' },
        { value: 'oct-2016', text: 'October 2016 version' },
        { value: 'may-2016', text: 'May 2016 version' },
        { value: 'feb-2016', text: 'February 2016 version' },
        { value: 'sep-2015', text: 'September 2015 version' },
        { value: 'feb-2015', text: 'February 2015 version' },
      ]
      const result = versionsList.find(
        (a) => a.value === this.project.v1_version
      )
      if (result) {
        return result.text
      } else {
        return '-'
      }
    },
  },
  async mounted() {
    this.formData = {}
    if (this.project && this.project.id) {
      await this.$store.dispatch('review/getReviewList', this.project.id)
    }
    if (this.currentUser) {
      const filtered = this.project.members.filter(
        (a) => a.email === this.currentUser.email
      )
      this.checkInviteAccess = filtered.length ? filtered[0].pivot.role : ''
    }
    if (this.accessLevel === 'project-admin') {
      this.estimateDocumentationSubmission()
    }
  },
  methods: {
    async recertProject() {
      this.submitting = true
      // eslint-disable-next-line no-unused-vars
      await this.$store
        .dispatch('project/recertProject', this.project.id)
        .then((res) => {
          this.$router.push(
            `/projects/${res.data.type}/${res.data.project_number}/dashboard`
          )
        })

      this.submitting = false
    },
    changeStandard() {
      this.$refs.modal.isHidden = false
    },
    allowPayment(inv) {
      let allow = true
      if (inv) {
        if (
          (inv.v1_project || inv.project_type === 'v2-pilot') &&
          inv.v1_project_standard !== 'community' &&
          inv.invoicable_sub_part === 'registration'
        ) {
          allow = false
        }
      }
      return allow
    },
    enrollinHSR() {},
    viewRegInvoice() {
      this.$router.push(
        `/invoice/${this.registrationInvoice.invoice_number}?redirect=/projects/${this.project.type}/${this.project.project_number}/overview`
      )
    },
    downloadRegInvoice() {
      this.$store.dispatch('invoice/download', this.registrationInvoice)
    },
    sendOwnerAgreement() {
      this.$store.dispatch('project/sendAgreement', this.project.id)
    },
    downloadOwnerAgreement() {
      this.$store.dispatch('project/downloadAgreement', this.project.id)
    },
    updateProjectEstDate() {
      this.$store.dispatch(
        'project/updateProjectDocSubDate',
        this.estDocSubDate
      )
    },
    estimateDocumentationSubmission() {
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(this.project))
      this.forceReMount++
      if (this.project.cert_status) {
        return false
      }
      if (
        this.allReviews.filter((a) =>
          a.phase.toLowerCase().includes('documentation')
        ).length
      ) {
        return false
      }

      if (
        this.estimatedDate ||
        this.estimatedDateAfter ||
        this.estimatedDateToday
      ) {
        setTimeout(() => {
          this.$refs.docSubmissionModal.isHidden = false
        }, 1500)
      }
    },
    async updateProject() {
      const payload = {
        doc_sub_date_est: this.formData.doc_sub_date_est,
      }
      try {
        await this.$axios.post(
          `api/project/${this.formData.id}/docSubDateEstUpdate`,
          payload
        )
        await this.$store.dispatch(
          'project/getProjectByNumber',
          this.$route.params.projectId
        )
        this.$store.dispatch('notifications/toastMessage', {
          message:
            'We have updated your Estimate Date. You can also change it from edit section under Project Information.',
        })
        this.$refs.docSubmissionNoModal.isHidden = false
        this.$refs.docSubmissionModal.isHidden = true
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
    },
  },
}
</script>
