---
title: Documentation for vuepress-theme-vuetify-blog
author: 孙子平
date: 2020-01-28T15:03:25Z
category: 文档
tags: [项目, 前端, 编程]
---

This is the documentation for npm package [@oak-tree-house/vuepress-theme-vuetify-blog](https://www.npmjs.com/package/@oak-tree-house/vuepress-theme-vuetify-blog). The Chinese version of this documentation will soon be published.

<!-- more -->

## 1 Introduction

This theme utilizes [Vuetify](https://vuetifyjs.com/en/) to create a Material Design UI for model blogs. It is intended to be used along with [VuePress](https://vuepress.vuejs.org/) and its plugin [@vuepress/plugin-blog](https://vuepress-plugin-blog.ulivz.com/). This website is built with this theme and several other plugins. I'll release these plugins soon. And you can view the source of my site at [sunziping2016/oak-tree-house](https://github.com/sunziping2016/oak-tree-house/). The UI of my website only supports Simplified Chinese. I'feel sorry, if this troubles you. But the language of the theme is not limited, Here is some screenshots of my sites.

The figure below shows the [directory classifier](https://vuepress-plugin-blog.ulivz.com/guide/getting-started.html#directory-classifier) index page with pagination (`IndexPost.vue`). The posts are organized in the form of cards, which supports an optional cover image.

![Index Page Demo](/assets/blog/theme-vuetify-blog-doc/index-demo.png) {.text-center}

The figure below shows the post page. With the help of [@vuepress/plugin-active-header-links](https://v1.vuepress.vuejs.org/plugin/official/plugin-active-header-links.html), the TOC in the sidebar is synchronized with the scrolled content. The style of the main content is generally copied from VuePress default theme. Copy buttons and prompt-toggling buttons are added to the code blocks by extra plugins. The main content also supports $\LaTeX$ and Gitalk comment system powered by my plugins.

![Post Page Demo](/assets/blog/theme-vuetify-blog-doc/post-demo.jpg) {.text-center}

The following figure shows the [frontmatter classifier](https://vuepress-plugin-blog.ulivz.com/guide/getting-started.html#frontmatter-classifier) key page (`FrontmatterKey.vue`).

![Category Page Demo](/assets/blog/theme-vuetify-blog-doc/category-demo.jpg) {.text-center}

And the picture below shows the post page on mobile devices.

![Mobile Demo](/assets/blog/theme-vuetify-blog-doc/mobile-demo.jpg) {.text-center}

## 2 Getting Started

To install the theme, just run the following command.

```bash
yarn add -D @oak-tree-house/vuepress-theme-vuetify-blog
# OR npm install -D @oak-tree-house/vuepress-theme-vuetify-blog
```

::: warning Note
Installing with npm may encounter some problems.
:::

Then add Robot font and Material Design icons to your html header in `<root>/.vuepress/config.js` illustrated by following code.

```javascript
module.exports = {
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' }],
  ]
}
```

We have two methods to add theme to our site.

1. Use this theme as parent theme by [theme inheritance](https://vuepress.vuejs.org/theme/inheritance.html#theme-inheritance) (highly recommended);
2. Directly add it into `<root>/.vuepress/config.js`.

When using the second way, you will lose the ability to add customized pagination component. So we only demonstrate the first way.

First create directory structure shown below.

```text
<root>
├── .vuepress
│   ├── theme (derived theme)
│   │   ├── layouts
│   │   │   └── TagFrontmatterPagination.vue (Optional, as an example)
│   │   ├── styles
│   │   │   └── variable.scss (customized colors and breakpoints)
│   │   └── index.js (theme Configuration file)
│   └── config.js (VuePress configuration file)
└── _posts (posts for your blog)
```

The content of `<root>/.vuepress/theme/index,js` is shown below.

```javascript
module.exports = {
  extend: '@oak-tree-house/vuetify-blog'
}
```

`variable.scss` and frontmatter pagination will be explained later in the configuration section.

## 3 Configuration

### 3.1 Vuetify Theme

The Default theme has an undesirable responsive breakpoint setting, and furthermore, you may want to change the palette colors. So it's highly recommended to add a customized style. You cannot add customized colors following the instruction in [VuePress styling](https://vuepress.vuejs.org/config/#palette-styl), because Vuetify uses Sass. And you must provide your style settings in both Scss and JavaScript format to make the setting applied everywhere.

First, add the following part to `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  head: [
    // add the following line if you want primary color
    // to be applied to the mobile browser toolbar
    ['meta', { name: 'theme-color', content: '#1976D2' }]
  ],
  themeConfig: {
    vuetifyConfig: {
      theme: {
        themes: {
          light: {
            primary: '#1976D2', // these are default values
            accent: '#82B1FF' // change them as you like
          }
        }
      },
      breakpoint: {
        thresholds: {
          xs: 420, // these are highly recommended values
          sm: 720, // default values are shown in
          md: 960, // https://vuetifyjs.com/en/customization/breakpoints
          lg: 1280
        }
      }
    }
  }
}
```

And then, create `<root>/.vuepress/theme/styles/varaibles.scss`, with the following content.

```scss
// Again, these are highly recommended values
$grid-breakpoints: (
  'xs': 0,
  'sm': 420px,
  'md': 720px,
  'lg': 960px,
  'xl': 1280px
);

// Again, these are default values. Change as you like
$primaryColor: #1976D2;
$accentColor: #82B1FF;
$textColor: #2c3e50;
$codeBgColor: #282c34;
$borderColor: rgba(0, 0, 0, 0.12);
```

Finally, add the following part to `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  sass: {
    implementation: require('sass'),
    fiber: require('fibers'),
    data: "@import '@theme/styles/variables.scss'"
  },
  scss: {
    implementation: require('sass'),
    fiber: require('fibers'),
    data: "@import '@theme/styles/variables.scss';"
  },
  configureWebpack: (config, isServer) => {
    config.plugins = config.plugins || []
    config.plugins.push(
      new (require('vuetify-loader/lib/plugin'))()
    )
  }
}
```

### 3.2 Logo

Just add following code to your `<root>/.vuepress/config.js`. Then a logo will displayed at the left-upper corner.

```javascript
module.exports = {
  themeConfig: {
    logo: '/assets/icons/logo.png'
  }
}
```

### 3.3 Navigation Links

Navigation links is displayed in site header on desktops and in site drawer on mobiles. Let's see an example configuration in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    nav: [
      { text: 'Homepage', link: '/', icon: 'mdi-home' },
      {
        type: 'menu', text: 'Archive', items: [
          { text: 'Index Pages', subheader: true },
          { text: 'Authors', link: '/author/', icon: 'mdi-account' },
          { text: 'Tags', link: '/tag/', icon: 'mdi-tag' },
          { text: 'Categories', link: '/category/', icon: 'mdi-file-tree' },
        ], icon: 'mdi-bookshelf'
      }
    ]
  }
}
```

There can be two kinds of items in array `nav`:

- Plain link: it can have `text`, `link` and `icon` properties. `icon` is optional and displayed only on mobiles;
- Sub-menu: its `type` property must be set to `'menu'`. The other properties it can have are `text`, `items`and `icon`. `icon` is optional and displayed only on mobiles. `items` is an array containing following two kinds of items:
  - Sub-header: its `subheader` properties must be set to `true`, and it can have a `text` property;
  - Plain link: it's almost the same as plain link above, except that `icon` is only displayed on desktop.

To see what icons can be used, visit [here](https://vuetifyjs.com/en/customization/icons).

### 3.4 Algolia Search

Add the following section to `<root>/.vuepress/config.js` to enable the search function.

```javascript
module.exports = {
  themeConfig: {
    algolia: {
      apiKey: 'YOUR API KEY',
      indexName: 'YOUR INDEX NAME'
    }
  }
}
```

### 3.5 Edit Links

Providing `repo` field will trigger the display of edit links (`editLinks` also needs to be set to `true`) and view source links described in the [Customized Card Action Buttons](#_4-2-3-customize-card-action-buttons) section. Edit links are shown in the bottom of posts, and view source links are shown in the cards of the index pages.

The following code can be added to `<root>/.vuepress/config.js` to enable these features.

```javascript
module.exports = {
  themeConfig: {
    repo: 'sunziping2016/oak-tree-house',
    docsDir: 'site',                 // default is '', the root directory
    docsBranch: 'master',            // default is master
    editLinks: true,                 // to enable displaying edit links
    editLinkText: 'Edit this page'  // default is 'Edit this page'
  }
}
```

### 3.6 Last Updated

To enable the last updated time, you need to install [@vuepress/last-updated](https://vuepress.vuejs.org/plugin/official/plugin-last-updated.html) plugin. Just add the following code to `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    lastUpdated: 'Last Updated'  // text to display before the time, default to 'Last Updated'
  },
  plugins: [
    ['@vuepress/last-updated']
  ]
}
```

### 3.7 Footer

Providing `footer` in `<root>/.vuepress/config.js` will trigger the display of a footer at the bottom of the site.

```javascript
module.exports = {
  themeConfig: {
    // this field can be HTML, default is to display nothing
    footer: '© 2016-2020 Ziping Sun <br> All rights reserved'
  }
}
```

### 3.8 Snackbar

The snackbar is used for some plugins to send notifications to the user. It has a closing button text, which can be configured in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    snackbarCloseText: 'close'  // default is 'close'
  }
}
```

### 3.9 404 Page

In the 404 page, there is a link to take users back to the homepage. You can configure the link text in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    notFoundText: 'Take me home.'  // default is 'Take me home.'
  }
}
```

To make the 404 page work, you also need to modify your web server configuration. For example, add the following text in the `server` blog to the Nginx configuration.

```text
error_page 404 /404.html;
```

## 4 Document Classifier

To see more about document classifier, click [here](https://vuepress-plugin-blog.ulivz.com/guide/getting-started.html#directory-classifier). This section is not intended to teach you what a document classifier is and how to configure it.

### 4.1 Directory Classifier

An example document classifier configuration in `<root>/.vuepress/config.js` is shown below.

```javascript
module.exports = {
  plugins: [
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
          itemPermalink: '/:year/:month/:day/:slug',
          title: 'Post',
          pagination: {
            lengthPerPage: 10,
            getPaginationPageTitle (pageNumber) {
              return `Page ${pageNumber} | Post`
            }
          }
        }
      ]
    }]
  ]
}
```

Then the index page at `/`, `/page/2/` and so on should work out of box.

### 4.2 Index Page Configuration

#### 4.2.1 Group Posts into Sections

Providing `indexHeading` in the `<root>/.vuepress/config.js` can group posts into sections. The value of `indexHeading` must be a string containing valid JavaScript expression which generate a string. The following table shows the variables available to the expression. More variables will be added in the near future.

|Variable Name|Variable Type|Explanation|
|:-:|:-:|:-:|
|date|Date|the creation date in the post frontmatter|

The following code is an example configuration.

```javascript
module.exports = {
  themeConfig: {
    // default is not to group posts
    indexHeading: '`${date.getFullYear()}-${date.getMonth() + 1}`'
  }
}
```

#### 4.2.2 Customize Breadcrumb Text

In the index page, the default breadcrumb is in the form of `Homepage / Page 1`. You can change the text through following code in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    homepageText: 'Homepage', // default is 'Homepage'
    // default pageNumberText is '`Page ${index + 1}`'
    pageNumberText: '`Page ${index + 1} (Total ${totalPage} pages ${totalPost} posts)`'
  }
}
```

