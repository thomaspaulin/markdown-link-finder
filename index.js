const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const parse = require('parse-markdown-links');


function isBlacklisted(link, blacklist) {
    const url = new URL(link);
    const host = url.host.startsWith("www.")
        ? url.host.substring(4)
        : url.host;
    return blacklist.includes(host);
}

function parseLinks(files, ignoreList, host) {
    let links = [];

    for (const f of files) {
        if (fs.existsSync(f) && fs.lstatSync(f).isFile()) {
            const opts = {
                encoding: "utf8",
                flag: "r"
            };
            const text = fs.readFileSync(f, opts);
            const parsedLinks = parse(text);
            const blacklist = host ? [...ignoreList, host] : [...ignoreList];
            const filteredLinks = parsedLinks.filter(l => !isBlacklisted(l, blacklist));
            links = [...links, ...filteredLinks];
        }
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
