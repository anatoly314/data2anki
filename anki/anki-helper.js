const ankiHelper = {};
const api = require("./ank-connect-api");
const config = require("../config");
module.exports = ankiHelper;

ankiHelper.checkIfNotesCanBeAdded = async function (notesData) {
    const frontFiels = notesData.map(noteData => {
        return noteData.front;
    })

    const response = await api.canAddNotes(config.deckName, config.modelName, frontFiels);
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
}