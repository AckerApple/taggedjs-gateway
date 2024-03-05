const fs = require('fs')
const path = require('path')
const pack = require('../package.json')

delete pack.scripts
delete pack.devDependencies
delete pack.private

const write = JSON.stringify(pack, null, 2)

const pathToWrite = path.join(__dirname,'../','dist','package.json')
fs.writeFileSync(pathToWrite, write)

console.info('✅ wrote ' + pathToWrite)
