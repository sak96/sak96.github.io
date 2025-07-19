+++
title = "debugging vim errors"
date = 2022-04-25
draft = true
[taxonomies]
tags = ["vim", "neovim", "debugging"]
categories = ["vim"]
+++
## Why Debugging Vim ?

Using Vim as it comes out of box is difficult.
Plugins make vim, a lot more powerful.
Some times some of these plugins cause issues, popping some error message.
Having knowledge on how to figure out what is causing issue can help in such situations.


## Error Messages

The error message which pop in vim may disappear when you type enter or hit some key.
These error message are as stated "messages" in vim.
To check the last error message again type `:echo errmsg` in normal mode.
To view all message type `:messages` in normal mode.

Some time it is much better to view error in new buffer.
This can be achieved as follows.
```vim
:vnew | put=execute('messages')
```

## Stack Trace in Vim ?

The error message can be simple and easy to understand.
Some of these error message are stack trace.
These stack trace can be hard to follow some time.
Below is partial stack trace.

```vim
Error detected while processing function <SNR>163_on_exit_vim[15]..1:
line    1:
E687: Less targets than List items
```

## Which function cause the issue ?

Noticing `<SNR>163_on_exit_vim[15]`  can lead to conclusion a function caused issue.
The `<SNR>163` part indicates that 163rd script caused the issue.
To find out the 163rd script, fetch all scripts with id.
```vim
:vnew | put=execute('scriptnames')
```

This will provide the script location which caused the issue.
To go to the file press `gf` when on the file path.
```vim
163: ~/.vim/plugged/vim-gitgutter/autoload/gitgutter/async.vim
```

Now find the function `on_exit_vim` and move to 15th line (`15j`)in it.
This is the function which was causing the issue.
More information can be found in [stack overflow question][vim_stack_trace].

## How to debug stuff?

Now having knowledge of what line in the function cause issue, let's reproduce it.
First use `echom` and restart vim to figure out value of local variable from messages.
Now execute the code in debug mode.
```vim
debug echo expand('%:h')
```

The above code returns quickly, but in real situation there is need for more debugging.
Like any other debugger, when in debug mode command to control the program flow.
Few of these are listed below.

| command   | action                                           |
| ---       | ---                                              |
| step      | execute a command but step into function         |
| next      | execute a command but step over function         |
| cont      | continue execution till next break point         |
| quit      | stop  execution till next break point            |
| interrupt | stop  execution till next command                |
| finish    | continue  till finish of current script/function |
| breakadd  | add breakpoint                                   |
| breakdel  | add breakpoint                                   |

The commands `breakadd/breakdel` take location as argument.
The argument can be as follows:

| argument                       | explanation              |
| ---                            | ---                      |
| here                           | current location         |
| file [lineNumber] fileName     | line x in file           |
| func [lineNumber] functionName | line x in function       |
| *                              | all useful with breakdel |

There is much detailed explanation in following [blog article][vim_debug_blog].

## Are there logs in vim ?

Vim has logging functionality builtin it.
To start vim in most verbose mode and log it to a file use following command.
More information can be got in vim help or you check [stack overflow question][vim_log].

```bash
vim -V9myVim.log
```

[vim_debug_blog]: https://inlehmansterms.net/2014/10/31/debugging-vim/ "debugging vim"
[vim_stack_trace]: https://stackoverflow.com/questions/51210172 "vim stack trace"
[vim_log]: https://stackoverflow.com/questions/3025615 "vim logs"

