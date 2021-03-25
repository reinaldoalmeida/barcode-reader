const path = require("path");
const process = require("process");
const download = require("../model/downloadFile.js");
const remove = require("../model/removeFile.js");
const barcode = require("../model/barcode.js");

module.exports = {
    async show(req, res) {
        const { image } = req.query;

        if (!image)
            return res.status(404).send({ error: "Image is not defined" });

        try {
            //
            const imagePathDest = path.join(
                process.cwd(),
                "barcodes",
                "barcode.png"
            );
            await download.downloadBarCode(image, imagePathDest);
            //
            const code = await barcode.processBarCode(imagePathDest);
            if (!code) {
                return res.status(404).send({ error: "BarCode read error" });
            } else {
                await remove.removeBarCode(imagePathDest);
                return res.status(200).send({ barcode: code });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "BarCode Processing Failed" });
        }
    },
};
