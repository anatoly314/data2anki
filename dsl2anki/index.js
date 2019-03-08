const ankiHelper = require("../anki/anki-helper");
const config = require("../config");
const dslHelper =require("../dsl2anki/dsl-helper");
const fs = require("fs");
const arrayHelper = require("../helpers/array-helper");
const NoteData = require("../anki/note-data");

function getWordsToTranslate() {
    const words = fs.readFileSync(config.modules.dsl.wordToTranslatePath).toString().split("\n").map(word => {
        word = word.replace(/[^a-zA-Z\d\s:]/gm, '');
        return word;
    }).filter(word => {
        return word.length > 0;
    });
    return words;
}


async function translateAndAddWordsToAnki(words) {
    try {
        let notesData = [];
        const htmlTranslations = dslHelper.getHtmlTranslations(words);
        //create notesData from html translations
        Object.keys(htmlTranslations).forEach(key => {
            const value = htmlTranslations[key];
            const noteData = new NoteData(key, value);
            notesData.push(noteData);
        });

        await ankiHelper.addMultipleNotesData(notesData, config.modules.dsl.anki.deckName, config.modules.dsl.anki.modelName);
    } catch (e) {
        console.error(e);
    }
}

async function main(){
    const words = getWordsToTranslate();
    const chunkedWords = arrayHelper.splitArrayToChunks(words);
    for(let chunk of chunkedWords){
        console.log(chunk.length);
        let response = await translateAndAddWordsToAnki(chunk);
        console.log(response);
    }
}



module.exports = function () {
    main().then(response => {
        console.log(response);
    }, error => {
        console.error(error);
    })
}
