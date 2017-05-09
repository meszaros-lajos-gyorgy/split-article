import onReady from './helpers/onready'

class SplitArticle {
  constructor (config) {
    // 1) measure the available space in the target

    onReady(() => {
      window.addEventListener('resize', () => {
        console.log('Window resized, need to recalculate stuff')
      })
    })
  }
}

export default SplitArticle
