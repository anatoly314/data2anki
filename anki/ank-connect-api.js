const axios = require("axios");
const config = require("../config");
const api = {};
module.exports = api;

async function _axiosPostRequest(body){
    const response = await axios({
        method: 'post',
        url: config.uri,
        data: body
    })
    return response.data;
}

/**
 * Gets the version of the API exposed by this plugin. Currently versions 1 through 6 are defined.
 * @returns {Promise<*>}
 */
api.getVersion = async function () {
    const body = {
        "action": "version",
        "version": config.apiVersion
    };
    const data = await _axiosPostRequest(body);
    return data;
}

/**
 * Displays a confirmation dialog box in Anki asking the user if they wish to upgrade AnkiConnect to the latest version from the project’s master branch on GitHub. Returns a boolean value indicating if the plugin was upgraded or not.
 * @returns {Promise<*>}
 */
api.upgradeAnkiConnectAddOn = async function () {
    const body = {
        "action": "upgrade",
        "version": config.apiVersion
    };
    const data = await _axiosPostRequest(body);
    return data;
}

api.upgradeAnkiConnectAddOn = async function () {
    const body = {
        "action": "sync",
        "version": config.apiVersion
    };
    const data = await _axiosPostRequest(body);
    return data;
}

api.getDeckNames = async function () {
    const body = {
        "action": "deckNamesAndIds",
        "version": config.apiVersion
    };
    const data = await _axiosPostRequest(body);
    return data;
}

api.getDecks = async function (cardIds = []) {
    const body = {
        "action": "getDecks",
        "version": config.apiVersion,
        "params": {
            "cards": cardIds
        }
    };
    const data = await _axiosPostRequest(body);
    return data;
}

api.canAddNotes = async function (deckName, modelName, frontFields = []) {
    const body = {
        action: "canAddNotes",
        version: config.apiVersion,
        params: {
            notes: []
        }
    };

    const noteTemplate = {
        deckName: deckName,
        modelName: modelName,
        fields: {
            Front: ""
        },
        tags:[]
    };

    const notes = frontFields.map(frontField => {
        const note = Object.assign({}, noteTemplate, {
            fields: {
                Front: frontField
            }
        });
        return note;
    });
    body.params.notes = notes;
    const data = await _axiosPostRequest(body);
    return data;
}

api.addNotes = async function (deckName, modelName, notesData) {
    const body = {
        action: "addNotes",
        version: config.apiVersion,
        params: {
            notes: []
        }
    };

    const noteTemplate = {
        deckName: deckName,
        modelName: modelName,
        fields: {
            Front: "",
            Back: ""
        },
        tags:[]
    };

    const notes = notesData.filter(noteData => {
        return noteData.canBeAdded;
    }).map(noteData => {
        const note = Object.assign({}, noteTemplate, {
            fields: {
                Front: noteData.front,
                Back: noteData.back
            }
        });
        return note;
    });

    body.params.notes = notes;
    const data = await _axiosPostRequest(body);
    return data;
}