Variables provided to `pageNumberText` are listed in the following table.

|Variable Name|Variable Type|Explanation|
|:-:|:-:|:-:|
|index|Number|the zero-based page number|
|totalPage|Number|total page number|
|totalPost|Number|total post number|

#### 4.2.3 Customize Card Action Buttons

There is a read more button in the cards. And if you follow the instruction in [Edit Links](#_3-5-edit-links) section, there is also a view source button in the cards left to the read more button. You can changed the text displayed on the buttons in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    readMoreText: 'Read More',      // default is 'Read More'
    viewSourceText: 'View Source',  // default is 'View Source'
  }
}
```

### 4.3 Frontmatter Classifier

[Frontmatter classifier](https://vuepress-plugin-blog.ulivz.com/guide/getting-started.html#frontmatter-classifier) needs more configuration than directory classifier, because the `FrontmatterPagination.vue` cannot know what the current frontmatter key is. So you need to create another layout and pass the information to `@theme/layouts/FrontmatterPagination.vue`. Let's start with a frontmatter classifier on the `tags` field.

First, create a layout in `<root>/,vuepress/theme/layouts/TagFrontmatterPagination.vue`

```vue
<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.tagText || 'Tags'"
    :frontmatter-path="'/tag'"
    :frontmatter-key-text="this.$currentTag.key"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination }
}
</script>
```

For example, when the current frontmatter key is `Python`, the breadcrumbs are in the form of `Tags / Python / Page 1`. `frontmatter-text` refers to the first part of the breadcrumbs, and it is linked to `frontmatter-path`. And `frontmatter-key-text` refers to the second part of the breadcrumbs. The `ready` and `updated` event need to be delegated to the global layout to trigger the update of some plugins.

Then, add the following code to your `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  plugins: [
    ['@vuepress/blog', {
      frontmatters: [
        {
          id: 'tag',
          keys: ['tags'],
          path: '/tag/',
          title: 'Tags',
          scopeLayout: 'TagFrontmatterPagination',
          frontmatter: {
            name: 'Tags'
          },
          pagination: {
            lengthPerPage: 10,
            layout: 'TagFrontmatterPagination',
            getPaginationPageTitle (pageNumber, key) {
              return `Page ${pageNumber} - ${key} | Tags`
            }
          }
        }
      ]
    }]
  ]
}
```

`frontmatter.name` is used in the breadcrumbs in `FrontmatterKey.vue`.

You can add as many frontmatter classifiers as you like.

### 4.4 Key Page Configuration

#### 4.4.1 Heading in Key Page of Frontmatter

`FrontmatterKey.vue` can have a heading. By default, no heading is displayed. You can configure the heading in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    frontmatterKeyHeading: '`There exist ${number} ${name}`'
  }
}
```

