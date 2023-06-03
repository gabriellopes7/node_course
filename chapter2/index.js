const fs = require('fs')
const path = require('path')
const fsPromises = require('fs').promises

// fs.readFile(path.join(__dirname, 'files','starter.txt'), 'utf-8',(err, data)=> {
//     if (err) throw err;
//     console.log(data)
// })

// console.log('Hello...')

process.on('uncaughtException', err =>{
    console.error(`There was an uncaught error: ${err}`)
    process.exit(1)
})


// //Create a file
// fs.writeFile(path.join(__dirname, 'files','reply.txt'),'Testing text', (err)=> {
//     if (err) throw err;
//     console.log('Writing complete')
    
//     //Append update and create a file if doesnt exist
//     fs.appendFile(path.join(__dirname, 'files','reply.txt'),'Yes it is', (err)=> {
//         if (err) throw err;
//         console.log('Writing complete')

//         fs.rename(path.join(__dirname, 'files','reply.txt'),path.join(__dirname, 'files','new_reply.txt'), (err)=> {
//             if (err) throw err;
//             console.log('Rename complete')
//         })
//     })
// })

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname,'files','starter.txt'), 'utf-8')
        console.log(data)

        //Delete file
        await fsPromises.unlink(path.join(__dirname,'files','starter.txt'),data )

        await fsPromises.writeFile(path.join(__dirname,'files','promise_text.txt'),data )

        //Update file
        await fsPromises.appendFile(path.join(__dirname,'files','promise_text.txt'),'\n\nNice to meet you' )
        await fsPromises.rename(path.join(__dirname,'files','promise_text.txt'),path.join(__dirname,'files','promise_complete.txt') )

        const newData = await fsPromises.readFile(path.join(__dirname,'files','promise_complete.txt'), 'utf-8')
        console.log(newData)
    } catch (err) {
        console.error(err)
    }
}
fileOps();