# Markdown Link Finder

This action find all links in the specified markdown files and presents them as output.

## Inputs

### `files`
**Required** A comma separated list of files to search within. These should be the absolute file paths.

### `url_blacklist`
A comma separated list of hosts to which should not be archived. This represents URLs which are considered reliable and are unlikely rot e.g., en.wikipedia.org'. The default setting permits every URL.

### `host`
The host of the pages to be checked, e.g., en.wikipedia.org. Setting this input will cause the script to ignore links from the host, regardless of the blacklist's settings.

## Outputs

### `links`
The links found within the provided markdown files. 

Note: The action will ignore home pages. For example, www.example.com will be ignored but www.example.com/my-post/ will not.

## Example Usage
```yaml
uses: thomaspaulin/markdown-link-finder@v3.1.0
with:
  files: 'README.md,example.md'
  url_blacklist: 'en.wikipedia.org,news.ycombinator.com'
  host: 'example.com'
```
