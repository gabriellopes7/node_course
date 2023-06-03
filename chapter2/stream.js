const fs = require('fs')
const rs = fs.createReadStream('./files/lorem.txt', {encoding: 'utf-8'})

const ws = fs.createWriteStream('./files/new-lorem.txt')

// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk)
// })

//Transfere os dados para o outro stream, executa a mesma função de cima
rs.pipe(ws);