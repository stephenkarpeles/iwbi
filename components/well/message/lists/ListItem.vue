<template>
  <div>
    <div class="md:flex px-4 py-6 md:px-6 md:py-4">
      <div class="flex items-center justify-center">
        <div
          class="
            w-10
            h-10
            flex
            items-center
            justify-center
            bg-primary-700
            shadow-md
            rounded-full
            text-white
            md:ml-4 md:mr-8
          "
        >
          {{
            message.coach_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
          }}
        </div>
      </div>
      <div class="md:flex flex-1 mt-6 md:mt-0">
        <div class="md:w-2/3 text-center md:text-left">
          <div
            class="
              text-primary-700 text-lg
              leading-tight
              font-bold
              truncate
              md:w-9/12
            "
          >
            {{ message.subject }}
          </div>
          <div
            v-if="message.description !== null"
            class="text-sm text-primary-500 mb-2"
          >
            {{ message.description }}
          </div>
          <div class="md:space-x-4">
            <div class="text-xs my-auto">
              <svg
                class="inline w-5 text-primary-400 mr-1 my-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div class="inline my-auto text-primary-400">
                {{ $dayjs(message.updated_at).format('MMM DD, YYYY') }}
              </div>
            </div>
            <div
              v-if="message.mc_tags.length"
              class="inline-block md:flex md:space-x-2 text-xs mt-1 md:mt-0"
            >
              <div
                v-for="element in message.mc_tags"
                :key="element.id"
                class="rounded-full bg-secondary-700 text-white py-1 px-3"
              >
                {{ element.name }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="
            flex
            md:ml-auto
            space-x-4
            md:space-x-2
            items-center
            justify-center
            md:justify-between
            mt-6
            md:mt-0
          "
        >
          <div>
            <WButtonsBase
              icon="eye-small"
              type="primaryInverted"
              @click.native="$parent.previewMessage(message)"
            />
          </div>
          <div>
            <WButtonsBase
              icon="pencil"
              type="primaryInverted"
              @click.native="
                $parent.editMessage(message), ($parent.modalScreen = 'compose')
              "
            />
          </div>
          <div>
            <WButtonsBase
              v-if="$store.state.message.filters.type !== 'automatic'"
              icon="menu"
              type="primaryInverted"
              @click.native="$parent.viewLogs(message.id)"
            />
          </div>
          <div v-show="currentUser.id === message.coach_id">
            <WButtonsBase
              v-if="$store.state.message.filters.type !== 'automatic'"
              icon="trash"
              type="dangerInverted"
              @click.native="deleteMessage(), $parent.getMessages()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async deleteMessage() {
      await this.$store.dispatch('message/getDeleteTemplate', this.message.id)
      this.$store.dispatch('message/getCoachMessages')
    },
  },
}
</script>
