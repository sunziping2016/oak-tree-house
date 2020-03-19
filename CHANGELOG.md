# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Bug Fixed

- [ ] **$vuepress-plugin-encrypt**: does not emit `contentReady` for decrypted content due to  `ClientOnly`

### Feature

- [x] **$vuepress-plugin-mathjax**: render TeX formula into PNGs at server side
- [x] **$vuepress-plugin-diagrams**: render diagrams to PNGs at server side
- [x] **$vuepress-plugin-diagrams**: support add classes and styles to graphs
- [ ] **$vuepress-plugin-diagrams**: support diagrams listed in [here](https://shd101wyy.github.io/markdown-preview-enhanced/#/diagrams)
- [ ] reimplement medium zoom
- [ ] update sass loader (wait for VuePress to solve issue #2148)


### Content

- [x] remove TODO from additional pages
- [x] add more about Tsmart code review
- [x] add pip configuration part to python tutorial 1
- [ ] add hashable objects and `set` parts to python tutorial 3

## [1.0.0]

- Transfer origin site
- Post index based on tags, categories, author and groups
- Post can be grouped
- Comment system based on Gitalk
- Show the creation and modification time
- Has a link to the corresponding GitHub page
- Add CI support to automatically run lint and deploy sites
- Picture has fullscreen mode
- Some answer part in my Python Tutorial can be hidden (Use detail block)
- Can view the front matter of a post (Use GitHub)
- Support RSS subscription
- Add more custom Markdown lint
- Add some helper scripts to create posts
- Vue Component that can hide Python prompt in code block
- Add git commit hook to run lint
- Math equations can be displayed correctly
- Additional pages like CHANGELOG, README, TODO
- Add Markdown link checker
- Search bar can search all text
- Unregister the old service worker
- Disable toggling checkbox
- Add copy button to code block
- Change whole site's theme to material design
- Transfer video to Bilibili
- Add audio component for NetEase Cloud Music
- Theme is provided via npm package
- Plugin to encrypt content
- Sidebar can display h1 to h4 toc
- Checker for whether everything is encrypted
- Display frontmatter in dialog
- PWA loads app
- Add version number to footer
- Support Marp like VsCode
- Refactor event system
- Make PWA notification use snackbar

[Unreleased]: https://github.com/sunziping2016/oak-tree-house/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/sunziping2016/oak-tree-house/releases/tag/v1.0.0
