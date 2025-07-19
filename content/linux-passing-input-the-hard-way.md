+++
title = "linux passing input the hard way"
date = 2020-07-18
draft = true
[taxonomies]
tags = ["story", "linux", "file"]
categories = ["stories"]
+++
For people familiar with unix philosophy, ["Everything is a file"][everthing_is_file] is
common phrase. Rarely do we get a case to use it in practice. This is one of those cases.

# Problem

At work a pipeline which had to be run by `End of Day`, got stuck. After checking the
logs, it looked like it was stuck waiting for a input prompt. The Prompts was suppose to
be bypassed by setting environment variable. But recent changes had introduced a flaw.

The patch would take some time and this was a lengthy pipeline. So, we had to manually
resume it. But the prompt was not directly available, as this was a process which was
deeply nested within pipeline logic.

# Solution in theory

"Everything is a file" in unix. This includes directories, devices and even process.
We leverage this fact to provide input to the process.

Process are directories under `/proc/` directory. Pid is unique number assigned to the
process. These are used to name the process directory. Ex: `/proc/1234/` is directory
representing process with pid `1234`.

In each process directory, files opened by the process are stored in `fd/` directory.
File descriptors are numbers assigned to files unique to that process. These are used to
name the files. Ex: `/proc/1234/fd/0` is file associated with file descriptors 0 of
process with pid `1234`.

In normal cases file descriptor one is standard input or the file which is the prompt of
the process. This was true in our case.

*Note*: There are to many interesting thing here to cover but lets concentrate on the
solution.

# Implemented Solution

To demonstrate, let us use `cat` program.

1. Run `cat` in a terminal. It wait for input.
1. Run `echo "Hello World" >> "/proc/$(pidof -s cat)/fd/1"` to input to `cat` program.

[everthing_is_file]: https://en.wikipedia.org/wiki/Everything_is_a_file "everything is a file"

