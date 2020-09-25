---
title: 欧几里得算法
author: 孙子平
date: 2020-09-22T05:22:02Z
category: 数学
tags: [数学, 数论]
---

这篇文章主要介绍了：

1. 最大公约数（GCD）与欧几里得算法；
2. 平衡欧几里得算法；
3. 扩展欧几里得算法。

<!-- more -->

## 1 GCD与欧几里得算法

### 1.1 整除和素数

**除法定理** $\forall a,b(a\in\mathbb{Z}\land b\in\mathbb{Z}^*\rightarrow\exists!q,r(q,r\in\mathbb{Z}\land 0\leq r<|b|\land a=bq+r))$。其中，$q$称为**商**，$r = (a \operatorname{mod} b)$称为**余**。如果$r=0$，那么我们说$b$**整除**$a$，$b$是$a$的约数，记作$b|a$。

**GCD的定义** 对$d\in\mathbf{Z}^*$，$a,b\in\mathbf{Z}$，若$d|a\land d|b$，则我们成$d$是$a$和$b$的**公约数**。如果$d$是所有公约数中最大的，就称为**最大公约数（GCD）**，记为$\mathrm{gcd}(a,b)=d$。

注：$\mathrm{gcd}(a,0)$一般定义为$a$。

**欧几里得定理** $\forall a,b,q,r(q,r\in\mathbb{Z}\land a,b\in\mathbb{Z}^*\land a=bq+r\rightarrow\mathrm{gcd}(a,b)=\mathrm{gcd}(b,r))$。

证明：

$$\begin{aligned}
&\mathrm{gcd}(a,b)|a-bq=r\Rightarrow\mathrm{gcd}(a,b)|\mathrm{gcd}(b,r) \\
&\mathrm{gcd}(b,r)|a=bq+r\Rightarrow\mathrm{gcd}(b,r)|\mathrm{gcd}(a,b)
\end{aligned}$$

### 1.2 欧几里得算法的实现

<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>代码</v-toolbar-title><v-spacer /><v-select dense solo hide-details class="mr-2" style="max-width: 150px" :items="['自定义', '递归', '循环', '二进制', '平衡']" v-model="gcdMode"></v-select><v-btn color="primary" v-on:click="onGcdFuncBodyUpdated">提交</v-btn></v-toolbar>
<div id="euclidean-code" class="elevation-1"></div>
</v-card>

<v-card v-if="gcdFuncError !== null" class="mt-2">
<v-toolbar flat class="red--text"><v-toolbar-title>编译错误</v-toolbar-title></v-toolbar>
<v-card-text class="error-panel pt-0">{{ gcdFuncError }}</v-card-text>
</v-card>
<v-card v-else class="mt-2">
<v-toolbar flat><v-toolbar-title>测试结果</v-toolbar-title></v-toolbar>
<v-tabs show-arrows :vertical="$vuetify.breakpoint.lgAndUp">
<v-tabs-slider></v-tabs-slider>
<v-tab v-for="testResult, index in gcdTestResults" class="justify-space-between">
<div class="text-lowercase" :class="[testResult[2] && testResult[1] == (testResult[3][0] && testResult[3][0][1]) ? 'green--text' : testResult[2] ? 'orange--text' : 'red--text']">gcd({{ testResult[0][0] }}, {{ testResult[0][1] }}) = {{ testResult[1] }}</div><div><v-btn icon color="gray" v-on:click.stop="gcdTestCases.splice(index, 1)"><v-icon>mdi-close</v-icon></v-btn></div>
</v-tab>
<v-tab-item v-for="testResult in gcdTestResults">
<v-card v-if="gcdChanged" flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="text-center text-h6">还未测试</div>
</v-card-text></v-card>
<v-card v-else flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div class="overflow-auto green--text" v-if="testResult[2] && testResult[1] == (testResult[3][0] && testResult[3][0][1])">正确，返回 {{testResult[1]}}</div>
<div class="overflow-auto orange--text" v-else-if="testResult[2]">错误，返回 {{testResult[3][0] && testResult[3][0][1]}}</div>
<div class="overflow-auto red--text" v-else>异常，抛出 {{testResult[3]}}</div>
</div>
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{(Math.round(testResult[4] * 1000) / 1000).toFixed(3)}} ms</div>
</div>
<div class="subtitle-1 pr-4 primary--text text-no-wrap">调用栈：</div>
<v-simple-table v-if="testResult[2]" dense class="stack-table">
<template v-slot:default>
<thead><tr>
<th class="text-left">深度</th>
<th class="text-left">参数a</th>
<th class="text-left">参数b</th>
<th class="text-left">返回值</th>
</tr></thead>
<tbody><tr v-for="frame, index in testResult[3]" :key="index">
<td>{{ index + 1 }}</td>
<td>a = {{ frame[0][0] }}</td>
<td>b = {{ frame[0][1] }}</td>
<td>{{ frame[1] }}</td>
</tr></tbody>
</template>
</v-simple-table>
</v-card-text></v-card>
</v-tab-item>
</v-tabs>
</v-card>
<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>添加测试</v-toolbar-title></v-toolbar>
<v-form v-model="gcdFormValid" v-on:submit.prevent="gcdTestSubmit">
<div class="pb-4 px-4 d-flex align-center">
<v-text-field class="mr-2" v-model="gcdTestA" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数a" required></v-text-field>
<v-text-field class="mr-2" v-model="gcdTestB" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数b" required></v-text-field>
<v-btn :disabled="!gcdFormValid" color="primary" type="submit">添加</v-btn>
</div>
</v-form>
</v-card>

