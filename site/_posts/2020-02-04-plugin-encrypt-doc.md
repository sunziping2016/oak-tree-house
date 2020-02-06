---
title: vuepress-plugin-encrypt Documentation
author: 孙子平
date: 2020-02-04T14:59:21Z
category: 文档
tags: [项目, 前端, 编程]
sidebar:
  - /_posts/2020-01-28-theme-vuetify-blog-doc.html
  - /_posts/2020-02-04-plugin-encrypt-doc.html
---

This is the documentation for npm package [@oak-tree-house/vuepress-plugin-encrypt](https://www.npmjs.com/package/@oak-tree-house/vuepress-plugin-encrypt). It's used to encrypt some part of text in markdown with keys. And without key, no one can get the content of your post, even when you GitHub repository is public.

<!-- more -->

## 1 Introduction

Sometime, it's necessary to encrypt some part of your posts which contain sensitive messages. Furthermore, when we are talking about encryption, we doesn't mean a div which `display` is `none` and then set to `block` when input string matches. What we want is a real encryption. This plugin encrypted the posts with `aes-128-ctr`, which I think can satisfy the needs of most people.

However, you may wonder whether this plugin is safe when the repository is public. This's exactly my situation. Don't worry. This plugin provide a CLI to encrypt or decrypt markdown files. It can also work with [husky](https://www.npmjs.com/package/husky) git hooks to ensure that you don't push unencrypted posts accidentally.

What's more, this plugin hacks VuePress, so that your customized markdown plugins and components can work normally. There are a few exceptions:

- Heading in the encrypted sections are not extracted.
- `<script>` and `<style>` in the encrypted sections are ignored.

Here is a demonstration. Just input `vuepress-plugin-encrypt` in the following dialog and click the button. Then you can see the content.

::: encrypt encrypted key=pluginEncryptDoc owners=sunziping2016
D5oJpV9C148Nvyg94xy50xQgBy1SPX15OZKKziZwfbitiWGEW6vtOfSTEGYFm3YV8PxGrvWPlUMQB9Z
LO7gAq7hdhbWDwHGHJqVHR4qxi8oymvaRGDvPR0LmogD9+QVvTS4jc/W2h9gO/hFgpSPJgAnQYQdWiM
dbM0GcXznUxzwN38Mbxqg1QE5NIqBGZzwErsQh6a2JP4Glj1qV9ZVqpalh+C6K0/vvvX5GlbnEV0XM6
GejxjZpBQCq3nUzXuiSNFU7bG8eIYAsE/MtyM2od9LJ32MnRF7TMRVjndl8X4zYW+Co4ORAGvaEwqmf
ekvoOmCqsR8IML9zhNldAR9qEB7dVqhT9Ix25I7hS22n/r3vH+zJkpaBkkk2EHP5oouO4RGx9TamQoL
cIGyhutbAf1pWfl4JjZ69/QUQ8rJN1Ud5V6TTwu7ttbDkj38oChwGaZU13ARyZk9pHTwAaD37woBg/l
KQ2Qm3n03dGE6NtWUv6qAFVDUJ8/LjJbb4zrW+mAkNiwm4Ngto8rFgWiUaqgKZAEpZC+EonbCB5DUMP
ZXyuuGXkuf7llH+N7VPEvO3jlYcma+xw1/UB8S1tJNd1ILuK1Nl6Q5TyYIVSDOlOm8UrKNfeRFKKh7N
iq6Mr1gU7TkFZNdx9adqY2J0GuL4JXPSMmYSvWBvr1prgNK3y1BXa91YD7pOShQyCElJmxJUfZi8Wjt
43Oo2rfdU4I3rZZen2ZB/k92Nn9YUxkQLqymDJP2pppSoW6WfCwouLJYy4mcEVtUgH7u6nr887Bb0be
SV6KKqo6RdH1++4SBIgrx+ucMYRIKda919GXrz2UaRYf838YqlZ/wjpzY9L2yJhjqEMT/OJHbOt7Fww
B2CPo0ulN64IIV0Jd15DPhsVKypjewi8zhEjxn4JG1k+LUEUZpmL7XXj5uVToTX+yB23RFTiqEKiPu6
DMIWBxCK3cXK7gpzgQJSQu/Yblg/n921xncccfxilWAImm4Cn+IOtuMw/Jox2ArtfH6oYj4KsqeZkY0
aNEgi/wKqEo7JPmscWRyCul97LkcE6GPv4knOqnylujWY6uyS2JUR6grc+N9uAOUenr0H+iPEU7NhWp
anPYoSRbiwlomerbpCuST4NvNYPxbgZEvoEyZ4WKYh35osIgrfRlGav8gNem1iXkI1HFcPs9xbewNER
BbRLaw5rdmLTksVhbosfr3f7mdGLLmYDWTlGUvwa2TL4SJFqkqr1G7rgOakQWQGDvoBOeBu8/QCIgs=
:::

## 2 Getting Started

To install the plugin, run the following command. It provide a script named `encrypt`.

```bash
yarn add -D @oak-tree-house/vuepress-plugin-encrypt
```

And add the following lines to your `<root>/.vuepress/config.js`

```javascript
module.exports = {
  plugins: [
    ['@oak-tree-house/encrypt']
  ]
}
```

It's recommended to add following part to your `package.json`. Replace `<YOUR_SOURCE_DIR>` with your real source dir. In the most case, it will be `docs`.

```json
{
  "scripts": {
    "decrypt": "encrypt --source-dir <YOUR_SOURCE_DIR> --key-file keys.json --temp .temp-encrypt decrypt",
    "encrypt": "encrypt --source-dir <YOUR_SOURCE_DIR> --key-file keys.json --temp .temp-encrypt encrypt"
  }
}
```

Then add the following lines to `.gitignore`.

```text
/keys.json
/.temp-encrypt
```

It is also recommended that you install `husky` and run a pre-commit hook to ensure encryption before commission.

To install `husky`, run:

```bash
yarn add -D husky
```

And then add the following lines to `package.json`.

```json
{
  "scripts": {
    "check": "encrypt --source-dir site --key-file keys.json --temp .temp-encrypt check"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run check"
    }
  }
}
```

And finally create `keys.json` with the following content. Replace `YOUR-USERNAME` with your preferred id. `KEY-NAME` and `YOUR-USERNAME` must match regular expression `[A-Za-z0-9_]+`.

```json
{
  "user": "YOUR-USERNAME",
  "keys": {}
}
```

To encrypt some parts of your markdown, surround them when `encrypt` container.

```text
::: encrypt key=KEY-NAME owners=USERNAME1,USERNAME2,...
hello
:::
```

Your must keep the supplied arguments order. That is first `key` and then `owners`. owners is a ',' separated username list. Only when the list contains your username, the encryption and decryption will take place.

Then run:

```bash
npm run encrypt
```

## 3 Configuration

This module can accept the following options. Supplied values are default values.

```javascript
module.exports = {
  plugins: [
    ['@oak-tree-house/encrypt', {
      contentTitle: 'Encrypted Content',
      unencryptedText: 'The content is shown below. It should be encrypted when published.',
      encryptedText: 'This part of content is encrypted. To view it, you need to enter the correct key in the input field below.',
      decryptedText: 'The encrypted content is successfully decrypted and shown below.',
      decryptButtonText: 'Decrypt',
      decryptFailText: 'Failed to decrypt!',
      unencryptedIcon: undefined,
      encryptedIcon: undefined,
      decryptedIcon: undefined
    }]
  ]
}
```

When `*Icon` are provided, they act as the icon classes. It is meant to be used with FontAwesome or Material Design Icons.
