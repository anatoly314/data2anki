const api = require("./anki/ank-connect-api");
const ankiHelper = require("./anki/anki-helper");
const config = require("./config");
const dslHelper =require("./dsl/dsl-helper");


function NoteData (front, back) {
    this.front = front;
    this.back = back;
    this.canBeAdded = true;
}

(async () => {
    try {
        let notesData = [];
        var words = ["angel", "world", "test"];
        const htmlTranslations = dslHelper.getHtmlTranslations(words);
        //create notesData from html translations
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
})();

