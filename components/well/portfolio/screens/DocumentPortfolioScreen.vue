<template>
  <div>
    <WTabsHorizontal
      ref="tabs"
      v-model="currentTabs"
      class="w-full -mb-px"
      :tabs="[
        { name: 'Documentation', icon: '' },
        {
          name: 'Verification methods (Portfolio-scale)',

          icon: '',
        },
      ]"
    />
    <div v-if="currentTabs === 'Documentation'">
      <div class="h-96 overflow-y-scroll">
        <div v-if="paginateProject.current_page === 1" class="text-sm my-5">
          Manage your portfolio’s documentation in a central location as you
          prepare for your next review cycle. Documents can also be uploaded
          inside of your scorecard and will be viewable here. Be sure to include
          the appropriate labels so you can filter most efficiently. Learn more
          about portfolio-scale documentation in the WELL Portfolio Guidebook.
        </div>
        <ul class="list-disc pl-5 text-sm mb-2.5 font-light leading-5">
          <li v-if="paginateProject.current_page === 1" class="text-sm">
            <span><b>Guideline documents</b></span
            ><br />
            Guideline documents documents describe the requirements that
            individual projects adhere to, rather than the details of how a
            particular project has met the feature. They can be used to
            streamline documentation in instances when the WELL v2 verification
            method is specific to the conditions of an individual project: for
            example, a modeling report or an architectural drawing.
          </li>
          <li v-if="paginateProject.current_page === 1" class="text-sm">
            Portfolio-scale documents across multiple projects within a defined
            portfolio. For example, a corporate commitment documented by a
            policy document could apply to all projects within a defined
            portfolio; or, a mechanical engineer involved with several projects
            in the defined portfolio could use the same MEP letter of assurance
            to attest to the designs across those projects.
          </li>
          <li v-if="paginateProject.current_page === 2" class="text-sm my-5">
            Individual-scale documents The verification methods detailed in WELL
            v2 were written to validate features for single-asset projects.
            These project-specific documents are Individual-scale documents;
            they are uploaded by a project team member and applied only to the
            project selected. Any project can use the Individual-scale
            verification method for any feature.
          </li>
        </ul>
      </div>
      <FormInputsPagination
        :pagination="paginateProject"
        :offset="3"
        @paginate="setPaginateProject"
      />
    </div>
    <div v-if="currentTabs === 'Verification methods (Portfolio-scale)'">
      <div class="h-96 overflow-y-scroll p-2">
        <table class="table-auto w-full">
          <thead class="border">
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                WELL v2 verification method
              </th>
              <th
                class="border-r border-l px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Scale
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject to audit?
              </th>
            </tr>
          </thead>
          <tbody class="divide-y border">
            <tr class="align-top">
              <td class="px-4 font-light text-sm">Owner LOA</td>
              <td class="px-4 font-light text-sm border-r border-l" rowspan="6">
                <div class="flex mt-14 text-center">
                  <div class="my-auto text-center">Portfolio-scale</div>
                </div>
              </td>
              <td class="px-4 font-light text-sm" rowspan="6">
                <div class="flex mt-14 text-center">
                  <div class="my-auto text-center">No</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Contractor LOA</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Architect LOA</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">MEP LOA</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Operations Schedule</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Policy Document</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Annotated Map</td>
              <td
                class="px-4 font-light text-sm border-l border-r"
                rowspan="13"
              >
                Portfolio-scale (Guidelines)
              </td>
              <td class="px-4 font-light text-sm border-r" rowspan="13">Yes</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Architectural Drawing</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Commissioning Report</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Design Specifications</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Educational Materials</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Mechanical Drawing</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Modeling Report</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">
                On-going Maintenance Report
              </td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Photographs</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Professional Narrative</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Remediation Report</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">
                Signage and Communications Materials
              </td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Survey Materials</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">On-going Data Report</td>
              <td class="px-4 font-light text-sm border-r border-l" rowspan="2">
                Individual-scale
              </td>
              <td class="px-4 font-light text-sm border-r" rowspan="2">No</td>
            </tr>
            <tr>
              <td class="px-4 font-light text-sm">Performance Test</td>
            </tr>
          </tbody>
        </table>
        <p class="text-secondary-700 text-xs mt-2">
          <i>
            <strong>Note:</strong> Projects may use Individual-scale documents
            for any feature.
          </i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentTabs: 'Documentation',
      paginateProject: {
        total: 2,
        per_page: 1,
        current_page: 1,
        last_page: 2,
        from: 1,
        to: 1,
      },
    }
  },
  methods: {
    setPaginateProject() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 1 === 0 ? 1 : (value - 1) * 1 + 1
      const lastPage =
        this.paginateProject.last_page % 1 === 0
          ? this.paginateProject.last_page / 1
          : this.paginateProject.last_page / 1 + 1
      const end =
        start + 1 <= this.paginateProject.last_page
          ? start + 1
          : this.paginateProject.last_page
      this.paginateProject = {
        total: this.paginateProject.last_page,
        per_page: 1,
        current_page: value,
        last_page: parseInt(lastPage),
        from: start,
        to: end,
      }
    },
  },
}
</script>
