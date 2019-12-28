---
title: 关于我和我的博客
author: 孙子平
date: 2019-09-07T00:57:54Z
---

这是我的个人博客。我叫孙子平，清华大学软件工程系在读。这是我的[简历](https://file.szp.io/f/7d680c14b3aa48b6963d/)。

这个博客目前由这个[仓库](https://github.com/sunziping2016/blog-sunziping)维护。

```js
function People(name){
  this.name = name
  this.hobbits = []
}

People.prototype.addHobbit = function(h){
  this.hobbits.push(h)
  return this
}
const I = new People('Sun Ziping')
I.addHobbit('coding');
// Hmm, let me think... Oh yes, I have
// another hobby. That's
I.addHobbit('learning to code');
// I've tried hard to add another hobbit,
// but it seems impossible.
Object.freeze(I.hobbits);
```

这已经是我的博客不知第几次大更改了。如上面的代码所示，我的兴趣几乎只有编程和学习编程。所以这整个博客也可能显得很乏味，除了技术和学习就没啥了。

希望能和大家共同进步。

::: tip
本站点支持$\LaTeX$和内嵌[Vue.js](https://vuejs.org/)，感谢[VuePress](https://vuepress.vuejs.org/)。
:::

::: warning
站点更新导致部分数学公式显示异常，抱歉了。
:::
