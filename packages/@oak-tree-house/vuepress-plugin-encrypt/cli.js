#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const util = require('util')
const aesjs = require('aes-js')
const program = require('commander')
const chalk = require('chalk')
const md5 = require('md5')
const { createApp } = require('@vuepress/core')
const { globby, sort, parseFrontmatter } = require('@vuepress/shared-utils')

const ENCRYPT_BEGIN_REGEX = /^(\s*:{3,})\s+encrypt\s+key=(\w+)\s+owners=(\w+(?:,\w+)*)\s*$/
const ENCRYPT_BEGIN_REGEX_WITH_ENCRYPTED = /^(\s*:{3,})\s+encrypt\s+encrypted\s+key=(\w+)\s+owners=(\w+(?:,\w+)*)\s*$/
const ENCRYPT_END_REGEX = /^(\s*:{3,})\s*$/

const VALID_KEY_CHARACTERS = ''
  + 'abcdefghijklmnopqrstuvwxyz'
  + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  + '0123456789'
  + '!"#$%&\'()*+,.\\/:;<=>?@[] ^_`{|}~-'

const DEFAULT_KEY_LENGTH = 8

function randomKey (length) {
  let result = ''
  const charactersLength = VALID_KEY_CHARACTERS.length
  for (let i = 0; i < length; i++) {
    result += VALID_KEY_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class App {
  constructor (options) {
    this.options = options
  }
  async prepareFiles (files) {
    if (files.length) {
      this.files = files
    } else if (this.options.sourceDir) {
      const patterns = ['**/*.md', '!.vuepress', '!node_modules']
      this.files = sort(await globby(patterns, { cwd: this.options.sourceDir }))
        .map(x => path.join(this.options.sourceDir, x))
    } else {
      console.error(chalk.red('[ERROR] No source specified. Use --source-dir or provide files'))
    }
  }
  async prepareMarkdown () {
    const app = createApp({
      sourceDir: path.resolve(this.options.sourceDir),
      theme: '@vuepress/default'
    })
    await app.process()
    this.markdown = app.markdown
  }
  async loadKeyFile () {
    this.keyFile = JSON.parse(await util.promisify(fs.readFile)(this.options.keyFile, 'utf8'))
  }
  async ensureLoadKeyFile () {
    try {
      await this.loadKeyFile()
    } catch (e) {
      console.error(chalk.red('[ERROR] Failed to load key file. Use "oth-encrypt init" to create a valid one'))
      console.error(chalk.red(`[ERROR] ${e.message}`))
      process.exit(1)
    }
  }
  async writeBackToFile (filename) {
    await util.promisify(fs.writeFile)(filename, this.currentFileBuffer.join('\n'), 'utf8')
  }
  async forFiles (callback) {
    for (const filename of this.files) {
      const content = await util.promisify(fs.readFile)(filename, 'utf8')
      await callback(content, filename)
    }
  }
  async forBlocks (content, callback, encrypted = false) {
    this.currentFileBuffer = []
    this.currentFileModified = false
    const lines = content.split('\n')
    let insideEncrypt = false
    let originStartLine, preamble, key, owners, blockBuffer
    for (const line of lines) {
      if (insideEncrypt) {
        const match = line.match(ENCRYPT_END_REGEX)
        if (match && match[1] === preamble) {
          insideEncrypt = false
          if (!await callback(preamble, key, owners, blockBuffer.join('\n'))) {
            this.currentFileBuffer.push(originStartLine)
            this.currentFileBuffer = this.currentFileBuffer.concat(blockBuffer)
            this.currentFileBuffer.push(line)
          } else {
            this.currentFileModified = true
          }
        } else {
          blockBuffer.push(line)
        }
      } else {
        const match = line.match(encrypted ? ENCRYPT_BEGIN_REGEX_WITH_ENCRYPTED : ENCRYPT_BEGIN_REGEX)
        if (match) {
          insideEncrypt = true
          originStartLine = line
          preamble = match[1]
          key = match[2]
          owners = match[3].split(',')
          blockBuffer = []
        } else {
          this.currentFileBuffer.push(line)
        }
      }
    }
  }
  async requestForNewKey (key) {
    if (this.options.onNewKey === 'abort') {
      console.log(chalk.red(`[ERROR] Aborted due to new key "${key}" request`))
      process.exit(1)
    } else if (this.options.onNewKey === 'skip') {
      console.warn(chalk.yellow(`[WARN] Skip key "${key}"`))
      return false
    } else if (this.options.onNewKey === 'ask') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question[util.promisify.custom] = (question) => {
        return new Promise((resolve) => {
          rl.question(question, resolve)
        })
      }
      let answer
      do {
        answer = await util.promisify(rl.question)(`[PROMPT] Key for "${key}" does not exist. Generate, abort, skip or input? [G/A/S/I]: `)
      } while (!answer)
      rl.close()
      return answer
    }
    return randomKey(DEFAULT_KEY_LENGTH)
  }
  async saveKeyFile () {
    try {
      await util.promisify(fs.writeFile)(this.options.keyFile, JSON.stringify(this.keyFile, null, 2), 'utf8')
    } catch (e) {
      console.log(chalk.red('[ERROR] Cannot store the key file!'))
      console.log(chalk.red(`[ERROR] ${e.message}`))
      process.exit(1)
    }
  }
  async encrypt (files) {
    if (['abort', 'ask', 'skip', 'generate'].indexOf(this.options.onNewKey) === -1) {
      console.error(chalk.red(`[ERROR] Invalid option for --on-new-key, expect abort/ask/skip/generate got "${this.options.onNewKey}"`))
      process.exit(1)
    }
    await this.prepareFiles(files)
    await this.ensureLoadKeyFile()
    await this.prepareMarkdown()
    await this.forFiles(async (content, filename) => {
      const frontmatter = parseFrontmatter(content)
      await this.forBlocks(content, async (preamble, key, owners, block) => {
        if (!owners.includes(this.keyFile.user)) {
          return false
        }
        let encryptKey
        if (this.keyFile.keys[key]) {
          encryptKey = this.keyFile.keys[key]
        } else {
          encryptKey = await this.requestForNewKey(key)
          if (!encryptKey) {
            return false
          }
          this.keyFile.keys[key] = encryptKey
          await this.saveKeyFile()
        }
        const { html } = this.markdown.render(block, {
          frontmatter: frontmatter.data,
          relativePath: path.relative(this.options.sourceDir, filename)
            .replace(/\\/g, '/')
        })
        const plaintext = JSON.stringify({
          origin: block,
          rendered: html
        })
        // eslint-disable-next-line new-cap
        const aesCtr = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(md5(encryptKey)))
        const encryptedText = Buffer.from(aesCtr.encrypt(aesjs.utils.utf8.toBytes(plaintext)))
        this.currentFileBuffer.push(`${preamble} encrypt encrypted key=${key} owners=${owners.join(',')}`)
        this.currentFileBuffer = this.currentFileBuffer.concat(encryptedText.toString('base64').match(/.{1,79}/g))
        this.currentFileBuffer.push(`${preamble}`)
        console.log(chalk.green(`[INFO] Encrypt block with key "${key}"`))
        return true
      })
      // for files
      if (this.currentFileModified) {
        await this.writeBackToFile(filename)
      }
    })
  }
  async decrypt (files) {
    await this.prepareFiles(files)
    await this.ensureLoadKeyFile()
    await this.forFiles(async (content, filename) => {
      await this.forBlocks(content, async (preamble, key, owners, block) => {
        if (!owners.includes(this.keyFile.user)) {
          return false
        }
        if (!this.keyFile.keys[key]) {
          console.error(chalk.red(`[ERROR] Abort due to the missing key "${key}"`))
          process.exit(1)
        }
        const encryptKey = aesjs.utils.hex.toBytes(md5(this.keyFile.keys[key]))
        // eslint-disable-next-line new-cap
        const aesCtr = new aesjs.ModeOfOperation.ctr(encryptKey)
        const plaintext = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(Buffer.from(block.replace(/\s/g, ''), 'base64')))
        const { origin } = JSON.parse(plaintext)
        this.currentFileBuffer.push(`${preamble} encrypt key=${key} owners=${owners.join(',')}`)
        this.currentFileBuffer = this.currentFileBuffer.concat(origin.split('\n'))
        this.currentFileBuffer.push(`${preamble}`)
        console.log(chalk.green(`[INFO] Decrypt block with key "${key}"`))
        return true
      }, true)
      // for files
      if (this.currentFileModified) {
        await this.writeBackToFile(filename)
      }
    })
  }
}

program
  .version('0.1.0')
  .description('Encrypt or decrypt markdown files for VuePress')
program
  .command('encrypt [files...]')
  .description('encrypt files or directories, default to source dir')
  .requiredOption('-s, --source-dir <dir>', 'source of VuePress (will load customized plugins from it)')
  .requiredOption('-k, --key-file <file>', 'file that stores key. Should be in .gitignore when using public repo')
  .option('--on-new-key [mode]', 'action when new key is needed, default to generate a key. can be [abort/ask/skip/generate]', 'generate')
  .action(async (files, options) => {
    const app = new App(options)
    await app.encrypt(files)
  })
program
  .command('decrypt [files...]')
  .description('encrypt files or directories, default to source dir')
  .option('-s, --source-dir <dir>', 'source of VuePress (will load customized plugins from it)')
  .requiredOption('-k, --key-file <file>', 'file that stores key. Should be in .gitignore when using public repo')
  .action(async (files, options) => {
    const app = new App(options)
    await app.decrypt(files)
  })
program.command('help')
  .description('print this help message')
  .action(() => { program.outputHelp() })

program.parseAsync(process.argv).catch(err => {
  console.error(err)
})
