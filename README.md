# Overview

Template for github blog hosting.

Has Features:

1. feed support
1. poster support
1. post category support
1. github comments

# Theme

1. add the following line in `pelicanconf.py` to enabled fenced code. 
```python
MARKDOWN = {"extensions": ["fenced_code", "codehilite"]}
```
1. copy theme folder to your repo.
1. add the following line in `pelicanconf.py` to use the theme. 
```python
THEME = "./theme"
```
1. add the following line in `pelicanconf.py` to use 404 page.
```python 
TEMPLATE_PAGES = { "404.html": "404.html" }
```

# Github comments
1. add the following line in `publishconf.py` to use github comments.
```python 
GITHUB_REPO  = "github repo name"
GITHUB_OWNER = "github user name"
```

1. update field `assignees` in `.github/ISSUE_TEMPLATE/comments-issue.md` to github user name.

# Writing Posts
1. create `content` folder (if not existing).
1. create `articles` folder in above folder (if not existing).
1. create category folder for the post in above folder (if not existing).
1. create a post with "`year`-`month`-`day`_`slug for post`.md" name.
1. add following yaml front matter.
```markdown
---
issue_no: github-issue-number
poster: poster-if-in-content/images/posters/-folder 
status: published-or-unpublished
summary: summary-of-post 
tags: comma-separated-tags
title: title-of-post
---
```
1. following this content add your post in markdown format

# Coming Soon

Todo list is [here](TODO.md).
