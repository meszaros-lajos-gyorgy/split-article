import throttle from './throttle'

const onResize = fn => {
  let previousPageHeight = document.body.scrollHeight

  window.addEventListener('resize', throttle(() => {
    if (document.body.scrollHeight !== previousPageHeight) {
      previousPageHeight = document.body.scrollHeight
      fn()
    }
  }, 200, {
    trailing: true,
    leading: true
  }))
}

export default onResize
