const config = require("../config");
const arrayHelper = {};
module.exports = arrayHelper;

arrayHelper.splitArrayToChunks = function(array) {
    let chunkSize = config.maxNotesPerCall;
    let chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        let tempArray = array.slice(i, i + chunkSize);
        chunks.push(tempArray);
    }
    return chunks;
}