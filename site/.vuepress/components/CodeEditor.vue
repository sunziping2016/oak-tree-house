<template>
  <v-card class="mt-2">
    <v-toolbar flat>
      <v-toolbar-title>代码</v-toolbar-title><v-spacer />
      <v-select
        v-if="predefined.length"
        dense
        solo
        hide-details
        class="mr-2"
        style="max-width: 150px"
        :value="mode"
        :items="[
          { text: '自定义', value: 0 },
          ...predefined.map((x, idx) => ({
            text: x.name,
            value: idx + 1
          }))]"
        @input="$emit('update:mode', $event)"
      />
      <v-btn
        color="primary"
        @click="$emit('submit', getContent())"
      >
        提交
      </v-btn>
    </v-toolbar>
    <div
      ref="editor"
      class="elevation-1"
      :class="{ 'codemirror-error': error }"
    />
  </v-card>
</template>

<script>
import { loadScript, loadStyle } from '@util/loader'

function frozenHeaderAndFooter (doc, header, footer) {
  if (header) {
    const segments = header.split('\n')
    doc.markText(
      { line: doc.firstLine(), ch: 0 },
      { line: doc.firstLine() + segments.length - 1, ch: segments[segments.length - 1].length },
      { readOnly: true, atomic: true, selectLeft: false, css: 'opacity: 0.5' })
  }
  if (footer) {
    const segments = footer.split('\n')
    doc.markText(
      { line: doc.lastLine() - segments.length + 1, ch: doc.getLine(doc.lastLine() - segments.length + 1).length - segments[0].length },
      { line: doc.lastLine(), ch: segments[segments.length - 1].length },
      { readOnly: true, atomic: true, selectRight: false, css: 'opacity: 0.5' })
  }
}

export default {
  props: {
    mode: {  // bi-direction bind
      type: Number,
      default: 0
    },
    defaultCode: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: undefined
    },
    header: {
      type: String,
      default: undefined
    },
    footer: {
      type: String,
      default: undefined
    },
    predefined: {
      type: Array,
      default: () => []
    },
    submitOnPredefined: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    mode () {
      if (this.mode === 0) {
        return
      }
      this.$options.editor.off('change', this.onCodeChanged)
      const doc = this.$options.editor.getDoc()
      const code = this.predefined[this.mode - 1].code
      doc.setValue((this.header || '') + code + (this.footer || ''))
      frozenHeaderAndFooter(this.$options.editor, this.header, this.footer)
      if (this.submitOnPredefined) {
        this.$emit('submit', code)
      }
      this.$options.editor.on('change', this.onCodeChanged)
    }
  },
  mounted () {
    Promise.all([
      loadScript('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js', 'script-codemirror'),
      loadStyle('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.css', 'style-codemirror')
    ])
      .then(() => {
        const items = []
        if (this.language) {
          items.push(loadScript(
            `//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/${this.language}/${this.language}.min.js`,
            `script-codemirror-mode-${this.language}`
          ))
        }
        return Promise.all(items)
      })
      .then(() => {
        this.$options.editor = window.CodeMirror((elt) => {
          this.$refs.editor.appendChild(elt)
        }, {
          mode: 'javascript',
          lineNumbers: true,
          viewportMargin: Infinity
        })
        const doc = this.$options.editor.getDoc()
        if (this.mode !== 0) {
          const code = this.predefined[this.mode - 1].code
          doc.setValue((this.header || '') + code + (this.footer || ''))
          frozenHeaderAndFooter(this.$options.editor, this.header, this.footer)
          if (this.submitOnPredefined) {
            this.$emit('submit', code)
          }
        } else {
          doc.setValue((this.header || '') + this.defaultCode + (this.footer || ''))
          frozenHeaderAndFooter(this.$options.editor, this.header, this.footer)
        }
        this.$options.editor.on('change', this.onCodeChanged)
      })
  },
  methods: {
    getContent () {
      const body = this.$options.editor.getDoc().getValue()
      const first = this.header ? this.header.length : 0
      const last = this.footer ? body.length - this.footer.length : body.length
      return body.slice(first, last)
    },
    onCodeChanged () {
      if (this.mode !== 0) {
        this.$emit('update:mode', 0)
      }
      this.$emit('change')
    }
  }
}
</script>

<style>
.CodeMirror {
  font-size: 16px;
  height: auto !important;
  font-family: monospace;
  border: 1px solid #eee;
  transition: all 0.3s ease-in-out;
}
.codemirror-error .CodeMirror {
  border: 1px solid rgba(255,0,0,0.5);
}
.CodeMirror.CodeMirror-focused {
  border: 1px solid rgba(0,0,255,0.5);
  box-shadow: 0 0 5px rgba(0,0,255,0.5);
}
.codemirror-error .CodeMirror.CodeMirror-focused {
  border: 1px solid rgba(255,0,0,0.5);
  box-shadow: 0 0 5px rgba(255,0,0,0.5);
}
</style>
