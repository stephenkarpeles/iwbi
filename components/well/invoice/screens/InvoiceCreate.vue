<template>
  <div>
    <FormulateForm
      :form-errors="formErrors"
      class="space-y-6 max-w-4xl mx-auto my-6 md:my-10"
      @submit="createInvoice"
    >
      <!-- General Information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">General Information</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="name"
              label="Name*"
              type="text"
              validation="required"
            />
            <FormulateInput v-model="email" label="Email Address" type="text" />
            <FormulateInput
              v-model="createdDate"
              label="Invoice Date:"
              type="datetimepicker"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="company"
              type="companymultisearch"
              name="organization"
              label="Organization*"
              validation="required"
              :searchable="true"
              :clearonselect="false"
              :closeonselect="true"
              :optionslimit="10"
            />
            <FormulateInput
              v-model="note"
              label="Notes"
              type="textarea"
              class="col-span-2"
            />
            <FormulateInput
              v-model="description"
              class="col-span-2"
              label="Description"
              validation="required"
              type="text"
            />
          </div>
        </div>
      </div>
      <!-- Address Information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Address Information</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <FormInputsAddressFormulate
            :required="true"
            :address="address"
            :target="address"
            class-key="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full"
          />
          <div class="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="postOffice"
              label="Purchase Order"
              type="text"
            />
          </div>
        </div>
      </div>

      <!-- items information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Items Information</div>
        </div>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="grid grid-cols-4 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="item.description"
              label="Description"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="item.quantity"
              label="Quantity"
              min="0"
              type="number"
              validation="required"
            />
            <FormulateInput
              v-model="item.unit_cost"
              label="Unit Cost"
              min="0"
              type="number"
              validation="required"
            />
            <div class="flex self-end justify-self-start">
              <WButtonsBase
                type="neutral"
                class="text-primary-500"
                icon="plus"
                @click.native="addProject"
              >
              </WButtonsBase>
              <WButtonsBase
                v-if="items.length > 1"
                type="neutral"
                class="text-danger-500"
                icon="minus"
                @click.native="items.splice(index, 1)"
              >
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>

      <div class="md:flex mt-4 md:mt-0">
        <div class="md:ml-auto">
          <FormulateInput
            v-if="!creatingInvoice"
            type="submit"
            label="Create Invoice"
          />
          <div v-else class="sm:w-48">
            <WButtonsBase>
              <WLoadingSpinner type="button" class="mx-auto" />
            </WButtonsBase>
          </div>
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formErrors: [],
      company: null,
      address: {
        country_code: this.$route.query.country_code,
        state: this.$route.query.state,
        street: this.$route.query.street,
        city: this.$route.query.city,
        postal_code: this.$route.query.postal_code,
      },
      paymentType: '',
      paymentStatus: '',
      name: this.$route.query.name,
      organization: this.$route.query.organization,
      note: '',
      description: '',
      paymentDate: '',
      paymentReference: '',
      email: this.$route.query.email,
      currentMenu: 'pricing',
      postOffice: '',
      createdDate: '',
      items: [
        {
          description: '',
          quantity: 0,
          unit_cost: 0,
        },
      ],
      projectInfo: [],
      projectId: '',
      creatingInvoice: false,
    }
  },
  methods: {
    createInvoice() {
      const self = this
      self.creatingInvoice = true
      const data = {
        name: this.name,
        email: this.email,
        company_id: this.company.id,
        organization: this.company.name,
        post_office: this.postOffice,
        description: this.description,
        note: this.note,
        status: this.paymentStatus.value,
        payment_date: null,
        payment_reference: this.paymentReference,
        payment_type: this.paymentType.value,
        country_code: this.address.country_code,
        state: this.address.state,
        postal_code: this.address.postal_code,
        street: this.address.street,
        city: this.address.city,
        items: this.items,
        created_date: this.createdDate
          ? this.createdDate
          : this.$dayjs().format('YYYY-MM-DD'),
      }
      if (this.$route.query.project_id) {
        data.project_id = this.$route.query.project_id
      }
      if (this.$route.query.portfolio_id) {
        data.portfolio_id = this.$route.query.portfolio_id
      }
      this.$axios.post('api/admin/invoice/create', data).then((response) => {
        this.$router.push('/invoice/' + response.data.invoice_number)
      })
    },
    addProject() {
      const newProject = {
        description: '',
        quantity: 0,
        unit_cost: 0,
      }
      this.items.push(newProject)
    },
  },
}
</script>