### 1.3 欧几里得算法的复杂性估计

引理：$\forall a,b(a,b\in\mathbb{Z}\land0<b\leq a\rightarrow a\operatorname{mod}b\leq \frac{a-1}{2})$。分$b\leq\frac{a}{2}$和$b>\frac{a}{2}$两种情况讨论即可证明。

**定理 欧几里得算法复杂度上界**：

$$\forall a,b(a,b\in\mathbb{Z}^+\rightarrow\mathrm{gcd}(a,b)\text{的带余除法运算次数}\leq\lfloor 2\log_2\max\{a,b\}\rfloor+1)$$

证明方法是构造数列$r_i (i=-1,0,\cdots)$，其中：

$$\begin{cases}
r_{-1} = a \\
r_0 = b \\
r_{i+1} = r_{i-1}\operatorname{mod}r_i &(i \geq 0)
\end{cases}$$

由此$r_{j+1}\leq\frac{r_{j-1}-1}{2}$。注意它是隔一个元素减半，这就到之类复杂度上界多了系数$2$。

### 1.4 二进制欧几里得算法

1. $\mathrm{gcd}(0,v)=v$；
2. 如果$u,v$都是偶数，$\mathrm{gcd}(u,v)=2\mathrm{gcd}(u/2,v/2)$；
3. 如果$u$是偶数，$v$是奇数，$\mathrm{gcd}(u,v)=\mathrm{gcd}(u/2,v)$；
4. 如果$u$是奇数，$v$是偶数，$\mathrm{gcd}(u,v)=\mathrm{gcd}(v/2,u)$；
5. 如果$u,v$都是奇数且$u\geq v$，$\mathrm{gcd}(u,v)=\mathrm{gcd}((u-v)/2, v)$。

## 2 平衡的欧几里得算法

**第1泛化除法定理** $\forall a,b,d(a,d\in\mathbb{Z}\land b\in\mathbb{Z}^*\rightarrow\exists!Q,R(Q,R\in\mathbb{Z}\land d\leq R<|b|+d\land a=bQ+R))$。特别地，令$d=-|\frac{m}{2}|$，则$-|\frac{m}{2}|\leq R<|\frac{m}{2}|$

**第1泛化欧几里得定理** $\forall a,b,q,r(q,r\in\mathbb{Z}\land a,b\in\mathbb{Z}^*\land a=bq+r\rightarrow\mathrm{gcd}(a,b)=\mathrm{gcd}(b,r)=\mathrm{gcd}(b,-r)=\mathrm{gcd}(b,b-r))$。

**定理 第1泛化欧几里得算法复杂度上界**：

$$\forall a,b(a,b\in\mathbb{Z}^+\rightarrow\mathrm{gcd}(a,b)\text{的带余除法运算次数}\leq\lfloor\log_2\max\{a,b\}\rfloor+1)$$

注：系数2不见了，时间复杂度在常数上有了进步。主要来源于构造的数列不再是隔一个减半，而是相邻减半：$r_{j}\leq\frac{r_{j-1}-1}{2}$。

## 3 扩展欧几里得算法

**Bézout等式**：

$$\forall a,b(a,b\in\mathbb{Z}\rightarrow\exists u,v(u,v\in\mathbb{Z}\land\mathrm{gcd}(a,b)=ua+vb))$$

证：

<script>
function loadScript (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      script.addEventListener('load', resolve)
      document.body.appendChild(script)
    }
  })
}

function loadStyle (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = src
      style.id = id
      style.addEventListener('load', resolve)
      document.body.appendChild(style)
    }
  })
}

function frozenFirstAndLastLine(doc) {
  doc.markText(
    { line: doc.firstLine(), ch: 0 },
    { line: doc.firstLine() + 1, ch: 0 },
    { readOnly: true, atomic: true, selectLeft: false, css: 'opacity: 0.5' })
  doc.markText(
    { line: doc.lastLine() - 1, ch: doc.getLine(doc.lastLine() - 1).length },
    { line: doc.lastLine(), ch: 1 },
    { readOnly: true, atomic: true, selectRight: false, css: 'opacity: 0.5' })
}

const gcdImplHeader = 'function gcd(a, b) {\n'
const gcdImplFooter = '\n}'

const gcdRecursiveImpl = `\
  return b <= 0 ? a : gcd(b, a % b);`

const gcdLoopImpl = `\
  while (b > 0) {
    const temp = a % b;
    a = b;
    b = temp;
  }
  return a;`

