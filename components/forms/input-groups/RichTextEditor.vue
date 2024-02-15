<template>
  <ClientOnly>
    <FormInputsTipTap v-model="editor" :model-value="model" />
  </ClientOnly>
</template>
<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  computed: {
    model() {
      return this.context.model
    },
  },
  // mounted(){
  //   if(this.context.model){}
  // }
}
</script>
