const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const parse = require('parse-markdown-links');


function ignore(link, ignoreList) {
    let url;
    try {
        url = new URL(link);
    } catch (e) {
        url = new URL(link);
    }
    return ignoreList.includes(url.host);
}

function parseLinks(files, ignoreList, host) {
    let links = [];

    for (const f of files) {
        const opts = {
            encoding: "utf8",
            flag: "r"
        };
        const text = fs.readFileSync(f, opts);
        const parsedLinks = parse(text);
        const filteredLinks = parsedLinks.filter(l => !ignore(l, [...ignoreList, host]));
        links = [...links, ...filteredLinks];
    }
    return links;
}

try {
    const files = core.getInput("files").split(",");
    const ignoreList = core.getInput("url-blacklist").split(",");
    const host = core.getInput("host");

    const links = parseLinks(files, ignoreList, host);

    const json = {
        links: links
    }
    console.log(JSON.stringify(json));
    core.setOutput("links", json);
} catch (error) {
    core.setFailed(error.message);
}

module.exports.parseLinks = parseLinks;
