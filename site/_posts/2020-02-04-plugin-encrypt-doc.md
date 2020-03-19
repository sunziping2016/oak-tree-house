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
KQ2Qm3n03dGE6NtWUv6qAFVDUJ8/LjJbb4zrW+mAkNixGNByApxbhZDXoHl06QQVhUD+M11PmM5zgHd
umR9v7DhvK+22GpJrlTFbqjgEhai+Oo1l6eQpvq44RRz4KoTB0uoUcKw91TEnGwIFZR5bobMFsecyuZ
n/287AsPtQxAYMIizvA6M1t7SvrgOSHgMGUFu3977lhbw4Gg9gYIepoaULZdUhB9Ng5yrjAYBMPYdms
9j+544NkT74/0d4Ggl+M7kM6Ojc8U0g5C7mLBevTzyIGvUfXIDAtzctxxsDFAAYh1CP61pqR9ulPhba
Omuvn04rFcCSP6unAV2/ctqs0SH5DOWtB/GXTmmEWOKcR865budf1xozV4LX+SmS2qf3jeJHbN+Yxww
hyTYJ8qnJGpKYZiMYlLA6E9A62u26ck5i5YjkD4JD915LsfRMEscbXPlc3GU9TT7XRn0F1Dlf0l2dP3
WZtZCk2e1dLb6QlijwRSM+DYehRiiY2ihTlSZ6xglyEYhTItzrMz+vAq9pg61Qngen+paz4KsrySm4U
TZVhx+Ay2XomCYzccFCHO8AxjO0hKp3Dm8VvJ+FLb7GTNsb6d25Ae50CV6ttmAash0OJdtTHrAaZgD6
+ndYAOTKXtkZaNn7gf63mkNr5lc1yvM132UjgtVak02YhlF0fFdRjB/dRJbGR0Xw5xNxpDr8pue0tXC
ArFKfw7vtqJShtpiOpsIOOA1yNdMbeYDSC4QRuvMHXD43UW5TukiyCjyuexTm4VH7dNd+on5qZBLAUo
ZPm1ja3wPaLFwmnbA+ZLe5FBKyxeQzgGbe5SKzN6JoTiNsCrI9wA7Y505uObhWU6PGiOYkI2LOFyHX5
Id8viv7QSRjGZFeAcTLCCNq51YxhjtxmOIE4RVQe6xxvkHuTXIqCisWJ+R62rYrp3L3S5UGV7qVdLuu
pwedFluTrlNQq5hC23SIWPXsHvW+Xlnj8wncTZMMomOVYNFZldko5NTfFC3x+qgjNi94OFEBzhEqTXe
LnVpRgcF5LTpeUhfTAK3e31rTgL
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
