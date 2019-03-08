const fs = require("fs");
const config = require("../config");
var javaInit = require('../java/java-init');
var java = javaInit.getJavaInstance();

const dslHelper = {};
module.exports = dslHelper;

dslHelper.getHtmlTranslations = function (words) {
    var pathArray = java.newArray('java.lang.String', config.modules.dsl.dictionariesPath);
    var wordsArray = java.newArray('java.lang.String', words);

    var htmlArticles = java.callStaticMethodSync("entrypoints.Dsl2Html", "getTranslationsAsArray", pathArray, wordsArray);

    const result = {};
    for(let i = 0; i < htmlArticles.length; i+=2){
        const key = htmlArticles[i];
        const value = htmlArticles[i+1];

        result[key] = value;
        //fs.writeFileSync(`output/${key}.html`, value);
    }


    return result;
}