Your can utilize following variables.

|Variable Name|Variable Type|Explanation|
|:-:|:-:|:-:|
|name|String|`frontmatter.name`|
|number|Number|number of keys|

#### 4.4.2 Word Cloud in Drawer

You can choose a frontmatter classifier to be displayed as a word cloud in the drawer. By default, if `tag` frontmatter classifier is available, it will use it as the source of words. If `tag` frontmatter classifier is not provided, it will not show.

You can configure the word cloud in `<root>/.vuepress/config.js`.

```javascript
module.exports = {
  themeConfig: {
    wordCloudName: 'Tag Cloud',   // default to 'Tag Cloud'
    wordCloudFrontmatter: 'tag',  // default to 'tag'
  }
}
```

## 5 Advance

There are some conventions this theme follows to provide a better interface to the plugins.

### 5.1 Global Layout Events

When the layout is mounted. it will emit a `ready` event. It usually means the initial page is loaded, or the router has switched to a new layout. And when the layout is updated, it will emit an `updated` event. It means client only components are loaded, or the router changed but within the same layout. These events should be delegated to the global layout. And global layout also has an extra data field called `ready`. It indicates whether layout component is mounted.

Generally, a plugin which want to modify DOM should watch `ready` and `updated` event.

### 5.2 Send Snackbar Notification

Global layout has a reference to the real layout called `child`, and sometimes, the real layout supports snackbar notification. You can send notification via `this.$refs.child.openSnackbar(‘SOME TEXT’)` in the root mixin.
