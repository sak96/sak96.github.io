#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = "sak96"
SITENAME = "sak96-blog"
SITEURL = ""

PATH = "content"

TIMEZONE = "Europe/London"

DEFAULT_LANG = "en"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ("Pelican", "http://getpelican.com/"),
    ("Pygments", "https://github.com/pygments/pygments"),
    ("Gruvbox", "https://github.com/morhetz/gruvbox-contrib"),
)


DEFAULT_PAGINATION = 3

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
THEME = "./theme"
TEMPLATE_PAGES = {"404.html": "404.html"}
MARKDOWN = {
    "extension_configs": {
        "fenced_code": {},
        "codehilite": {"linenums": True},
    },
    "tab_length": 2,
}
PLUGINS = ["minify"]
MINIFY = {
    "remove_comments": True,
    "remove_all_empty_space": True,
    "remove_optional_attribute_quotes": True,
}
