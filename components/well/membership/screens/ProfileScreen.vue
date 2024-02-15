<template>
  <div>
    <div
      class="shadow-md rounded-md p-12 md:my-5 border-primary-100 border space-y-4"
    >
      <img class="mx-auto max-w-lg max-h-72" :src="membership.profile_pic" />
    </div>
    <div class="pt-6 md:px-12 md:mt-12 flex flex-col md:flex-row flex-wrap">
      <div class="md:w-2/3 md:border-r">
        <WHeadingsHFour class="text-primary-400" heading="ORGANIZATION" />
        <WHeadingsHTwo class="text-primary-900" :heading="membership.name" />

        <div class="text-primary-900 flex flex-col space-y-2">
          <div v-if="membership.tell_us_about">
            <span class="font-bold uppercase text-lg">About</span>
            <div v-html="membership.tell_us_about"></div>
          </div>
          <div v-if="membership.company_mission">
            <span class="font-bold uppercase text-lg">Company's mission</span>
            <div v-html="membership.company_mission"></div>
          </div>
          <div v-if="membership.why_well_member">
            <span
              v-if="membership.type !== 'Portfolio'"
              class="font-bold uppercase text-lg"
              >Why well?</span
            >
            <span v-else class="font-bold uppercase text-lg"
              >Why well portfolio?</span
            >
            <div v-html="membership.why_well_member"></div>
          </div>

          <div v-if="membership.why_well">
            <span
              v-if="membership.type !== 'Portfolio'"
              class="font-bold uppercase text-lg"
              >Why well?</span
            >
            <span v-else class="font-bold uppercase text-lg"
              >Why well portfolio?</span
            >
            <div v-html="membership.why_well"></div>
          </div>

          <div v-if="membership.achievements">
            <span class="font-bold uppercase text-lg"
              >Achievements and accomplishments</span
            >
            <div v-html="membership.achievements"></div>
          </div>

          <div v-if="membership.goals">
            <span class="font-bold uppercase text-lg"
              >Health and Wellness goals</span
            >
            <div v-html="membership.goals"></div>
          </div>

          <div v-if="membership.wellness_values">
            <span class="font-bold uppercase text-lg"
              >Health and Wellness goals</span
            >
            <div v-html="membership.wellness_values"></div>
          </div>
        </div>
      </div>
      <div class="md:w-1/3 md:pl-8 space-y-5">
        <div v-if="$route.name === 'portfolio-id-profile'">
          <WButtonsBase
            class="mb-2"
            @click.native="
              $router.push(`/portfolio/${$route.params.id}}/profile/edit`)
            "
          >
            Edit Profile
          </WButtonsBase>
        </div>
        <div v-else>
          <div v-if="membership.type_internal !== 'pt-org'">
            <WButtonsBase class="mb-2" @click.native="joinOrganization()">
              Join Organization
            </WButtonsBase>
            <div>
              If you work at {{ membership.name }} and would like to gain access
              to the membership benefits, please click above.
            </div>
            <div
              class="text-center bg-secondary-600 w-12 rounded-full text-sm text-white mx-auto"
            >
              OR
            </div>
            <div>
              If you work at {{ membership.name }} and know the organization's
              registration code, please input it in the field below to gain
              access to the membership benefits.
            </div>
            <div>
              <FormulateForm @submit="joinByCode()">
                <FormulateInput
                  v-model="code"
                  type="text"
                  validation="required"
                  label="Join with code"
                />
                <FormulateInput class="mt-2" type="submit" label="Join" />
              </FormulateForm>
            </div>
          </div>
        </div>
        <div>
          <label
            class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Organization Level
          </label>
          <div class="font-bold text-xl">
            <span
              v-if="
                membership.type === 'Portfolio' &&
                membership.type_internal === 'pt-org'
              "
            >
              Performance Testing Organization
            </span>
            <span v-else>
              {{ membership.type }}
            </span>
          </div>
        </div>
        <div v-if="membership.poc_name">
          <label
            class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Point of Contact
          </label>
          <div class="font-bold text-xl">
            {{ membership.poc_name }}
          </div>
          <WLinksBase :link="'mailto:' + membership.poc_email" target="_blank">
            {{ membership.poc_email }}
          </WLinksBase>
        </div>
        <div v-if="membership.website">
          <label
            class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Website
          </label>
          <WLinksBase :link="membership.website" target="_blank">
            {{ membership.website }}
          </WLinksBase>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    membership: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      code: '',
    }
  },
  methods: {
    joinOrganization() {
      this.$axios
        .post('api/membership/member-request/user/' + this.membership.id)
        .then((res) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Joined Organization!',
          })
        })
        .catch((err) => {
          if (err.response) {
            this.$store.dispatch('notifications/toastMessage', {
              message: err.response.data.msg,
            })
          } else {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Something went wrong...please try again later',
            })
          }
        })
    },
    joinByCode() {
      this.$axios
        .post(
          'api/membership/member-request/' +
            this.membership.id +
            '/join/' +
            this.code
        )
        .then((res) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Joined Organization!',
          })
        })
        .catch((err) => {
          if (err.response) {
            this.$store.dispatch('notifications/toastMessage', {
              message: err.response.data.msg,
            })
          } else {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Something went wrong...please try again later',
            })
          }
        })
    },
  },
}
</script>
