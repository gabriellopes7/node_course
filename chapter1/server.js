// Node runs on a server not in a browser
// The console is the terminal window
// console.log('Hello world')
// //global object instead of window object
// console.log(global)
//Has common core modules that we can explore
//CommonJS imports instead of ES6 modules
//Missing some JS API's like fetch
const os = require('os')
const path = require('path')
const math = require('./math')
//We can destructure
const {subtract} = require('./math')

console.log(os.type())
console.log(os.version())
console.log(os.homedir())
console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))
console.log(path.parse(__filename))

console.log(math.add(2,3))
console.log(subtract(5,2))