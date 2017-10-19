const reload = require('reload')
const express = require('express')
const http = require('http')
const path = require('path')
const fs = require('fs')
const {
  append,
  curryN,
  unless,
  of
} = require('ramda')

// -------------

const getProjectName = () => require('../package.json').name

const wrapInArrayIfNeeded = unless(Array.isArray, of)

const filterSeries = curryN(2, (fn, [current, ...remaining], results = []) => {
  if (current) {
    return fn.apply(fn, wrapInArrayIfNeeded(current))
      .then(result => {
        if(result){
          results = append(current, results)
        }

        if (remaining.length) {
          return filterSeries(fn, remaining, results)
        } else {
          return Promise.resolve(results)
        }
      })
  } else {
    return Promise.resolve(results)
  }
})

const isDirectoryPromise = fileName => new Promise((resolve, reject) => {
  fs.lstat(path.join(__dirname, fileName), (err, stats) => {
    resolve(stats && stats.isDirectory())
  })
})

const fetchExampleFolders = () => new Promise((resolve, reject) => {
  fs.readdir(__dirname, (err, files) => {
    if(err){
      reject(err)
    }else{
      filterSeries(isDirectoryPromise, files)
        .then(files => resolve(files))
    }
  })
})

// -------------

const app = express()

const projectName = getProjectName()

const server = http.createServer(app)
reload(app)

app.get('/', (req, res) => fetchExampleFolders()
  .then(folders => {
    let pages = folders.map(folder => `<li><a href="/${folder}/">${folder}</a></li>`);
    if(pages.length){
      pages = '<ul>' + pages.join('\n') + '</ul>'
    }
    
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(`<!DOCTYPE html>
<html>
<head>
  <title>Example uses of "${projectName}"</title>
  <meta charset="utf-8" />
</head>
<body>
  <h1>Example uses of "${projectName}"</h1>
  ${pages}
  <script src="/reload/reload.js"></script>
</body>
</html>`)
    res.end()
  })
  .catch(err => {
    console.error(err)
    
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.write('500 Error')
    res.end()
  })
)

app.use(/^\/\w+\/$/, (req, res, next) => {
  const folder = req.originalUrl.replace('/', '')
  
  fs.lstat(path.join(__dirname, folder), (err, stats) => {
    if(stats && stats.isDirectory()){
      fs.readFile(path.join(__dirname, folder, 'index.html'), 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data
          .replace(/"\.\.\/\.\.\/dist\//g, '"/')
          .replace('<!-- script:live-reload -->', '<script src="/reload.js"></script>')
        )
        res.end()
      })
    }else{
      next()
    }
  })
})

app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname)))

server.listen(3000, '0.0.0.0', () => {
  console.log('server started @ 0.0.0.0:3000');
})
