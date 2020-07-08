# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Bug Fixed

- [ ] fix MathJax `Cannot read property 'chars' of undefined`

### Feature

- [x] **$vuepress-theme-vuetify-blog**: Add "Recently Updated" panels
- [ ] **$vuepress-plugin-diagrams**: support diagrams listed in [here](https://shd101wyy.github.io/markdown-preview-enhanced/#/diagrams)
- [ ] reimplement medium zoom
- [ ] Find a better solution for static files

### Content

- [x] finish Rust learning notes
- [x] finish GraphQL learning notes
- [ ] write python tutorial 4
- [ ] write "C++ Templates" notes

## [1.0.1]

### Bug Fixed

- [x] **$vuepress-plugin-encrypt**: does not emit `contentReady` for decrypted content due to `ClientOnly`
- [x] **$vuepress-plugin-encrypt**: change input type from text to password
- [x] **$vuepress-plugin-encrypt**: fix `=` in base64 treated as heading

### Feature

- [x] **$vuepress-plugin-mathjax**: render TeX formula into PNGs at server side
- [x] **$vuepress-plugin-diagrams**: render Graphviz and Ditaa diagrams to PNGs at server side
- [x] **$vuepress-plugin-diagrams**: support render flowchart, sequence and mermaid diagrams
- [x] **$vuepress-theme-vuetify-blog**: add timeline to index page next to posts
- [x] **$vuepress-theme-vuetify-blog**: refactor toc and support dark mode
- [x] **$site**: update sass loader (wait for VuePress to solve issue #2148)

### Content

- [x] remove TODO from additional pages
- [x] add more about Tsmart code review
- [x] add pip configuration part to python tutorial 1
- [x] finish python tutorial 3

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

[Unreleased]: https://github.com/sunziping2016/oak-tree-house/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/sunziping2016/oak-tree-house/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/sunziping2016/oak-tree-house/releases/tag/v1.0.0
