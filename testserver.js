/*
const http = require('http')
const nodeStatic = require('node-static')
const fs = require('fs')

const fileServer = new nodeStatic.Server('./examples')

const app = http.createServer((req, res) => {
  req
    .on('end', () => {
      switch (req.url) {
        case '../../dist/split-article.js':
        case '/dist/split-article.js':
          fs.readFile('./dist/split-article.js', 'utf8', (err, data) => {
            if (err) {
              res.write(404, {'Content-Type': 'text/plain'})
              res.write('Not found')
            } else {
              res.writeHead(200, {'Content-Type': 'text/javascript'})
              res.write(data)
            }
            res.end()
          })
          break
        default:
          if(req.url === '/'){
            fs.readFile('./examples/index.html', 'utf8', (err, data) => {
              res.writeHead(200, {'Content-Type': 'text/html'})
              res.write(data.replace('<!-- script:live-reload -->', '<script src="' + process.env.BROWSER_REFRESH_URL + '"></script>'))
              res.end()
            })
          }else{
            const matches = req.url.match(/^\/(\w+)(?:\/(?:index\.html)?)?$/)
            if (matches !== null) {
              fs.readFile('./examples/' + matches[1] + '/index.html', 'utf8', (err, data) => {
                if (err) {
                  res.write(404, {'Content-Type': 'text/plain'})
                  res.write('Not found')
                } else {
                  res.writeHead(200, {'Content-Type': 'text/html'})
                  res.write(data.replace('<!-- script:live-reload -->', '<script src="' + process.env.BROWSER_REFRESH_URL + '"></script>'))
                }
                res.end()
              })
            } else {
              fileServer.serve(req, res)
            }
          }
      }
    })
    .resume()
})

app.listen(3000, '0.0.0.0', () => {
  console.log('Server started on port ' + app.address().port)

  if (process.send) {
    process.send('online')
  }
})
*/

const express = require('express')
const reload = require('reload')
const fs = require('fs')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)

let reloadClient = ''

fs.readFile(path.join(__dirname, './node_modules/reload/lib/reload-client.js'), 'utf8', (err, data) => {
  reloadClient = data
})

reload(server, app)

app.use(express.static(path.join(__dirname, './dist')))

app.get('/reload.js', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/javascript'})
  res.write(reloadClient)
  res.end()
})

app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write(`<!DOCTYPE html>
<html>
<head>
  <title>Split article example</title>
  <meta charset="utf-8" />
</head>
<body>
  
  <script src="/reload.js"></script>
</body>
</html>`)
  res.end()
})

app.get('/:folder/', (req, res) => {
  // req.params.folder
})

server.listen(3000, '0.0.0.0', () => {
  console.log('server started @ 0.0.0.0:3000');
})
