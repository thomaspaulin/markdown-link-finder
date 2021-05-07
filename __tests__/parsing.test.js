"use strict";

const parseLinks = require("../index").parseLinks;

const testResources = "./__tests__/resources";

describe("link-parsing", () => {
    it("should parse a regular markdown file", () => {
        const f = [`${testResources}/file.md`];
        const links = parseLinks(f, [], undefined);
        expect(links).toContain("https://en.wikipedia.org");
        expect(links).toContain("https://www.example.com");
        expect(links).toContain("https://www.example.org");
    });
    it("should parse but ignore Hugo front matter", () => {
        const f = [`${testResources}/hugo.md`];
        const links = parseLinks(f, [], undefined);
        expect(links).toContain("https://en.wikipedia.org");
        expect(links).toContain("https://www.example.com");
        expect(links).toContain("https://www.example.org");
    });
    it("should parse URLs with parentheses in them", () => {
        const f = [`${testResources}/parens.md`];
        const links = parseLinks(f, [], undefined);
        expect(links).toContain("https://www.flightfromperfection.com/(a).html");
        expect(links).toContain("https://web.archive.org/web/20210113084039/https://www.flightfromperfection.com/(a).html");
    });
    it("should skip directories", () => {
        const f = [`${testResources}/`];
        const links = parseLinks(f, [], undefined);
        expect(links.length).toEqual(0);
    });
    it("should skip links which match the host", () => {
        const f = [`${testResources}/file.md`];
        const links = parseLinks(f, [], "example.com");
        expect(links).toContain("https://en.wikipedia.org");
        expect(links).toContain("https://www.example.org");
        expect(links.length).toEqual(2);
    });
    it("should skips links in the ignore list", () => {
        const f = [`${testResources}/file.md`];
        const links = parseLinks(f, ["example.com", "example.org"], undefined);
        expect(links).toContain("https://en.wikipedia.org");
        expect(links.length).toEqual(1);
    });
    it("should handle subdomains gracefully", () => {
        const f = [`${testResources}/subdomains.md`];
        const links = parseLinks(f, [], undefined);
        expect(links).toContain("https://hello.world.example.com/greeting");
    });
});
