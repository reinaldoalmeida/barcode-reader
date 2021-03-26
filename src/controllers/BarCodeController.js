const download = require("../model/barcodeDownload.js");
const remove = require("../model/barcodeRemove.js");
const reader = require("../model/barcodeReader.js");

module.exports = {
    async show(req, res) {
        const { image } = req.query;
        if (!image)
            return res.status(404).send({ error: "Image is not defined" });

        const fileDownloaded = await download.barcodeDownload(image);
        if (!fileDownloaded)
            return res.status(500).send({ error: "BarCode read failed" });

        const code = reader.barcodeReader(fileDownloaded);
        code.then((code) => {
            remove.barcodeRemove(fileDownloaded);
            return res.status(200).send({ barcode: code });
        }).catch((err) => {
            console.log(`[ERROR][500][BarCodeController] => ${err}`);
            return res.status(500).send({ error: "BarCode read failed" });
        });
    },
};
