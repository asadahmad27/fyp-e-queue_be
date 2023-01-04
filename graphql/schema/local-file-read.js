import { createWriteStream, readdir, readFileSync } from 'fs';
import path from 'path';

const readFile = (name) => {
    console.log(name, "gtr")
    const directoryPath = path.join(path.resolve("./"), 'images');

    var sfile = ''
    readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            if (file === name) {
                sfile = file
            }
            console.log(sfile, '---->')
            return sfile;

        });

    });
}

const getBufferedFile = (name) => {
    const bufferedFile = readFileSync(path.resolve("./images/" + name))
    console.log(bufferedFile, 'ohb')
    return bufferedFile
}

export { readFile, getBufferedFile }





