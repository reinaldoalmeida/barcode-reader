const Quagga = require("quagga").default;
/**
 * 
 * Barcode Decoders
 * 
 * 
    code_128_reader (default)
    ean_reader
    ean_8_reader
    code_39_reader
    code_39_vin_reader
    codabar_reader
    upc_reader
    upc_e_reader
    i2of5_reader
    2of5_reader
    code_93_reader
*/

module.exports.barcodeReader = async (image) => {
    return await Quagga.decodeSingle(
        {
            src: image,
            numOfWorkers: 0, // Needs to be 0 when used within node
            inputStream: {
                size: 800, // restrict input-size to be 800px in width (long-side)
            },
            decoder: {
                readers: [
                    {
                        format: "ean_reader",
                        config: {
                            supplements: ["ean_13_reader"],
                        },
                    },
                ], // List of active readers
            },
        },
        (result) => {
            if (result.codeResult) {
                return result.codeResult.code;
            } else {
                console.log("[ERROR][500][barcodeReader]", image);
                return false;
            }
        }
    );
};
