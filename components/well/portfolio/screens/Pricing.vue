<template>
  <div>
    <WHeadingsHTwo
      class="mt-5 mb-3 text-primary-800"
      heading="WELL Portfolio Estimate"
    />
    <div class="shadow p-5 mt-5 text-primary-800">
      <div class="flex justify-between mb-4">
        <h4 class="mt-2 text-2xl leading-9 font-bold text-primary-600">
          WELL Portfolio&trade;
        </h4>
        <WLinksBase
          class="mt-2"
          type="navPrimary"
          icon="download"
          @click.native="downloadEstimate"
        >
          Download Estimate
        </WLinksBase>
      </div>
      <div class="text-sm">
        <p>
          Transform your organization - and the future of health - when you
          apply proven wellness alternatives at scale.
        </p>
        <p>
          The WELL Portfolio program enables
          <span v-if="portfolioInfo.country === 'US'">organisations</span
          ><span v-else>organisations</span> to enhance building performance and
          improve human well-being at scale. Demonstrate your leadership by
          applying the world’s leading health-focused building standard – WELL –
          across multiple buildings in a streamlined and cost-effective
          approach. Designed to maximize the positive outcomes related to human
          health and well-being along with the value of your spaces, WELL
          Portfolio is a program for companies at the leading edge of the
          movement to improve global health.
        </p>
        <p class="mt-10 text-xl leading-9 font-bold">WELL Portfolio is</p>
        <p class="mb-3">
          <strong>Scaled for impact:</strong> Benefit from efficient pathways to
          implement WELL’s design, operations and policy-based alternatives
          across multiple locations, with the option to pursue WELL
          Precertification or WELL Certification. WELL Portfolio offers
          flexibility to meet your portfolio-wide needs and offers solutions for
          both new and existing spaces and locations.
        </p>
        <p class="mb-3">
          <strong>Data-driven: </strong>Monitor your building performance data,
          occupant feedback and other health-focused datasets and receive an
          annual WELL Portfolio Score that reflects your leadership and
          progress. Benchmarking capabilities also enable you to compare your
          performance across your own locations and to other global leaders.
        </p>
        <p class="mb-3">
          <strong>Collaborative: </strong>Receive dedicated coaching support to
          help your company assess its portfolio on health and well-being
          approaches, as well as identify opportunities for improvement and
          recognition.
        </p>
        <p class="mb-3">
          <strong>Built for you: </strong>Manage the entire experience from a
          proprietary platform that brings together teams from real estate to
          human resources in a single place, and helps you advance WELL
          certifications, assess progress and monitor and optimize performance.
        </p>
        <p>
          Participating in the WELL Portfolio program advances your ability to:
        </p>

        <ul class="list-disc pl-5 space-y-1 mt-1 mb-5 text-sm">
          <li>
            create a WELL Portfolio scorecard of health and wellness-based
            strategies,
          </li>
          <li>
            receive dedicated coaching support to help assess and improve the
            portfolio,
          </li>
          <li>
            identify the locations you want to include in your WELL portfolio
            and evaluate each location's performance using WELL assessment
            tools, rooted in more than 100 health and well-being solutions in 10
            concept areas,
          </li>
          <li>
            develop a strategy for improvement and recognition, and track each
            asset’s performance using WELL assessment tools,
          </li>
          <li>
            submit documentation and performance testing results to demonstrate
            how you are implementing WELL’s evidence-based design, operations
            and policy-based alternatives across your portfolio, leveraging our
            independent review process to ensure your spaces are performing as
            intended,
          </li>
          <li>
            achieve the WELL Precertification designation and WELL Certification
            for individual locations and spaces, along with your WELL Portfolio
            Score,
          </li>
          <li>
            earn recognition for your progress and portfolio-wide achievements,
            which can support your financial and ESG reporting efforts,
          </li>
          <li>
            leverage performance insights from the WELL Portfolio dashboard to
            assess your progress, inform future changes, and provide meaningful
            reports to your stakeholders, investors and employees.
          </li>
        </ul>
        <hr />
      </div>
      <div class="text-sm">
        <div class="text-xl mt-10">
          Fee estimate for WELL Portfolio - {{ portfolioInfo.name }}
        </div>
        <div class="text-xm">
          (Estimated portfolio size:
          {{ portfolioInfo.no_of_assets | formatNumber }} locations,
          <span v-if="portfolioInfo.country === 'US'"
            >{{ portfolioInfo.area | formatNumber }} sq ft</span
          ><span v-else
            >{{ portfolioInfo.area_in_meter | formatNumber }} sq metres</span
          >)
        </div>
        <table class="table-auto w-full">
          <thead>
            <tr class="uppercase bg-gray-100 px-3 text-xs">
              <th class="text-left p-4 border-2">BENEFITS</th>
              <th colspan="3" class="text-right p-4 border-2">FEE (USD)</th>
            </tr>
          </thead>

          <tbody class="text-left">
            <tr>
              <td class="p-4 text-sm bg-gray-100 border-2">
                <p class="font-bold mb-5">
                  WELL Portfolio
                  <span v-if="portfolioInfo.country === 'US'">Enrolment</span
                  ><span v-else>Enrollment</span>
                </p>
                <ul class="list-disc pl-5 space-y-1 my-5 text-sm">
                  <li>
                    Create your WELL Portfolio scorecard of health-based
                    strategies to apply across your organization
                  </li>
                  <li>
                    Receive dedicated coaching support from the IWBI technical
                    team to help define the portfolio scope and identify
                    efficiencies for implementing WELL features across your
                    portfolio
                  </li>
                  <li>
                    Access an online platform, WELL Online, for portfolio-wide
                    management of scorecard
                  </li>
                  <li>
                    Receive complimentary WELL Portfolio membership benefits for
                    your first year
                  </li>
                </ul>
              </td>
              <td colspan="3" class="p-4 text-sm text-right font-bold border-2">
                ${{ Math.round(portfolioInfo.reg_amount) | formatNumber }}
              </td>
            </tr>
            <tr class="uppercase bg-gray-100 px-3 text-xs">
              <th rowspan="2" class="text-left p-4 border-2"></th>
              <th colspan="3" class="text-center p-4 border-2">
                PAYMENT SCHEDULE
              </th>
            </tr>
            <tr class="uppercase bg-gray-100 px-3 text-xs">
              <th class="text-right p-4 border-r-2">Monthly</th>
              <th class="text-right p-4 border-r-2">Quarterly</th>
              <th class="text-right p-4 border-r-2">Annually</th>
            </tr>
            <tr>
              <td class="p-4 text-sm bg-gray-100 border-2">
                <p class="font-bold mb-1">WELL Portfolio Subscription</p>
                <ul class="list-disc pl-5 space-y-1 my-3 text-sm">
                  <li>
                    Assemble your team and access IWBI technical coaching
                    support to implement WELL features at scale
                  </li>
                  <li>
                    Review the WELL Portfolio dashboard showing performance
                    across projects and benchmarking progress across your
                    portfolio
                  </li>
                  <li>
                    Submit annual documentation and performance testing results
                    for review by GBCI to demonstrate feature achievements
                    across the defined portfolio
                  </li>
                  <li>
                    Receive an annual WELL Portfolio Score, representing
                    aggregated achievements
                  </li>
                  <li>
                    Earn recognition for your progress and portfolio-wide
                    achievements, which can support your financial and ESG
                    reporting efforts.
                  </li>
                  <li>
                    Achieve the WELL Precertification designation, WELL
                    Certification and recertification for individual projects
                    within the portfolio in a streamlined manner
                  </li>
                  <li>
                    Leverage performance insights from the WELL Portfolio
                    dashboard to assess your progress, inform future changes,
                    and provide meaningful reports to your stakeholders,
                    investors and employees.
                  </li>
                  <li>
                    Receive complimentary WELL Portfolio membership benefits for
                    the duration of your subscription (specific benefits may
                    vary based on your portfolio size)
                  </li>
                </ul>
              </td>
              <td class="p-4 text-sm text-right font-bold border-2">
                ${{
                  Math.round(getPrice(portfolioInfo.sub_amount, 12, 1, 2))
                    | formatNumber
                }}
              </td>
              <td class="p-4 text-sm text-right font-bold border-2">
                ${{
                  Math.round(getPrice(portfolioInfo.sub_amount, 4, 1, 2))
                    | formatNumber
                }}
              </td>
              <td class="p-4 text-sm text-right font-bold border-2">
                ${{
                  Math.round(getPrice(portfolioInfo.sub_amount, 1, 1, 2))
                    | formatNumber
                }}
              </td>
            </tr>
            <tr>
              <td class="p-4 text-sm bg-gray-100 border-2">
                Approximate cost per building<br /><span class="font-bold">
                  ({{ portfolioInfo.no_of_assets }} locations)</span
                >
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      12,
                      portfolioInfo.no_of_assets,
                      2
                    ) | formatNumber
                  }}</strong
                ><br />
                <span class="text-xs">per month</span>
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      4,
                      portfolioInfo.no_of_assets,
                      2
                    ) | formatNumber
                  }}</strong
                ><br />
                <span class="text-xs">per quarter</span>
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      1,
                      portfolioInfo.no_of_assets,
                      2
                    ) | formatNumber
                  }}</strong
                ><br />
                <span class="text-xs">per year</span>
              </td>
            </tr>
            <tr>
              <td class="p-4 text-sm bg-gray-100 border-2">
                Average cost per
                <span v-if="portfolioInfo.country === 'US'">sq ft</span
                ><span v-else>sq metre</span><br /><span class="font-bold">
                  (<span v-if="portfolioInfo.country === 'US'"
                    >{{ Math.round(portfolioInfo.area) | formatNumber }} sq
                    ft</span
                  ><span v-else
                    >{{
                      Math.round(portfolioInfo.area_in_meter) | formatNumber
                    }}
                    sq m</span
                  >)</span
                >
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong v-if="portfolioInfo.country === 'US'"
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      12,
                      portfolioInfo.area,
                      5
                    ) | formatNumber
                  }}</strong
                >
                <strong v-else
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      12,
                      portfolioInfo.area_in_meter,
                      5
                    ) | formatNumber
                  }}</strong
                ><br />
                <span class="text-xs">per month</span>
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong v-if="portfolioInfo.country === 'US'"
                  >${{
                    getPrice(portfolioInfo.sub_amount, 3, portfolioInfo.area, 4)
                      | formatNumber
                  }}</strong
                >
                <strong v-else
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      4,
                      portfolioInfo.area_in_meter,
                      3
                    ) | formatNumber
                  }}</strong
                ><br />
                <small class="text-xs">per quarter</small>
              </td>
              <td
                class="
                  p-4
                  text-sm text-right
                  font-bold
                  border-2
                  whitespace-nowrap
                "
              >
                <strong v-if="portfolioInfo.country === 'US'"
                  >${{
                    getPrice(portfolioInfo.sub_amount, 1, portfolioInfo.area, 3)
                      | formatNumber
                  }}</strong
                >
                <strong v-else
                  >${{
                    getPrice(
                      portfolioInfo.sub_amount,
                      1,
                      portfolioInfo.area_in_meter,
                      3
                    ) | formatNumber
                  }}</strong
                ><br />
                <small class="text-xs">per year</small>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-10">
          <p>Additional considerations:</p>
          <ul class="list-disc pl-5 space-y-1 my-5 text-xs">
            <li>
              The above fees assume a minimum five-year starting commitment to
              the WELL Portfolio program.
            </li>
            <li>
              WELL Portfolio subscription does not include costs associated with
              onsite performance testing. Other optional services may also
              require an additional fee.
            </li>
            <li>
              Market and sector discounts may apply but may not be combined with
              any other discounts.
            </li>
            <li>
              The annual subscription fee will be determined based on the total
              size of the defined portfolio at the start of each annual payment
              cycle, recalculated to reflect any square footage that was added
              or removed in the previous year.
            </li>
            <li>
              The enrollment and subscription fees are exclusive of and
              participants are responsible for any and all applicable sales tax,
              use tax, value added tax, or any similar tax or duty required by
              law.
            </li>
            <li>
              The <span v-if="portfolioInfo.country === 'US'">enrolment</span
              ><span v-else>enrollment</span> and subscription fees are
              nonrefundable.
              <ul class="list-disc pl-5 space-y-1 my-1 text-xs">
                <li>
                  If, within six months, you decide not to proceed under the
                  WELL Portfolio program, then the
                  <span v-if="portfolioInfo.country === 'US'">enrolment</span
                  ><span v-else>enrollment</span> fee may be credited towards
                  the registration and/or certification fees of any other single
                  projects pursuing WELL Certification. Fees must be credited
                  within 12 months of enrollment. Fees cannot be credited if you
                  have already enrolled individual assets as part of your
                  portfolio.
                </li>
                <li>
                  Once subscribed to the program, portfolio participants are
                  committing to pay the subscription fees for the duration of
                  the subscription term. Exiting the program will not relieve
                  subscribers of their obligation to pay subscription fees for
                  the remainder of the committed subscription term.
                </li>
              </ul>
            </li>
            <li>
              WELL Portfolio participants will be required to enter into a
              certification agreement with Green Business Certification Inc.
              (“GBCI”) in order to submit portfolio and project related
              documentation for GBCI’s review. To the extent that there are any
              statements within this pricing document which conflict with what’s
              in the GBCI certification agreement, the GBCI certification
              agreement will control.
            </li>
            <li>
              Assessment of portfolios and projects are further subject to
              customers entering into the WELL Portfolio Agreement with Green
              Business Certification Inc. (“GBCI”), the third party verifier for
              the WELL program.
            </li>
            <li>
              Coaching and other support services are available to customers
              following enrollment in the WELL Portfolio program. Based on
              information provided to IWBI, IWBI coaching and support staff may
              provide suggestions and feedback regarding application of certain
              WELL Building Standard features to a customer’s portfolio and/or
              individual projects. As a reminder, the final review of portfolio
              and project documentation and performance verification will be
              performed by GBCI, and achievement of WELL Certification or any
              level of WELL Certification or any particular WELL Portfolio Score
              cannot be guaranteed. Any discussions customers may have with IWBI
              representatives in connection with coaching services do not
              constitute advice, a promise, a representation or a warranty
              regarding the likelihood of achieving certification of one or more
              projects under WELL Certification program or of achieving a WELL
              Portfolio Score or other designation or one or more points,
              features, parts, credits, preconditions or other similar elements
              of WELL Certification or scoring, and neither IWBI nor any of its
              representatives shall have any liability resulting from the use or
              content of such statements or information or from any action taken
              or any inaction occurring in reliance on such statements or
              information.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      portfolioInfo: (state) => state.portfolio.portfolioEstimateDetails,
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },

  methods: {
    getPrice(value, months, divideBy, digits) {
      const temp = months * divideBy
      return (value / temp).toFixed(digits)
    },
    downloadEstimate() {
      const url =
        this.$axios.defaults.baseURL +
        'api/portfolio/estimate/pdf/' +
        this.portfolioInfo.id +
        '?token=' +
        this.$store.state.authentication.token
      window.open(url, '_blank')
    },
  },
}
</script>
