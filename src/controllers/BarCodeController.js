const barcode = require("../model/barcode.js");
module.exports = {
    async show(req, res) {
        const { image } = req.query;
        if (!image)
            return res.status(404).send({ error: "Image parameter not found" });
        try {
            const code = await barcode.processBarCode(image);
            return res.status(200).send(code);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "BarCode Processing Failed" });
        }
    },
};
