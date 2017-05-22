import throttle from './throttle'

const onResize = fn => {
  let previousPageHeight = document.body.clientHeight

  window.addEventListener('resize', throttle(() => {
    if (document.body.clientHeight !== previousPageHeight) {
      previousPageHeight = document.body.clientHeight
      fn()
    }
  }, 200, {
    trailing: true,
    leading: true
  }))
}

export default onResize
