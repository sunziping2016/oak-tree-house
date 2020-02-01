const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const util = require('util')
const aesjs = require('aes-js')
const chalk = require('chalk')
const { globby, sort, parseFrontmatter } = require('@vuepress/shared-utils')
const md = require('@vuepress/markdown')

const helpText = `\
Usage:
  node encrypt.js SOURCE_DIR KEY_FILE`

if (process.argv.length !== 4) {
  console.log(helpText)
  process.exit(1)
}
main(process.argv[2], process.argv[3]).catch(err => {
  console.error(err)
})

const ENCRYPT_BEGIN_REGEX = /^<!-- encrypt-begin key=(\w+) -->$/
const ENCRYPT_END_REGEX = /^<!-- encrypt-end -->$/

async function main (sourceDir, keyFile) {
  let keys = {}
  try {
    keys = JSON.parse(await util.promisify(fs.readFile)(keyFile, 'utf8'))
  } catch (e) {
    console.warn(chalk.yellow('[WARN] Failed to load key file. Create a new one!'))
  }
  const markdown = md()
  const patterns = ['**/*.md', '!.vuepress', '!node_modules']
  const pageFiles = sort(await globby(patterns, { cwd: sourceDir }))
  for (const pageFile of pageFiles) {
    const src = await util.promisify(fs.readFile)(path.join(sourceDir, pageFile), 'utf8')
    const frontmatter = parseFrontmatter(src)
    const inputLines = src.split('\n')
    let outputLines = []
    let modified = false
    let insideEncrypt = false
    let contentLines
    let keyId
    for (const inputLine of inputLines) {
      if (insideEncrypt) {
        if (inputLine.match(ENCRYPT_END_REGEX)) {
          insideEncrypt = false
          if (!keys[keyId]) {
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
              answer = await util.promisify(rl.question)(`[PROMPT] Key for "${keyId}" does not exist. Generate, abort or skip? [G/A/S]: `)
              answer = (answer || '').toUpperCase()
            } while (answer !== 'G' && answer !== 'A' && answer !== 'S')
            rl.close()
            if (answer === 'A') {
              console.log(chalk.red('[ERROR] Abort!'))
              process.exit(1)
            } else if (answer === 'S') {
              console.warn(chalk.yellow(`[WARN] Skip "${keyId}"`))
              outputLines.push(`<!-- encrypt-begin key=${keyId} -->`)
              outputLines = outputLines.concat(contentLines)
              outputLines.push('<!-- encrypt-end -->')
              continue
            }
            const randomBuffer = await util.promisify(crypto.randomBytes)(16)
            keys[keyId] = aesjs.utils.hex.fromBytes(randomBuffer)
            console.log(chalk.green(`[INFO] Generate key for ${keyId}: ${keys[keyId]}`))
            try {
              await util.promisify(fs.writeFile)(keyFile, JSON.stringify(keys, null, 2), 'utf8')
            } catch (e) {
              console.log(chalk.red('[ERROR] Cannot store the key file!'))
              console.log(chalk.red(`[ERROR] ${e.message}`))
              process.exit(1)
            }
          }
          const content = contentLines.join('\n')
          const { html } = markdown.render(content, {
            frontmatter: frontmatter.data,
            relativePath: pageFile.replace(/\\/g, '/')
          })
          console.log(html)
          const htmlBytes = aesjs.utils.utf8.toBytes(html)
          // eslint-disable-next-line new-cap
          const aesCtr = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(keys[keyId]))
          const encryptedHtmlBytes = Buffer.from(aesCtr.encrypt(htmlBytes))
          modified = true
          outputLines.push(`<!-- encrypt-begin key=${keyId} encrypted -->`)
          outputLines.push(encryptedHtmlBytes.toString('base64'))
          outputLines.push(`<!-- encrypt-end encrypte -->`)
        } else {
          contentLines.push(inputLine)
        }
      } else {
        const match = inputLine.match(ENCRYPT_BEGIN_REGEX)
        if (match) {
          insideEncrypt = true
          contentLines = []
          keyId = match[1]
        } else {
          outputLines.push(inputLine)
        }
      }
    }
    if (modified) {
      console.log('Output is:')
      console.log(outputLines.join('\n'))
    }
  }
}
