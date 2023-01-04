import { createWriteStream, readdir } from 'fs';
import path from 'path';

const uploadFile = async (image, name) => {
    const { filename, createReadStream } = await image;
    let imgArray = filename.split('.');
    let imgExtension = imgArray[imgArray.length - 1]
    const stream = createReadStream();
    const pathName = path.join(path.resolve("./"), `/images/${name}.${imgExtension}`);
    await stream.pipe(createWriteStream(pathName))
    return `${name}.${imgExtension}`;

};


// const readFile = (name) => {
//     const directoryPath = path.join(path.resolve("./"), 'images');
//     readdir(directoryPath, function (err, files) {
//         //handling error
//         if (err) {
//             return console.log('Unable to scan directory: ' + err);
//         }
//         //listing all files using forEach
//         files.forEach(function (file) {
//             // Do whatever you want to do with the file
//             console.log(file);
//         });
//     });
// }
export { uploadFile }