const { javascriptBarcodeReader } = require("javascript-barcode-reader");
module.exports.processBarCode = async function processBarCode(image) {
    javascriptBarcodeReader({
        /* Image file Path || {data: Uint8ClampedArray, width, height} || HTML5 Canvas ImageData */
        image: image,
        barcode: "code-93",
        // barcodeType: 'industrial',
        options: {
            // useAdaptiveThreshold: true
            // singlePass: true
        },
    })
        .then((code) => {
            console.log(code);
            return code;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};
