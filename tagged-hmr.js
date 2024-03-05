console.log('test')
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const rootPath = './' // '../'
const servePath = path.join(__dirname, rootPath)

console.log('📂 servePath',servePath)

const index = path.join(__dirname, rootPath, 'index.html')
const indexString = fs.readFileSync(index).toString()

const inject = path.join(__dirname, 'hmr', 'hmr.bundle.js')
const customScript = '<script type="module">'+ fs.readFileSync(inject).toString() +'</script>'
const watchPath = process.env.dir ? path.join(__dirname, process.env.dir) : __dirname

const bundleScript = require(rootPath + 'bundleScript.hmr.js')
const indexFilePath = path.join(__dirname, rootPath, 'index.html')

// Custom middleware for serving static files
app.use((req, res, next) => {
  const correctedPath = req.url === '/' ? 'index.html' : req.url
  const filePath = path.join(__dirname, rootPath, correctedPath)

  // Check if the requested file is an HTML file
  const customScriptInjection = path.extname(filePath) === '.html'

  // TODO: remove this
  const fileName = path.basename(filePath).toLowerCase()
  const isIndex = fileName === 'index.html'

  console.log(`↖️ 📄 send file ${fileName}`)

  // Check if the flag is set for HTML modification
  if (isIndex && customScriptInjection) {
    // Read the HTML file
    sendFile(filePath, res)
  } else {
    // If it's not an HTML file, proceed with the regular static file serving
    // servePath
    express.static('.', {
      setHeaders: (res, path) => {
          // Set no-store only for HTML files
          res.setHeader('Cache-Control', 'no-store');
      }
    })(req, res, (err) => {
      if(err) {
        req.url = 'index.html'
        sendFile(indexFilePath, res)
        //express.static('.')(req, res, next)
        return
      }
      next()
    })
  }
});

const server = app.listen(port, () => {
  console.log(`🏃 Server is running on http://localhost:${port}`);
  console.log(`Serving path:${servePath}`);
});


if(watchPath) {
  console.log('👀 Watching path', watchPath)
}

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
let promise = Promise.resolve()
let running = false
const connections = []

wss.on('close', (ws) => {
  const index = connections.indexOf(ws)
  connections.splice(index, 1)
})

wss.on('connection', (ws) => {
  connections.push(ws)
  console.log('wss connected')
  ws.send('Connected to the WebSocket endpoint');
});

fs.watch(watchPath, { recursive: true }, async (eventType, filename) => {
  if(running || filename.includes('bundle.js')) {
    return
  }

  console.log('📄 file changed', filename)

  await runBundle()
  
  const messageObject = {
    type:'file-change',
    filename:filename,
    changed: eventType,
  }

  connections.forEach(ws => {    
    ws.send(JSON.stringify(messageObject))
    console.log('sent message')
  })
});


function sendFile(
  filePath,
  res,
) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if(err.code === 'ENOENT') {
        data = indexString
      } else {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
    }

    // Inject your custom script into the HTML
    const modifiedHtml = data.replace('</body>', `${customScript}</body>`);

    // Send the modified HTML
    res.send(modifiedHtml);
  });
}

async function runBundle() {
  running = true
  promise = promise.then(async () => {
    console.log('🏗️ making bundle...')
    await bundleScript.run()
    running = false
  })

  await promise

  console.log('✅ 🏗️ bundle made')

}

console.log('🏗️ making first bundle...')
runBundle()