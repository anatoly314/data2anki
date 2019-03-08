const parser = require("./parser");
const config = require("../config");
const arrayHelper = require("../helpers/array-helper");
const ankiHelper = require("../anki/anki-helper");

async function _main(){
    const rawNotes = await parser.getRawNotesFromMarkdownFile(config.modules.markdown.pathToFile);
    const notesData = arrayHelper.splitArrayToChunks(rawNotes);

    for(let notesDataChunk of notesData){
        await ankiHelper.addMultipleNotesData(notesDataChunk, config.modules.markdown.anki.deckName, config.modules.markdown.anki.modelName);
    }

}

module.exports = function () {
    _main();
}