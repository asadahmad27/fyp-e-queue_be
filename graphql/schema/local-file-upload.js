import { createWriteStream } from 'fs';
import path from 'path';
import randomstring from 'randomstring';
import * as fs from 'fs';
import fsExtra from 'fs-extra'

// const DOMAIN_NAME = "https://petvet-backend.vercel.app"
const DOMAIN_NAME = "http://localhost:8000"
const uploadFile = async (image, folderName, id, name) => {

    const { filename, createReadStream } = await image;
    let imgArray = filename.split('.');
    let imgExtension = imgArray[imgArray.length - 1]
    const stream = createReadStream();

    var dir = `/public/${folderName}/${id}`;
    if (!fs.existsSync(path.join(path.resolve("./"), dir))) {
        fs.mkdirSync(path.join(path.resolve("./"), dir));
    }

    const pathName = path.join(path.resolve("./"), `${dir}/${name}.${imgExtension}`);
    await stream.pipe(createWriteStream(pathName))
    return `${DOMAIN_NAME}/${folderName}/${id}/${name}.${imgExtension}`;

};

const DeleteFile = async (folderName, id) => {
    try {
        const dirPath = folderName + '/' + id
        fs.rmSync(path.join(path.resolve(`./public`), dirPath), { recursive: true, force: true });
    } catch (err) {
        throw err
    }

};

const multipleUploadFile = async (images, folderName, id, name) => {
    const names = []
    var dir = `/public/ad/${id}`;
    if (!fs.existsSync(path.join(path.resolve("./"), dir))) {

        fs.mkdirSync(path.join(path.resolve("./"), dir));
    }
    for (let i = 0; i < images?.length; i++) {
        const { filename, createReadStream } = await images[i];
        let imgArray = filename.split('.');
        let imgExtension = imgArray[imgArray.length - 1]
        const stream = await createReadStream();
        const finalName = `${name}-${randomstring.generate(12).toLowerCase()}.${imgExtension}`
        const pathName = path.join(path.resolve("./"), `${dir}/${finalName}`);
        await stream.pipe(createWriteStream(pathName))
        names.push(`${DOMAIN_NAME}/${folderName}/${id}/${finalName}`)
    }

    return names

};

const NameCorrect = (data) => {
    if (data?.length > 0) {
        const finalImages = data.map(item => {
            let splited = item.split("images/")
            if (splited[1]) {
                return splited[1]
            } else {
                return splited[0]
            }
        })
        return finalImages
    }
    return data


}
export { uploadFile, multipleUploadFile, NameCorrect, DeleteFile }