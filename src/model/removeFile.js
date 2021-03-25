const fs = require("fs");
module.exports.removeBarCode = async (dest) => {
    return fs.unlink(dest, function (err) {
        if (err && err.code == "ENOENT") {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.", dest);
            return false;
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file", dest);
            return false;
        } else {
            return true;
        }
    });
};
