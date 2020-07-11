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
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
ZbMQD/Mva7dvDkUx
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
