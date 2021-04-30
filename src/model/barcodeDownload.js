const fs = require("fs");
const path = require("path");
const process = require("process");
const fetch = require("node-fetch");
// const extName = require("ext-name");
const { v4: uuidv4 } = require("uuid");

module.exports.barcodeDownload = async (uri) => {
    return await fetch(uri, { method: "GET" }).then((res) => {
        if (res.ok) {
            //console.log(res.url);
            // make directory and file name
            const randomName = uuidv4();
            // const contentType = res.headers.get("Content-Type");
            // const extension = extName.mime(contentType)[0].ext;
            const filename = `${randomName}.bmp`;
            const dir = path.join(process.cwd(), "barcodes");
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const imagePathDest = path.join(dir, filename);

            // create local image
            const fileStream = fs.createWriteStream(imagePathDest);
            const fileCreated = new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", (err) => {
                    reject(err);
                });
                fileStream.on("close", () => {
                    resolve(true);
                });
            });
            //
            return fileCreated
                .then(() => {
                    return imagePathDest;
                })
                .catch((err) => {
                    console.log(`[ERROR][500][createWriteStream] => ${err}`);
                    return false;
                });
        } else {
            const err = new Error(res.statusText);
            console.log(`[ERROR][500][barcodeDownload] => ${err}`);
            return false;
        }
    });
};
