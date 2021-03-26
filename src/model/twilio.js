const extName = require("ext-name");
const path = require("path");
const process = require("process");
const fs = require("fs");
const fetch = require("node-fetch");

const PUBLIC_DIR = "./barcodes";

module.exports.downloadBarCode = async (req) => {
    let images = [];

    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(path.resolve(PUBLIC_DIR));
    }

    async function SaveMedia(mediaItem) {
        const { mediaUrl, filename } = mediaItem;

        const fullPath = path.join(
            process.cwd(),
            `${PUBLIC_DIR}`,
            `${filename}`
        );

        if (!fs.existsSync(fullPath)) {
            const response = await fetch(mediaUrl);
            const fileStream = fs.createWriteStream(fullPath);
            response.body.pipe(fileStream);
            // TODO: deleteMediaItem(mediaItem) on Twilio;
        }
        images.push(filename);
    }

    const { body } = req;
    const { NumMedia, MessageSid } = body;
    let saveOperations = [];
    const mediaItems = [];

    console.log("body", body);
    for (let i = 0; i < NumMedia; i++) {
        const mediaUrl = body[`MediaUrl${i}`];
        const contentType = body[`MediaContentType${i}`];
        const extension = extName.mime(contentType)[0].ext;
        const mediaSid = path.basename(new URL(mediaUrl).pathname);
        const filename = `${mediaSid}.${extension}`;
        mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename });
        saveOperations = mediaItems.map((mediaItem) => SaveMedia(mediaItem));
    }

    return await Promise.all(saveOperations);
};
