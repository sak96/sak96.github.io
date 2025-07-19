+++
title = "vimspector rust test"
date = 2023-07-12
[taxonomies]
tags = ["vim", "neovim", "plugin", "vimspector", "rust", "test"]
categories = ["vim"]
+++
Vim is my go to editor for editing text.
I wanted to setup vim for rust library project.
The language server setup was straight forward with vim-ale.
But setup for debugging had a certain amount of challenges.

## Challenge 1: Finding the test executable

In library based project in rust can only be debugged using test cases.
Cargo generates a test case executable which can be used to run the test.
The issue is these binary generated have random hash attached to the filename.
Hence the setup for Vimspector has to run binary whose path is non deterministic.

This made it hard to write generic configuration which works for any developer using vim.
This issue has plagued others as well and can be checkout on [Github][test_exe_issue].
Fortunately there is a way to extract the path from the json output.

```bash
cargo test --no-run --message-format=json -q | grep -Poi 'executable":"\\K([^"]*)(?=")'
```

Vimspector allows runtime variables to be used in configuration.
An example for this can be found in [readme][picking_pid], where process id is found at runtime.
The same logic is used to find the test executable and is set to variable `test_exe`.

```json
{
  "test_exe": {
    "shell": [
      "bash",
      "-c",
      "cargo test --no-run --message-format=json -q | grep -Poi 'executable\":\"\\K([^\"]*)(?=\")'"
    ]
  }
}
```

## Challenge 2: Setting up standard libraries source to debug.

By setting up the `test_exe`, the test could be debugged.
But, whenever the code stepped into standard library call, the debugged would show machine instruction.
The source file for the symbol seemed to be starting with `/rustc/<hash>/`.
This issue was encounter with [rust-tools][std_lib_rust_tools] plugins as well.

The solution seems to be adding a source map configuration.
Source map directs `/rustc/<hash>/` to `<rust-toolchain-src>/lib/rustlib/src/rust/`.
This allows the debugger to find the symbols correctly.

```json
"sourceMap": {
  "/rustc/db9d1b20bba1968c1ec1fc49616d4742c1725b4b/" : "${rust_std}/lib/rustlib/src/rust/"
}
```

The variable `rust_std` point to rust tool chain source files.
It could be determined at runtime using following command

```bash
rustc --print sysroot
```


## Challenge 3: Getting rid of the hard code hash

Hash in source map key points to `rustc` commit used to compile the project.
This can be determined at runtime using command below.
But as this is on key side of the equation the configuration would not expand the variables.
This seemed like a dead end as there was no way to expand the variable in key.

```bash
rustc -Vv | grep -Poi 'commit-hash: \K(.*)'
```

On reaching out to the developer of vimspector, there was a [hack][json_hack] of `#json` pointed out.
This key would coerces the string value from to json type(boolean/number/list/map).
This allowed me to coerces the value of `sourceMap` to map using variable in the key.

```json
{
  "sourceMap#json": "{\"/rustc/${rustc_commit}/\" : \"${rust_std}/lib/rustlib/src/rust/\"}"
}
```

## Conclusion

To setup vimspector for rust library (test case), there were multiple challenges.

1. Test executable name has to be determined at runtime.
2. Rust standard library symbol need to be mapped using source map.
3. Utilize Vimspector type coerce to allow dynamic key for source map.

Final configuration looks like this:

```json
{
  "configurations": {
    "launch": {
      "adapter": "CodeLLDB",
      "variables": {
        "rustc_commit": {
          "shell": [
            "bash",
            "-c",
            "rustc -Vv | grep -Poi 'commit-hash: \\K(.*)'"
          ]
        },
        "rust_std": {
          "shell": [ "rustc", "--print", "sysroot" ]
        },
        "test_exe": {
          "shell": [
            "bash",
            "-c",
            "cargo test --no-run --message-format=json -q | grep -Poi 'executable\":\"\\K([^\"]*)(?=\")'"
          ]
        }
      },
      "configuration": {
        "sourceMap#json": "{\"/rustc/${rustc_commit}/\" : \"${rust_std}/lib/rustlib/src/rust/\"}",
        "request": "launch",
        "program": "${test_exe}"
      },
      "args": [ "*${args}" ],
      "breakpoints": {
        "exception": {
          "cpp_throw": "",
          "cpp_catch": ""
        }
      }
    }
  }
}
```

[test_exe_issue]: https://github.com/rust-lang/cargo/issues/8525 "Finding the test executable issue"
[picking_pid]: https://github.com/puremourning/vimspector/tree/02c8da857bbb1b5fc2cf7dfbdda85ba1201a8d8c#picking-a-pid "Picking pid"
[std_lib_rust_tools]: https://github.com/simrat39/rust-tools.nvim/pull/231 "Rust tools has no std source map"
[json_hack]: https://puremourning.github.io/vimspector/configuration.html#coercing-types "The json hack"