const gcdBinaryImpl = `\
  if (a === 0) {
    return b;
  }
  if (b === 0) {
    return a;
  }
  const aIsOdd = a % 2;
  const bIsOdd = b % 2;
  if (aIsOdd && bIsOdd) {
    return gcd(Math.abs(a - b) / 2, Math.min(a, b));
  } else if (aIsOdd) {
    return gcd(b / 2, a);
  } else if (bIsOdd) {
    return gcd(a / 2, b);
  } else {
    return 2 * gcd(a / 2, b / 2 );
  }`

const gcdBalancedImpl = `\
  if (b <= 0) {
    return a;
  } else {
    let r = a % b;
    if (2 * r > b) {
      r = b - r;
    }
    return gcd(b, r);
  }`

function gcd(a, b) {
  while (b > 0) {
    const temp = a % b;
    a = b;
    b = temp;
  }
  return a;
}

export default {
  data: () => ({
    gcdFunc: null,
    gcdFuncError: null,
    gcdTestCases: [
      [[6, 0], 6],
      [[6, 4], 2],
      [[4, 6], 2],
      [[101, 31], 1],
      [[11, 121], 11]
    ],
    gcdMode: '',
    gcdChanged: true,
    gcdTestA: '',
    gcdTestB: '',
    gcdFormValid: false
  }),
  mounted () {
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js', 'script-codemirror'),
      loadStyle('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.css', 'style-codemirror')
    ])
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js', 'script-codemirror-mode-javascript'))
      .then(() => {
        const element = document.getElementById('euclidean-code')
        this.$options.gcdCode = CodeMirror((elt) => {
          element.appendChild(elt, element)
        }, {
          mode: 'javascript',
          lineNumbers: true,
          viewportMargin: Infinity
        })
        this.$options.gcdCode.on('change', this.onGcdValueChanged)
        this.gcdMode = '递归'
      })
  },
  computed: {
    gcdTestResults () {
      return this.gcdTestCases.map(test => {
        // [input, answer, status, call stack/exception, time]
        if (this.gcdFunc === null || this.gcdChanged) {
          return [...test, true, [], 0]
        }
        const start = performance.now()
        try {
          const result = this.gcdFunc(...test[0]).reverse()
          const end = performance.now()
          return [...test, true, result, end - start]
        } catch (e) {
          const end = performance.now()
          return [...test, false, e, end - start]
        }
      })
    }
  },
  watch: {
    gcdFuncError () {
      const element = document.getElementById('euclidean-code').firstChild
      element.classList[this.gcdFuncError === null ? 'remove' : 'add']('CodeMirror-error')
    },
    gcdMode () {
      let code = ''
      switch (this.gcdMode) {
        case '递归':
          code = gcdRecursiveImpl;
          break;
        case '循环':
          code = gcdLoopImpl;
          break;
        case '二进制':
          code = gcdBinaryImpl;
          break;
        case '平衡':
          code = gcdBalancedImpl;
          break;
        default:
          return
      }

      this.$options.gcdCode.off('change', this.onGcdValueChanged)
      const doc = this.$options.gcdCode.getDoc()
      doc.setValue(gcdImplHeader + code + gcdImplFooter)
      frozenFirstAndLastLine(this.$options.gcdCode)
      this.onGcdFuncBodyUpdated()
      this.$options.gcdCode.on('change', this.onGcdValueChanged)
    }
  },
  methods: {
    onGcdValueChanged () {
      this.gcdMode = '自定义'
      this.gcdChanged = true
    },
    onGcdFuncBodyUpdated () { // TODO: debounce
      const gcdFuncBody = this.$options.gcdCode.getDoc().getValue()
      let first = gcdFuncBody.indexOf('\n')
      first = first < 0 ? 0 : first + 1
      let last = gcdFuncBody.lastIndexOf('\n') || 0
      last = last < 0 ? gcdFuncBody.length : last
      const funcBody = `\
function gcdInner(a, b) {${gcdFuncBody.slice(first, last)}}
const calls = []
function gcd() {
  const call = [arguments, _gcdInner(...arguments)];
  calls.push(call);
  return call[1];
}
gcd(a, b);
return calls;`
      try {
        this.gcdFunc = new Function('a', 'b', funcBody)
        this.gcdFuncError = null
      } catch (e) {
        this.gcdFunc = null
        this.gcdFuncError = e.stack
      } finally {
        this.gcdChanged = false
      }
    },
    gcdTestSubmit () {
      if (!this.gcdFormValid) {
        return
      }
      const a = parseInt(this.gcdTestA, 10)
      const b = parseInt(this.gcdTestB, 10)
      this.gcdTestCases.push([[a, b], gcd(a, b)])
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
.CodeMirror.CodeMirror-error {
  border: 1px solid rgba(255,0,0,0.5);
}
.CodeMirror.CodeMirror-focused {
  border: 1px solid rgba(0,0,255,0.5);
  box-shadow: 0 0 5px rgba(0,0,255,0.5);
}
.CodeMirror.CodeMirror-focused.CodeMirror-error {
  border: 1px solid rgba(255,0,0,0.5);
  box-shadow: 0 0 5px rgba(255,0,0,0.5);
}

.error-panel {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  overflow: auto;
}
.v-application .content .stack-table table {
    margin: 0;
    display: table;
}
</style>
