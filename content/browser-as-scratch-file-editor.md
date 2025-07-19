+++
title = "browser as scratch file editor"
date = 2020-07-22
[taxonomies]
tags = ["story", "browser", "file"]
categories = ["stories"]
+++
When browsing internet you may find a need to write down some temporary notes. I call it
scratch files. Opening text editor for editing these scratch files is too much pain or
just too much of context swap.

# In Browser Temporary File Editor

Here is the in-browser scratch file editor.

`data:text/html,<html contenteditable>`

Go ahead copy paste it to url bar. Bookmark it, if required.

# The Details

To use browser as text editor, I leverage [data urls][data_url]. Data url are used to
embed small documents into the url. The above url embedded html page which acts as
editor.

The format is `data:[<mediatype>][;base64],<data>`.

- Media type specifies the mime type of file.
- Base 64 is optional and added if data is base64 encoded
- followed by the content of file.

Our url is `data:text/html,<html contenteditable>`.

- Mime type is `text/html`. We are embedding html page.
- data is html page. The html tag is `contenteditable`.
- No need to close the html tag as it is corrected by browser.

**Note**: The content is lost if you close the tab. Try a extensions if you don't want
to lose the contents.

[data_url]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
"data url"

