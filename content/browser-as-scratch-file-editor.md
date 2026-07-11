+++
title = "Browser Scratch File Editor"
date = 2020-07-22
[taxonomies]
tags = ["browser", "story", "productivity"]
categories = ["stories"]
+++
Developers often require ephemeral scratch files for temporary note-taking during workflow without the overhead of context switching.
To address this need, a browser-native text editor solution leverages [data URLs][data_url] to create lightweight, on-the-fly text editors.

<!--more-->

The implementation utilizes the `data:text/html,<html contenteditable>` format, where the browser renders an editable HTML element directly within the URL.
This approach eliminates external dependency on text editors or file systems, providing immediate access to a text input field when the URL is opened in a browser tab.

Key considerations include:

- Content persistence is limited to the current browser tab session
- Browser extensions can enable content preservation for long-term use cases
- The solution is ideal for short-term documentation during development workflows

This technique offers a context-aware alternative to traditional text editors for temporary note capture, reducing workflow disruption while maintaining immediate accessibility to temporary text content.

The scratch file editor url is `data:text/html,<html contenteditable>`.

# Resources

- [Data Urls][data_url]

[data_url]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
