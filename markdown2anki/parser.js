const fs = require("fs");
const NoteData = require("../anki/note-data");
const config = require("../config");
const readline = require("readline");
const hljs = require('highlight.js'); // https://highlightjs.org/
const md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (e) {
                console.error(e);
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

function RawNote() {
    this.frontRaw = ""
    this.backRaw = "";
}

function _rawNoteToAnkiNote(rawNote, notes) {
    //markdown-it
    const front = md.render(rawNote.frontRaw);
    const back = md.render(rawNote.backRaw);
    const noteData = new NoteData(front, back);
    notes.push(noteData);
    return notes;
}

function _getRawNotesFromMarkdownFile(filename) {
    function checkIfQuestionStarts(line) {
        let questionStarts = false;
        config.modules.markdown.selectors.startQuestionSelectors.forEach(selector => {
            if(line.startsWith(selector)){
                questionStarts = true;
            }
        });
        return questionStarts;
    }

    function checkIfAnswerStarts(line) {
        let answerStarts = false;
        config.modules.markdown.selectors.startAnswerSelectors.forEach(selector => {
            if(line.startsWith(selector)){
                answerStarts = true;
            }
        });
        return answerStarts;
    }

    return new Promise((resolve, reject) => {
        try {
            let note;
            let notes = [];

            const fileStream = fs.createReadStream(filename);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            if(config.modules.markdown.questionMode === 'SINGLE_LINE_QUESTION'){
                rl.on('line', (line) => {
                    if(checkIfQuestionStarts(line)){ //add previous card if exists and create a new one
                        if(note){
                            notes = _rawNoteToAnkiNote(note, notes);
                        }
                        note = new RawNote();
                        note.frontRaw = line;
                    }else{
                        note.backRaw += line;
                        note.backRaw += "\n";
                    }
                });
            }else if(config.modules.markdown.questionMode === 'MULTI_LINE_QUESTION'){
                let parsingQuestion = false;
                rl.on('line', (line) => {
                    console.log(line);
                    if(checkIfQuestionStarts(line)){ //add previous card if exists and create a new one
                        parsingQuestion = true;
                        if(note){
                            notes = _rawNoteToAnkiNote(note, notes);
                        }
                        note = new RawNote();
                        note.frontRaw = line;
                    }else if(checkIfAnswerStarts(line) || !parsingQuestion){
                        parsingQuestion = false;
                        note.backRaw += line;
                        note.backRaw += "\n";
                    }else if(parsingQuestion){
                        note.frontRaw += line;
                        note.frontRaw += "\n";
                    }
                });
            }



            rl.on('close', () => {
                notes = _rawNoteToAnkiNote(note, notes);
                return resolve(notes);
            });
        } catch (e) {
            console.error(e);
            return reject(e);
        }
    })
}

module.exports = {
    getRawNotesFromMarkdownFile: _getRawNotesFromMarkdownFile
}