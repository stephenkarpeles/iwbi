<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <div class="flex justify-between">
            <WHeadingsHTwo heading="Invoices" />
            <div>
              <WButtonsBase
                type="primaryInverted"
                icon="arrow-narrow-left"
                @click.native="
                  $route.query.back
                    ? $router.push($route.query.back)
                    : $router.push(`/well-admin/invoices`)
                "
              >
                Back
              </WButtonsBase>
            </div>
          </div>
        </NavBreadcrumbs>
        <div>
          <InvoiceCreate />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: `Create an Invoice`,
    }
  },
}
</script>
