import throttle from './throttle'

const onResize = (fn, speed = 200) => {
  let previousPageHeight = document.body.clientHeight

  window.addEventListener('resize', throttle(() => {
    if (document.body.clientHeight !== previousPageHeight) {
      previousPageHeight = document.body.clientHeight
      fn()
    }
  }, speed, {
    trailing: true,
    leading: true
  }))
}

export default onResize
