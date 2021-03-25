const fs = require("fs");
const axios = require("axios");
module.exports.downloadBarCode = async (uri, dest) => {
    const config = {
        method: "GET",
        url: uri,
        responseType: "stream",
    };

    return await axios(config)
        .then((res) => {
            res.data
                .pipe(fs.createWriteStream(dest))
                .on("finish", () => {
                    return true;
                })
                .on("error", (err) => {
                    console.log(
                        `[ERROR][500][downloadBarCode-createWriteStream] => ${err}`
                    );
                    return false;
                });
        })
        .catch((err) => {
            console.log(`[ERROR][500][downloadBarCode] => ${err}`);
            return false;
        });
};
