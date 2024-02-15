<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <WLinksBase link="/directories/organizations" icon="arrow-narrow-left">
      ALL ORGANIZATIONS
    </WLinksBase>
    <MembershipProfileScreen :membership="organization" />
  </div>
</template>
<script>
export default {
  auth: false,
  async asyncData({ store, params, $axios, redirect }) {
    let organization = null

    if (params.organizationSlug) {
      await Promise.all([
        $axios
          .get('api/organizations/bySlug/' + params.organizationSlug)
          .then((response) => {
            return (organization = response.data)
          }),
      ])

      return {
        organization,
        currentUser: store.state.user.currentUser,
      }
    } else {
      redirect('/membership/directory')
    }
  },
  head() {
    return {
      title: `${this.organization.name}`,
    }
  },
}
</script>
