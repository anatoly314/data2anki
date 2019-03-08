"use strict";
var fs = require("fs");
var java = require("java");
var jarsLocation = "./java/jars";
var dependencies = fs.readdirSync(jarsLocation);

dependencies.forEach(function(dependency){
    java.classpath.push(jarsLocation + "/" + dependency);
})

exports.getJavaInstance = function() {
    return java;
}