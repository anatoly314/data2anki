const ankiHelper = {};
const api = require("./ank-connect-api");
module.exports = ankiHelper;

ankiHelper.checkIfNotesCanBeAdded = async function (notesData, deckName, modelName) {
    const frontFiels = notesData.map(noteData => {
        return noteData.front;
    })

    const response = await api.canAddNotes(deckName, modelName, frontFiels);
    response.result.forEach((canBeAdded, noteIndex) => {
        if(!canBeAdded){
            notesData[noteIndex].canBeAdded = false;
        }
    })

    return notesData;
};

ankiHelper.printWhichCannotBeAdded = function (notesData) {
    notesData.forEach(noteData => {
        if(!noteData.canBeAdded){
            console.log("Can't be added: ", noteData.front);
        }
    })
};

ankiHelper.printNotesWhichWereNotAdded = function(notesData, notesCreationResponse) {
    notesCreationResponse.result.forEach((result, index) => {
        if(!result){
            console.log("Wasn't added", notesData[index]);
        }
    });
};

ankiHelper.addMultipleNotesData = async function (notesData, deckName, modelName) {
    notesData = await this.checkIfNotesCanBeAdded(notesData, deckName, modelName);
    ankiHelper.printWhichCannotBeAdded(notesData);
    const notesCreationResponse = await api.addNotes(notesData, deckName, modelName);
    this.printNotesWhichWereNotAdded(notesData, notesCreationResponse);
}