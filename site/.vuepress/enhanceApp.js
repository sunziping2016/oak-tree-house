import themeEvent from '@theme-event'
import mathjaxEvent from '@mathjax-event'
import encryptEvent from '@encrypt-event'
import codeCopyEvent from '@code-copy-event'
import codeToggleEvent from '@code-toggle-event'
import marpEvent from '@marp-event'
import gitalkEvent from '@gitalk-event'
import swEvent from '@sw-event'

export default () => {
  themeEvent.$on('contentReady', () => {
    mathjaxEvent.$emit('contentReady')
    codeCopyEvent.$emit('contentReady')
    codeToggleEvent.$emit('contentReady')
    marpEvent.$emit('contentReady')
    gitalkEvent.$emit('contentReady')
  })
  encryptEvent.$on('decrypt-failed', () => {
    themeEvent.$emit('notify', {
      text: '解密失败！',
      buttonColor: 'red'
    })
  })
  encryptEvent.$on('decrypt-succeed', () => {
    themeEvent.$emit('notify', {
      text: '成功解密！',
      buttonColor: 'green'
    })
    themeEvent.$emit('contentReady')
  })
  codeCopyEvent.$on('code-copied', () => {
    themeEvent.$emit('notify', '成功复制代码片段！')
  })
  swEvent.$on('sw-updated', (updateEvent) => {
    themeEvent.$emit('notify', {
      text: '检测到有新的内容。',
      buttonColor: 'green',
      buttonText: '立刻更新',
      buttonAction: () => {
        updateEvent.skipWaiting().then(() => {
          location.reload()
        })
      }
    })
  })
}
