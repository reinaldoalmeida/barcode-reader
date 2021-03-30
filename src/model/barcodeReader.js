const fs = require("fs");
const path = require("path");
const process = require("process");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");
const {
    BinaryBitmap,
    RGBLuminanceSource,
    HybridBinarizer,
    DecodeHintType,
    MultiFormatReader,
    BarcodeFormat,
} = require("@zxing/library");

module.exports.barcodeReader = async (image) => {
    // make directory and file name
    const randomName = uuidv4();
    const filename = `${randomName}.bmp`;
    const dir = path.join(process.cwd(), "barcodes");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const imagePathDest = path.join(dir, filename);

    // convert image to bitmap
    const bmp = await Jimp.read(image)
        .then((bmp) => {
            return (
                bmp
                    //.greyscale() // set greyscale
                    .write(imagePathDest)
            ); // save
        })
        .catch((err) => {
            console.error(err);
            return false;
        });

    let pixels = [];
    for (let p = 0; p < bmp.bitmap.width * bmp.bitmap.height * 4; p += 4) {
        const r = bmp.bitmap.data[p];
        const g = bmp.bitmap.data[p + 1];
        const b = bmp.bitmap.data[p + 2];
        const a = bmp.bitmap.data[p + 3];

        let rgba = r;
        rgba = (rgba << 8) + g;
        rgba = (rgba << 8) + b;
        rgba = (rgba << 8) + a;

        pixels.push(rgba);
    }

    const hints = new Map();
    const formats = [BarcodeFormat.EAN_13];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    const reader = new MultiFormatReader();
    reader.setHints(hints);
    const luminanceSource = new RGBLuminanceSource(
        Int32Array.from(pixels),
        bmp.bitmap.width,
        bmp.bitmap.height
    );
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    // remove bitmap image
    fs.unlink(imagePathDest, () => {});

    // return de barcode text
    try {
        return reader.decode(binaryBitmap);
    } catch {
        return false;
    }
};
