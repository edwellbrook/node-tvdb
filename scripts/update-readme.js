'use strict';

const parseComments = require('parse-comments');
const fs = require('fs');
const _ = require('lodash');

const functionDocTemplate = _.template(`
### <%= name %><% if (urls.length === 1) { %> ([API Reference](<%= urls[0] %>))<% } %>

<%= lead %>
<%= exampleCode %>
`);

function makeFunctionDocTemplate(comment) {
    function urls(str) {
        return str.match(/\b(https):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)/ig);
    }

    comment.urls = urls(comment.description) || [];

    if (comment.name === ''){
        throw new Error(`@name tag missing for comment starting at index.js:${comment.comment.begin}`);
    }

    if (comment.examples.length === 0){
        throw new Error(`example code missing for ${comment.name} doc (index.js:${comment.comment.begin})`);
    }

    comment.exampleCode = comment.examples[0].block.replace(/\\/g, '');

    return functionDocTemplate(comment);
}

const comments = parseComments(fs.readFileSync('index.js').toString());

const functionSection = _.chain(comments)
    .filter(comment => comment.public && !comment.isAlias)
    .map(comment => makeFunctionDocTemplate(comment))
    .value()
    .join('\n');

const separator = '<!--- Function documentation -->';

let readmeContent = fs.readFileSync('./README.md').toString();
let readmeParts = readmeContent.split(separator);
readmeParts[1] = functionSection;
readmeContent = readmeParts.join(separator);

fs.writeFileSync('./README.md', readmeContent);
