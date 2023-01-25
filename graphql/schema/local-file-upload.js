import { createWriteStream } from 'fs';
import path from 'path';
import randomstring from 'randomstring';


const DOMAIN_NAME = "https://petvet-backend.vercel.app"
const uploadFile = async (image, name) => {

    const { filename, createReadStream } = await image;
    let imgArray = filename.split('.');
    let imgExtension = imgArray[imgArray.length - 1]
    const stream = createReadStream();
    const pathName = path.join(path.resolve("./"), `/public/images/${name}.${imgExtension}`);
    await stream.pipe(createWriteStream(pathName))
    return `${DOMAIN_NAME}/${name}.${imgExtension}`;

};

const multipleUploadFile = async (images, name) => {
    const names = []
    for (let i = 0; i < images?.length; i++) {
        const { filename, createReadStream } = await images[i];
        let imgArray = filename.split('.');
        let imgExtension = imgArray[imgArray.length - 1]
        const stream = await createReadStream();
        const finalName = `${name}-${randomstring.generate(12).toLowerCase()}.${imgExtension}`
        const pathName = path.join(path.resolve("./"), `/public/images/${finalName}`);
        await stream.pipe(createWriteStream(pathName))
        names.push(`${DOMAIN_NAME}/${finalName}`)
    }
    // await images.forEach(async (element, index) => {

    // });

    return names

};
const multipleUploadFileSingled = async (image, name) => {
    const { filename, createReadStream } = await image;
    let imgArray = filename.split('.');
    let imgExtension = imgArray[imgArray.length - 1]
    const stream = createReadStream();
    const finalName = `${name}-${randomstring.generate(12).toLowerCase()}.${imgExtension}`
    const pathName = path.join(path.resolve("./"), `/public/images/${finalName}`);
    await stream.pipe(createWriteStream(pathName))
    return `${DOMAIN_NAME}/${finalName}`

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
export { uploadFile, multipleUploadFile, NameCorrect, multipleUploadFileSingled }