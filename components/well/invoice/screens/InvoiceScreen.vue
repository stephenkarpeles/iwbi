<template>
  <div class="relative bg-white rounded-lg shadow-md">
    <div
      v-if="invoiceData"
      class="bg-white shadow overflow-hidden sm:rounded-lg"
    >
      <div v-if="!$route.query.redirect" class="w-24 ml-6 mt-3">
        <WButtonsBase
          type="primaryInverted"
          icon="arrow-narrow-left"
          @click.native="$router.back()"
        >
          Back
        </WButtonsBase>
      </div>
      <WFeedbackAlert ref="alert" />
      <WFeedbackModal ref="modal" :can-manually-close="canManuallyClose">
        <div class="space-y-4">
          <WHeadingsHFour heading="Split Invoice" />
          <div v-if="invoiceSplitData">
            <div>
              We have successfully splitted the invoice into following invoices:
            </div>

            <ul class="list-desc ml-5 max-w-2xl">
              <li v-for="(newInvoice, index) in invoiceSplitData" :key="index">
                #<span
                  class="text-primary-500 cursor-pointer hover:text-primary-800"
                  @click="openInvoiceInNewTab(newInvoice.invoice_number)"
                >
                  {{ newInvoice.invoice_number }}
                </span>
                - {{ newInvoice.description }}
              </li>
            </ul>
          </div>
          <div v-else>
            <FormulateInput
              v-model="splitData.type"
              label="Split by:"
              type="select"
              :options="{
                count: 'Count',
                percentage: 'Percentage',
              }"
            />
            <div class="md:w-96">
              <FormulateInput
                v-if="splitData.type === 'count'"
                v-model="splitData.count"
                label="Number of invoices"
                type="number"
                min="2"
              />
            </div>
            <div v-if="splitData.type === 'percentage'" class="md:w-96 mt-2">
              <div
                v-for="(invoice_perc, index) in splitData.percentage"
                :key="index"
              >
                <div class="flex space-x-2">
                  <div class="w-full">
                    <FormulateInput
                      v-model="splitData.percentage[index]"
                      :label="`Invoice ${index + 1}`"
                      type="number"
                    />
                  </div>
                  <div class="flex space-x-2 mt-2">
                    <WButtonsBase
                      type="neutral"
                      class="text-primary-500"
                      icon="plus"
                      @click.native="splitData.percentage.push('0')"
                    />
                    <WButtonsBase
                      v-if="splitData.percentage.length > 1"
                      type="neutral"
                      class="text-danger-500"
                      icon="minus"
                      @click.native="splitData.percentage.splice(index, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <WButtonsBase
                v-if="!splittingInvoice"
                @click.native="splitInvoice"
              >
                Submit
              </WButtonsBase>
              <WButtonsBase v-else :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
            </div>
          </div>
        </div>
      </WFeedbackModal>
      <WFeedbackModal ref="bulkUpdateModal" :can-manually-close="true">
        <div class="space-y-4">
          <WHeadingsHFour heading="Congratulations" />
          <p class="my-2 text-md text-center text-normal">
            Thank you for your payment. We have sent you an email with further
            instructions on redeeming your bulk purchase.
          </p>
          <WButtonsBase
            type="primary"
            @click.native="$refs['bulkUpdateModal'].isHidden = true"
          >
            Close
          </WButtonsBase>
        </div>
      </WFeedbackModal>
      <div
        class="px-4 sm:px-6 py-5 border-b border-gray-200 lg:flex justify-between space-y-4 lg:space-y-0"
      >
        <WHeadingsHTwo
          :heading="
            invoiceData.status === 'paid' || invoiceData.status === 'waived'
              ? 'Receipt #' + invoiceData.invoice_number
              : 'Invoice #' + invoiceData.invoice_number
          "
        />
        <div class="sm:flex sm:space-x-2">
          <div>
            <WButtonsBase
              type="primaryInverted"
              icon="download"
              @click.native="$store.dispatch('invoice/download', invoice)"
            >
              Download
            </WButtonsBase>
          </div>
          <div class="mt-3 sm:mt-0">
            <WButtonsBase
              v-if="
                currentUser &&
                invoiceData.status === 'unpaid' &&
                (currentUser.role.includes('well-admin') ||
                  currentUser.role.includes('billing-admin'))
              "
              type="primaryInverted"
              icon="calculator"
              @click.native="$refs.modal.isHidden = false"
            >
              Split Invoice
            </WButtonsBase>
          </div>
          <div v-if="currentUser" class="mt-3 sm:mt-0">
            <WButtonsBase
              v-if="
                invoice.status === 'unpaid' ||
                currentUser.role.includes('well-admin')
              "
              :icon="[editMode ? 'search-circle' : 'pencil']"
              @click.native="editMode = !editMode"
            >
              <span v-if="editMode">View</span>
              <span v-else>Update Invoice</span>
            </WButtonsBase>
          </div>
        </div>
      </div>

      <!-- The tag below this is intentially set to manipulate to show hide to avoid reinstanciating strip -->
      <!-- <div :class="[editMode && 'hidden']"> -->
      <div v-if="!editMode">
        <div class="md:flex flex-wrap px-4 sm:px-6 md:px-8 py-8">
          <div class="md:w-1/3">
            <dl class="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Date</dt>
                <dd class="mt-1 text-sm text-primary-700">
                  {{ $dayjs(invoiceData.created_date).format('MMM DD, YYYY') }}
                </dd>
              </div>
              <div>
                <dd class="mt-1 text-sm text-primary-700">
                  <div class="font-bold">
                    {{ invoiceData.addresses[0].first_name }}
                  </div>
                  <div
                    v-if="invoiceData.addresses[0].email"
                    class="text-gray-700"
                  >
                    {{ invoiceData.addresses[0].email }}
                  </div>
                  <div
                    v-if="invoiceData.addresses[0].organization"
                    class="font-bold"
                  >
                    {{ invoiceData.addresses[0].organization }}
                  </div>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-primary-700">
                  <div>
                    {{ invoiceData.addresses[0].street }}
                    <br />
                    {{ invoiceData.addresses[0].city }},
                    {{ invoiceData.addresses[0].state }},
                    {{ invoiceData.addresses[0].postal_code }}
                    <br />
                    {{ invoiceData.addresses[0].country_code }}
                    <br />
                  </div>
                </dd>
              </div>
              <div v-if="invoiceData.addresses[0].post_office">
                <dd class="text-sm font-medium text-gray-500">
                  PO: {{ invoiceData.addresses[0].post_office }}
                </dd>
              </div>
              <div v-if="invoiceData.note">
                <dd class="text-sm text-primary-500">
                  {{ invoiceData.note }}
                </dd>
              </div>
            </dl>
          </div>
          <div class="md:w-2/3 mt-8 lg:mt-0">
            <div class="md:grid grid-cols-4 lg:grid-cols-3 gap-4">
              <div class="col-start-3 col-span-2 lg:col-span-1 lg:col-start-3">
                <img :src="`/logo/full.png`" alt="WELL Logo" class="h-20" />
                <div v-if="isChinaInvoice" class="pt-2 text-sm text-gray-500">
                  <span class="font-bold">IWBI China(HK) Limited</span><br />
                  Room 06, 13A/F, South Tower, World Finance Centre,<br />
                  Harbour City, 17 Canton Road, Tsim Sha Tsui,<br />
                  Kowloon, Hong Kong
                </div>
                <div v-else class="pt-2 text-sm text-gray-500">
                  <span class="font-bold"
                    >International WELL Building Institute, PBC</span
                  >
                  <br />
                  860 Washington Street, 4th Floor <br />
                  New York, NY 10014 <br />
                  United States
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="invoiceData.project_number"
          class="px-14 mb-2 text-primary-700 font-bold"
        >
          Project: {{ invoiceData.project_number }} -
          {{ invoiceData.project_name }}
        </div>
        <div class="px-4 sm:px-6 md:px-8">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-primary-500">
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider w-1/2"
                  >
                    DESCRIPTION
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-xs leading-4 font-medium uppercase tracking-wider w-1/5 text-center"
                  >
                    QUANTITY
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-xs leading-4 font-medium uppercase tracking-wider w-1/5 text-center"
                  >
                    PRICE
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-xs leading-4 font-medium uppercase tracking-wider w-1/5 text-center"
                  >
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in invoiceData.invoice_items"
                  :key="index"
                >
                  <td
                    class="px-3 md:px-6 py-4 font-medium text-sm text-gray-900 w-1/2"
                  >
                    {{ item.description }}
                    <div
                      v-if="invoiceData.discount_id && item.is_discount"
                      class="flex"
                    >
                      <span
                        v-if="invoiceData.discount_code"
                        class="text-sm pr-2"
                      >
                        {{ invoiceData.discount_code }}
                      </span>

                      <svg
                        class="w-4 cursor-pointer text-danger-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        @click="cancelDiscountCode()"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  </td>
                  <td
                    class="px-3 md:px-6 py-4 font-medium text-sm text-gray-500 w-1/5 text-center"
                  >
                    {{ item.quantity }}
                  </td>
                  <td
                    class="px-3 md:px-6 py-4 font-medium text-sm text-gray-500 w-1/5 text-center"
                  >
                    {{ item.unit_cost.toFixed(2) | formatCurrency }} USD
                  </td>
                  <td
                    class="px-3 md:px-6 py-4 font-medium text-sm text-gray-500 w-1/5 text-center"
                  >
                    {{
                      (item.unit_cost * item.quantity).toFixed(2)
                        | formatCurrency
                    }}
                    USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="
            (invoiceData.status === 'unpaid' &&
              invoiceData.project_type === 'v2-pilot' &&
              invoiceData.invoicable_sub_part === 'registration') ||
            (invoiceData.status === 'unpaid' &&
              invoiceData.project_type === 'v1' &&
              invoiceData.invoicable_sub_part === 'registration' &&
              invoiceData.v1_project_standard !== 'community')
          "
          class="max-w-3xl mx-auto mt-10 bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="mt-3 h-5 w-5 text-yellow-400"
                x-description="Heroicon name: exclamation"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <div class="mt-2 text-sm leading-5 text-yellow-700">
                <p>
                  Registrations are now closed for WELL v1 and v2 pilot
                  projects. You can upgrade your pending registration to WELL v2
                  now - If you have any questions please reach out to
                  <a
                    href="mailto:info@wellcertified.com"
                    target="_blank"
                    class="text-bold cursor-pointer text-primary-600"
                    >info@wellcertified.com</a
                  >.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          :class="[
            invoiceData.status === 'unpaid' &&
              invoiceData.project_type === 'v2-pilot' &&
              invoiceData.invoicable_sub_part === 'registration' &&
              'opacity-0',
            invoiceData.status === 'unpaid' &&
              invoiceData.project_type === 'v1' &&
              invoiceData.invoicable_sub_part === 'registration' &&
              invoiceData.v1_project_standard !== 'community' &&
              'opacity-0',
            'md:flex flex-wrap px-4 sm:px-6 md:px-8 pb-8 space-y-4 md:space-y-0',
          ]"
        >
          <div class="md:w-2/3">
            <div v-if="paymentType === 'card'" class="">
              <WHeadingsHThree
                class="mt-10 text-center"
                :sub-heading="
                  invoiceData.status === 'waived'
                    ? 'Waived Amount'
                    : 'Payment Amount'
                "
              />
              <div class="text-center text-primary-800 font-bold flex">
                <div class="flex mx-auto">
                  <div class="my-auto">$</div>
                  <span class="text-4xl">
                    {{ invoiceData.total_amount.toFixed(2) | formatNumber }}
                  </span>
                </div>
              </div>

              <div
                :class="[
                  (invoiceData.status === 'paid' ||
                    invoiceData.status === 'waived') &&
                    invoiceData.payment_type !== 'card' &&
                    'hidden',
                  paymentType !== 'card' && 'hidden',
                  'flip-card duration-700 transition-transform transform relative h-48 md:h-52 mt-6 mx-auto md:w-96',
                ]"
              >
                <div
                  :class="{ 'rotate-y-180': !cardFront }"
                  class="flip-card-inner rounded-lg shadow-md"
                >
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <div
                    class="flip-card-front p-5"
                    style="
                      background: linear-gradient(
                        145.99deg,
                        #fbfdfe 20.15%,
                        #cfe6ed 164.62%
                      );
                    "
                  >
                    <div class="text-primary-300 text-sm text-left">
                      Credit Card
                    </div>
                    <div class="flex space-x-4">
                      <div class="flex-1 space-y-4 py-1">
                        <div class="space-y-2">
                          <img
                            class="w-10 mt-3 md:mt-6"
                            src="/supporting/credit-card-chip.png"
                          />
                          <div
                            :class="{
                              'text-primary-800 animate-pulse': focusNumbers,
                            }"
                            class="flex md:text-2xl text-primary-300 items-center"
                          >
                            <div class="mr-3">&bull; &bull; &bull; &bull;</div>
                            <div class="mr-3">&bull; &bull; &bull; &bull;</div>
                            <div class="mr-3">&bull; &bull; &bull; &bull;</div>
                            <div>
                              <div
                                v-if="invoiceData.card_last_four"
                                class="text-base"
                              >
                                {{ invoiceData.card_last_four }}
                              </div>
                              <div v-else>&bull; &bull; &bull; &bull;</div>
                            </div>
                          </div>
                          <div class="flex">
                            <div class="mr-3 text-primary-300 my-auto text-sm">
                              <div class="text-left">
                                <div v-if="invoiceData.card_holder">
                                  {{ invoiceData.card_holder }}
                                </div>
                                <div
                                  v-else-if="
                                    invoiceData.addresses &&
                                    invoiceData.addresses.length > 0
                                  "
                                >
                                  {{ invoiceData.addresses[0].first_name }}
                                </div>
                                <div v-else-if="currentUser">
                                  {{ currentUser.full_name }}
                                </div>
                              </div>
                              <div
                                :class="{
                                  'text-primary-800 animate-pulse': focusExpiry,
                                }"
                                class="flex"
                              >
                                Exp.
                                <div class="ml-3">
                                  &bull; &bull; / &bull; &bull;
                                </div>
                              </div>
                            </div>
                            <img
                              class="ml-auto w-16"
                              src="/supporting/visa-logo.png"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <div
                    class="flip-card-back rounded-lg shadow-md"
                    style="
                      background: linear-gradient(
                        145.99deg,
                        #fbfdfe 20.15%,
                        #cfe6ed 164.62%
                      );
                    "
                  >
                    >
                    <div class="absolute w-full left-0 p-5 transform">
                      <div class="text-primary-300 text-sm text-left">
                        Back of card
                      </div>
                      <div class="flex mt-10 w-full">
                        <div class="w-full h-7 bg-primary-200"></div>
                        <div
                          :class="{
                            'text-primary-800 animate-pulse': focusCvc,
                          }"
                          class="ml-3 w-9 text-primary-300"
                        >
                          &bull; &bull; &bull;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else-if="paymentType === 'check'"
              class="bg-white p-4 mt-4 md:m-5 shadow sm:rounded-lg md:px-6 divide-y divide-gray-200"
            >
              <WHeadingsHThree :heading="'Payment Instructions'" />
              <div class="mt-2 pt-2 flow-root">
                <div v-if="isChinaInvoice">
                  <p class="text-sm text-gray-500 lh-5 text-light py-3">
                    Make checks payable to
                    <span class="tx-bold">IWBI China(HK) Limited</span>
                  </p>
                  <p class="text-sm text-gray-500 lh-5 text-light py-3 mt-1">
                    Please note: Due to COVID-19, checks can take several weeks
                    to receive and process. Where possible, please consider
                    altenative forms of payment to avoid delays.
                  </p>

                  <p class="small lh-5 tx-light mg-b-0">
                    <span class="tx-bold">Mailing address:</span><br />
                    11/F One Pacific Place<br />
                    88 Queensway<br />
                    Hong Kong<br />
                    <span class="font-bold">Email address: </span>
                    <a
                      class="text-primary-500"
                      href="mailto:billing@wellcertified.com"
                      >billing@wellcertified.com</a
                    >
                  </p>
                </div>
                <div v-else class="text-sm text-gray-500 lh-5 text-light">
                  <p>
                    Make checks payable to
                    <span class="font-bold"
                      >International WELL Building Institute, PBC</span
                    >
                  </p>
                  <p class="text-sm text-gray-500 lh-5 text-light py-3 mt-1">
                    Please note: Due to COVID-19, checks can take several weeks
                    to receive and process. Where possible, please consider
                    altenative forms of payment to avoid delays.
                  </p>
                  <p>
                    <span class="font-bold">Mailing address:</span><br />
                    860 Washington Street, 4th Floor<br />
                    New York, NY 10014<br />
                    <span class="font-bold">Email address: </span>
                    <a
                      class="text-primary-500"
                      href="mailto:billing@wellcertified.com"
                      >billing@wellcertified.com</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              v-else-if="paymentType === 'wire'"
              class="bg-white mt-4 p-4 md:m-5 shadow sm:rounded-lg md:px-6 divide-y divide-gray-200"
            >
              <WHeadingsHThree :heading="'ACH and Wiring Instructions'" />
              <div class="mt-2 pt-2 flow-root">
                <div
                  v-if="isChinaInvoice"
                  class="text-sm text-gray-500 lh-5 text-light py-3"
                >
                  <p>
                    SWIFT Code - CHASUS33<br />
                    ABA - 021000021<br />
                    Bank Name - JP Morgan Chase Bank<br />
                    Account No - 153798738<br />
                    <span class="font-bold">Email address: </span
                    ><a
                      class="text-primary-500"
                      href="mailto:billing@wellcertified.com"
                      >billing@wellcertified.com</a
                    ><br />
                    <span class="font-bold"
                      >Please include invoice number #{{
                        invoiceData.invoice_number
                      }}
                      in payment remittance.</span
                    >
                  </p>
                </div>
                <div v-else class="text-sm text-gray-500 lh-5 text-light py-3">
                  <p>
                    SWIFT Code - FRBBUS6S<br />
                    ABA - 321081669<br />
                    Bank Name - First Republic Bank<br />
                    Account No - 80006861381<br />
                    <span class="font-bold">Email address: </span
                    ><a
                      class="text-primary-500"
                      href="mailto:billing@wellcertified.com"
                      >billing@wellcertified.com</a
                    ><br />
                    <span class="font-bold"
                      >Please include invoice number #{{
                        invoiceData.invoice_number
                      }}
                      in payment remittance.</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="md:w-1/3">
            <div
              v-if="
                invoiceData.status !== 'paid' && invoiceData.status !== 'waived'
              "
            >
              <div>
                <WHeadingsHThree class="mt-10" :heading="'Payment Options'" />

                <FormulateInput
                  v-model="paymentType"
                  :options="
                    isChinaInvoice
                      ? {
                          card: 'Card',
                          wire: 'Wire Transfer',
                        }
                      : {
                          card: 'Card',
                          check: 'Check',
                          wire: 'Wire Transfer',
                        }
                  "
                  type="radio"
                />
              </div>
            </div>
            <div v-else class="mt-8">
              <WButtonsBase icon="download" @click.native="downloadInvoice">
                Download Receipt
              </WButtonsBase>
              <div
                class="mt-5 rounded-md bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300 w-full"
              >
                <div class="flex">
                  <div class="ml-3">
                    <div class="mt-2 text-sm leading-5 text-primary-700">
                      <div>
                        <div>
                          {{
                            invoiceData.status === 'waived'
                              ? 'Waived on'
                              : 'Paid on'
                          }}
                          :
                          {{
                            $dayjs(invoiceData.payment_date).format(
                              'MMM DD, YYYY'
                            )
                          }}
                        </div>
                        <div>Payment type: {{ invoiceData.payment_type }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="invoiceData.status === 'unpaid'">
              <WHeadingsHFour
                v-if="!invoiceData.discount_id"
                class="mt-10"
                :heading="'Discount'"
              />
              <div v-if="!invoiceData.discount_id" class="flex items-center">
                <FormulateInput
                  v-model="discountCode"
                  class="w-full mr-2"
                  type="text"
                  placeholder="Enter discount code"
                />
                <WButtonsBase
                  type="primary"
                  class="w-1/2 mt-0"
                  icon="check-circle-small"
                  @click.native="verifyDiscount"
                  >Apply</WButtonsBase
                >
              </div>
              <div
                v-if="errorCode"
                class="rounded-md bg-red-50 p-4 rounded-lg border border-red-300"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-400"
                      x-description="Heroicon name: exclamation"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm leading-5 text-red-700">
                      <p>Please provide a valid discount code.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5">
              <div
                :class="[
                  (invoiceData.status === 'paid' ||
                    invoiceData.status === 'waived') &&
                    'hidden',
                  paymentType !== 'card' && 'hidden',
                ]"
              >
                <WHeadingsHFour
                  class="mt-10 text-primary-800"
                  :sub-heading="'Card Details'"
                />
                <div class="border border-primary-200 rounded-t-md">
                  <input
                    ref="cardHolderName"
                    maxlength="26"
                    minlength="2"
                    class="p-3 text-primary-600 placeholder-primary-500 w-full"
                    placeholder="Card Holder's Name"
                  />
                </div>
                <div
                  ref="cardNumber"
                  class="border border-primary-200 p-3"
                ></div>
                <div class="flex mb-3">
                  <div
                    ref="cardExpiry"
                    class="border border-primary-200 p-3 rounded-bl-md w-1/2"
                  ></div>
                  <div
                    ref="cardCvc"
                    class="border border-primary-200 p-3 rounded-br-md w-1/2"
                  ></div>
                </div>
                <WButtonsBase
                  data-id="pay-now-btn"
                  :type="[processingPayment ? 'primaryInverted' : 'primary']"
                  icon="credit-card"
                  @click.native="createPayment"
                >
                  <span v-if="!processingPayment">Pay Now</span>
                  <span v-else>
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                </WButtonsBase>
                <div
                  v-if="errorMessage"
                  class="bg-red-200 border rounded-lg p-2 mt-3 text-center text-red-900 border-red-800"
                >
                  {{ errorMessage }}
                </div>
              </div>
              <div v-if="paymentType && paymentType != 'card'">
                <WButtonsBase icon="download" @click.native="downloadInvoice">
                  Download
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvoiceEdit v-if="editMode" :invoice-data="invoiceData" />
    </div>
    <div v-else>
      <div class="mx-auto text-center pb-10">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Invoice...</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    invoice: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: false,
      default: null,
    },
    redirectPath: {
      type: String,
      required: false,
      default: '',
    },
    legacyId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      editMode: false,
      splitData: {
        type: 'count',
        count: null,
        percentage: ['0'],
      },
      discountCode: '',
      errorCode: false,
      canManuallyClose: true,
      splittingInvoice: false,
      invoiceSplitData: null,
      invoiceData: null,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      paymentType: null,
      stripe: null,
      elements: null,
      cardFront: true,
      focusNumbers: false,
      focusExpiry: false,
      focusCvc: false,
      processingPayment: false,
      errorMessage: null,
    }
  },
  computed: {
    isChinaInvoice() {
      for (let i = 0; i < this.invoiceData.addresses.length; i++) {
        if (
          this.invoiceData.addresses[i].country_code === 'CN' ||
          this.invoiceData.addresses[i].country_code === 'HK' ||
          this.invoiceData.addresses[i].country_code === 'MO'
        ) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    paymentType(newValue) {
      const self = this
      setTimeout(function () {
        if (newValue === 'card') self.setupStripe()
      }, 1000)
    },
    editMode(newValue) {
      setTimeout(function () {
        if (newValue === false) location.reload()
      }, 1000)
    },
  },
  async mounted() {
    await this.getInvoiceData()
  },
  methods: {
    async getInvoiceData() {
      await this.$store
        .dispatch('invoice/getInvoiceByNumber', this.invoice.invoice_number)
        .then((res) => {
          this.invoiceData = res
          setTimeout(() => {
            this.paymentType = 'card'
            this.setupStripe()
          }, 2000)
        })
    },
    async splitInvoice() {
      this.splittingInvoice = true
      this.canManuallyClose = false

      const data = { ...this.splitData }
      data.invoice_id = this.invoice.id
      if (this.splitData.type === 'count') {
        delete data.percentage
      } else {
        delete data.count
      }
      await this.$store.dispatch('invoice/splitInvoice', data).then((res) => {
        this.invoiceSplitData = res
      })

      await this.getInvoiceData()

      this.canManuallyClose = true
    },
    async cancelDiscountCode() {
      await this.$axios.get(
        `api/invoice/${this.invoiceData.id}/remove-discount`
      )
      this.$refs.alert.showAlert(
        'success',
        'Discount code removed successfully'
      )
      await this.getInvoiceData()
    },
    verifyDiscount() {
      if (this.discountCode) {
        const discountCode = this.discountCode
        this.$axios
          .get(
            `api/invoice/${this.invoiceData.id}/apply-discount/${discountCode}`
          )
          .then((resp) => {
            this.$refs.alert.showAlert(
              'success',
              'Discount code applied successfully'
            )
            this.getInvoiceData()
            this.errorCode = false
          })
          .catch((resp) => {
            this.errorCode = true
          })
      }
    },
    setupStripe() {
      this.stripe = this.$stripe
      // Use correct Stripe key for payment
      if (this.isChinaInvoice) {
        this.stripe._apiKey = this.$config.StripeCN
      } else {
        this.stripe._apiKey = this.$config.StripeUS
      }

      this.elements = this.stripe.elements()
      this.cardNumber = this.elements.create('cardNumber', {
        style: {
          base: {
            color: '#5EABC4',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: '#5EABC4',
            },
            '::placeholder': {
              color: '#5EABC4',
            },
          },
          invalid: {
            iconColor: '#48232A',
            color: '#48232A',
          },
        },
      })

      this.cardExpiry = this.elements.create('cardExpiry', {
        style: {
          base: {
            color: '#5EABC4',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: '#5EABC4',
            },
            '::placeholder': {
              color: '#5EABC4',
            },
          },
          invalid: {
            iconColor: '#48232A',
            color: '#48232A',
          },
        },
      })

      this.cardCvc = this.elements.create('cardCvc', {
        style: {
          base: {
            color: '#5EABC4',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: '#5EABC4',
            },
            '::placeholder': {
              color: '#5EABC4',
            },
          },
          invalid: {
            iconColor: '#48232A',
            color: '#48232A',
          },
        },
      })

      this.cardNumber.mount(this.$refs.cardNumber)
      this.cardExpiry.mount(this.$refs.cardExpiry)
      this.cardCvc.mount(this.$refs.cardCvc)

      const self = this

      this.cardCvc.on('focus', function (event) {
        self.cardFront = false
        self.focusCvc = true
        self.focusExpiry = false
      })

      this.cardExpiry.on('focus', function (event) {
        self.cardFront = true
        self.focusExpiry = true
        self.focusCvc = false
        self.focusNumbers = false
      })

      this.cardNumber.on('focus', function (event) {
        self.cardFront = true
        self.focusNumbers = true
        self.focusCvc = false
        self.focusExpiry = false
      })
    },
    async createPayment() {
      const self = this

      if (!this.processingPayment && this.$refs.cardHolderName.value !== '') {
        this.processingPayment = true
        this.errorMessage = null

        await this.stripe
          .createPaymentMethod({
            type: 'card',
            card: this.cardNumber,
            billing_details: {
              name: this.$refs.cardHolderName.value,
            },
          })
          .then((result) => {
            if (result.error) {
              // error handling here
              self.processingPayment = false
            } else {
              // handle stripe charge logic here.
              this.$axios
                .post('api/invoice/' + this.invoice.id + '/payment', {
                  stripeToken: result.paymentMethod.id,
                  name: this.$refs.cardHolderName.value,
                })
                .then((response) => {
                  if (response.data.error) {
                    this.stripe
                      .confirmCardPayment(response.data.error.client_secret, {
                        payment_method: response.data.error.payment_method,
                      })
                      .then((result) => {
                        this.$axios
                          .post('api/invoice/' + this.invoice.id + '/confirm')
                          .then(() => {
                            this.postPaymentAction()
                          })
                          .catch((error) => {
                            this.errorMessage = error.response.data.msg
                            this.processingPayment = false
                          })
                      })
                  } else {
                    this.postPaymentAction()
                  }
                })
                .catch((error) => {
                  this.errorMessage = error.response.data.error.message
                  this.processingPayment = false
                })
            }
          })
      } else {
        alert("Card Holder's Name is required!")
      }
    },
    openInvoiceInNewTab(invoiceNumber) {
      const routeData = this.$router.resolve(`/invoice/${invoiceNumber}`)
      window.open(routeData.href, '_blank')
    },
    downloadInvoice() {
      const token = this.$store.state.authentication.token

      if (this.legacyId) {
        window.open(
          'https://legacy-wellonline.wellcertified.com/printPdf/' +
            this.legacyId,
          '_blank'
        )
      } else {
        const url =
          this.$axios.defaults.baseURL +
          'api/invoice/' +
          this.invoice.id +
          '/pdf?token=' +
          token
        window.open(url, '_blank')
      }
    },
    postPaymentAction() {
      if (this.$route.query.showSuccessModal === 'bulk-purchase') {
        this.getInvoiceData()
        this.$refs.bulkUpdateModal.isHidden = false
      }
      if (self.redirectPath) {
        this.$router.push(self.redirectPath)
      } else if (process.client) {
        window.location.reload()
      }
      this.processingPayment = true
    },
  },
}
</script>

<style>
.flip-card {
  background-color: transparent;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  color: black;
}

.flip-card-back {
  color: white;
  transform: rotateY(180deg);
}
</style>
