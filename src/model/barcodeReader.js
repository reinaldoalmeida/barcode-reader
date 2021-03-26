const javascriptBarcodeReader = require("javascript-barcode-reader");
module.exports.barcodeReader = async (image) => {
    return await javascriptBarcodeReader({
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
            return code;
        })
        .catch((err) => {
            console.log(`[ERROR][500][javascriptBarcodeReader] => ${err}`);
            return false;
        });
};
