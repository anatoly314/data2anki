const api = require("./anki/ank-connect-api");
const ankiHelper = require("./anki/anki-helper");
const config = require("./config");
const dslHelper =require("./dsl/dsl-helper");
const fs = require("fs");

function NoteData (front, back) {
    this.front = front;
    this.back = back;
    this.canBeAdded = true;
}

function getWordsToTranslate() {
    const words = fs.readFileSync(config.sources.dsl.wordToTranslatePath).toString().split("\n").map(word => {
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
        console.log("done");
        Object.keys(htmlTranslations).forEach(key => {
            const value = htmlTranslations[key];
            const noteData = new NoteData(key, value);
            notesData.push(noteData);
        });

        notesData = await ankiHelper.checkIfNotesCanBeAdded(notesData);
        ankiHelper.printWhichCannotBeAdded(notesData);
        const notesCreationResponse = await api.addNotes(config.deckName, config.modelName, notesData);
        ankiHelper.printNotesWhichWereNotAdded(notesData, notesCreationResponse);
    } catch (e) {
        console.error(e);
    }
}

const words = getWordsToTranslate();
translateAndAddWordsToAnki(words).then(response => {
    console.log(response);
}, error => {
    console.error(error);
})


