+++
title = "my vim wiki setup"
date = 2021-11-09
[taxonomies]
tags = ["vim", "neovim", "plugin"]
categories = ["vim"]
+++
## Why Keep Notes?

Note taking helps in process of learning new material.
The process of writing notes forces you to summarise what you learned.
The notes may be used later to revise or recollect facts.
It also helps to organise thoughts.

My reasoning of using notes was only to force me to summarise materials.
I never wrote my notes for the purpose of recollection.
This usually happened due to my laziness to write legibly or maintaining notes.

As my interaction with computer increased, typing became second nature.
This also meant I could easily transfer data around devices.
Thus I stared using Joplin as a tool for storing my notes.

## Vim Wiki

Joplin worked fine for taking notes.
It could sync between android and my laptop.
It also had vim key binding integration.
It also had a command line interface.

I still decided to move to vim wiki.
It was simple setup and the data was versioned.
And I could parse the data as and when required.
Installation was also simple via `vim-plug`.

```vim
Plug 'vimwiki/vimwiki'
```

## Markdown format

### Enabling markdown

By default vim wiki has it own format of data.
But it also support markdown syntax by setting following.

```vim
let g:vimwiki_syntax = 'markdown'
let g:vimwiki_ext = '.md'
```

### Generating Html From Markdown

Vim wiki support conversion of notes to html artifacts.
But markdown syntax is not supported for this feature.
The only way to make it work is to use custom program like `vimwiki_markdown`.

```vim
if executable('vimwiki_markdown')
  let g:vimwiki_custom_wiki2html = 'vimwiki_markdown'
  let g:vimwiki_template_path = '~/.wiki_template/'
endif
```

The above code sets up `vimwiki_markdown` as html generator.
Custom template can be provided which is placed in `~/.wiki_template/default.tpl`.

### syntax highlight

Syntax highlighting is not enabled by default.
It can be set explicitly.

```vim
let g:vimwiki_automatic_nested_syntaxes = 1
```

Only certain language can also be set.
This also can be used to map syntax highlight as you please.

```vim
let g:vimwiki_nested_syntaxes = {'python': 'python', 'c++': 'cpp'}
```

## Folder Hierarchy

Organizing notes into folder hierarchy can be helpful.
This might help classifying notes into broad categories.

```vim
let g:vimwiki_list = [
      \ {'name': '/', 'path': ''},
      \ {'name': 'python', 'path': 'language/py/'},
      \ {'name': 'rust', 'path': 'language/rs/'},
      \ {'name': 'software', 'path': 'software/'},
      \ ]
```

### Better links

Using spaces in link might some time cause issues.
Underscores can be used instead.

```vim
let g:vimwiki_links_space_char = '_'
```

### Better Indexes For Vim Wiki

Vim wiki allows generating of link and creating of wiki for that file.
But in case you use `/` at the it does opens directory but not index file.
Index file can be made default for directory.

```vim
let g:vimwiki_dir_link = 'index'
```

## Diary Usage

Vim wiki also allows diary creation.
To have different diary for different machine we can use host name.

```vim
let g:vimwiki_diary_rel_path = 'dairy_'.hostname()
```

## Keybinding

Most command keybinding can be found in this [cheat sheet][cheat_sheet].

## Android sync

Notes can be synced using GitHub.
To sync GitHub repo, [Mgit][mgit] can be used.
For markdown viewer, using [Markor][markor].

### Better Indexes For Vim Wiki

1. Settings
2. View Mode
3. Inject -> body

```html
<script>
  window.onload = function() {
    Array.from(
      document.getElementsByTagName('a')
    ).forEach(
        (a) => {
          if (a.href.endsWith('/')) {
            a.href+='index'
          }
        }
    )
  }
</script>
```

## Vim Configuration

```vim
Plug 'vimwiki/vimwiki'

let g:vimwiki_syntax = 'markdown'
let g:vimwiki_ext = '.md'

if executable('vimwiki_markdown')
  let g:vimwiki_custom_wiki2html = 'vimwiki_markdown'
  let g:vimwiki_template_path = '~/project/wiki/template/'
endif

let g:vimwiki_automatic_nested_syntaxes = 1

let g:vimwiki_list = [
      \ {'name': '/', 'path': ''},
      \ {'name': 'python', 'path': 'language/py/'},
      \ {'name': 'rust', 'path': 'language/rs/'},
      \ {'name': 'software', 'path': 'software/'},
      \ ]
let g:vimwiki_links_space_char = '_'
let g:vimwiki_dir_link = 'index'

let g:vimwiki_diary_rel_path = 'dairy_'.hostname()
```

[mgit]: https://github.com/maks/MGit "Mgit"
[markor]: https://github.com/gsantner/markor "Markor"
[cheat_sheet]: https://gist.github.com/drkarl/4c503bccb62558dc85e8b1bc0f29e9cb "Cheat sheet"

