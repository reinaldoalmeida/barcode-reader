const download = require("../model/barcodeDownload.js");
const remove = require("../model/barcodeRemove.js");
const reader = require("../model/barcodeReader.js");

module.exports = {
    async show(req, res) {
        const { image, barcodeType } = req.query;
        if (!image)
            return res.status(404).send({ barcode: "Image is not defined" });

        let barcodeTypeList = ["ean_reader"];
        if (barcodeType) {
            barcodeTypeList.pop();
            barcodeTypeList.push(barcodeType);
        }

        const fileDownloaded = await download.barcodeDownload(image);
        if (!fileDownloaded)
            return res.status(500).send({ barcode: "BarCode read failed" });

        const code = await reader.barcodeReader(
            fileDownloaded,
            barcodeTypeList
        );
        await remove.barcodeRemove(fileDownloaded);
        if (!code)
            return res.status(500).send({ barcode: "BarCode read failed" });
        code.then((code) => {
            return res.status(200).send({ barcode: code });
        });
    },
};
