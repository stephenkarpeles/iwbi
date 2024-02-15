<template>
  <div class="bg-gray-100 bg-opacity-75 p-0 md:p-8">
    <div class="px-5 md:px-0 bg-white">
      <div class="md:px-0 pl-0 md:pl-10 pt-5 md:pt-10 md:flex">
        <div class="mb-6 md:mb-0 md:w-1/2">
          <h3>
            <small class="text-gray-600"
              >WELL Estimate #{{ estimate.estimate.id }}</small
            >
          </h3>
          <h1 class="font-medium leading-tight">
            <span class="text-xl">{{ estimate.estimate.name }}</span
            ><br />
            <span class="text-2xl">{{ estimate.estimate.organization }}</span
            ><br />
          </h1>
          <span class="text-base font-light pb-12 text-gray-600">
            {{ estimate.estimate.country_name }}
          </span>
        </div>

        <div class="md:w-1/2 pr-0 md:pr-12">
          <img
            src="/logo/full.png"
            alt=""
            class="w-28 md:ml-auto mb-2 md:mb-0"
          />
          <span
            class="
              mt-2.5
              float-none
              md:float-right
              text-gray-600
              font-light
              mb-5
              md:mb-0
            "
          >
            220 Fifth Avenue, Floor #8<br />
            New York, NY 10001, USA<br />
          </span>
        </div>
      </div>
      <div
        v-if="estimate.version !== 'community'"
        class="p-0 md:p-10 pr-0 md:pr-12 text-base font-light"
      >
        <p class="mb-4 mt-8 md:mt-0">
          Thank you for reviewing the customized fees estimate for your WELL
          project.
        </p>
        <p class="mb-4">
          In addition to WELL's meaningful ROI proposition, which will help
          increase the value of your project and enhance the experience of your
          building's occupants, WELL pricing is designed to ensure you receive a
          comprehensive and robust package of support services throughout the
          WELL Certification process.
        </p>
        <p class="mb-4">
          Our complete package for the WELL Certification Program and Support
          includes the following:
        </p>
        <ol class="ml-10 list-decimal" type="1">
          <li>
            <h5 class="text-lg mb-2 font-medium">Registration</h5>
            <p class="mb-4">
              Upon registration, project teams gain access to WELL Online, a
              comprehensive WELL Certification platform, and individualized
              support from IWBI’s Technical Solutions teams at no extra cost to
              help you create and implement WELL program solutions tailored to
              your project needs and the level of certification you are
              pursuing. This supports our “all projects in” approach to WELL
              Certification.
            </p>
          </li>
          <li>
            <h5 class="text-lg mb-2 font-medium">
              IWBI Technical Solutions coaching and support
            </h5>
            <p class="mb-4">
              Once you’re on the path to WELL Certification, from beginning to
              end, your project team and service providers have access to IWBI’s
              Technical Solutions team to help coach you through elements of the
              WELL process, including feature interpretation and AAP
              submissions.
            </p>
          </li>
          <li>
            <h5 class="text-lg mb-2 font-medium">Documentation review</h5>
            <p class="mb-4">
              Comprehensive review round where GBCI-verified professionals
              verify building design components and provide feedback and
              assistance in ensuring a successful process. Expedited options are
              available.
            </p>
          </li>
          <li>
            <h5 class="text-lg mb-2 font-medium">
              Performance verification, on-site evaluation &amp; testing
            </h5>
            <p class="mb-4">
              Once your project is ready for performance verification, an
              on-site evaluation and testing is conducted by a GBCI-verified
              professional that specializes in testing for WELL buildings. A
              visual inspection of the minimum required features is conducted.
              Technical measuring of air, water, lighting, acoustics, thermal
              and other additional elements are gathered and sent to approved
              laboratories for review. Please refer to the Performance
              Verification Guidebook for a detailed summary of services
              performed.
            </p>
          </li>
          <li>
            <h5 class="text-lg mb-2 font-medium">Certification</h5>
            <p class="mb-4">
              Upon achieving Certification, projects receive an in-depth score
              report, and their certification status is updated on the WELL
              project directory.
            </p>
          </li>
          <li>
            <h5 class="text-lg mb-2 font-medium">
              Comprehensive marketing and public relations support
            </h5>
            <p class="mb-4">
              Certified projects are connected to IWBI’s marketing and public
              relations teams for comprehensive promotional opportunities
              exclusively available to WELL Certified projects. IWBI provides a
              tool kit including information on WELL plaques, certificates,
              logos and imagery, project directory listings, opportunities for
              IWBI-developed project case studies, and more.
            </p>
          </li>
        </ol>
      </div>
      <div v-else class="p-0 md:p-10 pr-0 md:pr-12 text-base font-light">
        <p class="mb-4 mt-8 md:mt-0">
          Thank you for reviewing the customized fees estimate for your WELL
          Community project.
        </p>
      </div>
      <div
        v-if="estimate.version !== 'community'"
        class="pl-0 md:pl-10 mb-10 mt-8 md:mt-0"
      >
        <h3 class="mb-2 text-3xl text-gray-600">
          Fee Summary - {{ estimate.estimate.formattedTotalArea }} sq ft
        </h3>
        <table style="min-width: 90%" class="table-auto mb-7.5">
          <tr style="border-top: 1px solid #dee2e6">
            <th
              class="text-left p-3 text-gray-600"
              style="border-top: 1px solid #dee2e6"
            >
              Item
            </th>
            <th class="text-right p-3 text-gray-600">Price</th>
            <th class="text-right p-3 text-gray-600">Discount</th>
            <th class="text-right p-3 text-gray-600">Offered price</th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <td class="p-3 font-light text-base text-gray-600" align="left">
              Registration
            </td>
            <td class="p-3 font-light text-base text-gray-600" align="right">
              ${{ estimate.formattedRegPrice }} USD
            </td>
            <td class="p-3 font-light text-base text-gray-600" align="right">
              <span v-if="estimate.estimate.reg_discount">
                {{ estimate.estimate.reg_discount }}%
              </span>
            </td>
            <th class="p-3 text-right text-gray-600">
              ${{ estimate.formattedDiscountedRegPrice }} USD
            </th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <td>
              <span class="p-3 font-light text-base text-gray-600">
                Document Review, Performance Verification &amp; Certification
              </span>
            </td>
            <td class="p-3 font-light text-base text-gray-600" align="right">
              ${{ estimate.formattedBundlePrice }} USD
            </td>
            <td class="p-3 font-light text-base text-gray-600" align="right">
              <span v-if="estimate.effectiveDiscount">
                {{ estimate.effectiveDiscount.toFixed(2) }}%
              </span>
            </td>
            <th class="p-3 text-right text-gray-600">
              ${{ estimate.formattedDiscountedBundlePrice }} USD
            </th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <th
              class="p-3 text-gray-600 flex md:block"
              colspan="3"
              align="right"
            >
              Total
            </th>
            <th
              class="text-right text-white p-3 bg-black whitespace-nowrap"
              align="right"
              style="border-bottom: 1px solid white"
            >
              ${{ estimate.formattedTotalPriceBundle }} USD
            </th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <th class="text-right p-3 text-gray-600" colspan="3" align="right">
              Per sq ft
            </th>
            <th
              class="text-right text-white p-3 bg-gray-700"
              align="right"
              style="border-bottom: 1px solid white"
            >
              ${{ estimate.pricePerSqBundle.toFixed(3) }} USD
            </th>
          </tr>
        </table>
      </div>
      <div v-else class="pl-0 md:pl-10 mb-10 mt-8 md:mt-0">
        <h3 class="mb-2 text-xl text-gray-600">
          {{ estimate.estimate.projects[0].name }} (WELL Community) -
          {{ estimate.estimate.formattedTotalArea }} acres
        </h3>
        <table style="min-width: 90%" class="table-auto mb-7.5">
          <tr style="border-top: 1px solid #dee2e6">
            <th
              class="text-left p-3 text-gray-600"
              style="border-top: 1px solid #dee2e6"
            >
              Item
            </th>
            <th class="text-right p-3 text-gray-600">Offered price</th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <td class="p-3 font-light text-base text-gray-600" align="left">
              Registration
            </td>
            <td class="p-3 font-light text-base text-gray-600" align="right">
              ${{ estimate.formattedDiscountedRegPrice }} USD
            </td>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <td class="p-3 font-light text-base text-gray-600">
              WELL Certification Program and Support
            </td>
            <th class="p-3 text-right text-gray-600">
              ${{ estimate.formattedDiscountedBundlePrice }} USD
            </th>
          </tr>
          <tr style="border-top: 1px solid #dee2e6">
            <th class="p-3 text-gray-600 flex md:block" align="right">Total</th>
            <th
              class="text-right text-white p-3 bg-black whitespace-nowrap"
              align="right"
              style="border-bottom: 1px solid white"
            >
              ${{ estimate.formattedTotalPrice }} USD
            </th>
          </tr>
        </table>
      </div>
      <div class="pl-0 md:pl-10 mr-0 md:mr-20">
        <h5 class="text-xl mb-2 font-medium">Payment terms</h5>
        <div v-if="estimate.version !== 'community'">
          <div class="mx-5 md:mx-0">
            <ul
              class="list-disc text-sm pl-0 md:pl-10 font-light text-gray-600"
            >
              <li>
                Early adopter discounts are only valid for projects that
                register on WELL Online and submit all required and complete
                accompanying documentation for GBCI review within two years of
                the date on which the project was registered.
              </li>
              <li>
                The pricing for Certification and Performance Verification is
                subject to change if all required and complete documentation is
                not submitted for GBCI review within two years from the date of
                registration. If a project submits its documentation after the
                second year anniversary of the project registration date, the
                project will be charged the then-current fees as they are
                incurred.
              </li>
              <li>
                If you have multiple projects listed above, each one must be
                registered in WELL Online simultaneously in order to qualify for
                the listed fees.
              </li>
              <li>
                This fee estimate is subject to change. Please check the IWBI
                website for the most current WELL fee schedule,
                <a
                  target="_blank"
                  href="http://www.wellcertified.com/well-pricing"
                  >available here for reference</a
                >.
              </li>
              <li>
                In addition to the fees, IWBI will collect applicable sales or
                use taxes, if any, as required by law.
              </li>
              <li>
                The fees listed above not include fees for recertification of an
                existing WELL Certified project. To the extent you see
                certification, such fees will be calculated on the dates on
                which they are incurred and invoiced as they are incurred. The
                fees listed above also do not include fees for optional
                services, such as the review of requests for alternative
                compliance paths or innovation features, the review and approval
                of curative action plans, or the undertaking of appeal.
              </li>
              <li>
                For any further questions, please contact
                <a href="mailto:pricing@wellcertified.com"
                  >pricing@wellcertified.com</a
                >.
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="mx-5 md:mx-0">
          <ul class="list-disc pl-0 md:pl-10 font-light text-gray-600 text-sm">
            <li>
              $20,000 registration fee for WELL Community is due at registration
              with IWBI.
            </li>
            <li>
              Certification fees for buildings follow the same schedule as
              standard pricing as provided on the pricing page of
              wellcertified.com.
            </li>
            <li>
              50% of the fees for WELL Community certification (per acre charges
              for all phases) is due upon submission of documents for Design
              Verification. The remaining 50% is due upon the submission of
              documentation for Performance Verification.
            </li>
            <li>
              This fee estimate is subject to change. Please check the IWBI
              website for the most current WELL fee schedule
            </li>
            <li>
              In addition to the fees, IWBI will collect applicable sales or use
              taxes, if any, as required by law.
            </li>
            <li>
              The fees listed above also do not include fees for optional
              services, such as the review of requests for alternative
              compliance paths or innovation features, the review and approval
              of curative action plans, or the undertaking of appeal.
            </li>

            <li>
              For any further questions, please contact technical solutions
              <a
                class="text-primary-500"
                href="mailto:'WELLCommunity@WELLCertified.com'"
                >WELLCommunity@WELLCertified.com</a
              >
            </li>
            <li>
              WELL Community pricing and the other terms provided herein are
              subject to you accepting and executing a WELL Certification
              agreement governing your projects.
            </li>
            <li>
              <b>Existing communities</b> are required to certify at least one
              building under an approved health and wellness building
              certification. For a list of preapproved health and wellness
              rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </li>
            <li>
              For <b>new developments</b>, health and wellness certified
              buildings must represent at least 15% of total buildings. For more
              information about this requirement, including the process for
              seeking an exemption, see the WELL Community Standard “Certified
              Buildings” section. For a list of preapproved health and wellness
              rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </li>
          </ul>
        </div>
      </div>

      <div v-if="estimate.version !== 'community'" class="pl-0 md:pl-10 pr-12">
        <h3 class="mb-2 text-gray-600" style="font-size: 1.75rem">
          Payment schedule ({{ estimate.estimate.projects.length }} projects)
        </h3>
        <table
          v-for="(project, index) in estimate.estimate.projects"
          :key="index"
          style="border: 1px solid #dee2e6; min-width: 100%"
          class="table-auto mb-7.5"
        >
          <tr style="border-top: 1px solid #dee2e6">
            <th
              colspan="2"
              class="
                text-left
                p-3
                uppercase
                text-center
                bg-gray-200
                text-gray-600
              "
              style="border-top: 2px solid rgb(68, 68, 68)"
            >
              {{ project.name }} - {{ project.formattedArea }} sq ft
            </th>
          </tr>
          <tr>
            <td class="p-3 text-gray-600" style="border-top: 1px solid #dee2e6">
              Registration:
              <span class="font-light text-base text-gray-600">
                {{ project.type_name }}
              </span>
            </td>
            <th
              class="p-3 text-gray-600"
              align="right"
              style="border-top: 1px solid #dee2e6"
            >
              ${{ Math.round(project.regPriceOffered) | formatNumber }} USD
            </th>
          </tr>
          <tr>
            <td class="p-3 text-gray-600" style="border-top: 1px solid #dee2e6">
              <span
                >Document Review, Performance Verification &amp;
                Certification</span
              >
            </td>
            <th
              class="p-3 text-gray-600"
              align="right"
              style="border-top: 1px solid #dee2e6"
            >
              ${{ Math.round(estimate.discountedBundlePrice) | formatNumber }}
              USD
            </th>
          </tr>
          <tr>
            <td
              class="p-3 text-sm pl-6 font-light text-gray-600"
              colspan="1"
              style="border-top: 1px solid #dee2e6"
            >
              Due upon submission of documentation for review in WELL Online
            </td>
            <th
              class="p-3 text-sm text-gray-600"
              align="right"
              style="border-top: 1px solid #dee2e6"
            >
              ${{
                (Math.round(estimate.discountedBundlePrice) / 2) | formatNumber
              }}
              USD
            </th>
          </tr>
          <tr>
            <td
              class="p-3 text-sm pl-6 font-light text-gray-600"
              colspan="1"
              style="border-top: 1px solid #dee2e6"
            >
              Due upon request for Performance Verification scheduling
            </td>
            <th
              class="p-3 text-sm text-gray-600"
              align="right"
              style="border-top: 1px solid #dee2e6"
            >
              ${{
                (Math.round(estimate.discountedBundlePrice) / 2) | formatNumber
              }}
              USD
            </th>
          </tr>
          <tr>
            <th
              class="p-3 text-gray-600"
              colspan="1"
              style="border-top: 1px solid #dee2e6"
              align="right"
            >
              Sub total<br />
            </th>
            <th
              class="p-3 bg-gray-700 text-white"
              align="right"
              style="border-top: 1px solid #dee2e6"
            >
              ${{ Math.round(estimate.totalPriceBundle) | formatNumber }} USD
            </th>
          </tr>
          <tr>
            <th
              colspan="1"
              class="p-3 text-gray-600"
              style="border-top: 2px solid #dee2e6"
              align="right"
            >
              Total<br />
            </th>
            <th
              class="p-3 bg-black text-white"
              align="right"
              style="border-top: 2px solid #dee2e6"
            >
              ${{ estimate.formattedTotalPriceBundle }} USD
            </th>
          </tr>
        </table>
      </div>
      <div class="my-4 pl-0 md:pl-10 pr-12"><hr /></div>

      <div class="text-center font-bold text-gray-700">
        <span
          ><strong
            >This estimate was generated on
            {{ $dayjs(estimate.estimate.created_at).format('MMM DD, YYYY') }}
            and is valid until {{ estimate.expiration_date
            }}<br /></strong></span
        ><br /><br />
      </div>
      <div class="pl-0 md:pl-10 pr-12 pb-8" style="font-size: 12.8px">
        <p class="text-gray-600">
          The WELL Building Standard is administered by the International WELL
          Building Institute™, pbc (IWBI), a public benefit corporation whose
          mission is to improve human health and
        </p>
        <br />
        <p class="text-gray-600">
          wellbeing through the built environment. The Green Business
          Certification Inc. (GBCI) manages and administers third-party
          certification for the WELL Building Standard.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    estimate: {
      type: Object,
      required: true,
    },
  },
}
</script>
