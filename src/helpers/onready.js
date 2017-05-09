const isReady = () => ['interactive', 'complete'].includes(document.readyState)

export default function onReady (handler) {
  if (isReady()) {
    handler()
  } else {
    handler.done = false
    document.addEventListener('readystatechange', () => {
      if (isReady() && !handler.done) {
        handler.done = true
        handler()
      }
    })
  }
}
