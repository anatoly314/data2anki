const config = require("./config");
const dsl2anki = require("./dsl2anki");
const markdown2anki = require("./markdown2anki");

if (config.mode === "dsl2anki"){
    dsl2anki();
}else if (config.mode === "markdown2anki"){
    markdown2anki();
}else {
    console.error("Wrong mode, possible values are 'dsl2anki' or 'markdown2anki'");
}

