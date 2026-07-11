+++
title = "Linux Input Injection Through Unusual Methods"
date = 2020-07-18
[taxonomies]
tags = ["linux", "debugging", "story"]
categories = ["stories"]
+++
For people familiar with Unix philosophy, ["Everything is a file"][everyting_is_file] is
a common phrase. Rarely do we get a case to use it in practice. This is one of those cases.
<!--more-->

# Problem

At work, a pipeline that needed to be run by the end of the day got stuck. After checking the 
logs, it appeared to be waiting for an input prompt. The prompt was supposed to 
be bypassed by setting an environment variable, but recent changes had introduced a flaw.

Since the patch would take time and the pipeline was lengthy, we had to manually 
resume it. However, the prompt wasn't directly available because this process was 
deeply nested within the pipeline logic.

# Solution in Theory

"Everything is a file" in Unix includes directories, devices, and even processes.
We can leverage this fact to provide input to a process.

- **Processes are represented by directories under `/proc/`**: Each process has a unique PID 
which names its directory. For example, `/proc/1234/` represents a process with PID 1234.

- **Files associated with processes are stored in the `fd/` subdirectory of each process's 
directory**: Each file descriptor is assigned a number unique to that process and is used to 
name the files. For example, `/proc/1234/fd/0` corresponds to the standard input or prompt file 
for the process with PID 1234.

- **In normal cases, file descriptor 1** (associated with standard input) contains the user's prompt. 
This was applicable in our case.

# Solution Demonstration

To demonstrate, let us use the `cat` program.

1. Run `cat` in a terminal. It will wait for input.
2. Use the command `echo "Hello World" >> "/proc/$(pidof -s cat)/fd/1"` to "Hello World" to the `cat` program.

[everthing_is_file]: https://en.wikipedia.org/wiki/Everything_is_a_file "everything is a file"
