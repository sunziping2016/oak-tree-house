<template>
  <div>
    <ClientOnly>
      <div
        class="encrypted-header"
      >
        <p
          v-if="icon"
          class="encrypted-icon"
        >
          <i
            :class="icon"
          />
        </p>
        <p class="encrypted-title">
          {{ contentTitle }}
        </p>
        <div v-if="!encrypted">
          <p>{{ unencryptedText }}</p>
        </div>
        <div v-else-if="!decryptedComponent">
          <p>{{ encryptedText }}</p>
          <p>
            <input
              v-model.lazy="keyFromInput"
              type="text"
              @keyup.enter="onConfirm"
            >
            <button
              @click="onConfirm"
            >
              {{ decryptButtonText }}
            </button>
          </p>
        </div>
        <div v-else>
          <p>{{ decryptedText }}</p>
        </div>
      </div>
      <!-- for decrypted component -->
      <div
        v-show="!encrypted"
        ref="content"
      >
        <slot />
      </div>
      <component
        :is="decryptedComponent"
        v-if="decryptedComponent"
      />
    </ClientOnly>
  </div>
</template>

<script>
/* global EN_CONTENT_TITLE, EN_UNENCRYPTED_TEXT, EN_ENCRYPTED_TEXT,
  EN_DECRYPTED_TEXT, EN_DECRYPT_BUTTON_TEXT, EN_DECRYPT_FAIL_TEXT,
  EN_UNENCRYPTED_ICON, EN_ENCRYPTED_ICON, EN_DECRYPTED_ICON */

import aesjs from 'aes-js'
import md5 from 'md5'

function base64ToArrayBuffer (base64) {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export default {
  name: 'EncryptedContent',
  props: {
    keyName: {
      type: String,
      required: true
    },
    owners: {
      type: String,
      required: true
    },
    encrypted: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    encryptedContent: '',
    keyFromInput: '',
    decryptedComponent: ''
  }),
  computed: {
    contentTitle () {
      return EN_CONTENT_TITLE
    },
    unencryptedText () {
      return EN_UNENCRYPTED_TEXT
    },
    encryptedText () {
      return EN_ENCRYPTED_TEXT
    },
    decryptedText () {
      return EN_DECRYPTED_TEXT
    },
    decryptButtonText () {
      return EN_DECRYPT_BUTTON_TEXT
    },
    icon () {
      if (!this.encrypted) {
        return EN_UNENCRYPTED_ICON || ''
      } else if (!this.decryptedComponent) {
        return EN_ENCRYPTED_ICON || ''
      } else {
        return EN_DECRYPTED_ICON || ''
      }
    }
  },
  updated () {
    if (this.encrypted && !this.encryptedContent) {
      this.encryptedContent = this.$refs.content.innerText.replace(/\s/g, '')
    }
    this.$root.$refs.layout.$emit('updated')
  },
  methods: {
    onConfirm () {
      try {
        const encryptedContent = base64ToArrayBuffer(this.encryptedContent)
        const key = aesjs.utils.hex.toBytes(md5(this.keyFromInput))
        // eslint-disable-next-line new-cap
        const aesCtr = new aesjs.ModeOfOperation.ctr(key)
        const content = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(encryptedContent))
        const { component } = JSON.parse(content)
        this.decryptedComponent = component
        this.$nextTick(() => {
          this.$root.$refs.layout.$emit('updated')
        })
      } catch (e) {
        if (this.$root.$refs.layout
          && this.$root.$refs.layout.$refs.child
          && this.$root.$refs.layout.$refs.child.openSnackbar) {
          this.$root.$refs.layout.$refs.child.openSnackbar(EN_DECRYPT_FAIL_TEXT)
        } else {
          alert(EN_DECRYPT_FAIL_TEXT)
        }
      }
    }
  }
}
</script>

<style>
.encrypted-header {
  padding: .1rem 1.5rem;
  border-left-width: .5rem;
  border-left-style: solid;
  margin: 1rem 0;
  border-color: darkcyan;
  background-color: lightcyan;
}
.encrypted-title {
  font-weight: 600;
}
.encrypted-icon {
  float: right;
  font-size: 1.4em;
  margin-top: 0.6em !important;
}
.encrypted-header input[type=text] {
  border-radius: 5px;
  padding: 2px 8px;
  background-color: #e8ffff;
  box-shadow: 0 0 3px darkcyan;
  margin: .5em 1em .5em 0;
}
.encrypted-header button {
  background-color: darkcyan;
  color: white;
  border-radius: 5px;
  padding: 2px 8px;
  box-shadow: 0 0 3px darkcyan;
  transition: box-shadow 0.2s ease-in-out;
  margin: .5em 0;
}
.encrypted-header button:hover {
  box-shadow: 0 0 5px darkcyan;
}
</style>
