<template>
  <div>
    <CodeEditor
      class="mt-2"
      :mode.sync="mode"
      default-code="  "
      :error="error !== null"
      language="javascript"
      :header="`function ${functionName}(${functionParameters.join(', ')}) {\n`"
      :footer="'\n}'"
      :predefined="predefined"
      @submit="onSubmitted"
      @change="changed = true"
    />
    <v-card
      v-if="error !== null"
      class="mt-2"
    >
      <v-toolbar
        flat
        class="red--text"
      >
        <v-toolbar-title>编译错误</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="error-panel pt-0">
        {{ error }}
      </v-card-text>
    </v-card>
    <v-card
      v-else-if="testCases.length"
      class="mt-2"
    >
      <v-toolbar flat>
        <v-toolbar-title>测试结果</v-toolbar-title>
      </v-toolbar>
      <v-tabs
        show-arrows
        :vertical="$vuetify.breakpoint.lgAndUp"
      >
        <v-tabs-slider />
        <v-tab
          v-for="(testResult, index) in testResults"
          :key="index"
          class="justify-space-between"
        >
          <div
            style="text-transform: none"
            :class="[testResult.correctness ? 'green--text' : testResult.success ? 'orange--text' : 'red--text']"
          >
            <slot
              name="test-name"
              v-bind="testResult"
              :index="index"
            >
              {{ functionName }}({{ functionParameters.join(', ') }}) = {{ testResult.result }}
            </slot>
          </div>
          <div>
            <v-btn
              icon
              color="gray"
              @click.stop="testCases.splice(index, 1)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-tab>
        <v-tab-item
          v-for="(testResult, index) in testResults"
          :key="index"
        >
          <v-card
            v-if="changed"
            flat
            style="max-width: 500px"
            class="mx-auto"
          >
            <v-card-text class="pt-0">
              <div class="text-center text-h6">
                还未测试
              </div>
            </v-card-text>
          </v-card>
          <v-card
            v-else
            flat
            :style="testResultWidth ? `max-width: ${testResultWidth}px` : ''"
            class="mx-auto"
          >
            <v-card-text class="pt-0">
              <slot
                name="test-result"
                v-bind="testResult"
                :index="index"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-card
      v-if="canAddTest"
      class="mt-2"
    >
      <v-toolbar flat>
        <v-toolbar-title>添加测试</v-toolbar-title>
      </v-toolbar>
      <slot
        name="test-more"
        :add="onTestAdded"
      />
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    predefined: {
      type: Array,
      default: () => []
    },
    functionName: {
      type: String,
      default: 'foo'
    },
    functionParameters: {
      type: Array,
      default: () => []
    },
    initialTestCases: {
      type: Array,
      default: () => []
    },
    correct: {
      type: Function,
      default: undefined
    },
    testResultWidth: {
      type: Number,
      default: undefined
    },
    canAddTest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mode: this.predefined.length ? 1 : 0,
      error: null,
      changed: false,
      func: null,
      testCases: this.initialTestCases.slice()
    }
  },
  computed: {
    testResults () {
      return this.testCases.map(test => {
        // [test, no exception, call stack/exception, time, correctness]
        if (this.func === null || this.changed) {
          return {
            test,
            success: true,
            results: [],
            result: undefined,
            time: 0,
            correctness: false
          }
        }
        const start = performance.now()
        try {
          const results = this.func(...test[0]).reverse()
          const end = performance.now()
          const evaluation = this.correct ? this.correct(test, results[0][1]) : [test[1] === results[0][1]]
          return {
            test,
            success: true,
            results,
            result: results[0] && results[0][1],
            time: end - start,
            correctness: evaluation[0],
            evaluation
          }
        } catch (e) {
          const end = performance.now()
          console.error(e)
          return {
            test,
            success: false,
            exception: e,
            time: end - start,
            correctness: false
          }
        }
      })
    }
  },
  methods: {
    onSubmitted (code) {
      const funcBody = `\
function __inner(${this.functionParameters.join(', ')}) {${code}}
const __calls = []
function ${this.functionName}() {
  const __call = [arguments, __inner(...arguments)];
  __calls.push(__call);
  return __call[1];
}
${this.functionName}(${this.functionParameters.join(', ')});
return __calls;`
      try {
        this.func = new Function(...this.functionParameters, funcBody)
        this.error = null
      } catch (e) {
        this.func = null
        this.error = e.stack
      } finally {
        this.changed = false
      }
    },
    onTestAdded (test) {
      this.testCases.push(test)
    }
  }
}
</script>

<style>
.error-panel {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  overflow: auto;
  color: red !important;
}
</style>
