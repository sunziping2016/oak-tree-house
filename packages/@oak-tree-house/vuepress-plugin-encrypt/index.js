const path = require('path')
const { ENCRYPT_CONTAINER_BEGIN_REGEX } = require('./common')

module.exports = (options) => {
  options = options || {}
  return {
    name: 'encrypt',
    extendMarkdown: md => {
      md.use(require('markdown-it-container'), 'encrypt', {
        validate (params) {
          return params.match(ENCRYPT_CONTAINER_BEGIN_REGEX)
        },
        render (tokens, idx) {
          const m = tokens[idx].info.match(ENCRYPT_CONTAINER_BEGIN_REGEX)
          if (tokens[idx].nesting === 1) {
            // opening tag
            return `<EncryptedContent key-name="${m[2]}" owners="${m[3]}" :encrypted="${!!m[1]}">`
          } else {
            // closing tag
            return '</EncryptedContent>\n'
          }
        }
      })
    },
    alias: {
      vue: 'vue/dist/vue.esm.js',
      '@encrypt-event': path.resolve(__dirname, 'event.js')
    },
    define: {
      'EN_CONTENT_TITLE': options.contentTitle || 'Encrypted Content',
      'EN_UNENCRYPTED_TEXT': options.unencryptedText || 'The content is shown below. It should be encrypted when published.',
      'EN_ENCRYPTED_TEXT': options.encryptedText || 'This part of content is encrypted. To view it, you need to enter the correct key in the input field below.',
      'EN_DECRYPTED_TEXT': options.decryptedText || 'The encrypted content is successfully decrypted and shown below.',
      'EN_DECRYPT_BUTTON_TEXT': options.decryptButtonText || 'Decrypt',
      'EN_UNENCRYPTED_ICON': options.unencryptedIcon,
      'EN_ENCRYPTED_ICON': options.encryptedIcon,
      'EN_DECRYPTED_ICON': options.decryptedIcon
    },
    plugins: [
      ['@vuepress/register-components', {
        components: [
          {
            name: 'EncryptedContent',
            path: path.resolve(__dirname, 'EncryptedContent.vue')
          }
        ]
      }]
    ]
  }
}
