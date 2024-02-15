<template>
  <form onsubmit="event.preventDefault();">
    <div
      v-if="editor"
      class="edit-button-group border-t border-l border-r border-b px-3 py-2 rounded-t-lg flex content-center"
    >
      <button
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <div class="cursor-pointer my-auto">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="bold"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="w-3 text-primary-700"
            style="fill: currentcolor"
          >
            <path
              fill="currentColor"
              d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z"
            ></path>
          </svg>
        </div>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <div class="cursor-pointer menubar__button my-auto is-active">
          <svg
            aria-hidden="true"
            focusable="false"
            data-icon="italic"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            class="w-2.5 text-primary-700"
            style="fill: currentcolor"
          >
            <path
              fill="currentColor"
              d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z"
            ></path>
          </svg>
        </div>
      </button>

      <button
        :class="{ 'is-active': editor.isActive('link') }"
        @click="setLink"
      >
        <div class="cursor-pointer menubar__button my-auto">
          <div class="flex h-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="my-auto w-5 pt-0.5 mb-1 text-primary-700"
              style="fill: currentcolor"
            >
              <path
                fill-rule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </button>
      <button
        v-if="editor.isActive('link')"
        @click="editor.chain().focus().unsetLink().run()"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="unlink"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="my-auto w-4 pt-0.5 text-primary-700"
        >
          <path
            fill="currentColor"
            d="M304.083 405.907c4.686 4.686 4.686 12.284 0 16.971l-44.674 44.674c-59.263 59.262-155.693 59.266-214.961 0-59.264-59.265-59.264-155.696 0-214.96l44.675-44.675c4.686-4.686 12.284-4.686 16.971 0l39.598 39.598c4.686 4.686 4.686 12.284 0 16.971l-44.675 44.674c-28.072 28.073-28.072 73.75 0 101.823 28.072 28.072 73.75 28.073 101.824 0l44.674-44.674c4.686-4.686 12.284-4.686 16.971 0l39.597 39.598zm-56.568-260.216c4.686 4.686 12.284 4.686 16.971 0l44.674-44.674c28.072-28.075 73.75-28.073 101.824 0 28.072 28.073 28.072 73.75 0 101.823l-44.675 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.598 39.598c4.686 4.686 12.284 4.686 16.971 0l44.675-44.675c59.265-59.265 59.265-155.695 0-214.96-59.266-59.264-155.695-59.264-214.961 0l-44.674 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.597 39.598zm234.828 359.28l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941L63.598 7.029c-9.373-9.373-24.569-9.373-33.941 0L7.029 29.657c-9.373 9.373-9.373 24.569 0 33.941l441.373 441.373c9.373 9.372 24.569 9.372 33.941 0z"
            class=""
          ></path>
        </svg>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('list') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ordered-list my-auto w-4 pt-0.5 text-primary-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('list') }"
        @click="editor.chain().focus().setHardBreak().run()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="hardbreak my-auto w-4 pt-0.5 text-primary-700"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>
    </div>
    <editor-content
      :editor="editor"
      class="tiptap-editor border-primary-200 border-b border-l border-r rounded-b-lg min-h-[5rem]"
    />
  </form>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import HardBreak from '@tiptap/extension-hard-break'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editor: null,
    }
  },
  watch: {
    modelValue: {
      handler(value) {
        // HTML
        let isSame = false
        if (this.editor) {
          isSame = this.editor.getHTML() === value
        }

        if (isSame) {
          return
        }
        if (value) {
          this.$emit('update:modelValue', value)
        }
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class:
            'p-2 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[5rem]',
        },
      },
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
        HardBreak,
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$parent.value = this.editor.getHTML()
        this.$parent.context.model = this.editor.getHTML()

        this.$emit('update:modelValue', this.editor.getHTML())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
  methods: {
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('Enter your link: ', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()

        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    },
  },
}
</script>
<style>
.tiptap-editor ol,
.tiptap-editor ul {
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
.tiptap-editor ol {
  list-style-type: decimal;
}
.tiptap-editor ul {
  list-style: disc;
}
/* Gap between button in Editor */
.edit-button-group > button {
  margin-right: 10px;
}
/* Hardbreak Icon - Flip Reply Icon Vertically  */
.hardbreak {
  transform: scaleY(-1);
}
</style>
